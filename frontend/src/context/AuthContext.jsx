import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nourishly_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nourishly_token');
    if (token) {
      authAPI.me()
        .then(res => { setUser(res.data); localStorage.setItem('nourishly_user', JSON.stringify(res.data)); })
        .catch(() => { localStorage.removeItem('nourishly_token'); localStorage.removeItem('nourishly_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('nourishly_token', res.data.token);
    localStorage.setItem('nourishly_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (email, username, password) => {
    const res = await authAPI.register({ email, username, password });
    localStorage.setItem('nourishly_token', res.data.token);
    localStorage.setItem('nourishly_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const res = await authAPI.googleAuth({ credential });
    localStorage.setItem('nourishly_token', res.data.token);
    localStorage.setItem('nourishly_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nourishly_token');
    localStorage.removeItem('nourishly_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('nourishly_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
