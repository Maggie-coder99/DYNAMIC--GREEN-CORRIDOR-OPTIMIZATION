const EARTH_RADIUS_M = 6371000;

export function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineMeters(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function polylineLengthMeters(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineMeters(points[i - 1], points[i]);
  }
  return total;
}

/** Walk `distanceM` along a lat/lng polyline and return the position. */
export function interpolateAlong(points, distanceM) {
  if (!points.length) return null;
  if (distanceM <= 0) return { ...points[0], traveledM: 0, remainingM: polylineLengthMeters(points) };
  let remaining = distanceM;
  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const seg = haversineMeters(start, end);
    if (remaining <= seg || i === points.length - 1) {
      const t = seg === 0 ? 1 : Math.min(1, remaining / seg);
      const total = polylineLengthMeters(points);
      const traveled = Math.min(total, distanceM);
      return {
        lat: start.lat + (end.lat - start.lat) * t,
        lng: start.lng + (end.lng - start.lng) * t,
        traveledM: traveled,
        remainingM: Math.max(0, total - traveled),
        segmentIndex: i - 1,
      };
    }
    remaining -= seg;
  }
  const last = points[points.length - 1];
  return { ...last, traveledM: polylineLengthMeters(points), remainingM: 0, segmentIndex: points.length - 2 };
}

export function formatDuration(seconds) {
  const sec = Math.max(0, Math.round(seconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}
