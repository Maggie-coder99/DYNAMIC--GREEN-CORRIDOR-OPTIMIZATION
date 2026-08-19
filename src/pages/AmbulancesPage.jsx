import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';

const TONE = {
  Available: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/40',
  'On Emergency': 'bg-red-500/20 text-red-300 ring-red-500/40',
  Returning: 'bg-cyan-500/20 text-cyan-200 ring-cyan-500/40',
  Maintenance: 'bg-slate-500/20 text-slate-300 ring-slate-500/40',
};

export default function AmbulancesPage() {
  const { user } = useAuth();
  const { state, request, busy } = useSimulation();
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({
    registration: 'MH-12-EM-9001',
    driver: 'New Driver',
    station: 'West Depot',
    lat: 18.5164,
    lng: 73.8421,
  });
  const canManage = user?.role === 'administrator' || user?.role === 'emergency_operator';
  const rows = useMemo(() => {
    const list = state?.ambulances || [];
    if (filter === 'All') return list;
    return list.filter((a) => a.status === filter);
  }, [state, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold">Ambulance fleet</h1>
        <select className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {['All', 'Available', 'On Emergency', 'Returning', 'Maintenance'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {canManage && (
        <form
          className="card grid gap-3 p-4 md:grid-cols-5"
          onSubmit={(e) => {
            e.preventDefault();
            request('/api/ambulances', {
              method: 'POST',
              body: { ...form, lat: Number(form.lat), lng: Number(form.lng), status: 'Available', equipment: ['BLS'] },
            });
          }}
        >
          <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="Registration" value={form.registration} onChange={(e) => setForm({ ...form, registration: e.target.value })} />
          <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="Driver" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} />
          <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="Station" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })} />
          <button className="btn-primary md:col-span-2" disabled={busy} type="submit">
            Register ambulance
          </button>
        </form>
      )}
      <div className="overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              {['ID', 'Registration', 'Driver', 'Station', 'Status', 'Equipment', 'Location', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-medium">{a.id}</td>
                <td className="px-4 py-3">{a.registration}</td>
                <td className="px-4 py-3">{a.driver}</td>
                <td className="px-4 py-3">{a.station}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={TONE[a.status]}>{a.status}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-slate-300">{(a.equipment || []).join(', ')}</td>
                <td className="px-4 py-3 text-slate-400">
                  {a.lat.toFixed(4)}, {a.lng.toFixed(4)}
                </td>
                <td className="px-4 py-3">
                  {canManage && (
                    <select
                      className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs"
                      value={a.status}
                      onChange={(e) => request(`/api/ambulances/${a.id}`, { method: 'PATCH', body: { status: e.target.value } })}
                    >
                      {['Available', 'On Emergency', 'Returning', 'Maintenance'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
