import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import KpiCard from '../components/KpiCard.jsx';
import { formatDuration } from '../utils/format.js';

const BAND_COLORS = { low: '#22c55e', moderate: '#eab308', high: '#f97316', severe: '#ef4444' };

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/analytics', { token })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [token]);

  if (error) return <p className="text-red-300">{error}</p>;
  if (!data) return <p className="text-slate-400">Loading analytics…</p>;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Average response time" value={formatDuration(data.averageResponseSec)} />
        <KpiCard label="Average time saved" value={formatDuration(data.averageTimeSavedSec)} accent="text-emerald-300" />
        <KpiCard label="Green corridors activated" value={data.greenCorridorsActivated} />
        <KpiCard label="Successful trips" value={`${Math.round((data.successRate || 0) * 100)}%`} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Emergencies per day</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.emergenciesPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#e11d2e" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Traffic distribution</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.trafficDistribution} dataKey="count" nameKey="band" innerRadius={50} outerRadius={80}>
                  {data.trafficDistribution.map((d) => (
                    <Cell key={d.band} fill={BAND_COLORS[d.band]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Route efficiency (original vs optimized ETA)</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={data.routeEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="id" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="original" stroke="#f97316" />
                <Line type="monotone" dataKey="optimized" stroke="#22d3ee" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Signal clearance delay</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.signalClearance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="id" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="delay" fill="#22c55e" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
