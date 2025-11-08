import { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
      setReviews(response.data.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await axios.post(`${API_URL}/reviews/${reviewId}/helpful`);
      
      setReviews(prev =>
        prev.map(review =>
          review._id === reviewId
            ? { ...review, helpful: review.helpful + 1 }
            : review
        )
      );
      
      toast.success('Thanks for your feedback!');
    } catch (error) {
      toast.error('Failed to mark as helpful');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No reviews yet</p>
        <p className="text-sm text-gray-400">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">
        Customer Reviews ({reviews.length})
      </h3>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">
                    {review.userName}
                  </span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <h4 className="font-semibold text-gray-800 mb-2">
              {review.title}
            </h4>
            <p className="text-gray-600 leading-relaxed mb-4">
              {review.comment}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleHelpful(review._id)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;