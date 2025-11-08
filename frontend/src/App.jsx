import { useState, useEffect } from 'react';
import ProductDetailModal from './components/ProductDetailModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import LoadingSpinner from './components/LoadingSpinner';
import { getProducts, getCart, addToCart, updateCartItem, removeFromCart } from './services/api';

function App() {
   const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');
  
  const userId = 'guest';

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadCart()]);
    setLoading(false);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const loadProducts = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;

      const data = await getProducts(params);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
    }
  };

  const loadCart = async () => {
    try {
      const data = await getCart(userId);
      setCart(data);
    } catch (error) {
      toast.error('Failed to load cart');
      console.error('Error loading cart:', error);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const data = await addToCart(productId, quantity, userId);
      setCart(data);
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const data = await updateCartItem(userId, productId, quantity);
      setCart(data);
      if (quantity === 0) {
        toast.info('Item removed from cart');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const data = await removeFromCart(userId, productId);
      setCart(data);
      toast.info('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (order) => {
    setCheckoutOpen(false);
    setReceiptData(order);
    setCart({ items: [], total: 0, itemCount: 0 });
    toast.success('Order placed successfully!');
  };

  const categories = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={cart.itemCount}
        onCartClick={() => setCartOpen(true)}
      />

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}  // ← ADD THIS
              />
            ))}
          </div>
        )}
      </main>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        userId={userId}
        onSuccess={handleCheckoutSuccess}
      />

      <ReceiptModal
        isOpen={!!receiptData}
        onClose={() => setReceiptData(null)}
        order={receiptData}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
        userId={userId}
      />
    </div>

  );
}

export default App;