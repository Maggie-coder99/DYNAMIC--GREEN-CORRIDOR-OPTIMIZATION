import { signalColor } from '../utils/format.js';

export default function SignalLight({ state, compact }) {
  const active = signalColor(state);
  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'} items-center`}>
      {['RED', 'YELLOW', 'GREEN'].map((s) => {
        const on =
          (s === 'GREEN' && (state === 'GREEN' || state === 'EMERGENCY_GREEN')) ||
          (s === 'YELLOW' && state === 'YELLOW') ||
          (s === 'RED' && state === 'RED');
        const color = s === 'RED' ? '#ef4444' : s === 'YELLOW' ? '#eab308' : '#22c55e';
        return (
          <span
            key={s}
            className="inline-block rounded-full"
            style={{
              width: compact ? 8 : 12,
              height: compact ? 8 : 12,
              background: on ? color : '#1e293b',
              boxShadow: on ? `0 0 10px ${active}` : 'none',
            }}
          />
        );
      })}
      {!compact && (
        <span className="text-xs font-medium text-slate-300">
          {state === 'EMERGENCY_GREEN' ? 'EMERGENCY GREEN' : state}
        </span>
      )}
    </div>
  );
}
