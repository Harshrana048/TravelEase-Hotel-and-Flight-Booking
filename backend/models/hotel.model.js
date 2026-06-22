const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
}, { timestamps: true });

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    description: { type: String, default: '' },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    images: [String],
    amenities: [String],
    roomsAvailable: { type: Number, required: true },
    reviews: [reviewSchema],
}, { timestamps: true });


hotelSchema.index({ city: 1, pricePerNight: 1, rating: -1});

module.exports = mongoose.model('Hotel',hotelSchema);