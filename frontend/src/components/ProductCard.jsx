import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
    <span className="text-[10px] text-gray-400 ml-1">({parseFloat(rating || 0).toFixed(1)})</span>
  </div>
);

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered,   setHovered]   = useState(false);

  const images = product.images || [];
  const mainImg = images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600';
  const hoverImg = images[1] || mainImg;

  const price    = product.discount_price || product.price;
  const original = product.discount_price ? product.price : null;
  const discountPct = original ? Math.round((1 - price / original) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add items to cart.'); return; }
    if (product.stock < 1) { toast.error('Out of stock.'); return; }
    await addToCart(product.id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          {/* Skeleton */}
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={mainImg}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            } ${imgLoaded ? '' : 'opacity-0'}`}
          />
          <img
            src={hoverImg}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_trending  && <span className="badge bg-obsidian text-ivory text-[9px] tracking-widest uppercase px-2 py-1">Trending</span>}
            {product.is_featured  && <span className="badge bg-gold text-obsidian text-[9px] tracking-widest uppercase px-2 py-1">Featured</span>}
            {discountPct > 0 && <span className="badge bg-red-500 text-white text-[9px] tracking-widest px-2 py-1">-{discountPct}%</span>}
            {product.stock < 1 && <span className="badge bg-gray-800 text-white text-[9px] tracking-widest px-2 py-1">Out of Stock</span>}
          </div>

          {/* Wishlist button */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-gold hover:text-obsidian transition-colors duration-200"
          >
            <svg className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-obsidian'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.5"/>
            </svg>
          </motion.button>

          {/* Quick Add */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: hovered ? 0 : '100%' }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 inset-x-0 bg-obsidian/95 backdrop-blur-sm"
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              className="w-full py-3 text-ivory text-xs tracking-widest uppercase font-medium hover:bg-gold hover:text-obsidian transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock < 1 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2 px-1">
          {product.brand && (
            <p className="text-[10px] font-body font-medium tracking-[0.2em] text-gold/80 uppercase mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="text-sm font-body font-medium text-obsidian leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200 mb-1.5">
            {product.name}
          </h3>
          {product.rating > 0 && (
            <div className="mb-1.5">
              <StarRating rating={product.rating} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold font-body text-obsidian">
              ₹{parseFloat(price).toLocaleString('en-IN')}
            </span>
            {original && (
              <span className="text-xs font-body text-gray-400 line-through">
                ₹{parseFloat(original).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
