import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'An error occurred';
    
    throw new Error(errorMessage);
  }
);

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCart = async (userId) => {
  const response = await api.get(`/cart/${userId}`);
  return response.data;
};

export const addToCart = async (productId, quantity, userId) => {
  const response = await api.post('/cart', { productId, quantity, userId });
  return response.data;
};

export const updateCartItem = async (userId, productId, quantity) => {
  const response = await api.put(`/cart/${userId}/item/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (userId, productId) => {
  const response = await api.delete(`/cart/${userId}/item/${productId}`);
  return response.data;
};

export const clearCart = async (userId) => {
  const response = await api.delete(`/cart/${userId}`);
  return response.data;
};

export const checkout = async (userId, customerInfo) => {
  const response = await api.post('/checkout', { userId, customerInfo });
  return response.data;
};

export const getOrders = async (userId) => {
  const response = await api.get(`/checkout/orders/${userId}`);
  return response.data;
};

export const getOrder = async (orderNumber) => {
  const response = await api.get(`/checkout/order/${orderNumber}`);
  return response.data;
};

export default api;
