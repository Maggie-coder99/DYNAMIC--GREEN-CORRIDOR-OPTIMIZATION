import { useSimulation } from '../context/SimulationContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function HospitalsPage() {
  const { state } = useSimulation();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Hospitals</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {(state?.hospitals || []).map((h) => (
          <article key={h.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{h.id}</p>
                <h2 className="text-lg font-semibold">{h.name}</h2>
                <p className="text-sm text-slate-400">{h.address}</p>
              </div>
              <StatusBadge
                tone={
                  h.edStatus === 'Accepting'
                    ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-200 ring-amber-500/40'
                }
              >
                {h.edStatus}
              </StatusBadge>
            </div>
            <p className="mt-4 text-sm">
              Emergency beds {h.availableBeds} / {h.emergencyCapacity}
            </p>
            <p className="mt-1 text-xs text-slate-400">{(h.specialties || []).join(' · ')}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
