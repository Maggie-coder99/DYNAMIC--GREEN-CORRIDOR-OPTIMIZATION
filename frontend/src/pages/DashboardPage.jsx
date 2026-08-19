import KpiCard from '../components/KpiCard.jsx';
import MapView from '../components/MapView.jsx';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';
import { formatDuration } from '../utils/format.js';

export default function DashboardPage() {
  const { state, act, busy } = useSimulation();
  const k = state?.kpis;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Emergency operations</h1>
          <p className="text-sm text-slate-400">Vidyapur Metro · Simulation / Demo Data</p>
        </div>
        <button className="btn-primary" disabled={busy} onClick={() => act('/api/demo/start')}>
          Start Demo Emergency
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Active emergencies" value={k?.activeEmergencies ?? '—'} accent="text-red-300" />
        <KpiCard label="Ambulances available" value={k?.ambulancesAvailable ?? '—'} />
        <KpiCard label="Average ETA" value={formatDuration(k?.averageEtaSec)} accent="text-cyan-300" />
        <KpiCard label="Time saved" value={formatDuration(k?.timeSavedSec)} accent="text-emerald-300" />
        <KpiCard label="Active green corridors" value={k?.activeGreenCorridors ?? 0} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapView state={state} followAmbulance className="h-[480px] w-full overflow-hidden rounded-2xl" />
        </div>
        <EmergencyPanel trip={state?.activeTrip} state={state} />
      </div>
    </div>
  );
}
