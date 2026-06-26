const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'bookingType'
  },

  bookingType: {
    type: String,
    enum: ['HotelBooking', 'FlightBooking'],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: 'INR'
  },

  // Razorpay details
  orderId: {
    type: String,
    default: ''
  },

  transactionId: {
    type: String,
    default: ''
  },

  signature: {
    type: String,
    default: ''
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid','refund_pending', 'refunded','failed'],
    default: 'pending'
  },

  paymentMethod: {
    type: String,
    enum: ['razorpay', 'credit_card', 'debit_card', 'upi', 'netbanking'],
    default: 'razorpay'
  },

  refundStatus: {
    type: String,
    enum: ['none', 'partial', 'full'],
    default: 'none'
  },

  refundAmount: {
    type: Number,
    default: 0
  },

  refundId: {
    type: String,
    default: ''
  },

  refundedAt: {
    type: Date,
  },

  errorMessage: {
    type: String,
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);