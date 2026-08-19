import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { classifyTraffic, trafficSpeedFactor } from './traffic.js';
import {
  findAllSimplePaths,
  optimizeRoutes,
  priorityMultiplier,
  scorePath,
  shouldRecommendSwitch,
  estimateTravelTimeSec,
} from './routeOptimizer.js';
import { corridorLookaheadMeters, selectPrioritySignals } from './greenCorridor.js';
import { EDGES, NODES } from '../data/city.js';

describe('traffic classification', () => {
  it('bands densities correctly', () => {
    assert.equal(classifyTraffic(0), 'low');
    assert.equal(classifyTraffic(30), 'low');
    assert.equal(classifyTraffic(31), 'moderate');
    assert.equal(classifyTraffic(60), 'moderate');
    assert.equal(classifyTraffic(61), 'high');
    assert.equal(classifyTraffic(80), 'high');
    assert.equal(classifyTraffic(81), 'severe');
    assert.equal(classifyTraffic(100), 'severe');
  });

  it('rejects invalid density', () => {
    assert.throws(() => classifyTraffic(-1));
    assert.throws(() => classifyTraffic(101));
  });

  it('slows speed as density rises', () => {
    assert.ok(trafficSpeedFactor(80) < trafficSpeedFactor(20));
  });
});

describe('emergency priority', () => {
  it('weights critical highest', () => {
    assert.ok(priorityMultiplier('CRITICAL') > priorityMultiplier('HIGH'));
    assert.ok(priorityMultiplier('HIGH') > priorityMultiplier('LOW'));
  });
});

describe('ETA calculation', () => {
  it('increases with distance and congestion', () => {
    const clear = estimateTravelTimeSec({
      distanceKm: 2,
      baseSpeedKmh: 40,
      trafficDensity: 10,
      signalDelaySec: 0,
    });
    const jammed = estimateTravelTimeSec({
      distanceKm: 2,
      baseSpeedKmh: 40,
      trafficDensity: 90,
      signalDelaySec: 40,
    });
    assert.ok(jammed > clear);
  });
});

describe('route optimizer', () => {
  const trafficByEdge = Object.fromEntries(EDGES.map((e) => [e.id, e.trafficSeed]));
  const signalsByNode = {};

  it('finds multiple paths from west depot to City General', () => {
    const paths = findAllSimplePaths(EDGES, 'DEPOT_WEST', 'H_CGH');
    assert.ok(paths.length >= 2);
  });

  it('selects the lowest score as best', () => {
    const result = optimizeRoutes({
      edges: EDGES,
      start: 'DEPOT_WEST',
      goal: 'H_CGH',
      trafficByEdge,
      signalsByNode,
      emergencyLevel: 'CRITICAL',
    });
    assert.equal(result.reason, 'OK');
    assert.ok(result.best.score <= result.candidates[1].score);
    assert.ok(result.best.distanceKm > 0);
    assert.ok(result.best.travelTimeSec > 0);
  });

  it('scores heavier traffic worse', () => {
    const path = findAllSimplePaths(EDGES, 'DEPOT_WEST', 'H_CGH')[0];
    const light = scorePath(path, Object.fromEntries(path.map((e) => [e.id, 10])), {}, 'HIGH');
    const heavy = scorePath(path, Object.fromEntries(path.map((e) => [e.id, 90])), {}, 'HIGH');
    assert.ok(heavy.score > light.score);
  });

  it('recommends a faster alternative', () => {
    const current = { edgeIds: ['A'], travelTimeSec: 800 };
    const alt = { edgeIds: ['B'], travelTimeSec: 500 };
    assert.equal(shouldRecommendSwitch(current, alt), true);
    assert.equal(shouldRecommendSwitch(current, { edgeIds: ['A'], travelTimeSec: 790 }), false);
  });
});

describe('green corridor', () => {
  it('activates a limited lookahead window', () => {
    assert.equal(corridorLookaheadMeters('CRITICAL'), 900);
    const plan = selectPrioritySignals({
      ambulance: { lat: NODES.S1.lat, lng: NODES.S1.lng, speedKmh: 45 },
      remainingSignalNodes: ['S1', 'S2', 'S3', 'S4', 'S5'],
      nodes: NODES,
      priority: 'CRITICAL',
      passedNodeIds: [],
    });
    assert.ok(plan.activate.length <= 3);
    assert.ok(plan.activate.length >= 1);
    assert.equal(plan.activate[0].priorityOrder, 1);
  });
});
