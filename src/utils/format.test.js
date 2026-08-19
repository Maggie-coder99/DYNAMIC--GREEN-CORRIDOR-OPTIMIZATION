import { describe, it, expect } from 'vitest';
import { classifyTraffic, formatDuration, trafficColor } from './format.js';

describe('format helpers', () => {
  it('formats mm:ss', () => {
    expect(formatDuration(462)).toBe('07:42');
    expect(formatDuration(198)).toBe('03:18');
  });

  it('classifies traffic', () => {
    expect(classifyTraffic(12)).toBe('low');
    expect(classifyTraffic(70)).toBe('high');
    expect(trafficColor('severe')).toBe('#ef4444');
  });
});
