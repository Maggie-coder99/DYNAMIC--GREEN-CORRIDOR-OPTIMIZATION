import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApiUrl } from './vercelUrl.js';

describe('normalizeApiUrl', () => {
  it('keeps Express /api paths', () => {
    assert.equal(normalizeApiUrl('/api/auth/login'), '/api/auth/login');
    assert.equal(normalizeApiUrl('/api/health?ready=1'), '/api/health?ready=1');
  });

  it('prefixes stripped function paths', () => {
    assert.equal(normalizeApiUrl('/auth/login'), '/api/auth/login');
    assert.equal(normalizeApiUrl('/health'), '/api/health');
    assert.equal(normalizeApiUrl('/index'), '/api');
  });
});
