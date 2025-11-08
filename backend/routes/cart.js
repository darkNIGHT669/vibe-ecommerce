const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET /api/cart/:userId
// @desc    Get user's cart
// @access  Public
router.get('/:userId', async (req, res, next) => {
  try {
    const cart = await Cart.getOrCreate(req.params.userId);
    await cart.populate('items.product');
    
    // Filter out items with deleted products
    const validItems = cart.items.filter(item => item.product);
    
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
    
    res.json({
      success: true,
      data: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity = 1, userId = 'guest' } = req.body;
    
    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }
    
    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Product is not available'
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.stock} items available in stock`
      });
    }
    
    // Get or create cart
    const cart = await Cart.getOrCreate(userId);
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stock} items available. You already have ${existingItem.quantity} in cart.`
        });
      }
    }
    
    // Add item to cart
    await cart.addItem(productId, quantity, product.price);
    await cart.populate('items.product');
    
    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/cart/:userId/item/:productId
// @desc    Update item quantity in cart
// @access  Public
router.put('/:userId/item/:productId', async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid quantity is required'
      });
    }
    
    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.stock} items available in stock`
      });
    }
    
    const cart = await Cart.getOrCreate(userId);
    await cart.updateItemQuantity(productId, quantity);
    await cart.populate('items.product');
    
    res.json({
      success: true,
      message: quantity > 0 ? 'Cart updated' : 'Item removed from cart',
      data: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    if (error.message === 'Item not found in cart') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

// @route   DELETE /api/cart/:userId/item/:productId
// @desc    Remove item from cart
// @access  Public
router.delete('/:userId/item/:productId', async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    
    const cart = await Cart.getOrCreate(userId);
    await cart.removeItem(productId);
    await cart.populate('items.product');
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/:userId
// @desc    Clear entire cart
// @access  Public
router.delete('/:userId', async (req, res, next) => {
  try {
    const cart = await Cart.getOrCreate(req.params.userId);
    await cart.clearCart();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

