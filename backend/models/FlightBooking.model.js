const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  age:   { type: Number, required: true, min: 1 },
}, { _id: false }); 

const flightBookingSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  flightId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },

  passengers:     [passengerSchema], // Array of passenger objects
  passengerCount: { type: Number, required: true, min: 1 },

  seatNumbers:    [String], // Array of seat numbers, one per passenger
  totalPrice:     { type: Number, required: true },

  bookingStatus:  { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus:  { type: String, enum: ['pending', 'paid','refund_pending', 'refunded'], default: 'pending' },
  tripType:       { type: String, enum: ['one-way', 'round-trip'], default: 'one-way' },
  returnFlightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', default: null },
}, { timestamps: true });

module.exports = mongoose.model('FlightBooking', flightBookingSchema);