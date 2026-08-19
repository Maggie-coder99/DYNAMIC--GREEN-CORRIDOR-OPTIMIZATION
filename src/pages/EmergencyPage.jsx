import { useEffect, useMemo, useState } from 'react';
import MapView from '../components/MapView.jsx';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDuration } from '../utils/format.js';

export default function EmergencyPage() {
  const { state, act, busy } = useSimulation();
  const { prefs } = usePreferences();
  const { token } = useAuth();
  const [ambulanceId, setAmbulanceId] = useState('AMB-001');
  const [hospitalId, setHospitalId] = useState('HOS-001');
  const [level, setLevel] = useState('CRITICAL');
  const [ranked, setRanked] = useState([]);
  const ambulances = useMemo(
    () => (state?.ambulances || []).filter((a) => a.status === 'Available' || a.id === ambulanceId),
    [state, ambulanceId],
  );
  const alt = state?.simulation?.alternative;

  useEffect(() => {
    if (!token || !ambulanceId) return undefined;
    api(`/api/hospitals/recommend?ambulanceId=${encodeURIComponent(ambulanceId)}`, { token })
      .then((d) => setRanked(d.ranked || []))
      .catch(() => setRanked([]));
    return undefined;
  }, [ambulanceId, token, state?.hospitals]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Emergency control</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <form
          className="card space-y-3 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            act('/api/emergencies', { ambulanceId, hospitalId, level });
          }}
        >
          <h2 className="font-semibold">Dispatch</h2>
          <label className="block text-sm">
            Ambulance
            <select className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" value={ambulanceId} onChange={(e) => setAmbulanceId(e.target.value)}>
              {ambulances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} · {a.driver} · {a.status}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Hospital
            <select className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
              {(state?.hospitals || []).map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} · {h.edStatus} · {h.availableBeds} beds
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Priority
            <select className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" value={level} onChange={(e) => setLevel(e.target.value)}>
              {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <button className="btn-primary w-full" disabled={busy} type="submit">
            Start Emergency
          </button>
          <button className="btn-ghost w-full" disabled={busy} type="button" onClick={() => act('/api/demo/start')}>
            Start Demo Emergency
          </button>
          <button className="btn-ghost w-full" type="button" onClick={() => ranked[0] && setHospitalId(ranked[0].id)}>
            Use recommended hospital
          </button>
          {ranked[0] && (
            <p className="text-xs text-cyan-200">
              Suggested: {ranked[0].name} · {ranked[0].distanceKm} km · {ranked[0].reason}
            </p>
          )}
        </form>
        <div className="card space-y-2 p-5">
          <h2 className="font-semibold">Simulation controls</h2>
          <button className="btn-green w-full" disabled={busy} onClick={() => act('/api/green-corridor/activate')}>
            Activate Green Corridor
          </button>
          <button className="btn-ghost w-full" disabled={busy} onClick={() => act('/api/simulation/pause')}>
            Pause Simulation
          </button>
          <button className="btn-ghost w-full" disabled={busy} onClick={() => act('/api/simulation/resume')}>
            Resume
          </button>
          <button className="btn-ghost w-full" disabled={busy} onClick={() => act('/api/simulation/recalculate')}>
            Recalculate Route
          </button>
          <button className="btn-ghost w-full" disabled={busy} onClick={() => act('/api/simulation/reset')}>
            Reset
          </button>
          <button className="btn-primary w-full" disabled={busy} onClick={() => act('/api/simulation/end')}>
            End Emergency
          </button>
        </div>
        <EmergencyPanel trip={state?.activeTrip} state={state} />
      </div>
      {alt && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-amber-400/30 p-4">
          <div>
            <p className="font-semibold text-amber-200">Alternative route detected</p>
            <p className="text-sm text-slate-300">
              Previous ETA {formatDuration(alt.previousEtaSec)} → new {formatDuration(alt.newEtaSec)} · save{' '}
              {formatDuration(alt.estimatedSaveSec)}
            </p>
          </div>
          <button className="btn-green" disabled={busy} onClick={() => act('/api/simulation/switch-route')}>
            Switch Route
          </button>
        </div>
      )}
      <MapView state={state} followAmbulance={prefs.followMap} className="h-[460px] w-full overflow-hidden rounded-2xl" />
    </div>
  );
}
