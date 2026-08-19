import { createContext, useContext, useMemo, useState } from 'react';

const KEY = 'pulse-prefs';
const PreferencesContext = createContext(null);

function load() {
  try {
    return {
      followMap: true,
      soundAlerts: false,
      ...JSON.parse(localStorage.getItem(KEY) || '{}'),
    };
  } catch {
    return { followMap: true, soundAlerts: false };
  }
}

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(load);
  const value = useMemo(
    () => ({
      prefs,
      setPref(key, val) {
        const next = { ...prefs, [key]: val };
        setPrefs(next);
        localStorage.setItem(KEY, JSON.stringify(next));
      },
    }),
    [prefs],
  );
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
