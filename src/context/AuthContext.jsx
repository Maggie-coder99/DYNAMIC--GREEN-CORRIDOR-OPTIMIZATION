import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'pulse-corridor-auth';

function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadAuth);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      async login(payload) {
        const data = await api('/api/auth/login', { method: 'POST', body: payload });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSession(data);
        return data;
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
