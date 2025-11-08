// ========================================
// FILE: seed.js
// Location: backend/seed.js
// ========================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    price: 18999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    stock: 45,
    rating: 4.7
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 50+ sport modes.',
    price: 14999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    stock: 60,
    rating: 4.5
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable, sustainable t-shirt made from 100% organic cotton. Available in multiple colors.',
    price: 799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    stock: 150,
    rating: 4.3
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Elegant genuine leather bag with adjustable strap and multiple compartments. Perfect for daily use.',
    price: 4999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    stock: 35,
    rating: 4.6
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 handcrafted ceramic pots with drainage holes and saucers. Modern minimalist design.',
    price: 1299,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
    stock: 80,
    rating: 4.4
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly yoga mat with extra cushioning. Includes carrying strap.',
    price: 1499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
    stock: 100,
    rating: 4.8
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle keeps drinks cold for 24hrs or hot for 12hrs. BPA-free and leak-proof.',
    price: 699,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    stock: 200,
    rating: 4.6
  },
  {
    name: 'Classic Novel Collection',
    description: 'Beautiful hardcover collection of 5 timeless classics. Perfect for book lovers.',
    price: 2499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    stock: 50,
    rating: 4.9
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    stock: 75,
    rating: 4.5
  },
  {
    name: 'Aromatherapy Diffuser',
    description: 'Ultrasonic essential oil diffuser with LED lights and auto shut-off. Creates a calming atmosphere.',
    price: 1299,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
    stock: 90,
    rating: 4.4
  },
  {
    name: 'Professional Chef Knife',
    description: 'High-carbon stainless steel 8-inch chef knife with ergonomic handle. Essential for any kitchen.',
    price: 2999,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80',
    stock: 40,
    rating: 4.7
  },
 {
  name: 'Bamboo Cutting Board Set',
  description: 'Set of 3 eco-friendly bamboo cutting boards in different sizes with juice grooves.',
  price: 1799,
  category: 'Home & Garden',
  image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80',
  stock: 65,
  rating: 4.5
}
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    console.log('📦 Cleared existing products');

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products seeded successfully`);

    console.log('\n🎉 Database seeded! Products:');
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} (₹${product.price})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();