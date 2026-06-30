const User = require('../models/User.model');

// POST /api/wishlist/add
exports.addToWishlist = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      return res.status(400).json({
        message: 'itemId and itemType (hotel or flight) are required',
      });
    }

    if (!['hotel', 'flight'].includes(itemType)) {
      return res.status(400).json({
        message: 'itemType must be "hotel" or "flight"',
      });
    }

    const user = await User.findById(req.user._id);

    const wishlistKey = itemType === 'hotel' ? 'hotels' : 'flights';
    const already = user.wishlist[wishlistKey].includes(itemId);

    if (already) {
      return res.status(400).json({
        message: `This ${itemType} is already in your wishlist`,
      });
    }

    user.wishlist[wishlistKey].push(itemId);
    await user.save();

    res.json({
      message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added to wishlist`,
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/wishlist/remove/:itemId?type=hotel|flight
exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { type } = req.query;

    if (!itemId || !type) {
      return res.status(400).json({
        message: 'itemId and type query param (hotel or flight) are required',
      });
    }

    if (!['hotel', 'flight'].includes(type)) {
      return res.status(400).json({
        message: 'type must be "hotel" or "flight"',
      });
    }

    const user = await User.findById(req.user._id);
    const wishlistKey = type === 'hotel' ? 'hotels' : 'flights';

    const index = user.wishlist[wishlistKey].indexOf(itemId);

    if (index === -1) {
      return res.status(400).json({
        message: `This ${type} is not in your wishlist`,
      });
    }

    user.wishlist[wishlistKey].splice(index, 1);
    await user.save();

    res.json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed from wishlist`,
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist.hotels')
      .populate('wishlist.flights');

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};