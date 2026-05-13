import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';

const statusColors = {
  ordered: 'badge-info', packed: 'badge-warning',
  shipped: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-error',
};

const steps = ['ordered', 'packed', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getDetail(orderNumber)
      .then(({ data }) => { setOrder(data.order); setItems(data.items); })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <p className="text-gray-400">Order not found.</p>
    </div>
  );

  const stepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-gray-400 font-body mb-1">Order Number</p>
            <h1 className="font-display text-2xl font-semibold text-obsidian">{order.order_number}</h1>
            <p className="text-xs text-gray-400 font-body mt-1">
              Placed on {new Date(order.ordered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`badge ${statusColors[order.status] || 'badge-info'} text-sm px-4 py-2`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Progress Bar */}
        {order.status !== 'cancelled' && (
          <div className="bg-white border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>
              {steps.map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= stepIndex ? 'bg-gold text-obsidian' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <p className="text-[10px] font-body uppercase tracking-widest text-gray-500 capitalize">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-display text-lg font-semibold text-obsidian mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  {item.product_image && (
                    <img src={item.product_image} alt={item.product_name} className="w-14 h-18 object-cover bg-gray-50 flex-shrink-0" style={{height:'72px'}} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-body font-medium text-obsidian">{item.product_name}</p>
                    <div className="flex gap-2 text-xs text-gray-400 font-body mt-0.5">
                      {item.size  && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <p className="text-xs font-body mt-1">Qty: {item.quantity} × ₹{parseFloat(item.unit_price).toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-sm font-semibold font-body text-obsidian">₹{parseFloat(item.total_price).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Shipping */}
            <div className="bg-white border border-gray-100 p-6">
              <h2 className="font-display text-lg font-semibold text-obsidian mb-3">Shipping Address</h2>
              <div className="text-sm font-body text-gray-600 space-y-1">
                <p className="font-semibold text-obsidian">{order.shipping_name}</p>
                <p>{order.shipping_phone}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-gray-100 p-6">
              <h2 className="font-display text-lg font-semibold text-obsidian mb-3">Payment Summary</h2>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shipping_amount > 0 ? `₹${order.shipping_amount}` : <span className="text-green-600">FREE</span>}</span></div>
                <div className="flex justify-between font-semibold text-obsidian border-t border-gray-100 pt-2"><span>Total</span><span>₹{parseFloat(order.final_amount).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-xs text-gray-400 pt-1">
                  <span>Payment</span>
                  <span className="capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/orders" className="btn-outline text-xs !py-3 !px-8">← Back to Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
