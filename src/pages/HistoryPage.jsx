import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDuration } from '../utils/format.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function HistoryPage() {
  const { token } = useAuth();
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('startedAt');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ trips: [], total: 0, pageSize: 8 });
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api(
          `/api/trips?q=${encodeURIComponent(q)}&level=${encodeURIComponent(level)}&sort=${sort}&dir=desc&page=${page}&pageSize=8`,
          { token },
        );
        if (!cancelled) {
          setData(res);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, level, sort, page, token]);

  const pages = Math.max(1, Math.ceil((data.total || 0) / (data.pageSize || 8)));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Trip history</h1>
      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          placeholder="Search trip, ambulance…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <select
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          value={level}
          onChange={(e) => {
            setPage(1);
            setLevel(e.target.value);
          }}
        >
          <option value="">All levels</option>
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="startedAt">Sort by date</option>
          <option value="timeSavedSec">Sort by time saved</option>
          <option value="distanceKm">Sort by distance</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              {['Trip', 'Ambulance', 'Level', 'Destination', 'Distance', 'Original ETA', 'Optimized ETA', 'Saved', 'Status', 'Date'].map(
                (h) => (
                  <th key={h} className="px-3 py-3 font-medium">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {(data.trips || []).map((t) => (
              <tr key={t.id} className="border-t border-white/5">
                <td className="px-3 py-2 font-medium">{t.id}</td>
                <td className="px-3 py-2">{t.ambulanceId}</td>
                <td className="px-3 py-2">
                  <StatusBadge>{t.level}</StatusBadge>
                </td>
                <td className="px-3 py-2">{t.hospitalId}</td>
                <td className="px-3 py-2">{t.distanceKm} km</td>
                <td className="px-3 py-2">{formatDuration(t.originalEtaSec)}</td>
                <td className="px-3 py-2">{formatDuration(t.optimizedEtaSec)}</td>
                <td className="px-3 py-2 text-emerald-300">{formatDuration(t.timeSavedSec)}</td>
                <td className="px-3 py-2">{t.status}</td>
                <td className="px-3 py-2 text-slate-400">{(t.startedAt || '').slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {page} / {pages}
        </span>
        <button className="btn-ghost" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
