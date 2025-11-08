const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
router.get('/:userId', async (req, res, next) => {
  try {
    const wishlist = await Wishlist.getOrCreate(req.params.userId);
    await wishlist.populate('products');
    
    res.json({
      success: true,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
});

// Add product to wishlist
router.post('/:userId', async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const wishlist = await Wishlist.getOrCreate(req.params.userId);
    await wishlist.addProduct(productId);
    await wishlist.populate('products');
    
    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
});

// Remove product from wishlist
router.delete('/:userId/product/:productId', async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    
    const wishlist = await Wishlist.getOrCreate(userId);
    await wishlist.removeProduct(productId);
    await wishlist.populate('products');
    
    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;