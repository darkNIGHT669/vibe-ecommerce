const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  productImage: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    default: 'mock_payment'
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Calculate subtotals for items
orderSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.subtotal = Math.round(item.price * item.quantity * 100) / 100;
  });
  next();
});

// Static method to create order from cart
orderSchema.statics.createFromCart = async function(cart, customerInfo, userId) {
  const items = cart.items.map(item => ({
    product: item.product._id,
    productName: item.product.name,
    productImage: item.product.image,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity
  }));

  const order = await this.create({
    userId,
    items,
    total: cart.total,
    customerInfo,
    status: 'confirmed'
  });

  return order;
};

module.exports = mongoose.model('Order', orderSchema);