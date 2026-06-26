const express = require('express');
const router = express.Router();

// Local module
const { register, getlogin, getProfile, updateProfile, changePassword, getAdminStats } = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', register);
router.post('/login',getlogin);
router.get('/profile',protect,getProfile);
router.put('/profile',protect,updateProfile);
router.put('/change-password',protect,changePassword);
router.get('/admin/stats',protect,adminOnly,getAdminStats);


module.exports = router;
