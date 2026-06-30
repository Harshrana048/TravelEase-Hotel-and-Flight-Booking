const express = require('express');
const router = express.Router();

const {
  bookHotel,
  bookFlight,
  getMyBookings,
  downloadTicket,
  cancelBookings
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/hotel', protect, bookHotel);
router.post('/flight', protect, bookFlight);
router.get('/my-bookings', protect, getMyBookings);
router.get(
  "/download-ticket/:bookingId",
  protect,
  downloadTicket
);
router.patch('/cancel/:id', protect, cancelBookings)
module.exports = router;