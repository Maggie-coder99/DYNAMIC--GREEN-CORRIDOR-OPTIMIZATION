import { randomUUID } from 'node:crypto';
import {
  AMBULANCES,
  EDGES,
  HISTORIC_TRIPS,
  HOSPITALS,
  NODES,
  SIGNALS,
  SYSTEM_LOGS,
  USERS,
} from '../data/city.js';
import { classifyTraffic, delayFromSignal, queueFromDensity } from '../algorithms/traffic.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildSignals() {
  const states = ['RED', 'GREEN', 'YELLOW', 'GREEN', 'RED', 'GREEN'];
  return SIGNALS.map((s, i) => {
    const node = NODES[s.nodeId];
    const density = 30 + ((i * 11) % 55);
    const state = states[i % states.length];
    return {
      id: s.id,
      nodeId: s.nodeId,
      name: node.name,
      road: node.road,
      lat: node.lat,
      lng: node.lng,
      state,
      normalState: state,
      cycleSec: s.cycleSec,
      greenSec: s.greenSec,
      remainingSec: 12 + (i * 3) % 20,
      trafficDensity: density,
      trafficBand: classifyTraffic(density),
      queueLength: queueFromDensity(density),
      estimatedDelaySec: delayFromSignal(state, s.cycleSec, density),
      emergencyPriority: false,
    };
  });
}

function buildTraffic() {
  return EDGES.map((e) => ({
    edgeId: e.id,
    from: e.from,
    to: e.to,
    road: e.road,
    distanceKm: e.distanceKm,
    baseSpeedKmh: e.baseSpeedKmh,
    trafficDensity: e.trafficSeed,
    trafficBand: classifyTraffic(e.trafficSeed),
    averageSpeed: Number((e.baseSpeedKmh * (1 - (e.trafficSeed / 100) * 0.58)).toFixed(1)),
  }));
}

export function createStore() {
  const state = {
    users: clone(USERS),
    ambulances: clone(AMBULANCES),
    hospitals: clone(HOSPITALS),
    nodes: clone(NODES),
    edges: clone(EDGES),
    signals: buildSignals(),
    traffic: buildTraffic(),
    trips: clone(HISTORIC_TRIPS),
    logs: clone(SYSTEM_LOGS),
    notifications: [],
    simulation: {
      running: false,
      paused: false,
      demoMode: true,
      tickMs: 1000,
      tick: 0,
      greenCorridorActive: false,
      activeTrip: null,
      alternative: null,
      events: [],
    },
  };

  return {
    snapshot() {
      return clone(state);
    },
    getUsers() {
      return state.users;
    },
    findUser(email) {
      return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    getAmbulances() {
      return state.ambulances;
    },
    getAmbulance(id) {
      return state.ambulances.find((a) => a.id === id);
    },
    updateAmbulance(id, patch) {
      const row = this.getAmbulance(id);
      if (!row) return null;
      Object.assign(row, patch);
      return row;
    },
    createAmbulance(payload) {
      const row = {
        id: payload.id || `AMB-${String(state.ambulances.length + 1).padStart(3, '0')}`,
        registration: payload.registration,
        driver: payload.driver,
        status: payload.status || 'Available',
        lat: payload.lat,
        lng: payload.lng,
        nodeId: payload.nodeId || 'DEPOT_WEST',
        equipment: payload.equipment || ['BLS'],
        speedKmh: payload.speedKmh || 40,
        station: payload.station || 'Unassigned',
      };
      state.ambulances.push(row);
      return row;
    },
    getHospitals() {
      return state.hospitals;
    },
    getHospital(id) {
      return state.hospitals.find((h) => h.id === id);
    },
    updateHospital(id, patch) {
      const row = this.getHospital(id);
      if (!row) return null;
      Object.assign(row, patch);
      return row;
    },
    createHospital(payload) {
      const row = {
        id: payload.id || `HOS-${String(state.hospitals.length + 1).padStart(3, '0')}`,
        name: payload.name,
        shortName: payload.shortName || payload.name,
        lat: payload.lat,
        lng: payload.lng,
        nodeId: payload.nodeId,
        emergencyCapacity: payload.emergencyCapacity || 10,
        availableBeds: payload.availableBeds ?? 4,
        edStatus: payload.edStatus || 'Accepting',
        specialties: payload.specialties || ['General'],
        address: payload.address || 'Vidyapur',
      };
      state.hospitals.push(row);
      return row;
    },
    getSignals() {
      return state.signals;
    },
    getSignal(id) {
      return state.signals.find((s) => s.id === id);
    },
    getTraffic() {
      return state.traffic;
    },
    getEdges() {
      return state.edges;
    },
    getNodes() {
      return state.nodes;
    },
    getTrips() {
      return state.trips;
    },
    addTrip(trip) {
      state.trips.unshift(trip);
      return trip;
    },
    updateTrip(id, patch) {
      const row = state.trips.find((t) => t.id === id);
      if (!row) return null;
      Object.assign(row, patch);
      return row;
    },
    getLogs() {
      return state.logs;
    },
    addLog(level, message) {
      const row = { id: randomUUID(), level, message, at: new Date().toISOString() };
      state.logs.unshift(row);
      state.logs = state.logs.slice(0, 80);
      return row;
    },
    addNotification(type, message) {
      const row = {
        id: randomUUID(),
        type,
        message,
        at: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(row);
      state.notifications = state.notifications.slice(0, 40);
      return row;
    },
    getNotifications() {
      return state.notifications;
    },
    simulation() {
      return state.simulation;
    },
    mutateSimulation(patch) {
      Object.assign(state.simulation, patch);
      return state.simulation;
    },
  };
}

export const store = createStore();
