import { haversineMeters } from '../utils/geo.js';

const LOOKAHEAD_M = {
  CRITICAL: 900,
  HIGH: 700,
  MEDIUM: 500,
  LOW: 350,
};

const MAX_ACTIVE = {
  CRITICAL: 3,
  HIGH: 2,
  MEDIUM: 2,
  LOW: 1,
};

export function corridorLookaheadMeters(priority) {
  if (!LOOKAHEAD_M[priority]) throw new Error(`Unknown priority ${priority}`);
  return LOOKAHEAD_M[priority];
}

/**
 * Choose the next signals ahead of the ambulance. Only a sliding window
 * is activated so the corridor is sequential, not city-wide.
 */
export function selectPrioritySignals({
  ambulance,
  remainingSignalNodes,
  nodes,
  priority = 'HIGH',
  passedNodeIds = [],
}) {
  if (!ambulance) throw new Error('Ambulance position is required');
  const lookahead = corridorLookaheadMeters(priority);
  const maxActive = MAX_ACTIVE[priority];
  const ahead = remainingSignalNodes.filter((id) => !passedNodeIds.includes(id));

  const withDistance = ahead.map((id) => {
    const node = nodes[id];
    const distanceM = haversineMeters(ambulance, node);
    const etaSec = Math.round(distanceM / Math.max(4, (ambulance.speedKmh || 40) / 3.6));
    return {
      nodeId: id,
      signalName: node.name,
      distanceM: Math.round(distanceM),
      etaSec,
      withinLookahead: distanceM <= lookahead,
    };
  });

  const window = withDistance.filter((s) => s.withinLookahead).slice(0, maxActive);
  const activationPlan = window.map((s, index) => ({
    ...s,
    priorityOrder: index + 1,
    activationDelaySec: index * 6,
    estimatedClearanceSec: Math.max(8, s.etaSec + 12),
  }));

  return {
    lookaheadM: lookahead,
    maxActive,
    upcoming: withDistance,
    activate: activationPlan,
  };
}

export function nextSignalAfterPass(passedId, remaining) {
  return remaining.filter((id) => id !== passedId);
}
