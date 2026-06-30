const HotelBooking = require('../models/HotelBooking.model');
const FlightBooking = require('../models/FlightBooking.model');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');
const {
  generateHotelTicketPDF,
  generateFlightTicketPDF,
} = require("../utils/generatePDF");

exports.bookHotel = async (req, res) => {
    try {
        const { hotelId, contactPhone, guests, roomsBooked, checkInDate, checkOutDate } = req.body;

        if (!hotelId || !checkInDate || !checkOutDate || !contactPhone || !guests || !roomsBooked) {
            return res.status(400).json({
                message: 'All fields required: hotelId, checkInDate, checkOutDate, contactPhone, guests array, roomsBooked'
            });
        }
        // validate user array 
        if (!Array.isArray(guests) || guests.length === 0) {
            return res.status(400).json({
                message: 'guests must be a non-empty array with at least 1 guest'
            });
        }

        // Validate each guest has name and age
        for (let i = 0; i < guests.length; i++) {
            if (!guests[i].name || guests[i].age === undefined) {
                return res.status(400).json({
                    message: `Guest ${i + 1} missing fields. Each guest needs: name, age`
                });
            }
        }

        // Validate dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            return res.status(400).json({
                message: 'Check-out date must be after check-in date'
            });
        }

        // Fetch hotel

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Check if enough rooms available

        if (hotel.roomsAvailable < roomsBooked) {
            return res.status(400).json({
                message: `Only ${hotel.roomsAvailable} rooms available, you need ${roomsBooked}`
            });
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * hotel.pricePerNight * roomsBooked;

        // create Booking

        const booking = await HotelBooking.create({
            userId: req.user._id,
            hotelId,
            contactPhone,
            guests,
            guestCount: guests.length,
            roomsBooked,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            nights,
            totalPrice,
            bookingStatus: 'pending',      
            paymentStatus: 'pending',

        });
        // Reduce room availability
        hotel.roomsAvailable -= roomsBooked;
        await hotel.save();

        res.status(201).json(booking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.bookFlight = async (req, res) => {
    try {
        const { flightId, passengers, tripType, returnFlightId } = req.body;

        if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
            return res.status(400).json({
                message: 'flightId and passengers array (with at least 1 passenger) are required'
            });
        }

        // Validate each passenger has required fields
        for (let i = 0; i < passengers.length; i++) {
            if (!passengers[i].name || passengers[i].age === undefined) {
                return res.status(400).json({
                    message: `Passenger ${i + 1} missing fields. Each passenger needs: name,age`
                });
            }
        }
        const passengerCount = passengers.length;
        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });

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
            if (!returnFlight) return res.status(404).json({ message: 'Return flight not found' });
            if (returnFlight.availableSeats < passengerCount) {
                return res.status(400).json({
                    message: `Only ${returnFlight.availableSeats} seats available on return flight`
                });
            }
        }

        // Calculate price
        const totalPrice = tripType === 'round-trip' && returnFlight
            ? (flight.price + returnFlight.price) * passengerCount
            : flight.price * passengerCount;

        // Generate seat numbers for each passenger
        const seatNumbers = [];
        for (let i = 0; i < passengerCount; i++) {
            seatNumbers.push(`S${flight.availableSeats - i}`);
        }

        const booking = await FlightBooking.create({
            userId: req.user._id,
            flightId,
            passengers,
            passengerCount,
            seatNumbers,
            totalPrice,
            bookingStatus: 'pending',      
            paymentStatus: 'pending',
            tripType: tripType || 'one-way',
            returnFlightId: tripType === 'round-trip' ? returnFlightId : null,
        });

        flight.availableSeats -= passengerCount;
        await flight.save();

        if (returnFlight) {
            returnFlight.availableSeats -= passengerCount;
            await returnFlight.save();
        }

        res.status(201).json(booking);


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

exports.getMyBookings = async (req, res) => {
    try {
        const [hotelBookings, flightBookings] = await Promise.all([
            HotelBooking.find({ userId: req.user._id })
                .populate('hotelId', 'name city images pricePerNight address')
                .sort({ createdAt: -1 }),
            FlightBooking.find({ userId: req.user._id })
                .populate('flightId', 'flightNumber airline source destination departureTime arrivalTime price')
                .sort({ createdAt: -1 }),
        ])

        res.json({ hotelBookings, flightBookings })

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
exports.downloadTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { type } = req.query;

    if (type === "HotelBooking") {
      const booking = await HotelBooking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      const hotel = await Hotel.findById(booking.hotelId);

      const pdfBuffer = await generateHotelTicketPDF(booking, hotel);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=hotel-ticket-${booking._id}.pdf`
      );

      return res.send(pdfBuffer);
    }

    if (type === "FlightBooking") {
      const booking = await FlightBooking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      const flight = await Flight.findById(booking.flightId);

      let returnFlight = null;

      if (booking.returnFlightId) {
        returnFlight = await Flight.findById(
          booking.returnFlightId
        );
      }

      const pdfBuffer = await generateFlightTicketPDF(
        booking,
        flight,
        returnFlight
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=flight-ticket-${booking._id}.pdf`
      );

      return res.send(pdfBuffer);
    }

    return res.status(400).json({
      message: "Invalid booking type",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.cancelBookings = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query;

        if (!type || !['hotel', 'flight'].includes(type)) {
            return res.status(400).json({ message: 'Query param "type" must be "hotel" or "flight"' });
        }

        const Model = type === 'hotel' ? HotelBooking : FlightBooking;

        const booking = await Model.findOne({ _id: id, userId: req.user._id });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.bookingStatus = 'cancelled';

        if (booking.paymentStatus === 'paid') {
            booking.paymentStatus = 'refund_pending';
        }
        await booking.save();

        
        res.json({ message: 'Booking cancelled successfully', booking });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};