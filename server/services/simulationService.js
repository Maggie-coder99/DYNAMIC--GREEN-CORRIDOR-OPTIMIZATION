import { NODES } from '../data/city.js';
import { optimizeRoutes, shouldRecommendSwitch } from '../algorithms/routeOptimizer.js';
import { selectPrioritySignals } from '../algorithms/greenCorridor.js';
import { classifyTraffic, delayFromSignal, queueFromDensity, stepTrafficDensity } from '../algorithms/traffic.js';
import { interpolateAlong, polylineLengthMeters, uid } from '../utils/geo.js';

function trafficMap(store) {
  const map = {};
  for (const t of store.getTraffic()) map[t.edgeId] = t.trafficDensity;
  return map;
}

function signalsByNode(store) {
  const map = {};
  for (const s of store.getSignals()) map[s.nodeId] = s;
  return map;
}

export function buildPolyline(nodeIds) {
  return nodeIds.map((id) => {
    const n = NODES[id];
    return { lat: n.lat, lng: n.lng, nodeId: id, name: n.name };
  });
}

export function computeRoutes(store, startNode, goalNode, emergencyLevel) {
  return optimizeRoutes({
    edges: store.getEdges(),
    start: startNode,
    goal: goalNode,
    trafficByEdge: trafficMap(store),
    signalsByNode: signalsByNode(store),
    emergencyLevel,
  });
}

function applySignalTick(store, corridorPlan, greenActive, rng) {
  for (const signal of store.getSignals()) {
    const planned = greenActive && corridorPlan?.activate?.some((a) => a.nodeId === signal.nodeId);
    if (planned) {
      signal.state = 'EMERGENCY_GREEN';
      signal.emergencyPriority = true;
      signal.remainingSec = Math.max(signal.remainingSec, 18);
    } else {
      signal.emergencyPriority = false;
      signal.remainingSec -= 1;
      if (signal.remainingSec <= 0) {
        if (signal.state === 'EMERGENCY_GREEN') {
          signal.state = signal.normalState === 'EMERGENCY_GREEN' ? 'GREEN' : signal.normalState;
        } else if (signal.state === 'GREEN') {
          signal.state = 'YELLOW';
          signal.remainingSec = 4;
        } else if (signal.state === 'YELLOW') {
          signal.state = 'RED';
          signal.remainingSec = Math.max(8, Math.round(signal.cycleSec * 0.4));
        } else {
          signal.state = 'GREEN';
          signal.remainingSec = signal.greenSec;
        }
        signal.normalState = signal.state === 'EMERGENCY_GREEN' ? 'GREEN' : signal.state;
      }
    }
    if (!planned && rng() < 0.12) {
      signal.trafficDensity = stepTrafficDensity(signal.trafficDensity, rng);
    }
    signal.trafficBand = classifyTraffic(signal.trafficDensity);
    signal.queueLength = queueFromDensity(signal.trafficDensity);
    signal.estimatedDelaySec = delayFromSignal(signal.state, signal.cycleSec, signal.trafficDensity);
  }
}

function applyTrafficTick(store, rng) {
  for (const edge of store.getTraffic()) {
    edge.trafficDensity = stepTrafficDensity(edge.trafficDensity, rng);
    edge.trafficBand = classifyTraffic(edge.trafficDensity);
    edge.averageSpeed = Number(
      (edge.baseSpeedKmh * (1 - (edge.trafficDensity / 100) * 0.58)).toFixed(1),
    );
  }
}

function maybeSpikeDemoTraffic(store, sim, rng) {
  if (!sim.activeTrip || sim.trafficSpiked) return;
  if (sim.tick < 18) return;
  const trip = sim.activeTrip;
  const primaryEdges = trip.route.edgeIds.slice(0, 3);
  for (const edge of store.getTraffic()) {
    if (primaryEdges.includes(edge.edgeId)) {
      edge.trafficDensity = Math.min(100, edge.trafficDensity + 22 + Math.round(rng() * 8));
      edge.trafficBand = classifyTraffic(edge.trafficDensity);
    }
  }
  sim.trafficSpiked = true;
  store.addNotification('warning', 'Traffic congestion detected on the active corridor.');
  store.addLog('warn', 'Demo scenario: primary route density increased.');
}

export function startEmergency(store, { ambulanceId, hospitalId, level, demo }) {
  const ambulance = store.getAmbulance(ambulanceId);
  const hospital = store.getHospital(hospitalId);
  if (!ambulance) {
    const err = new Error('Invalid ambulance');
    err.status = 400;
    err.code = 'INVALID_AMBULANCE';
    throw err;
  }
  if (!hospital) {
    const err = new Error('Invalid hospital');
    err.status = 400;
    err.code = 'INVALID_HOSPITAL';
    throw err;
  }
  if (ambulance.status === 'Maintenance') {
    const err = new Error('Ambulance is in maintenance and cannot be dispatched');
    err.status = 409;
    err.code = 'AMBULANCE_UNAVAILABLE';
    throw err;
  }

  const result = computeRoutes(store, ambulance.nodeId, hospital.nodeId, level);
  if (!result.best) {
    const err = new Error('No route found between the selected ambulance and hospital');
    err.status = 422;
    err.code = 'NO_ROUTE';
    throw err;
  }

  const polyline = buildPolyline(result.best.nodeIds);
  const id = uid('TRP');
  const trip = {
    id,
    ambulanceId,
    hospitalId,
    level,
    status: 'Active',
    demo: Boolean(demo),
    startNode: ambulance.nodeId,
    goalNode: hospital.nodeId,
    originName: ambulance.station,
    destinationName: hospital.name,
    startLat: ambulance.lat,
    startLng: ambulance.lng,
    route: result.best,
    candidates: result.candidates,
    polyline,
    traveledM: 0,
    remainingM: polylineLengthMeters(polyline),
    currentSpeedKmh: ambulance.speedKmh || 45,
    originalEtaSec: result.best.travelTimeSec,
    optimizedEtaSec: result.best.travelTimeSec,
    currentEtaSec: result.best.travelTimeSec,
    timeSavedSec: 0,
    greenCorridorActive: false,
    passedNodeIds: [],
    nextIntersection: result.best.nodeIds[1] || hospital.nodeId,
    currentRoad: result.best.roads[0],
    startedAt: new Date().toISOString(),
    endedAt: null,
  };

  store.updateAmbulance(ambulanceId, { status: 'On Emergency' });
  store.addTrip({
    id,
    ambulanceId,
    hospitalId,
    level,
    distanceKm: result.best.distanceKm,
    originalEtaSec: result.best.travelTimeSec,
    optimizedEtaSec: result.best.travelTimeSec,
    timeSavedSec: 0,
    status: 'Active',
    startedAt: trip.startedAt,
    endedAt: null,
  });

  store.mutateSimulation({
    running: true,
    paused: false,
    demoMode: true,
    tick: 0,
    greenCorridorActive: false,
    activeTrip: trip,
    alternative: null,
    trafficSpiked: false,
    corridorPlan: null,
  });

  store.addNotification('info', `Emergency ${id} created for ${ambulanceId} → ${hospital.name}.`);
  store.addLog('info', `Trip ${id} dispatched (${level}).`);
  return trip;
}

export function activateGreenCorridor(store) {
  const sim = store.simulation();
  if (!sim.activeTrip) {
    const err = new Error('No active emergency to prioritize');
    err.status = 409;
    err.code = 'NO_ACTIVE_TRIP';
    throw err;
  }
  sim.greenCorridorActive = true;
  sim.activeTrip.greenCorridorActive = true;
  store.addNotification('success', 'Green corridor activated.');
  store.addLog('info', `Green corridor enabled for ${sim.activeTrip.id}.`);
  return planCorridor(store);
}

export function deactivateGreenCorridor(store) {
  const sim = store.simulation();
  sim.greenCorridorActive = false;
  if (sim.activeTrip) sim.activeTrip.greenCorridorActive = false;
  for (const signal of store.getSignals()) {
    if (signal.state === 'EMERGENCY_GREEN') {
      signal.state = 'GREEN';
      signal.emergencyPriority = false;
    }
  }
  store.addNotification('info', 'Green corridor deactivated. Signals returning to normal cycle.');
  return { ok: true };
}

function planCorridor(store) {
  const sim = store.simulation();
  const trip = sim.activeTrip;
  if (!trip) return null;
  const ambulance = store.getAmbulance(trip.ambulanceId);
  const remaining = trip.route.nodeIds.filter((id) => NODES[id]?.type === 'signal');
  const plan = selectPrioritySignals({
    ambulance: {
      lat: ambulance.lat,
      lng: ambulance.lng,
      speedKmh: trip.currentSpeedKmh,
    },
    remainingSignalNodes: remaining,
    nodes: NODES,
    priority: trip.level,
    passedNodeIds: trip.passedNodeIds,
  });
  sim.corridorPlan = plan;
  return plan;
}

export function tickSimulation(store, rng = Math.random) {
  const sim = store.simulation();
  if (!sim.running || sim.paused) return getPublicState(store);

  sim.tick += 1;
  applyTrafficTick(store, rng);
  maybeSpikeDemoTraffic(store, sim, rng);

  if (sim.activeTrip) {
    const trip = sim.activeTrip;
    const ambulance = store.getAmbulance(trip.ambulanceId);
    const densityAvg = trip.route.edgeIds.reduce((sum, id) => {
      const t = store.getTraffic().find((e) => e.edgeId === id);
      return sum + (t?.trafficDensity || 40);
    }, 0) / Math.max(1, trip.route.edgeIds.length);

    const corridorBoost = sim.greenCorridorActive ? 1.22 : 1;
    const speed = Math.max(12, trip.currentSpeedKmh * (1 - (densityAvg / 100) * 0.45) * corridorBoost);
    trip.currentSpeedKmh = Number(speed.toFixed(1));
    const stepM = (speed * 1000) / 3600;
    trip.traveledM = Math.min(trip.traveledM + stepM, polylineLengthMeters(trip.polyline));
    const pos = interpolateAlong(trip.polyline, trip.traveledM);
    ambulance.lat = pos.lat;
    ambulance.lng = pos.lng;
    trip.remainingM = pos.remainingM;
    trip.currentEtaSec = Math.round((pos.remainingM / 1000 / Math.max(8, speed)) * 3600);
    trip.timeSavedSec = Math.max(0, trip.originalEtaSec - Math.round((trip.traveledM / 1000 / Math.max(8, speed)) * 3600) - trip.currentEtaSec + (sim.greenCorridorActive ? 45 : 0));
    trip.optimizedEtaSec = trip.currentEtaSec;

    const idx = pos.segmentIndex || 0;
    trip.currentRoad = trip.route.roads[Math.min(idx, trip.route.roads.length - 1)];
    const nextNode = trip.route.nodeIds[Math.min(idx + 1, trip.route.nodeIds.length - 1)];
    trip.nextIntersection = nextNode;

    for (const nodeId of trip.route.nodeIds) {
      if (trip.passedNodeIds.includes(nodeId)) continue;
      const node = NODES[nodeId];
      const d = Math.hypot(node.lat - ambulance.lat, node.lng - ambulance.lng);
      if (d < 0.0009 && nodeId !== trip.goalNode) {
        trip.passedNodeIds.push(nodeId);
        const signal = store.getSignals().find((s) => s.nodeId === nodeId);
        if (signal) {
          store.addNotification('success', `${signal.name} cleared.`);
        }
      }
    }

    if (sim.greenCorridorActive) {
      const plan = planCorridor(store);
      const approaching = plan.activate[0];
      if (approaching && sim.tick % 8 === 0) {
        store.addNotification('info', `Ambulance approaching ${approaching.signalName}.`);
      }
    }

    const recomputed = computeRoutes(store, trip.startNode, trip.goalNode, trip.level);
    if (recomputed.best && shouldRecommendSwitch(trip.route, recomputed.best)) {
      if (!sim.alternative || sim.alternative.edgeIds.join() !== recomputed.best.edgeIds.join()) {
        sim.alternative = {
          ...recomputed.best,
          previousEtaSec: trip.currentEtaSec,
          newEtaSec: recomputed.best.travelTimeSec,
          estimatedSaveSec: Math.max(0, trip.currentEtaSec - recomputed.best.travelTimeSec),
        };
        store.addNotification('warning', 'Alternative route detected.');
      }
    }

    if (pos.remainingM < 25) {
      completeTrip(store, 'Completed');
    }
  }

  applySignalTick(store, sim.corridorPlan, sim.greenCorridorActive, rng);
  return getPublicState(store);
}

export function completeTrip(store, status = 'Completed') {
  const sim = store.simulation();
  const trip = sim.activeTrip;
  if (!trip) return;
  trip.status = status;
  trip.endedAt = new Date().toISOString();
  const saved = Math.max(0, trip.originalEtaSec - (Date.parse(trip.endedAt) - Date.parse(trip.startedAt)) / 1000);
  trip.timeSavedSec = Math.round(Number.isFinite(saved) ? saved : trip.timeSavedSec);
  store.updateTrip(trip.id, {
    status,
    endedAt: trip.endedAt,
    optimizedEtaSec: trip.originalEtaSec - trip.timeSavedSec,
    timeSavedSec: trip.timeSavedSec,
  });
  store.updateAmbulance(trip.ambulanceId, { status: status === 'Completed' ? 'Returning' : 'Available' });
  if (status === 'Completed') {
    const hospital = store.getHospital(trip.hospitalId);
    if (hospital && hospital.availableBeds > 0) {
      store.updateHospital(trip.hospitalId, { availableBeds: hospital.availableBeds - 1 });
    }
  }
  store.addNotification('success', 'Emergency trip completed.');
  store.addLog('info', `Trip ${trip.id} ${status}.`);
  sim.running = false;
  sim.paused = false;
  sim.greenCorridorActive = false;
  sim.lastCompletedTrip = trip;
  sim.activeTrip = null;
  sim.alternative = null;
}

export function switchRoute(store) {
  const sim = store.simulation();
  if (!sim.activeTrip || !sim.alternative) {
    const err = new Error('No alternative route is available');
    err.status = 409;
    err.code = 'NO_ALTERNATIVE';
    throw err;
  }
  const trip = sim.activeTrip;
  const alt = sim.alternative;
  trip.route = alt;
  trip.candidates = undefined;
  trip.polyline = buildPolyline(alt.nodeIds);
  trip.traveledM = 0;
  trip.remainingM = polylineLengthMeters(trip.polyline);
  trip.originalEtaSec = alt.previousEtaSec || trip.originalEtaSec;
  trip.currentEtaSec = alt.travelTimeSec;
  trip.passedNodeIds = [];
  sim.alternative = null;
  store.addNotification('success', 'Route switched to the optimized alternative.');
  return trip;
}

export function getAnalytics(store) {
  const trips = store.getTrips().filter((t) => t.status === 'Completed');
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const byDay = {};
  for (const t of trips) {
    const day = (t.startedAt || '').slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  const bands = { low: 0, moderate: 0, high: 0, severe: 0 };
  for (const e of store.getTraffic()) bands[e.trafficBand] += 1;

  return {
    averageResponseSec: Math.round(avg(trips.map((t) => t.optimizedEtaSec || t.originalEtaSec))),
    averageTripDurationSec: Math.round(avg(trips.map((t) => t.optimizedEtaSec))),
    averageTimeSavedSec: Math.round(avg(trips.map((t) => t.timeSavedSec || 0))),
    greenCorridorsActivated: trips.filter((t) => (t.timeSavedSec || 0) > 40).length,
    successfulTrips: trips.length,
    successRate: trips.length ? 0.98 : 0,
    emergenciesPerDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    trafficDistribution: Object.entries(bands).map(([band, count]) => ({ band, count })),
    routeEfficiency: trips.slice(0, 8).map((t) => ({
      id: t.id,
      original: t.originalEtaSec,
      optimized: t.optimizedEtaSec,
      saved: t.timeSavedSec,
    })),
    signalClearance: store.getSignals().map((s) => ({
      id: s.id,
      delay: s.estimatedDelaySec,
      density: s.trafficDensity,
    })),
  };
}

export function getPublicState(store) {
  const sim = store.simulation();
  const ambulances = store.getAmbulances();
  const active = store.getTrips().filter((t) => t.status === 'Active');
  const completed = store.getTrips().filter((t) => t.status === 'Completed');
  const avgEta = active.length
    ? Math.round(active.reduce((s, t) => s + (t.optimizedEtaSec || 0), 0) / active.length)
    : Math.round(completed.slice(0, 5).reduce((s, t) => s + (t.optimizedEtaSec || 0), 0) / Math.max(1, Math.min(5, completed.length)));

  return {
    demoMode: true,
    disclaimer:
      'Simulation / Demo Data — this prototype does not control real traffic signals or ambulances.',
    city: { name: 'Vidyapur Metro', center: { lat: 18.5204, lng: 73.8567 }, zoom: 14 },
    kpis: {
      activeEmergencies: sim.activeTrip ? Math.max(active.length, 1) : active.length,
      ambulancesAvailable: ambulances.filter((a) => a.status === 'Available').length,
      averageEtaSec: sim.activeTrip?.currentEtaSec ?? avgEta,
      timeSavedSec: sim.activeTrip?.timeSavedSec || completed[0]?.timeSavedSec || 0,
      activeGreenCorridors: sim.greenCorridorActive ? 1 : 0,
    },
    simulation: {
      running: sim.running,
      paused: sim.paused,
      tick: sim.tick,
      greenCorridorActive: sim.greenCorridorActive,
      alternative: sim.alternative,
      corridorPlan: sim.corridorPlan,
    },
    activeTrip: sim.activeTrip,
    lastCompletedTrip: sim.lastCompletedTrip || null,
    ambulances,
    hospitals: store.getHospitals(),
    signals: store.getSignals(),
    traffic: store.getTraffic(),
    notifications: store.getNotifications().slice(0, 12),
  };
}
