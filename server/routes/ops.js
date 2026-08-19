import { Router } from 'express';
import { store } from '../models/store.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import { emergencySchema, optimizeSchema, validate } from '../middleware/validate.js';
import {
  activateGreenCorridor,
  completeTrip,
  computeRoutes,
  deactivateGreenCorridor,
  getAnalytics,
  getPublicState,
  startEmergency,
  switchRoute,
  tickSimulation,
} from '../services/simulationService.js';

export const opsRouter = Router();

opsRouter.get('/state', authRequired, (_req, res) => {
  res.json(getPublicState(store));
});

opsRouter.post('/emergencies', authRequired, validate(emergencySchema), (req, res) => {
  try {
    const trip = startEmergency(store, req.body);
    res.status(201).json({ trip, state: getPublicState(store) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code || 'EMERGENCY_ERROR' });
  }
});

opsRouter.get('/emergencies', authRequired, (_req, res) => {
  const sim = store.simulation();
  res.json({
    active: sim.activeTrip,
    recent: store.getTrips().slice(0, 15),
  });
});

opsRouter.post(
  '/demo/start',
  authRequired,
  requireRole('emergency_operator', 'administrator', 'traffic_control'),
  (_req, res) => {
    try {
      if (store.simulation().activeTrip) completeTrip(store, 'Reset');
      const amb = store.getAmbulance('AMB-001');
      if (amb) {
        amb.status = 'Available';
        amb.lat = 18.5164;
        amb.lng = 73.8421;
        amb.nodeId = 'DEPOT_WEST';
      }
      const trip = startEmergency(store, {
        ambulanceId: 'AMB-001',
        hospitalId: 'HOS-001',
        level: 'CRITICAL',
        demo: true,
      });
      activateGreenCorridor(store);
      res.status(201).json({ trip, state: getPublicState(store) });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message, code: err.code || 'DEMO_ERROR' });
    }
  },
);

opsRouter.post('/green-corridor/activate', authRequired, (_req, res) => {
  try {
    const plan = activateGreenCorridor(store);
    res.json({ plan, state: getPublicState(store) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code || 'CORRIDOR_ERROR' });
  }
});

opsRouter.post('/green-corridor/deactivate', authRequired, (_req, res) => {
  res.json(deactivateGreenCorridor(store));
});

opsRouter.post('/routes/optimize', authRequired, validate(optimizeSchema), (req, res) => {
  const result = computeRoutes(store, req.body.startNode, req.body.goalNode, req.body.level);
  if (!result.best) {
    return res.status(422).json({ error: 'No route found', code: 'NO_ROUTE' });
  }
  return res.json(result);
});

opsRouter.post('/simulation/pause', authRequired, (_req, res) => {
  store.mutateSimulation({ paused: true });
  res.json(getPublicState(store));
});

opsRouter.post('/simulation/resume', authRequired, (_req, res) => {
  store.mutateSimulation({ paused: false, running: true });
  res.json(getPublicState(store));
});

opsRouter.post('/simulation/tick', authRequired, (_req, res) => {
  res.json(tickSimulation(store));
});

opsRouter.post('/simulation/recalculate', authRequired, (_req, res) => {
  const sim = store.simulation();
  if (!sim.activeTrip) {
    return res.status(409).json({ error: 'No active emergency', code: 'NO_ACTIVE_TRIP' });
  }
  const result = computeRoutes(
    store,
    sim.activeTrip.startNode,
    sim.activeTrip.goalNode,
    sim.activeTrip.level,
  );
  if (result.best) {
    sim.alternative = {
      ...result.best,
      previousEtaSec: sim.activeTrip.currentEtaSec,
      newEtaSec: result.best.travelTimeSec,
      estimatedSaveSec: Math.max(0, sim.activeTrip.currentEtaSec - result.best.travelTimeSec),
    };
    store.addNotification('info', 'Route recalculated against current traffic.');
  }
  res.json(getPublicState(store));
});

opsRouter.post('/simulation/switch-route', authRequired, (_req, res) => {
  try {
    switchRoute(store);
    res.json(getPublicState(store));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.code || 'SWITCH_ERROR' });
  }
});

opsRouter.post('/simulation/end', authRequired, (_req, res) => {
  completeTrip(store, 'Ended');
  res.json(getPublicState(store));
});

opsRouter.post('/simulation/reset', authRequired, (_req, res) => {
  completeTrip(store, 'Reset');
  const amb = store.getAmbulance('AMB-001');
  if (amb) {
    amb.status = 'Available';
    amb.lat = 18.5164;
    amb.lng = 73.8421;
    amb.nodeId = 'DEPOT_WEST';
  }
  store.mutateSimulation({ lastCompletedTrip: null, tick: 0 });
  res.json(getPublicState(store));
});

opsRouter.get('/analytics', authRequired, (_req, res) => {
  res.json(getAnalytics(store));
});

opsRouter.get('/logs', authRequired, requireRole('administrator'), (_req, res) => {
  res.json({ logs: store.getLogs() });
});

opsRouter.get('/notifications', authRequired, (_req, res) => {
  res.json({ notifications: store.getNotifications() });
});
