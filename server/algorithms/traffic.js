export const TRAFFIC_BANDS = {
  low: { min: 0, max: 30, label: 'Low', color: '#22c55e' },
  moderate: { min: 31, max: 60, label: 'Moderate', color: '#eab308' },
  high: { min: 61, max: 80, label: 'High', color: '#f97316' },
  severe: { min: 81, max: 100, label: 'Severe', color: '#ef4444' },
};

export function classifyTraffic(density) {
  const d = Number(density);
  if (Number.isNaN(d) || d < 0 || d > 100) {
    throw new Error('Traffic density must be a number between 0 and 100');
  }
  if (d <= 30) return 'low';
  if (d <= 60) return 'moderate';
  if (d <= 80) return 'high';
  return 'severe';
}

export function trafficSpeedFactor(density) {
  return 1 - (density / 100) * 0.58;
}

export function queueFromDensity(density) {
  return Math.round((density / 100) * 18);
}

export function delayFromSignal(state, cycleSec, density) {
  if (state === 'EMERGENCY_GREEN' || state === 'GREEN') return Math.round(density * 0.12);
  if (state === 'YELLOW') return Math.round(8 + density * 0.2);
  return Math.round(cycleSec * 0.35 + density * 0.35);
}

/** Small random-walk so dashboards feel live without chaotic jumps. */
export function stepTrafficDensity(current, rng = Math.random) {
  const delta = (rng() - 0.48) * 6;
  return Math.round(Math.min(100, Math.max(8, current + delta)));
}
