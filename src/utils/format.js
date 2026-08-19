export function formatDuration(seconds = 0) {
  const sec = Math.max(0, Math.round(seconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function trafficColor(band) {
  if (band === 'low') return '#22c55e';
  if (band === 'moderate') return '#eab308';
  if (band === 'high') return '#f97316';
  return '#ef4444';
}

export function signalColor(state) {
  if (state === 'EMERGENCY_GREEN' || state === 'GREEN') return '#22c55e';
  if (state === 'YELLOW') return '#eab308';
  return '#ef4444';
}

export function priorityTone(level) {
  if (level === 'CRITICAL') return 'bg-red-500/20 text-red-300 ring-red-500/40';
  if (level === 'HIGH') return 'bg-orange-500/20 text-orange-300 ring-orange-500/40';
  if (level === 'MEDIUM') return 'bg-amber-500/20 text-amber-200 ring-amber-500/40';
  return 'bg-slate-500/20 text-slate-300 ring-slate-500/40';
}

export function classifyTraffic(density) {
  const d = Number(density);
  if (d <= 30) return 'low';
  if (d <= 60) return 'moderate';
  if (d <= 80) return 'high';
  return 'severe';
}
