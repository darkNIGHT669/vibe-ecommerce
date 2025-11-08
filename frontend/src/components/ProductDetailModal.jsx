import { useState, useEffect } from 'react';
import { FiX, FiShoppingCart, FiStar } from 'react-icons/fi';
import WishlistButton from './WishlistButton';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { toast } from 'react-toastify';

function ProductDetailModal({ product, isOpen, onClose, onAddToCart, userId = 'guest' }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product._id, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    // Reload reviews list (handled by ReviewList component)
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="min-h-screen px-4 py-8 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Product Info Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <WishlistButton productId={product._id} userId={userId} />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {product.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.numReviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-4xl font-bold text-blue-600">
                    ₹{product.price.toFixed(2)}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Stock */}
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-gray-700">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4">
                      <label className="font-medium text-gray-700">Quantity:</label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6 space-y-6">
                {/* Write Review Button */}
                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
                  >
                    Write a Review
                  </button>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <ReviewForm
                    productId={product._id}
                    userId={userId}
                    userName="Guest User"
                    onSuccess={handleReviewSuccess}
                    onClose={() => setShowReviewForm(false)}
                  />
                )}

                {/* Reviews List */}
                <ReviewList productId={product._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailModal;
