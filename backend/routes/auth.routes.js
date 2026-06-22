const express = require('express');
const router = express.Router();

// Local module
const { register, getlogin, getProfile, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', register);
router.post('/login',getlogin);
router.get('/profile',protect,getProfile);
router.put('/profile',protect,updateProfile);


module.exports = router;
