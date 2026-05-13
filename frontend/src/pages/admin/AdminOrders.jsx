import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
  ordered:   'badge-info',
  packed:    'badge-warning',
  shipped:   'badge-warning',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};

const statusOptions = ['ordered', 'packed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    adminService.getOrders()
      .then(({ data }) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderNumber, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderNumber, newStatus);
      toast.success('Order status updated.');
      fetchOrders();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-obsidian text-ivory px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-display text-xl font-black tracking-widest">LUXE</span>
          <span className="text-gold text-xs ml-2 tracking-widest">ADMIN</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/admin"          className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">Dashboard</Link>
          <Link to="/admin/products" className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">Products</Link>
          <Link to="/"               className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">View Shop</Link>
          <button onClick={() => { adminLogout(); navigate('/admin/login'); }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors tracking-widest uppercase">Logout</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-obsidian">Orders</h1>
          <p className="text-sm text-gray-400 font-body">{orders.length} total orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-display text-xl text-obsidian mb-2">No orders yet</h3>
            <p className="text-sm text-gray-400">Orders will appear here once customers start buying.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Order</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Customer</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Items</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Amount</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Payment</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.order_number} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-obsidian">{order.order_number}</td>
                    <td className="px-4 py-3 text-gray-600">{order.user_name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.ordered_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.item_count}</td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{parseFloat(order.final_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">
                      {order.payment_method === 'cod' ? 'COD' : 'Online'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.order_number, e.target.value)}
                        className={`text-xs border border-gray-200 rounded px-2 py-1 font-body bg-white cursor-pointer focus:outline-none focus:border-gold`}
                      >
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
