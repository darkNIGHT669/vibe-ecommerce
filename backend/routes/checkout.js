// ========================================
// FILE: routes/checkout.js
// Location: backend/routes/checkout.js
// ========================================
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST /api/checkout
// @desc    Process checkout and create order
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { userId = 'guest', customerInfo } = req.body;
    
    // Validate customer info
    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer name and email are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }
    
    // Get cart
    const cart = await Cart.findOne({ userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }
    
    // Verify stock availability for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.product.name} is no longer available`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
        });
      }
    }
    
    // Create order
    const order = await Order.createFromCart(cart, customerInfo, userId);
    
    // Update product stock (in real app, this would be in a transaction)
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart
    await cart.clearCart();
    
    // Populate order items
    await order.populate('items.product');
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        total: order.total,
        customerInfo: order.customerInfo,
        status: order.status,
        timestamp: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/checkout/orders/:userId
// @desc    Get user's order history
// @access  Public
router.get('/orders/:userId', async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/checkout/order/:orderNumber
// @desc    Get specific order by order number
// @access  Public
router.get('/order/:orderNumber', async (req, res, next) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;