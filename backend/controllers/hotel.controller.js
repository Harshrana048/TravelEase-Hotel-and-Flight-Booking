const Hotel = require('../models/hotel.model');


exports.getHotels = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, rating, amenities, page = 1, limit = 9 } = req.query;
        const filter = {};

        if (city) {
            filter.city = new RegExp(city, 'i');
        }

        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);

        }

        if (rating) {
            filter.rating = { $gte: Number(rating) };
        }

        if (amenities) {
            const amenitiesarray = amenities.split(',').map((a) => a.trim());
            filter.amenities = { $all: amenitiesarray };
        }
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const total = await Hotel.countDocuments(filter);

        const hotels = await Hotel.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ rating: -1, createdAt: -1 });



        res.json({
            hotels,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

exports.getHotelById = async (req, res) => {
    try {
        const id = req.params.id;
        const hotel = await Hotel.findById(id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: err.message });

    }
}
exports.createHotel = async (req, res) => {
    try {
        const { name, city, address, pricePerNight, roomsAvailable } = req.body;

        if (!name || !city || !address || !pricePerNight || !roomsAvailable) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hotel = await Hotel.create(req.body);
        res.status(201).json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        const alreadyReviewed = hotel.reviews.find(
            r => r.userId.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You already reviewed this hotel"
            });
        }

        hotel.reviews.push({ userId: req.user._id, userName: req.user.name, rating, comment });
        hotel.rating = hotel.reviews.reduce((a, r) => a + r.rating, 0) / hotel.reviews.length;
        await hotel.save();
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};