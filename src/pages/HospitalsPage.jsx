import { useAuth } from '../context/AuthContext.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function HospitalsPage() {
  const { user } = useAuth();
  const { state, request, busy } = useSimulation();
  const canEdit = user?.role === 'administrator' || user?.role === 'emergency_operator';

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
            {canEdit && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="btn-ghost text-xs"
                  disabled={busy}
                  type="button"
                  onClick={() =>
                    request(`/api/hospitals/${h.id}`, {
                      method: 'PATCH',
                      body: { availableBeds: Math.max(0, h.availableBeds - 1) },
                    })
                  }
                >
                  Use 1 bed
                </button>
                <button
                  className="btn-ghost text-xs"
                  disabled={busy}
                  type="button"
                  onClick={() =>
                    request(`/api/hospitals/${h.id}`, {
                      method: 'PATCH',
                      body: { availableBeds: Math.min(h.emergencyCapacity, h.availableBeds + 1) },
                    })
                  }
                >
                  Free 1 bed
                </button>
                <select
                  className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs"
                  value={h.edStatus}
                  onChange={(e) =>
                    request(`/api/hospitals/${h.id}`, { method: 'PATCH', body: { edStatus: e.target.value } })
                  }
                >
                  {['Accepting', 'Busy', 'Limited'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
