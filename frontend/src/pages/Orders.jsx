import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';

const statusColors = {
  ordered:   'badge-info',
  packed:    'badge-warning',
  shipped:   'badge-warning',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(({ data }) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-obsidian mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-display text-xl text-obsidian mb-2">No orders yet</h3>
            <p className="text-sm text-gray-400 mb-6">Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-primary text-xs !py-3 !px-8">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.order_number}`}
                className="block border border-gray-100 bg-white p-5 hover:border-gold transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-body mb-1">Order Number</p>
                    <p className="font-body font-semibold text-obsidian">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-body mb-1">Date</p>
                    <p className="text-sm font-body">{new Date(order.ordered_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-body mb-1">Items</p>
                    <p className="text-sm font-body">{order.item_count} item{order.item_count !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-body mb-1">Total</p>
                    <p className="font-body font-semibold text-obsidian">₹{parseFloat(order.final_amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className={`badge ${statusColors[order.status] || 'badge-info'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
