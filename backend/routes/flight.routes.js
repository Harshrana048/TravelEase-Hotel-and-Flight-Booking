const express = require('express');
const router = express.Router();

const {
  getFlight,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
} = require('../controllers/flight.contoller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/',       getFlight);
router.get('/:id',    getFlightById);
router.post('/',      protect, adminOnly, createFlight);
router.put('/:id',    protect, adminOnly, updateFlight);
router.delete('/:id', protect, adminOnly, deleteFlight);


module.exports = router;