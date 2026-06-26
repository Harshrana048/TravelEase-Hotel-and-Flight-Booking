
// External module
const jwt = require('jsonwebtoken');
// Local module
const User = require('../models/User.model');
const HotelBooking = require('../models/HotelBooking.model');
const FlightBooking = require('../models/FlightBooking.model');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');

const signToken = (id) => {
 return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, email, password, phone',
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            });
        }
        
        // 4. Create the user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            
        });
        const token = signToken(user._id);

        // 5. Respond (never send password back)
         res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });

    } catch (error) {
        console.error('Register error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

exports.getlogin = async(req,res,next) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Email and password required'});
        }

        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password) )){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const token = signToken(user._id);
         res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });

        
        
    } catch (err) {
        res.status(500).json({ message: err.message });    
    }
}

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, phone },  {
    returnDocument: 'after'
  }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(oldPassword)))
      return res.status(400).json({ message: 'Old password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/admin/stats
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