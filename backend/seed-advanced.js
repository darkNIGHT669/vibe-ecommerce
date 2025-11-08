const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

dotenv.config();

const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 50,
    maxDiscount: 20,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 100,
    isActive: true
  },
  {
    code: 'SAVE20',
    discountType: 'fixed',
    discountValue: 20,
    minPurchase: 100,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 50,
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 5.99,
    minPurchase: 25,
    expiryDate: new Date('2025-12-31'),
    isActive: true
  },
  {
    code: 'FLASH50',
    discountType: 'percentage',
    discountValue: 50,
    minPurchase: 200,
    maxDiscount: 100,
    expiryDate: new Date('2025-11-30'),
    usageLimit: 20,
    isActive: true
  }
];

const seedCoupons = async () => {
  try {
    await connectDB();
    
    await Coupon.deleteMany();
    console.log('📦 Cleared existing coupons');
    
    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`✅ ${createdCoupons.length} coupons created`);
    
    console.log('\n🎉 Available Coupons:');
    createdCoupons.forEach(coupon => {
      const discount = coupon.discountType === 'percentage' 
        ? `${coupon.discountValue}% off`
        : `$${coupon.discountValue} off`;
      console.log(`   ${coupon.code}: ${discount} (Min: $${coupon.minPurchase})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
    process.exit(1);
  }
};

seedCoupons();