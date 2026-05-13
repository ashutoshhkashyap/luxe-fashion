import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-body font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <span className={`text-2xl`}>{icon}</span>
    </div>
    <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(({ data }) => { setStats(data.stats); setRecentOrders(data.recentOrders || []); })
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    ordered: 'badge-info', packed: 'badge-warning',
    shipped: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-error',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <header className="bg-obsidian text-ivory px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-display text-xl font-black tracking-widest">LUXE</span>
          <span className="text-gold text-xs ml-2 tracking-widest">ADMIN</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/admin/products" className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">Products</Link>
          <Link to="/admin/orders"   className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">Orders</Link>
          <Link to="/"               className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">View Shop</Link>
          <button onClick={() => { adminLogout(); navigate('/admin/login'); }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors tracking-widest uppercase">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-obsidian">Dashboard</h1>
          <p className="text-sm text-gray-400 font-body mt-1">Welcome back, {admin?.name}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Users"     value={stats?.totalUsers}    icon="👥" color="text-blue-600" />
              <StatCard label="Total Orders"    value={stats?.totalOrders}   icon="📦" color="text-purple-600" />
              <StatCard label="Total Products"  value={stats?.totalProducts} icon="👗" color="text-obsidian" />
              <StatCard label="Revenue"         value={`₹${parseFloat(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} icon="💰" color="text-gold" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-obsidian">Recent Orders</h2>
                <Link to="/admin/orders" className="text-xs text-gold hover:underline font-body">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Order</th>
                      <th className="text-left py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Customer</th>
                      <th className="text-left py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.order_number} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 font-medium">{order.order_number}</td>
                        <td className="py-3 text-gray-600">{order.user_name}</td>
                        <td className="py-3 font-semibold">₹{parseFloat(order.final_amount).toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className={`badge ${statusColors[order.status] || 'badge-info'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
