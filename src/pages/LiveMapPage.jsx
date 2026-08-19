import MapView from '../components/MapView.jsx';
import SignalLight from '../components/SignalLight.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';

export default function LiveMapPage() {
  const { state } = useSimulation();
  const { prefs } = usePreferences();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Live map</h1>
      <p className="text-sm text-slate-400">
        Green / yellow / orange / red polylines are simulated traffic density. Dashed emerald line is the active green
        corridor.
      </p>
      <MapView state={state} followAmbulance={prefs.followMap} className="h-[560px] w-full overflow-hidden rounded-2xl" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {(state?.signals || []).slice(0, 8).map((s) => (
          <div key={s.id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{s.name}</p>
              <SignalLight state={s.state} compact />
            </div>
            <p className="mt-1 text-xs text-slate-400">{s.road}</p>
            {s.emergencyPriority && <p className="mt-2 text-xs font-semibold text-amber-300">🚨 EMERGENCY PRIORITY</p>}
            <p className="mt-2 text-sm">
              {s.state} · {s.remainingSec}s remaining
            </p>
            <p className="text-xs text-slate-400">
              Density {s.trafficDensity} · queue {s.queueLength}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
