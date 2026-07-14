const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  searchHotelsWithAI,
  searchFlightsWithAI,
} = require('../controllers/ai.controller');

const router = express.Router();

// ✅ Natural language hotel search
router.post('/search-hotels', protect, searchHotelsWithAI);

// ✅ Natural language flight search
router.post('/search-flights', protect, searchFlightsWithAI);

module.exports = router;