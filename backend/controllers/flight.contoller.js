const Flight = require('../models/Flight.model');


exports.getFlight = async (req, res) => {
    try {
        const { source, destination, date, page = 1, limit = 9 } = req.query;

        const filter = { availableSeats: { $gt: 0 } };

        if (source) filter.source = new RegExp(source, 'i');
        if (destination) filter.destination = new RegExp(destination, 'i');

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 9999);
            filter.departureTime = { $gte: start, $lte: end };
        } 
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const total = await Flight.countDocuments(filter);

        const flights = await Flight.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ departureTime: 1 });

        res.json({
            flights,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const {
      flightNumber, airline, source, destination,
      departureTime, arrivalTime, availableSeats, price,
    } = req.body;

    if (!flightNumber || !airline || !source || !destination ||
        !departureTime || !arrivalTime || !availableSeats || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (new Date(arrivalTime) <= new Date(departureTime)) {
      return res.status(400).json({ message: 'Arrival time must be after departure time' });
    }

    const existing = await Flight.findOne({ flightNumber });
    if (existing) {
      return res.status(400).json({ message: 'Flight number already exists' });
    }

    const flight = await Flight.create({
      ...req.body,
      totalSeats: req.body.totalSeats || availableSeats,
    });

    res.status(201).json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json({ message: 'Flight deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};