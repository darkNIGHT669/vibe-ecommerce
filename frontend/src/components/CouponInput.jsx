import { useState } from 'react';
import { FiTag } from 'react-icons/fi';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function CouponInput({ cartTotal, onApplyCoupon }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/coupons/apply`, {
        code: code.trim(),
        cartTotal
      });

      const couponData = response.data.data;
      setApplied(couponData);
      onApplyCoupon(couponData);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid coupon code');
      setApplied(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setApplied(null);
    setError('');
    onApplyCoupon(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            disabled={loading || applied}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 uppercase"
          />
        </div>
        {!applied ? (
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        ) : (
          <button
            onClick={handleRemove}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {applied && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-800">
            <FiTag className="w-4 h-4" />
            <span className="font-semibold">{applied.code} applied!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            You saved ${applied.discount.toFixed(2)}
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Try: WELCOME10, SAVE20, FREESHIP
      </div>
    </div>
  );
}

export default CouponInput;