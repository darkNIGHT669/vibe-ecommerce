const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Apply coupon code
router.post('/apply', async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    
    if (!code || !cartTotal) {
      return res.status(400).json({
        success: false,
        error: 'Coupon code and cart total are required'
      });
    }
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Invalid coupon code'
      });
    }
    
    try {
      const discount = coupon.calculateDiscount(cartTotal);
      const finalTotal = cartTotal - discount;
      
      res.json({
        success: true,
        data: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount: discount,
          originalTotal: cartTotal,
          finalTotal: finalTotal
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  } catch (error) {
    next(error);
  }
});

// Get all active coupons (for admin or display)
router.get('/', async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ 
      isActive: true,
      expiryDate: { $gte: new Date() }
    }).select('-usedCount -usageLimit');
    
    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;