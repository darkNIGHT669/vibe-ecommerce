const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  expiryDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to validate and calculate discount
couponSchema.methods.calculateDiscount = function(cartTotal) {
  // Check if coupon is valid
  if (!this.isActive) {
    throw new Error('Coupon is inactive');
  }
  
  if (this.expiryDate < new Date()) {
    throw new Error('Coupon has expired');
  }
  
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    throw new Error('Coupon usage limit reached');
  }
  
  if (cartTotal < this.minPurchase) {
    throw new Error(`Minimum purchase of $${this.minPurchase} required`);
  }
  
  // Calculate discount
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = cartTotal * (this.discountValue / 100);
    
    // Apply max discount cap
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discountValue;
  }
  
  // Discount cannot exceed cart total
  if (discount > cartTotal) {
    discount = cartTotal;
  }
  
  return Math.round(discount * 100) / 100;
};

module.exports = mongoose.model('Coupon', couponSchema);