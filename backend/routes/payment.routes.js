const express = require('express');
const router = express.Router();


const { createOrder, verifyPayment, paymentFailed, getPaymentHistory,  cancelAndRefund, handleWebhook } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create-order',protect,createOrder);
router.post('/verify',protect,verifyPayment);
router.post('/payment-failed',protect ,paymentFailed);
router.get('/history',protect,getPaymentHistory);
router.post('/refunds/:paymentId',protect,cancelAndRefund)
router.post('/webhook', handleWebhook);


module.exports = router;