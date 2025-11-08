const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  this.total = Math.round(this.total * 100) / 100; // Round to 2 decimal places
  this.lastUpdated = Date.now();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity, price });
  }

  await this.save();
  return this;
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function(productId, quantity) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    this.items = this.items.filter(item => 
      item.product.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }

  await this.save();
  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  await this.save();
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.total = 0;
  await this.save();
  return this;
};

// Static method to get or create cart
cartSchema.statics.getOrCreate = async function(userId) {
  let cart = await this.findOne({ userId }).populate('items.product');
  
  if (!cart) {
    cart = await this.create({ userId, items: [], total: 0 });
  }
  
  return cart;
};

module.exports = mongoose.model('Cart', cartSchema);