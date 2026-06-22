const express = require('express');
const router = express.Router();
const {getHotels, getHotelById, createHotel, updateHotel, deleteHotel, addReview} = require('../controllers/hotel.controller');
const { adminOnly ,protect} = require('../middleware/auth.middleware');


router.get('/', getHotels);
router.get('/:id',getHotelById);
router.post('/',protect,adminOnly,createHotel);
router.put('/:id',protect,adminOnly,updateHotel);
router.delete('/:id',protect,adminOnly,deleteHotel);
router.post("/:id/reviews", protect, addReview);
module.exports = router;
