import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, subtotal, updateItem, removeItem, cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartLoading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-obsidian mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="1.2"/>
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.2"/>
              <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="1.2"/>
            </svg>
            <h3 className="font-display text-xl text-obsidian mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mb-6">Add some products to get started.</p>
            <Link to="/products" className="btn-primary text-xs !py-3 !px-8">Shop Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => {
                  const price = item.discount_price || item.price;
                  const image = item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200';
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-5 p-4 border border-gray-100 bg-white"
                    >
                      <Link to={`/products/${item.slug}`}>
                        <img src={image} alt={item.name} className="w-24 h-32 object-cover bg-gray-50 flex-shrink-0" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div>
                            {item.brand && <p className="text-[10px] text-gold uppercase tracking-widest font-body mb-1">{item.brand}</p>}
                            <Link to={`/products/${item.slug}`}>
                              <h3 className="text-sm font-body font-medium text-obsidian hover:text-gold transition-colors line-clamp-2">{item.name}</h3>
                            </Link>
                            <div className="flex gap-3 mt-1">
                              {item.size  && <p className="text-xs text-gray-400 font-body">Size: {item.size}</p>}
                              {item.color && <p className="text-xs text-gray-400 font-body">Color: {item.color}</p>}
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200">
                            <button onClick={() => updateItem(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-sm">−</button>
                            <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                            <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-sm">+</button>
                          </div>
                          <p className="font-body font-semibold text-obsidian">
                            ₹{(parseFloat(price) * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 sticky top-28">
                <h2 className="font-display text-xl font-semibold text-obsidian mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{parseFloat(subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400 font-body">Add ₹{(999 - subtotal).toFixed(0)} more for free shipping</p>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-body font-semibold text-obsidian">
                    <span>Total</span>
                    <span>₹{parseFloat(total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {user ? (
                  <button onClick={() => navigate('/checkout')} className="btn-primary w-full !py-4 text-sm">
                    Proceed to Checkout
                  </button>
                ) : (
                  <button onClick={() => navigate('/login')} className="btn-primary w-full !py-4 text-sm">
                    Login to Checkout
                  </button>
                )}
                <Link to="/products" className="btn-outline w-full !py-3 text-xs mt-3 text-center block">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
