import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { haversineMeters, interpolateAlong, polylineLengthMeters } from './geo.js';

describe('geo helpers', () => {
  it('computes a non-zero distance between two city points', () => {
    const d = haversineMeters({ lat: 18.5164, lng: 73.8421 }, { lat: 18.5289, lng: 73.8741 });
    assert.ok(d > 1000);
  });

  it('interpolates along a polyline', () => {
    const line = [
      { lat: 18.51, lng: 73.84 },
      { lat: 18.52, lng: 73.85 },
      { lat: 18.53, lng: 73.86 },
    ];
    const total = polylineLengthMeters(line);
    const mid = interpolateAlong(line, total / 2);
    assert.ok(mid.remainingM < total);
    assert.ok(mid.lat > 18.51);
  });
});
