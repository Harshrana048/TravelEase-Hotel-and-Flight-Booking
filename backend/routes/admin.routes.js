const express = require('express');
const router = express.Router();

const {getAdminStats,getAllUsers, getAllBookings} = require('../controllers/admin.controller')
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/stats',protect,adminOnly,getAdminStats);
router.get('/all-users',protect,adminOnly,getAllUsers);
router.get('/all-bookings',protect,adminOnly,getAllBookings);


module.exports = router;