import StatusBadge from '../components/StatusBadge.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';

const TONE = {
  Available: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/40',
  'On Emergency': 'bg-red-500/20 text-red-300 ring-red-500/40',
  Returning: 'bg-cyan-500/20 text-cyan-200 ring-cyan-500/40',
  Maintenance: 'bg-slate-500/20 text-slate-300 ring-slate-500/40',
};

export default function AmbulancesPage() {
  const { state } = useSimulation();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Ambulance fleet</h1>
      <div className="overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              {['ID', 'Registration', 'Driver', 'Station', 'Status', 'Equipment', 'Location'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(state?.ambulances || []).map((a) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
