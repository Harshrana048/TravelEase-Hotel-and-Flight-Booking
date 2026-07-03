
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

        // if (pendingPayment) {
        //     return res.status(400).json({
        //         message: 'A payment order already exists for this booking. Complete or cancel it first.',
        //         orderId: pendingPayment.orderId,
        //         paymentId: pendingPayment._id
        //     });
        // }

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
    const { orderId, paymentId, signature, bookingId, bookingType } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        message: 'orderId, paymentId, and signature are required'
      });
    }

    // Verify signature
    const hmac = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // In test/dev mode, allow mismatched signatures
    if (hmac !== signature && process.env.NODE_ENV === 'production') {
      return res.status(400).json({
        message: 'Payment signature verification failed'
      });
    }

    // Find payment
    const payment = await Payment.findOne({
      orderId,
      userId: req.user._id,
      bookingId
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    if (payment.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'This payment has already been verified'
      });
    }

    // Update payment
    payment.transactionId = paymentId;
    payment.signature = signature;
    payment.paymentStatus = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    // Get io instance once
    const io = req.app.get('io');

    // Update booking based on type
    let booking;

    if (payment.bookingType === 'HotelBooking') {
      const pendingBooking = await HotelBooking.findById(payment.bookingId);
      if (!pendingBooking) {
        return res.status(404).json({ message: 'Hotel booking record not found' });
      }

      // Extract values securely from the database document
      const hotelId = pendingBooking.hotelId;
      const roomsBooked = pendingBooking.roomsBooked || 1;

      // Find the live hotel inventory record
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Check if enough rooms are still available
      if (hotel.roomsAvailable < roomsBooked) {
        return res.status(400).json({
          message: `Only ${hotel.roomsAvailable} rooms available, you need ${roomsBooked}`
        });
      }

      // Update booking status
      booking = await HotelBooking.findByIdAndUpdate(
        payment.bookingId,
        {
          paymentStatus: 'paid',
          bookingStatus: 'confirmed',
          paymentId: payment._id,
        },
        { new: true }
      ).populate('hotelId');

      // Reduce rooms availability
      if (booking && booking.hotelId) {
        await Hotel.findByIdAndUpdate(booking.hotelId._id, {
          $inc: { roomsAvailable: -roomsBooked }
        });
      }

      // ── Step 3: Room Validation before emit ─────────────────────────────────
      const hotelRoomName = `hotel-${hotelId}`;
      const hotelRoom = io.sockets.adapter.rooms.get(hotelRoomName);
      const hotelRoomClients = hotelRoom ? [...hotelRoom] : [];
      console.log(`\n[SOCKET] 🔍 STEP 3 — Room Validation (before emit)`);
      console.log(`   Room name     : ${hotelRoomName}`);
      if (hotelRoom) {
          console.log(`   Clients count : ${hotelRoom.size}`);
          console.log(`   Socket IDs    :`, hotelRoomClients);
      } else {
          console.log(`   ⚠️  Room is EMPTY/UNDEFINED — no browsers watching this hotel page!`);
          console.log(`   → The event will be emitted but nobody will receive it.`);
          console.log(`   → Possible causes:`);
          console.log(`       1. Browser A never opened /hotels/${hotelId}`);
          console.log(`       2. Browser A opened the page but socket never joined the room`);
          console.log(`       3. Browser A refreshed before payment completed`);
      }

      // ── Step 4: Event Emission ────────────────────────────────────────────
      const updatedHotel = await Hotel.findById(hotelId);
      const hotelPayload = {
          hotelId: hotelId.toString(),
          roomsAvailable: updatedHotel.roomsAvailable,
          message: `${roomsBooked} room(s) booked. ${updatedHotel.roomsAvailable} remaining.`,
      };
      io.to(hotelRoomName).emit('room-booked', hotelPayload);
      console.log(`\n[SOCKET] 📡 STEP 4 — Emitting room-booked`);
      console.log(`   Event name    : room-booked`);
      console.log(`   Room name     : ${hotelRoomName}`);
      console.log(`   Payload       :`, JSON.stringify(hotelPayload, null, 6));
      console.log(`   Clients receiving: ${hotelRoom ? hotelRoom.size : 0}`);
      console.log('');

    } else if (payment.bookingType === 'FlightBooking') {
      // ✅ FIXED: Added 'else if' condition
      const pendingBooking = await FlightBooking.findById(payment.bookingId);
      if (!pendingBooking) {
        return res.status(404).json({ message: 'Booking record not found' });
      }

      // Extract the variables securely from the database document
      const passengerCount = pendingBooking.passengerCount;
      const flightId = pendingBooking.flightId;
      const tripType = pendingBooking.tripType;
      const returnFlightId = pendingBooking.returnFlightId;

      // Find the live flight using that extracted flightId
      const flight = await Flight.findById(flightId);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Check if enough seats for all passengers
      if (flight.availableSeats < passengerCount) {
        return res.status(400).json({
          message: `Only ${flight.availableSeats} seats available, you need ${passengerCount}`
        });
      }

      // For round-trip, validate return flight too
      let returnFlight = null;
      if (tripType === 'round-trip' && returnFlightId) {
        returnFlight = await Flight.findById(returnFlightId);
        if (!returnFlight) {
          return res.status(404).json({ message: 'Return flight not found' });
        }
        if (returnFlight.availableSeats < passengerCount) {
          return res.status(400).json({
            message: `Only ${returnFlight.availableSeats} seats available on return flight`
          });
        }
      }

      // Generate seat numbers
      const seatNumbers = [];
      for (let i = 0; i < passengerCount; i++) {
        seatNumbers.push(`S${flight.availableSeats - i}`);
      }

      // Update booking status
      booking = await FlightBooking.findByIdAndUpdate(
        payment.bookingId,
        {
          paymentStatus: 'paid',
          bookingStatus: 'confirmed',
          paymentId: payment._id,
          seatNumbers: seatNumbers,
        },
        { new: true }
      ).populate('flightId');

      // Populate returnFlightId if it exists
      if (booking.returnFlightId) {
        booking = await booking.populate('returnFlightId');
      }

      // Reduce available seats on main flight
      if (booking && booking.flightId) {
        await Flight.findByIdAndUpdate(booking.flightId._id, {
          $inc: { availableSeats: -booking.passengerCount }
        });
      }

      // Reduce available seats on return flight if round-trip
      if (booking && booking.tripType === 'round-trip' && booking.returnFlightId) {
        await Flight.findByIdAndUpdate(booking.returnFlightId._id, {
          $inc: { availableSeats: -booking.passengerCount }
        });
      }

      // ── Step 3: Room Validation before emit (main flight) ────────────────
      const flightRoomName = `flight-${flightId}`;
      const flightRoom = io.sockets.adapter.rooms.get(flightRoomName);
      const flightRoomClients = flightRoom ? [...flightRoom] : [];
      console.log(`\n[SOCKET] 🔍 STEP 3 — Room Validation (before emit)`);
      console.log(`   Room name     : ${flightRoomName}`);
      if (flightRoom) {
          console.log(`   Clients count : ${flightRoom.size}`);
          console.log(`   Socket IDs    :`, flightRoomClients);
      } else {
          console.log(`   ⚠️  Room is EMPTY/UNDEFINED — no browsers watching this flight page!`);
          console.log(`   → The event will be emitted but nobody will receive it.`);
          console.log(`   → Possible causes:`);
          console.log(`       1. Browser A never opened /flights/${flightId}`);
          console.log(`       2. Browser A opened the page but socket join was not sent`);
          console.log(`       3. Browser A refreshed before payment completed`);
      }

      // ── Step 4: Event Emission (main flight) ───────────────────────────
      const updatedFlight = await Flight.findById(flightId);
      const flightPayload = {
          flightId: flightId.toString(),
          availableSeats: updatedFlight.availableSeats,
          message: `${passengerCount} seat(s) booked. ${updatedFlight.availableSeats} remaining.`,
      };
      io.to(flightRoomName).emit('flight-booked', flightPayload);
      console.log(`\n[SOCKET] 📡 STEP 4 — Emitting flight-booked`);
      console.log(`   Event name    : flight-booked`);
      console.log(`   Room name     : ${flightRoomName}`);
      console.log(`   Payload       :`, JSON.stringify(flightPayload, null, 6));
      console.log(`   Clients receiving: ${flightRoom ? flightRoom.size : 0}`);
      console.log('');

      // ✅ EMIT SOCKET EVENT FOR RETURN FLIGHT
      if (tripType === 'round-trip' && returnFlightId) {
        const updatedReturnFlight = await Flight.findById(returnFlightId);
        io.to(`flight-${returnFlightId}`).emit('flight-booked', {
          flightId: returnFlightId.toString(),
          availableSeats: updatedReturnFlight.availableSeats,
          message: `${passengerCount} seat(s) booked (return). ${updatedReturnFlight.availableSeats} remaining.`,
        });

        console.log(`✈️ Emitted flight-booked for return flight ${returnFlightId}`);
        console.log('📣 Payload:', {
          flightId: returnFlightId.toString(),
          availableSeats: updatedReturnFlight.availableSeats,
        });
      }
    }

    // Send email
    // try {
    //   const user = await User.findById(req.user._id);

    //   if (payment.bookingType === 'HotelBooking') {
    //     const pdfBuffer = await generateHotelTicketPDF(booking, booking.hotelId);
    //     await sendEmail({
    //       to: user.email,
    //       subject: `Hotel Booking Confirmed - Payment Received`,
    //       html: `
    //         <h2>🏨 Booking Confirmed & Payment Received!</h2>
    //         <p>Dear ${user.name},</p>
    //         <p>Your payment has been successfully received. Your hotel booking is now confirmed.</p>
    //         <p><strong>Booking Details:</strong></p>
    //         <ul>
    //           <li>Hotel: ${booking.hotelId.name}, ${booking.hotelId.city}</li>
    //           <li>Check-in: ${new Date(booking.checkInDate).toDateString()}</li>
    //           <li>Check-out: ${new Date(booking.checkOutDate).toDateString()}</li>
    //           <li>Number of Nights: ${booking.nights}</li>
    //           <li>Total Amount: ₹${booking.totalPrice}</li>
    //         </ul>
    //         <p>Your booking confirmation PDF is attached.</p>
    //         <p>Thank you for using TravelEase!</p>
    //       `,
    //       attachments: [
    //         {
    //           filename: `hotel-booking-${booking._id}.pdf`,
    //           content: pdfBuffer,
    //         },
    //       ],
    //     });
    //   } else if (payment.bookingType === 'FlightBooking') {
    //     const pdfBuffer = await generateFlightTicketPDF(
    //       booking,
    //       booking.flightId,
    //       booking.returnFlightId
    //     );
    //     await sendEmail({
    //       to: user.email,
    //       subject: `Flight Booking Confirmed - Payment Received`,
    //       html: `
    //         <h2>✈️ Booking Confirmed & Payment Received!</h2>
    //         <p>Dear ${user.name},</p>
    //         <p>Your payment has been successfully received. Your flight booking is now confirmed.</p>
    //         <p><strong>Flight Details:</strong></p>
    //         <ul>
    //           <li>Flight: ${booking.flightId.flightNumber} (${booking.flightId.airline})</li>
    //           <li>Route: ${booking.flightId.source} → ${booking.flightId.destination}</li>
    //           <li>Departure: ${new Date(booking.flightId.departureTime).toLocaleString()}</li>
    //           <li>Passengers: ${booking.passengers.length}</li>
    //           <li>Total Amount: ₹${booking.totalPrice}</li>
    //         </ul>
    //         <p>Your booking confirmation PDF is attached.</p>
    //         <p>Thank you for using TravelEase!</p>
    //       `,
    //       attachments: [
    //         {
    //           filename: `flight-booking-${booking._id}.pdf`,
    //           content: pdfBuffer,
    //         },
    //       ],
    //     });
    //   }
    // } catch (emailErr) {
    //   console.error('⚠️ Email Failed:', emailErr.message);
    //   // Don't fail payment if email fails
    // }

    res.json({
      message: 'Payment verified successfully',
      payment,
      booking,
    });
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

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

        let booking;

        if (payment.bookingType === "HotelBooking") {
            booking = await HotelBooking.findById(payment.bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            // Hotel stay has already started or passed
            if (new Date() >= new Date(booking.checkInDate)) {
                return res.status(400).json({
                    message: "This hotel booking can no longer be cancelled because the check-in date has already passed."
                });
            }

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
                    subject: `'Full'  Refund Completed - TravelEase`,
                    html: `
      <h2>✅ Refund Completed</h2>
      <p>Dear ${user.name},</p>
      <p>Your refund has been successfully processed.</p>
      <p><strong>Refund Details:</strong></p>
      <ul>
        <li>Refund ID: ${razorpayRefund.id}</li>
        <li>Amount Refunded: ₹${refundAmount}</li>
      
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