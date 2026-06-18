const express = require('express');
const router = express.Router();

// Local module
const { register, getlogin } = require('../controllers/auth.controller');

// POST /api/auth/register
router.post('/register', register);
router.post('/login',getlogin);

module.exports = router;
