const router = require('express').Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/add',           protect, addToWishlist);
router.delete('/remove/:itemId', protect, removeFromWishlist);
router.get('/',               protect, getWishlist);

module.exports = router;