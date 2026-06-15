
// Local module
const User = require('../models/User.model');


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
        const newUser = await User.create({
            name,
            email,
            password,
            phone,
        });

        // 5. Respond (never send password back)
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });

    } catch (error) {
        console.error('Register error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};