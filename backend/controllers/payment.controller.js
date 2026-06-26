
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment.model');
const HotelBooking = require('../models/HotelBooking.model');
const FlightBooking = require('../models/FlightBooking.model');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');
const User = require('../models/User.model');
const sendEmail = require('../utils/sendEmail');
const { generateHotelTicketPDF, generateFlightTicketPDF } = require('../utils/generatePDF');




const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// / Helper: Verify booking belongs to user

const verifyBookingOwnership = async (bookingId, bookingType, userId) => {
    const Model = bookingType === 'HotelBooking' ? HotelBooking : FlightBooking;
    const booking = await Model.findOne({ _id: bookingId, userId });
    return booking;
};

// POST /api/payments/create-order

exports.createOrder = async (req, res) => {
    try {
        const { bookingId, bookingType } = req.body;

        if (!bookingId || !bookingType) {
            return res.status(400).json({
                message: 'bookingId and bookingType are required'
            });
        }
        if (!['HotelBooking', 'FlightBooking'].includes(bookingType)) {
            return res.status(400).json({
                message: 'bookingType must be HotelBooking or FlightBooking'
            });
        }

        //  Verify booking exists and belongs to user

        const booking = await verifyBookingOwnership(bookingId, bookingType, req.user._id);
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found or does not belong to you'
            });
        }

        // Check if already paid (prevent duplicate payments)

        const existingPayment = await Payment.findOne({
            bookingId,
            paymentStatus: { $in: ['paid', 'refund_pending', 'refunded'] }
        });

        if (existingPayment) {
            return res.status(400).json({
                message: 'This booking has already been paid. Cannot create another order.'
            });
        }

        const actualAmount = booking.totalPrice;
        // Check for duplicate pending order for same booking
        const pendingPayment = await Payment.findOne({
            bookingId,
            bookingType,
            paymentStatus: 'pending',
            orderId: { $ne: null }
        });

        if (pendingPayment) {
            return res.status(400).json({
                message: 'A payment order already exists for this booking. Complete or cancel it first.',
                orderId: pendingPayment.orderId,
                paymentId: pendingPayment._id
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: actualAmount * 100,
            currency: 'INR',
            receipt: `TRV-${Date.now()}`,
            notes: {
                bookingId,
                bookingType,
                userId: req.user._id.toString(),
            },

        });
        // Save payment record with server-verified amount

        const payment = await Payment.create({
            userId: req.user._id,
            bookingId,
            bookingType,
            amount: actualAmount,
            orderId: razorpayOrder.id,
            paymentStatus: 'pending',
        });

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount / 100, // Convert back to rupees for display
            currency: razorpayOrder.currency,
            paymentId: payment._id,
            key: process.env.RAZORPAY_KEY_ID,
        });



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentId, signature, bookingId, bookingType } = req.body

        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({
                message: 'orderId, paymentId, and signature are required'
            });
        }

        const hmac = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (hmac !== signature) {
            return res.status(400).json({
                message: 'Payment signature verification failed. Payment may be fraudulent.'
            });
        }

        // ✅ Find payment and verify it belongs to user

        const payment = await Payment.findOne({
            orderId,
            userId: req.user._id
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }


        // ✅ Prevent duplicate verification — check if already paid

        if (payment.paymentStatus === 'paid') {
            return res.status(400).json({
                message: 'This payment has already been verified and marked as paid'
            });
        }

        if (payment.paymentStatus === 'refunded' || payment.paymentStatus === 'refund_pending') {
            return res.status(400).json({
                message: 'Cannot verify payment that has been refunded'
            });
        }

        // Prevent duplicate transactions with same transactionId
        if (payment.transactionId) {
            return res.status(400).json({
                message: 'This payment has already been processed with a transaction ID'
            });
        }

        // Update payment record
        payment.transactionId = paymentId;
        payment.signature = signature;
        payment.paymentStatus = 'paid';
        payment.paidAt = new Date(); // ✅ Track when payment was received
        await payment.save();

        // Update booking status to confirmed

        const Model = payment.bookingType === 'HotelBooking' ? HotelBooking : FlightBooking;
        const booking = await Model.findByIdAndUpdate(
            payment.bookingId,
            {
                paymentStatus: 'paid',
                bookingStatus: 'confirmed',
            },
            { new: true }
        )
            .populate('hotelId')
            .populate('flightId')
            .populate('returnFlightId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found after payment update' });
        }

        // NOW send confirmation email (only after payment confirmed)
        try {
            const user = await User.findById(req.user._id);

            if (payment.bookingType === 'HotelBooking') {
                const pdfBuffer = await generateHotelTicketPDF(booking, booking.hotelId);

                await sendEmail({
                    to: user.email,
                    subject: `Hotel Booking Confirmed - Payment Received`,
                    html: `
            <h2>🏨 Booking Confirmed & Payment Received!</h2>
            <p>Dear ${user.name},</p>
            <p>Your payment has been successfully received. Your hotel booking is now confirmed.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
              <li>Hotel: ${booking.hotelId.name}, ${booking.hotelId.city}</li>
              <li>Check-in: ${new Date(booking.checkInDate).toDateString()}</li>
              <li>Check-out: ${new Date(booking.checkOutDate).toDateString()}</li>
              <li>Number of Nights: ${booking.nights}</li>
              <li>Total Amount: ₹${booking.totalPrice}</li>
            </ul>
            <p>Your booking confirmation PDF is attached.</p>
            <p>Thank you for using TravelEase!</p>
          `,
                    attachments: [
                        {
                            filename: `hotel-booking-${booking._id}.pdf`,
                            content: pdfBuffer,
                        },
                    ],
                });
            } else {
                const pdfBuffer = await generateFlightTicketPDF(
                    booking,
                    booking.flightId,
                    booking.returnFlightId
                );

                await sendEmail({
                    to: user.email,
                    subject: `Flight Booking Confirmed - Payment Received`,
                    html: `
            <h2>✈ Booking Confirmed & Payment Received!</h2>
            <p>Dear ${user.name},</p>
            <p>Your payment has been successfully received. Your flight booking is now confirmed.</p>
            <p><strong>Flight Details:</strong></p>
            <ul>
              <li>Flight: ${booking.flightId.flightNumber} (${booking.flightId.airline})</li>
              <li>Route: ${booking.flightId.source} → ${booking.flightId.destination}</li>
              <li>Departure: ${new Date(booking.flightId.departureTime).toLocaleString()}</li>
              <li>Passengers: ${booking.passengers.length}</li>
              <li>Total Amount: ₹${booking.totalPrice}</li>
            </ul>
            <p>Your booking confirmation PDF is attached.</p>
            <p>Thank you for using TravelEase!</p>
          `,
                    attachments: [
                        {
                            filename: `flight-booking-${booking._id}.pdf`,
                            content: pdfBuffer,
                        },
                    ],
                });
            }
        } catch (emailErr) {
            console.error('❌ Email send failed:', emailErr.message);
            // Booking is still confirmed even if email fails
        }

        res.json({
            message: 'Payment verified successfully',
            payment,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// POST /api/payments/payment-failed
exports.paymentFailed = async (req, res) => {
    try {
        const { orderId, errorCode, errorDescription } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'orderId is required' });
        }

        // Find payment and verify ownership
        const payment = await Payment.findOne({
            orderId,
            userId: req.user._id
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        // Only update if still pending
        if (payment.paymentStatus !== 'pending') {
            return res.status(400).json({
                message: 'Cannot mark payment as failed if it\'s already been processed'
            });
        }

        payment.paymentStatus = 'failed';
        payment.errorMessage = `${errorCode}: ${errorDescription}`;
        await payment.save();

        res.json({
            message: 'Payment marked as failed. Booking remains pending.',
            payment,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .populate('bookingId')
            .sort({ createdAt: -1 });
        console.log(payments);

        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.cancelAndRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findOne({
            _id: paymentId,
            userId: req.user._id
        });


        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.paymentStatus !== 'paid') {
            return res.status(400).json({
                message: 'Can only refund payments that have been successfully paid'
            });
        }

        if (payment.refundStatus !== 'none') {
            return res.status(400).json({
                message: `This payment has already been ${payment.refundStatus === 'full' ? 'fully' : 'partially'} refunded`
            });
        }

        if (payment.paymentStatus === 'refund_pending') {
            return res.status(400).json({
                message: 'A refund is already in progress'
            });
        }

        payment.paymentStatus = 'refund_pending';
        payment.errorMessage = '';
        await payment.save();


        try {
            const user = await User.findById(req.user._id);
            await sendEmail({
                to: user.email,
                subject: 'Refund Request Initiated - TravelEase',
                html: `
      <h2>💰 Refund Request Initiated</h2>
      <p>Dear ${user.name},</p>
      <p>Your refund request has been initiated and is being processed.</p>
      <p><strong>Refund Details:</strong></p>
      <ul>
        <li>Refund Amount: ₹${refundAmount}</li>
        <li>Type: ${isFullRefund ? 'Full' : 'Partial'}</li>
        <li>Status: Processing</li>
      </ul>
      <p>You will receive another email once the refund is complete.</p>
      <p>Thank you for using TravelEase!</p>
    `,
            });
        } catch (emailErr) {
            console.error('Email failed:', emailErr);
        }

        try {
            console.log(payment.transactionId);
            const razorpayRefund = await razorpay.payments.refund(payment.transactionId, {
                amount: payment.amount * 100,
                notes: {
                    paymentId: payment._id.toString(),
                    reason: 'Full refund on booking cancellation'
                }
            });

            payment.refundStatus = 'full';
            payment.refundAmount = payment.amount;
            payment.refundId = razorpayRefund.id;
            payment.paymentStatus = 'refunded';
            payment.refundedAt = new Date();
            await payment.save();
            try {
                const user = await User.findById(req.user._id);
                await sendEmail({
                    to: user.email,
                    subject: `${isFullRefund ? 'Full' : 'Partial'} Refund Completed - TravelEase`,
                    html: `
      <h2>✅ Refund Completed</h2>
      <p>Dear ${user.name},</p>
      <p>Your refund has been successfully processed.</p>
      <p><strong>Refund Details:</strong></p>
      <ul>
        <li>Refund ID: ${razorpayRefund.id}</li>
        <li>Amount Refunded: ₹${refundAmount}</li>
        <li>Type: ${isFullRefund ? 'Full' : 'Partial'}</li>
        <li>Processed On: ${new Date().toLocaleString()}</li>
      </ul>
      <p>The refund will be credited to your original payment method within 3-5 business days.</p>
      <p>Thank you for using TravelEase!</p>
    `,
                });
            } catch (emailErr) {
                console.error('Email failed:', emailErr);
            }

            // Update booking status to refunded/cancelled
            const Model = payment.bookingType === 'HotelBooking' ? HotelBooking : FlightBooking;
            const booking = await Model.findByIdAndUpdate(
                payment.bookingId,
                {
                    paymentStatus: 'refunded',
                    bookingStatus: 'cancelled',
                },
                { new: true }
            );

            if (!booking) {
                // Payment was refunded but booking was not found; surface a clear error
                return res.status(404).json({ message: 'Booking not found after refund', payment });
            }

            // Restore availability now that refund succeeded
            try {
                if (payment.bookingType === 'HotelBooking') {
                    await Hotel.findByIdAndUpdate(booking.hotelId, { $inc: { roomsAvailable: booking.roomsBooked } });
                } else {
                    await Flight.findByIdAndUpdate(booking.flightId, { $inc: { availableSeats: booking.passengerCount } });
                    if (booking.returnFlightId) {
                        await Flight.findByIdAndUpdate(booking.returnFlightId, { $inc: { availableSeats: booking.passengerCount } });
                    }
                }
            } catch (restoreErr) {
                // Persist an explanatory error and return 500 — refund succeeded but availability restore failed
                console.error('Availability restoration failed:', restoreErr);
                payment.errorMessage = `Availability restoration failed: ${restoreErr.message}`;
                await payment.save();
                return res.status(500).json({
                    message: 'Refund processed but restoring availability failed',
                    payment,
                    booking,
                    error: restoreErr.message,
                });
            }

            res.json({
                message: 'Booking cancelled, full refund processed and availability restored',
                payment,
                booking,
                refundId: razorpayRefund.id,
            });
        } catch (refundErr) {
            console.error("Refund Error:", refundErr);
            console.error("Refund Error JSON:", JSON.stringify(refundErr, null, 2));

            payment.paymentStatus = 'paid';
            payment.errorMessage = JSON.stringify(refundErr);
            await payment.save();

            res.status(500).json({
                message: "Refund failed",
                error: refundErr
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== req.headers['x-razorpay-signature']) {
            return res.status(400).json({ message: 'Webhook signature verification failed' });
        }

        const event = req.body;

        if (event.event === 'payment.authorized' || event.event === 'payment.captured') {
            const payment = await Payment.findOne({
                transactionId: event.payload.payment.entity.id
            });

            if (payment && payment.paymentStatus !== 'paid') {
                payment.paymentStatus = 'paid';
                payment.paidAt = new Date();
                payment.webhookVerified = true;
                await payment.save();

                const Model = payment.bookingType === 'HotelBooking' ? HotelBooking : FlightBooking;
                await Model.findByIdAndUpdate(payment.bookingId, {
                    paymentStatus: 'paid',
                    bookingStatus: 'confirmed',
                });
            }
        }

        if (event.event === 'refund.created' || event.event === 'refund.completed') {
            const payment = await Payment.findOne({
                refundId: event.payload.refund.entity.id
            });

            if (payment) {
                payment.paymentStatus = 'refunded';
                payment.refundedAt = new Date();
                payment.webhookVerified = true;
                await payment.save();
            }
        }

        res.json({ message: 'Webhook processed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};