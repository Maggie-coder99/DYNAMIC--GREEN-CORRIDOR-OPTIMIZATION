import { useAuth } from '../context/AuthContext.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';

export default function SettingsPage() {
  const { user } = useAuth();
  const { state } = useSimulation();
  const mapbox = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card space-y-3 p-5 text-sm">
        <p>
          <span className="text-slate-400">Signed in as</span> {user?.name} ({user?.email})
        </p>
        <p>
          <span className="text-slate-400">Role</span> {user?.role}
        </p>
        <p>
          <span className="text-slate-400">Data source</span> Simulation / Demo Data
        </p>
        <p>
          <span className="text-slate-400">Map tiles</span> {mapbox ? 'Mapbox (env token)' : 'CARTO Dark + OpenStreetMap (no key)'}
        </p>
        <p>
          <span className="text-slate-400">API</span> {import.meta.env.VITE_API_URL || '/api via Vite proxy'}
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
