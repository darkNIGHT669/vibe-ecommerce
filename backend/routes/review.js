// const express = require('express');
// const router = express.Router();
// const Review = require('../models/Review');
// const Product = require('../models/Product');

// // Get reviews for a product
// router.get('/product/:productId', async (req, res, next) => {
//   try {
//     const reviews = await Review.find({ 
//       product: req.params.productId 
//     }).sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       count: reviews.length,
//       data: reviews
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Create review
// router.post('/', async (req, res, next) => {
//   try {
//     const { productId, userId, userName, rating, title, comment } = req.body;
    
//     // Validate input
//     if (!productId || !userId || !userName || !rating || !title || !comment) {
//       return res.status(400).json({
//         success: false,
//         error: 'All fields are required'
//       });
//     }
    
//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }
    
//     // Check if user already reviewed
//     const existingReview = await Review.findOne({
//       product: productId,
//       userId: userId
//     });
    
//     if (existingReview) {
//       return res.status(400).json({
//         success: false,
//         error: 'You have already reviewed this product'
//       });
//     }
    
//     const review = await Review.create({
//       product: productId,
//       userId,
//       userName,
//       rating,
//       title,
//       comment
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Review created successfully',
//       data: review
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Mark review as helpful
// router.post('/:reviewId/helpful', async (req, res, next) => {
//   try {
//     const review = await Review.findByIdAndUpdate(
//       req.params.reviewId,
//       { $inc: { helpful: 1 } },
//       { new: true }
//     );
    
//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: review
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;