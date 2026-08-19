import { Router } from 'express';
import { store } from '../models/store.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import { ambulanceSchema, ambulancePatchSchema, hospitalSchema, hospitalPatchSchema, signalOverrideSchema, validate } from '../middleware/validate.js';
import { delayFromSignal } from '../algorithms/traffic.js';
import { recommendHospitals } from '../algorithms/hospitalRecommend.js';

export const fleetRouter = Router();

fleetRouter.get('/ambulances', authRequired, (_req, res) => {
  res.json({ ambulances: store.getAmbulances() });
});

fleetRouter.post(
  '/ambulances',
  authRequired,
  requireRole('administrator', 'emergency_operator'),
  validate(ambulanceSchema),
  (req, res) => {
    const created = store.createAmbulance(req.body);
    store.addLog('info', `Ambulance ${created.id} registered.`);
    res.status(201).json({ ambulance: created });
  },
);

fleetRouter.patch(
  '/ambulances/:id',
  authRequired,
  requireRole('administrator', 'emergency_operator', 'traffic_control'),
  validate(ambulancePatchSchema),
  (req, res) => {
    const updated = store.updateAmbulance(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Ambulance not found', code: 'INVALID_AMBULANCE' });
    store.addLog('info', `Ambulance ${updated.id} updated.`);
    return res.json({ ambulance: updated });
  },
);

fleetRouter.get('/hospitals', authRequired, (_req, res) => {
  res.json({ hospitals: store.getHospitals() });
});

fleetRouter.get('/hospitals/recommend', authRequired, (req, res) => {
  const ambulance = store.getAmbulance(req.query.ambulanceId || 'AMB-001');
  if (!ambulance) return res.status(400).json({ error: 'Invalid ambulance', code: 'INVALID_AMBULANCE' });
  const ranked = recommendHospitals(ambulance, store.getHospitals());
  res.json({ recommended: ranked[0], ranked });
});

fleetRouter.post(
  '/hospitals',
  authRequired,
  requireRole('administrator'),
  validate(hospitalSchema),
  (req, res) => {
    const created = store.createHospital(req.body);
    store.addLog('info', `Hospital ${created.id} added.`);
    res.status(201).json({ hospital: created });
  },
);

fleetRouter.patch(
  '/hospitals/:id',
  authRequired,
  requireRole('administrator', 'emergency_operator'),
  validate(hospitalPatchSchema),
  (req, res) => {
    const updated = store.updateHospital(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Hospital not found', code: 'INVALID_HOSPITAL' });
    return res.json({ hospital: updated });
  },
);

fleetRouter.get('/signals', authRequired, (_req, res) => {
  res.json({ signals: store.getSignals() });
});

fleetRouter.post(
  '/signals/:id/override',
  authRequired,
  requireRole('traffic_control', 'administrator'),
  validate(signalOverrideSchema),
  (req, res) => {
    const signal = store.getSignal(req.params.id);
    if (!signal) return res.status(404).json({ error: 'Signal not found', code: 'INVALID_SIGNAL' });
    signal.state = req.body.state;
    signal.emergencyPriority = req.body.state === 'EMERGENCY_GREEN';
    signal.remainingSec = req.body.state === 'YELLOW' ? 4 : 18;
    signal.estimatedDelaySec = delayFromSignal(signal.state, signal.cycleSec, signal.trafficDensity);
    store.addNotification('info', `${signal.name} manually set to ${signal.state}.`);
    return res.json({ signal });
  },
);

fleetRouter.get('/traffic', authRequired, (_req, res) => {
  res.json({ traffic: store.getTraffic() });
});

fleetRouter.get('/trips', authRequired, (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  const level = (req.query.level || '').toString();
  let trips = store.getTrips();
  if (q) {
    trips = trips.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.ambulanceId.toLowerCase().includes(q) ||
        t.hospitalId.toLowerCase().includes(q),
    );
  }
  if (level) trips = trips.filter((t) => t.level === level);
  const sort = (req.query.sort || 'startedAt').toString();
  const dir = req.query.dir === 'asc' ? 1 : -1;
  trips = [...trips].sort((a, b) => {
    const av = a[sort] ?? '';
    const bv = b[sort] ?? '';
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(50, Math.max(5, Number(req.query.pageSize || 10)));
  const start = (page - 1) * pageSize;
  res.json({
    total: trips.length,
    page,
    pageSize,
    trips: trips.slice(start, start + pageSize),
  });
});

fleetRouter.get('/search', authRequired, (req, res) => {
  const q = (req.query.q || '').toString().trim().toLowerCase();
  if (q.length < 2) return res.json({ results: [] });
  const results = [];
  for (const a of store.getAmbulances()) {
    if (`${a.id} ${a.driver} ${a.registration} ${a.station}`.toLowerCase().includes(q)) {
      results.push({ type: 'ambulance', id: a.id, title: a.id, subtitle: `${a.driver} · ${a.status}`, href: '/app/ambulances' });
    }
  }
  for (const h of store.getHospitals()) {
    if (`${h.id} ${h.name} ${h.address}`.toLowerCase().includes(q)) {
      results.push({ type: 'hospital', id: h.id, title: h.name, subtitle: h.edStatus, href: '/app/hospitals' });
    }
  }
  for (const s of store.getSignals()) {
    if (`${s.id} ${s.name} ${s.road}`.toLowerCase().includes(q)) {
      results.push({ type: 'signal', id: s.id, title: s.name, subtitle: s.road, href: '/app/signals' });
    }
  }
  for (const t of store.getTrips().slice(0, 40)) {
    if (`${t.id} ${t.ambulanceId} ${t.hospitalId}`.toLowerCase().includes(q)) {
      results.push({ type: 'trip', id: t.id, title: t.id, subtitle: `${t.ambulanceId} · ${t.status}`, href: '/app/history' });
    }
  }
  res.json({ results: results.slice(0, 12) });
});

fleetRouter.post('/notifications/read', authRequired, (_req, res) => {
  res.json({ notifications: store.markNotificationsRead() });
});

fleetRouter.get('/messages', authRequired, requireRole('administrator'), (_req, res) => {
  res.json({ messages: store.getMessages() });
});
