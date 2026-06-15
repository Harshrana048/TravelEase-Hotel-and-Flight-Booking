const express = require('express');
const router = express.Router();

// Local module
const { register } = require('../controllers/auth.controller');

// POST /api/auth/register
router.post('/register', register);

module.exports = router;
