import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [admin,     setAdmin]     = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('luxe_token');
    const stored = localStorage.getItem('luxe_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const adminToken   = localStorage.getItem('luxe_admin_token');
    const storedAdmin  = localStorage.getItem('luxe_admin');
    if (adminToken && storedAdmin) {
      try { setAdmin(JSON.parse(storedAdmin)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await authService.register({ name, email, password, phone });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
    setUser(null);
  };

  const adminLogin = async (email, password) => {
    const { data } = await authService.adminLogin({ email, password });
    localStorage.setItem('luxe_admin_token', data.token);
    localStorage.setItem('luxe_admin',       JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const adminLogout = () => {
    localStorage.removeItem('luxe_admin_token');
    localStorage.removeItem('luxe_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, login, register, logout, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
