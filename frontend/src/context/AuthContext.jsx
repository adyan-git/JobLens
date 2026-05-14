import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const TOKEN_KEY = 'joblensToken';

function parseUserFromToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    if (!payload?.id) return null;
    return { id: payload.id, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState(() =>
    parseUserFromToken(localStorage.getItem(TOKEN_KEY))
  );

  const login = useCallback(async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setCurrentUser(data.user ?? parseUserFromToken(data.token));
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerApi(name, email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setCurrentUser(data.user ?? parseUserFromToken(data.token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [currentUser, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
