const express = require('express');
const router = express.Router();

// Local module
const { register, getlogin, getProfile, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', register);
router.post('/login',getlogin);
router.get('/profile',protect,getProfile);
router.put('/profile',protect,updateProfile);
router.put('/change-password',protect,changePassword);
router.get(
  "/admin-test",
  protect,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin Access Granted"
    });
  }
);

module.exports = router;
