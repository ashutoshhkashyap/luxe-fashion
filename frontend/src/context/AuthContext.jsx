import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — verify session via API (cookie is sent automatically by browser)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await authService.getMe();
        if (data.user) setUser(data.user);
      } catch {
        setUser(null); // token invalid or expired
      }

      try {
        const { data } = await authService.getAdminMe();
        if (data.admin) setAdmin(data.admin);
      } catch {
        setAdmin(null);
      }

      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    // Cookie is set automatically by browser from server response
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await authService.register({ name, email, password, phone });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout(); // clears httpOnly cookie on server
    } catch {}
    setUser(null);
  };

  const adminLogin = async (email, password) => {
    const { data } = await authService.adminLogin({ email, password });
    setAdmin(data.admin);
    return data;
  };

  const adminLogout = async () => {
    try {
      await authService.adminLogout(); // clears httpOnly admin cookie on server
    } catch {}
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
