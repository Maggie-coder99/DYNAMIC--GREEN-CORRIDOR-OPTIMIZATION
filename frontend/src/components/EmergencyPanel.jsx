import { formatDuration } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';
import SignalLight from './SignalLight.jsx';

export default function EmergencyPanel({ trip, state }) {
  if (!trip) {
    return (
      <div className="card p-5">
        <h3 className="font-semibold">Emergency panel</h3>
        <p className="mt-2 text-sm text-slate-400">No active emergency. Start a demo trip or dispatch from Emergency Control.</p>
      </div>
    );
  }

  const ambulance = state?.ambulances?.find((a) => a.id === trip.ambulanceId);
  const nextSignal = state?.signals?.find((s) => s.nodeId === trip.nextIntersection);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">Emergency panel</h3>
        <StatusBadge>{trip.level}</StatusBadge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-400">Ambulance</dt>
          <dd className="font-medium">{trip.ambulanceId}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Destination</dt>
          <dd className="font-medium">{trip.destinationName}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Location</dt>
          <dd className="font-medium">
            {ambulance ? `${ambulance.lat.toFixed(4)}, ${ambulance.lng.toFixed(4)}` : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Current road</dt>
          <dd className="font-medium">{trip.currentRoad}</dd>
        </div>
        <div>
          <dt className="text-slate-400">ETA</dt>
          <dd className="font-medium text-cyan-300">{formatDuration(trip.currentEtaSec)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Distance left</dt>
          <dd className="font-medium">{(trip.remainingM / 1000).toFixed(2)} km</dd>
        </div>
        <div>
          <dt className="text-slate-400">Speed</dt>
          <dd className="font-medium">{trip.currentSpeedKmh} km/h</dd>
        </div>
        <div>
          <dt className="text-slate-400">Time saved</dt>
          <dd className="font-medium text-emerald-300">{formatDuration(trip.timeSavedSec)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Route</dt>
          <dd className="font-medium">{trip.status}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Green corridor</dt>
          <dd className="font-medium">{trip.greenCorridorActive ? 'ACTIVE' : 'OFF'}</dd>
        </div>
      </dl>
      {nextSignal && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Next intersection</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-medium">{nextSignal.name}</p>
              <p className="text-xs text-slate-400">{nextSignal.road}</p>
            </div>
            <SignalLight state={nextSignal.state} />
          </div>
        </div>
      )}
    </div>
  );
}
