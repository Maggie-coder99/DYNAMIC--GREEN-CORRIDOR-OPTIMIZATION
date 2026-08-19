import { trafficSpeedFactor } from './traffic.js';

export const ROUTE_WEIGHTS = {
  travelTime: 0.4,
  traffic: 0.25,
  signalDelay: 0.2,
  distance: 0.15,
};

export function priorityMultiplier(level) {
  switch (level) {
    case 'CRITICAL':
      return 1.35;
    case 'HIGH':
      return 1.2;
    case 'MEDIUM':
      return 1.05;
    case 'LOW':
      return 1;
    default:
      throw new Error(`Unknown emergency priority: ${level}`);
  }
}

export function estimateTravelTimeSec({
  distanceKm,
  baseSpeedKmh,
  trafficDensity,
  signalDelaySec,
}) {
  if (distanceKm < 0 || baseSpeedKmh <= 0) {
    throw new Error('Distance must be >= 0 and speed must be > 0');
  }
  const speed = Math.max(8, baseSpeedKmh * trafficSpeedFactor(trafficDensity));
  const movingSec = (distanceKm / speed) * 3600;
  return movingSec + Math.max(0, signalDelaySec);
}

function buildAdjacency(edges) {
  const map = new Map();
  for (const edge of edges) {
    if (!map.has(edge.from)) map.set(edge.from, []);
    map.get(edge.from).push(edge);
  }
  return map;
}

/** Enumerate simple paths. Graph is small (demo city), so exhaustive search is reliable. */
export function findAllSimplePaths(edges, start, goal, maxDepth = 10) {
  const adj = buildAdjacency(edges);
  const results = [];

  function dfs(node, path, usedEdges) {
    if (path.length > maxDepth) return;
    if (node === goal && path.length > 1) {
      results.push([...path]);
      return;
    }
    const next = adj.get(node) || [];
    for (const edge of next) {
      if (usedEdges.has(edge.id)) continue;
      if (path.some((p) => p.to === edge.to)) continue;
      usedEdges.add(edge.id);
      path.push(edge);
      dfs(edge.to, path, usedEdges);
      path.pop();
      usedEdges.delete(edge.id);
    }
  }

  dfs(start, [], new Set());
  return results;
}

export function scorePath(edgeList, trafficByEdge, signalsByNode, emergencyLevel) {
  const distanceKm = edgeList.reduce((sum, e) => sum + e.distanceKm, 0);
  const avgTraffic =
    edgeList.reduce((sum, e) => sum + (trafficByEdge[e.id] ?? e.trafficSeed), 0) / edgeList.length;
  const avgSpeed =
    edgeList.reduce((sum, e) => sum + e.baseSpeedKmh, 0) / edgeList.length;

  let signalDelaySec = 0;
  const intersectionCount = edgeList.length;
  for (const edge of edgeList) {
    const signal = signalsByNode[edge.to];
    const density = trafficByEdge[edge.id] ?? edge.trafficSeed;
    if (signal) {
      const isEmergency = signal.state === 'EMERGENCY_GREEN';
      signalDelaySec += isEmergency ? density * 0.08 : delayHeuristic(signal, density);
    } else {
      signalDelaySec += density * 0.05;
    }
  }

  const travelTimeSec = estimateTravelTimeSec({
    distanceKm,
    baseSpeedKmh: avgSpeed,
    trafficDensity: avgTraffic,
    signalDelaySec,
  });

  const prio = priorityMultiplier(emergencyLevel);
  const timeTerm = (travelTimeSec / 60) * ROUTE_WEIGHTS.travelTime * prio;
  const trafficTerm = avgTraffic * ROUTE_WEIGHTS.traffic;
  const delayTerm = (signalDelaySec / 30) * ROUTE_WEIGHTS.signalDelay;
  const distanceTerm = distanceKm * 8 * ROUTE_WEIGHTS.distance;

  const score = timeTerm + trafficTerm + delayTerm + distanceTerm;

  return {
    score: Number(score.toFixed(3)),
    distanceKm: Number(distanceKm.toFixed(2)),
    avgTraffic: Number(avgTraffic.toFixed(1)),
    intersectionCount,
    signalDelaySec: Math.round(signalDelaySec),
    travelTimeSec: Math.round(travelTimeSec),
    nodeIds: [edgeList[0].from, ...edgeList.map((e) => e.to)],
    edgeIds: edgeList.map((e) => e.id),
    roads: edgeList.map((e) => e.road),
  };
}

function delayHeuristic(signal, density) {
  if (signal.state === 'GREEN' || signal.state === 'EMERGENCY_GREEN') return 4 + density * 0.1;
  if (signal.state === 'YELLOW') return 10 + density * 0.18;
  return (signal.cycleSec || 90) * 0.28 + density * 0.28;
}

export function optimizeRoutes({
  edges,
  start,
  goal,
  trafficByEdge,
  signalsByNode,
  emergencyLevel = 'HIGH',
  maxCandidates = 6,
}) {
  if (!start || !goal) {
    throw new Error('Start and destination nodes are required');
  }
  const paths = findAllSimplePaths(edges, start, goal);
  if (!paths.length) {
    return { best: null, candidates: [], reason: 'NO_ROUTE' };
  }

  const scored = paths
    .map((edgeList) => ({
      ...scorePath(edgeList, trafficByEdge, signalsByNode, emergencyLevel),
      edges: edgeList,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, maxCandidates);

  return {
    best: scored[0],
    candidates: scored,
    reason: 'OK',
  };
}

export function shouldRecommendSwitch(current, alternative, improvementRatio = 0.12) {
  if (!current || !alternative) return false;
  if (alternative.edgeIds.join() === current.edgeIds.join()) return false;
  return alternative.travelTimeSec < current.travelTimeSec * (1 - improvementRatio);
}
