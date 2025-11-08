import { FiShoppingCart } from 'react-icons/fi';

function Header({ cartItemCount, onCartClick }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Vibe Commerce
            </h1>
          </div>
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-blue-500 rounded-lg transition-colors duration-200"
            aria-label="Shopping cart"
          >
            <FiShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

