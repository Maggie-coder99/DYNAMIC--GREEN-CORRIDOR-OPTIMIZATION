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
          try {
            const prefs = JSON.parse(localStorage.getItem('pulse-prefs') || '{}');
            if (prefs.soundAlerts && typeof AudioContext !== 'undefined') {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.frequency.value = 880;
              gain.gain.value = 0.04;
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.12);
            }
          } catch {
            /* ignore audio policy */
          }
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

  const request = useCallback(
    async (path, { method = 'GET', body } = {}) => {
      setBusy(true);
      try {
        const data = await api(path, { method, body, token });
        await refresh();
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
    () => ({ state, error, busy, toasts, refresh, act, request, dismissToast, setError }),
    [state, error, busy, toasts, refresh, act, request, dismissToast],
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
