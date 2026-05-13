import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    shipping_name: '', shipping_phone: '', shipping_address: '',
    shipping_city: '', shipping_state: '', shipping_pincode: '',
    payment_method: 'cod', notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty.'); return; }
    setLoading(true);
    try {
      const { data } = await orderService.place(form);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order.order_number}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-obsidian mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 p-6">
                <h2 className="font-display text-xl font-semibold text-obsidian mb-6">Shipping Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Full Name *</label>
                    <input required value={form.shipping_name} onChange={e => set('shipping_name', e.target.value)} className="input-field" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Phone *</label>
                    <input required value={form.shipping_phone} onChange={e => set('shipping_phone', e.target.value)} className="input-field" placeholder="+91 98765 43210" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Address *</label>
                    <input required value={form.shipping_address} onChange={e => set('shipping_address', e.target.value)} className="input-field" placeholder="House no, Street, Area" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">City *</label>
                    <input required value={form.shipping_city} onChange={e => set('shipping_city', e.target.value)} className="input-field" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">State *</label>
                    <input required value={form.shipping_state} onChange={e => set('shipping_state', e.target.value)} className="input-field" placeholder="Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Pincode *</label>
                    <input required value={form.shipping_pincode} onChange={e => set('shipping_pincode', e.target.value)} className="input-field" placeholder="400001" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Payment Method</label>
                    <select value={form.payment_method} onChange={e => set('payment_method', e.target.value)} className="input-field">
                      <option value="cod">Cash on Delivery</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Notes (Optional)</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="input-field resize-none" rows={3} placeholder="Any special instructions..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 sticky top-28">
                <h2 className="font-display text-xl font-semibold text-obsidian mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.images?.[0]} alt={item.name} className="w-12 h-16 object-cover bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-body font-medium text-obsidian line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400 font-body">Qty: {item.quantity}</p>
                        <p className="text-xs font-semibold font-body">₹{((item.discount_price || item.price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{parseFloat(subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold font-body text-obsidian border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>₹{parseFloat(total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full !py-4 mt-6 text-sm">
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
