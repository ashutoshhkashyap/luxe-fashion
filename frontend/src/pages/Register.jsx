import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to LUXE.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-ivory">
      <div className="w-full max-w-md bg-white p-8 md:p-10 shadow-card">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-black tracking-widest text-obsidian">LUXE</span>
          <p className="text-xs tracking-[0.3em] text-gold font-body uppercase mt-1">Create Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Full Name</label>
            <input type="text" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Doe" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Phone (Optional)</label>
            <input type="tel" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+91 98765 43210" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 characters" className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-4 mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm font-body text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
