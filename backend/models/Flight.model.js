const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber:   { type: String, required: true, unique: true, trim: true },
  airline:        { type: String, required: true, trim: true },
  source:         { type: String, required: true, trim: true },
  destination:    { type: String, required: true, trim: true },
  departureTime:  { type: Date, required: true },
  arrivalTime:    { type: Date, required: true },
  availableSeats: { type: Number, required: true, min: 0 },
  totalSeats:     { type: Number, required: true },
  price:          { type: Number, required: true },
  class:          { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
}, { timestamps: true });

// Speeds up search queries
flightSchema.index({ source: 1, destination: 1, departureTime: 1 });

module.exports = mongoose.model('Flight', flightSchema);