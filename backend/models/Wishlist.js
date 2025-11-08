const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Prevent duplicate products in wishlist
wishlistSchema.index({ userId: 1, products: 1 }, { unique: true });

// Static method to get or create wishlist
wishlistSchema.statics.getOrCreate = async function(userId) {
  let wishlist = await this.findOne({ userId }).populate('products');
  
  if (!wishlist) {
    wishlist = await this.create({ userId, products: [] });
  }
  
  return wishlist;
};

// Method to add product
wishlistSchema.methods.addProduct = async function(productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    await this.save();
  }
  return this;
};

// Method to remove product
wishlistSchema.methods.removeProduct = async function(productId) {
  this.products = this.products.filter(
    id => id.toString() !== productId.toString()
  );
  await this.save();
  return this;
};

module.exports = mongoose.model('Wishlist', wishlistSchema);