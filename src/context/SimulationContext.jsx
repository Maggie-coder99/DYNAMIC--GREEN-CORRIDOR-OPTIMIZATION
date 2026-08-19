import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const SimContext = createContext(null);

export function SimulationProvider({ children }) {
  const { token } = useAuth();
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toasts, setToasts] = useState([]);
  const seen = useRef(new Set());

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api('/api/state', { token });
      setState(data);
      setError('');
      for (const n of data.notifications || []) {
        if (!seen.current.has(n.id)) {
          seen.current.add(n.id);
          setToasts((t) => [...t.slice(-4), n]);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const act = useCallback(
    async (path, body) => {
      setBusy(true);
      try {
        const data = await api(path, { method: 'POST', body, token });
        if (data.state) setState(data.state);
        else if (data.kpis) setState(data);
        else await refresh();
        setError('');
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [token, refresh],
  );

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(
    () => ({ state, error, busy, toasts, refresh, act, dismissToast, setError }),
    [state, error, busy, toasts, refresh, act, dismissToast],
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
