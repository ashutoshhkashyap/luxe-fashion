import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-obsidian mb-8">My Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50">
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-2xl font-bold text-gold font-display">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-obsidian">{user?.name}</p>
            <p className="text-sm text-gray-400 font-body">{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-obsidian mb-2">Edit Profile</h2>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="input-field" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-2">Address</label>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="input-field resize-none" rows={3} placeholder="Your delivery address" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary !py-3 !px-8">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Logout */}
        <div className="mt-6 text-center">
          <button onClick={logout} className="text-sm text-red-400 hover:text-red-600 font-body transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
