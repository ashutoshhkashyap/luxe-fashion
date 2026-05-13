import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-ivory">
      <div className="w-full max-w-md bg-white p-8 md:p-10 shadow-card">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-black tracking-widest text-obsidian">LUXE</span>
          <p className="text-xs tracking-[0.3em] text-gold font-body uppercase mt-1">Welcome Back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-4 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm font-body text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
