import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, wishlistService } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items,      setItems]     = useState([]);
  const [subtotal,   setSubtotal]  = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlist,   setWishlist]  = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); setSubtotal(0); return; }
    setCartLoading(true);
    try {
      const { data } = await cartService.get();
      setItems(data.items || []);
      setSubtotal(data.subtotal || 0);
    } catch {}
    finally { setCartLoading(false); }
  }, [user]);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const { data } = await wishlistService.get();
      setWishlist(data.items || []);
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);
  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      await cartService.add({ product_id: productId, quantity, size: size||'', color: color||'' });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart.');
    }
  };

  const updateItem = async (itemId, qty) => {
    try {
      await cartService.updateItem(itemId, qty);
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update cart.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await fetchCart();
      toast.success('Item removed.');
    } catch {}
  };

  const clearCart = async () => {
    try { await cartService.clear(); setItems([]); setSubtotal(0); } catch {}
  };

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error('Please login to use wishlist.'); return; }
    try {
      const { data } = await wishlistService.toggle(productId);
      await fetchWishlist();
      toast.success(data.message);
    } catch {}
  };

  const isInWishlist = (productId) => wishlist.some(w => w.product_id === productId);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, subtotal, cartLoading, cartCount, wishlist, isInWishlist,
      fetchCart, addToCart, updateItem, removeItem, clearCart, toggleWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
