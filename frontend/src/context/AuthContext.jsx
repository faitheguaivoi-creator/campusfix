import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('campusfix_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem('campusfix_user', JSON.stringify(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem('campusfix_token');
        localStorage.removeItem('campusfix_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('campusfix_token', token);
    localStorage.setItem('campusfix_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    const { user, token } = res.data.data;
    localStorage.setItem('campusfix_token', token);
    localStorage.setItem('campusfix_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // best effort
    }
    localStorage.removeItem('campusfix_token');
    localStorage.removeItem('campusfix_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}