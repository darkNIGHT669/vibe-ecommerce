import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function WishlistButton({ productId, userId = 'guest' }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, [productId]);

  const checkWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist/${userId}`);
      const wishlist = response.data.data;
      setIsInWishlist(wishlist.some(item => item._id === productId));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (isInWishlist) {
        await axios.delete(`${API_URL}/wishlist/${userId}/product/${productId}`);
        setIsInWishlist(false);
        toast.info('Removed from wishlist');
      } else {
        await axios.post(`${API_URL}/wishlist/${userId}`, { productId });
        setIsInWishlist(true);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isInWishlist
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <FiHeart
        className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
      />
    </button>
  );
}

export default WishlistButton;