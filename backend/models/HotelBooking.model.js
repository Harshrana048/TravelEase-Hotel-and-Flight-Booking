const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const hotelBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },

  contactPhone: {
    type: String,
    required: true
  },

  guests: [guestSchema],

  guestCount: {
    type: Number,
    required: true,
    min: 1
  },

  roomsBooked: {
    type: Number,
    required: true,
    min: 1
  },

  checkInDate: {
    type: Date,
    required: true
  },

  checkOutDate: {
    type: Date,
    required: true
  },

  nights: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid','refund_pending', 'refunded'],
    default: 'pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);