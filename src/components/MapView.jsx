import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { trafficColor, signalColor } from '../utils/format.js';

const ambulanceIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:22px;filter:drop-shadow(0 2px 4px #000)">🚑</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hospitalIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:22px;filter:drop-shadow(0 2px 4px #000)">🏥</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.panTo([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapView({ state, followAmbulance = false, className = 'h-[420px] w-full overflow-hidden rounded-2xl' }) {
  const center = state?.city?.center || { lat: 18.5204, lng: 73.8567 };
  const trip = state?.activeTrip;
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const trafficLines = useMemo(() => {
    if (!state?.traffic || !state?.signals) return [];
    const nodePos = {};
    for (const s of state.signals) nodePos[s.nodeId] = [s.lat, s.lng];
    for (const h of state.hospitals || []) nodePos[h.nodeId] = [h.lat, h.lng];
    for (const a of state.ambulances || []) nodePos[a.nodeId] = nodePos[a.nodeId] || [a.lat, a.lng];
    return state.traffic
      .map((edge) => {
        const a = nodePos[edge.from];
        const b = nodePos[edge.to];
        if (!a || !b) return null;
        return { id: edge.edgeId, positions: [a, b], color: trafficColor(edge.trafficBand), density: edge.trafficDensity, road: edge.road };
      })
      .filter(Boolean);
  }, [state]);

  const routeLine = trip?.polyline?.map((p) => [p.lat, p.lng]) || [];
  const follow = followAmbulance && trip ? state.ambulances.find((a) => a.id === trip.ambulanceId) : null;

  const tileUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${token}`
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  const attribution = token
    ? '&copy; Mapbox &copy; OpenStreetMap'
    : '&copy; OpenStreetMap &copy; CARTO';

  if (!state) {
    return (
      <div className={`${className} flex items-center justify-center border border-white/10 bg-ink-800 text-slate-400`}>
        Loading map…
      </div>
    );
  }

  return (
    <div className={`${className} border border-white/10`}>
        <MapContainer center={[center.lat, center.lng]} zoom={state.city?.zoom || 14} className="h-full w-full" style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer url={tileUrl} attribution={attribution} />
        {follow && <Recenter lat={follow.lat} lng={follow.lng} />}
        {trafficLines.map((line) => (
          <Polyline key={line.id} positions={line.positions} pathOptions={{ color: line.color, weight: 4, opacity: 0.55 }}>
            <Popup>
              {line.road}
              <br />
              Density {line.density} (simulated)
            </Popup>
          </Polyline>
        ))}
        {routeLine.length > 1 && (
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: state.simulation?.greenCorridorActive ? '#34d399' : '#22d3ee',
              weight: 6,
              opacity: 0.95,
              dashArray: state.simulation?.greenCorridorActive ? '12 8' : null,
            }}
          />
        )}
        {(state.hospitals || []).map((h) => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
            <Popup>
              <strong>{h.name}</strong>
              <br />
              Beds {h.availableBeds}/{h.emergencyCapacity} · {h.edStatus}
            </Popup>
          </Marker>
        ))}
        {(state.signals || []).map((s) => (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lng]}
            radius={s.emergencyPriority ? 11 : 7}
            pathOptions={{
              color: s.emergencyPriority ? '#fbbf24' : signalColor(s.state),
              fillColor: signalColor(s.state),
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{s.name}</strong>
              <br />
              {s.road}
              <br />
              {s.state} · {s.remainingSec}s · density {s.trafficDensity}
              {s.emergencyPriority ? ' · 🚨 PRIORITY' : ''}
            </Popup>
          </CircleMarker>
        ))}
        {(state.ambulances || []).map((a) => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={ambulanceIcon}>
            <Popup>
              <strong>{a.id}</strong> · {a.driver}
              <br />
              {a.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
