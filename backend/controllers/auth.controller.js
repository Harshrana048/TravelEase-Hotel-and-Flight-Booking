
// External module
const jwt = require('jsonwebtoken');
// Local module
const User = require('../models/User.model');

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