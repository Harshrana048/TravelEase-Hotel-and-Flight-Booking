
// External module
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library')
// Local module
const User = require('../models/User.model');
const HotelBooking = require('../models/HotelBooking.model');
const FlightBooking = require('../models/FlightBooking.model');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: 'Google credential missing' });

    let payload;

    // Check if credential is a JWT (ID Token) or an Access Token
    if (credential.split('.').length === 3) {
      // Verify the ID token with Google
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      // Verify Access Token with Google UserInfo endpoint
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` }
      });
      if (!response.ok) {
        throw new Error('Failed to verify access token with Google');
      }
      payload = await response.json();
    }

    const { email, name, sub } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });
    if(user && !user.googleId){
      user.googleId = sub;
      await user.save()
    }

    if (!user ) {
      // Create new user (no password needed)
      user = await User.create({
        name,
        email,
        googleId: sub,
       
      });
    } 

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
       
      },
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Google token', error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password, phone',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
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
    // 3. check if phone number is 10 digit and already exists
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number',
      });
    }
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this phone number already exists',
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
    res.status(201).json({ token, user: { id: user._id, name, email,  phone: user.phone,role: user.role } });

  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

exports.getlogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role , phone:user.phone, } });



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
      req.user._id, { name, phone }, {
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


