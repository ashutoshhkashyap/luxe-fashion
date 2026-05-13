import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useCart();

  const products = wishlist.map(item => ({
    ...item,
    id: item.product_id,
  }));

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-obsidian mb-8">
          My Wishlist {wishlist.length > 0 && <span className="text-gold">({wishlist.length})</span>}
        </h1>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.2"/>
            </svg>
            <h3 className="font-display text-xl text-obsidian mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-gray-400 mb-6">Save items you love to your wishlist.</p>
            <Link to="/products" className="btn-primary text-xs !py-3 !px-8">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
