const User = require('../models/User.model');
const HotelBooking = require('../models/HotelBooking.model');
const FlightBooking = require('../models/FlightBooking.model');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');


exports.getAdminStats = async (req, res) => {
  try {
    const [
      users,
      hotels,
      flights,
      hotelBookings,
      flightBookings,
      confirmedHotelBookings,
      confirmedFlightBookings,
      cancelledHotelBookings,
      cancelledFlightBookings,
      hotelRevenueResult,
      flightRevenueResult
    ] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments(),
      Flight.countDocuments(),

      HotelBooking.countDocuments({ paymentStatus: "paid" }),
      FlightBooking.countDocuments({ paymentStatus: "paid" }),

      HotelBooking.countDocuments({ bookingStatus: "confirmed" }),
      FlightBooking.countDocuments({ bookingStatus: "confirmed" }),

      HotelBooking.countDocuments({ bookingStatus: "cancelled" }),
      FlightBooking.countDocuments({ bookingStatus: "cancelled" }),

      HotelBooking.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" }
          }
        }
      ]),

      FlightBooking.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" }
          }
        }
      ])
    ]);

    const hotelRevenue =
      hotelRevenueResult.length > 0
        ? hotelRevenueResult[0].totalRevenue
        : 0;

    const flightRevenue =
      flightRevenueResult.length > 0
        ? flightRevenueResult[0].totalRevenue
        : 0;

    const totalRevenue = hotelRevenue + flightRevenue;
    const totalBookings = hotelBookings + flightBookings;

    res.status(200).json({
      users,
      hotels,
      flights,

      totalBookings,
      hotelBookings,
      flightBookings,

      confirmedBookings:
        confirmedHotelBookings + confirmedFlightBookings,

      cancelledBookings:
        cancelledHotelBookings + cancelledFlightBookings,

      hotelRevenue,
      flightRevenue,
      totalRevenue,

      averageBookingValue:
        totalBookings > 0
          ? Number((totalRevenue / totalBookings).toFixed(2))
          : 0
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const [hotelBookings, flightBookings] = await Promise.all([
      HotelBooking.find()
        .populate("userId", "name email")
        .populate("hotelId", "name city")
        .sort({ createdAt: -1 }),

      FlightBooking.find()
        .populate("userId", "name email")
        .populate(
          "flightId",
          "flightNumber airline source destination departureTime"
        )
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      hotelBookings,
      flightBookings,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};