import SignalLight from '../components/SignalLight.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';

export default function SignalsPage() {
  const { user } = useAuth();
  const { state, act, busy } = useSimulation();
  const canOverride = user?.role === 'traffic_control' || user?.role === 'administrator';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Traffic control</h1>
        <p className="text-sm text-slate-400">Manual overrides are simulated signal changes for training / demo.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(state?.signals || []).map((s) => (
          <article key={s.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-slate-400">{s.road}</p>
              </div>
              <SignalLight state={s.state} compact />
            </div>
            {s.emergencyPriority && (
              <p className="mt-2 text-xs font-semibold text-amber-300">🚨 EMERGENCY PRIORITY · ACTIVE</p>
            )}
            <p className="mt-3 text-sm">
              {s.state} · {s.remainingSec} sec remaining
            </p>
            <p className="text-xs text-slate-400">
              Density {s.trafficDensity} ({s.trafficBand}) · queue {s.queueLength} · delay {s.estimatedDelaySec}s
            </p>
            {canOverride && (
              <div className="mt-3 flex flex-wrap gap-1">
                {['RED', 'YELLOW', 'GREEN', 'EMERGENCY_GREEN'].map((st) => (
                  <button
                    key={st}
                    className="btn-ghost px-2 py-1 text-xs"
                    disabled={busy}
                    onClick={() => act(`/api/signals/${s.id}/override`, { state: st })}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
