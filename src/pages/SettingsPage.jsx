import { useAuth } from '../context/AuthContext.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';

export default function SettingsPage() {
  const { user } = useAuth();
  const { state } = useSimulation();
  const { prefs, setPref } = usePreferences();
  const mapbox = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card space-y-4 p-5 text-sm">
        <p>
          <span className="text-slate-400">Signed in as</span> {user?.name} ({user?.email})
        </p>
        <p>
          <span className="text-slate-400">Role</span> {user?.role?.replaceAll('_', ' ')}
        </p>
        <label className="flex items-center justify-between gap-3">
          <span>Follow ambulance on the map</span>
          <input type="checkbox" checked={prefs.followMap} onChange={(e) => setPref('followMap', e.target.checked)} />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span>Play a short alert when a new event arrives</span>
          <input type="checkbox" checked={prefs.soundAlerts} onChange={(e) => setPref('soundAlerts', e.target.checked)} />
        </label>
        <p>
          <span className="text-slate-400">Map tiles</span> {mapbox ? 'Mapbox (env token)' : 'CARTO Dark + OpenStreetMap'}
        </p>
        <p>
          <span className="text-slate-400">City overlay</span> {state?.city?.name}
        </p>
      </div>
      <div className="card p-5 text-sm leading-relaxed text-slate-300">
        <h2 className="font-semibold text-white">Limitation</h2>
        <p className="mt-2">
          This project is an academic software simulation and does not directly control real-world traffic
          infrastructure. Traffic conditions, ambulance movement, and traffic signal behavior are simulated unless
          connected to authorized real-world infrastructure.
        </p>
      </div>
    </div>
  );
}
