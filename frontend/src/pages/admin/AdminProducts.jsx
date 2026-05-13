import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService, productService, categoryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    productService.getAll({ limit: 100 })
      .then(({ data }) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted.');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product.');
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
          <Link to="/admin/orders"   className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">Orders</Link>
          <Link to="/"               className="text-xs text-ivory/70 hover:text-gold transition-colors tracking-widest uppercase">View Shop</Link>
          <button onClick={() => { adminLogout(); navigate('/admin/login'); }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors tracking-widest uppercase">Logout</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-obsidian">Products</h1>
          <p className="text-sm text-gray-400 font-body">{products.length} total products</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Product</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Price</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Stock</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Tags</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-12 object-cover bg-gray-100 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-obsidian line-clamp-1">{p.name}</p>
                          {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.category_name}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">₹{parseFloat(p.discount_price || p.price).toLocaleString('en-IN')}</p>
                      {p.discount_price && <p className="text-xs text-gray-400 line-through">₹{parseFloat(p.price).toLocaleString('en-IN')}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.is_featured   && <span className="badge bg-gold/10 text-gold border border-gold/20 text-[9px]">Featured</span>}
                        {p.is_trending   && <span className="badge bg-blue-50 text-blue-600 border border-blue-200 text-[9px]">Trending</span>}
                        {p.is_bestseller && <span className="badge bg-green-50 text-green-600 border border-green-200 text-[9px]">Bestseller</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors font-body"
                      >
                        Delete
                      </button>
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

export default AdminProducts;
