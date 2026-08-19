import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './app.js';

const app = createApp();
let token = '';

describe('API', () => {
  before(async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'operator@corridor.demo',
      password: 'demo123',
      role: 'emergency_operator',
    });
    assert.equal(res.status, 200);
    token = res.body.token;
  });

  it('rejects unauthenticated fleet access', async () => {
    const res = await request(app).get('/api/ambulances');
    assert.equal(res.status, 401);
  });

  it('validates login input', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'bad', password: 'x' });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
  });

  it('lists ambulances and hospitals', async () => {
    const a = await request(app).get('/api/ambulances').set('Authorization', `Bearer ${token}`);
    const h = await request(app).get('/api/hospitals').set('Authorization', `Bearer ${token}`);
    assert.equal(a.status, 200);
    assert.ok(a.body.ambulances.length >= 6);
    assert.ok(h.body.hospitals.length >= 5);
  });

  it('optimizes a route', async () => {
    const res = await request(app)
      .post('/api/routes/optimize')
      .set('Authorization', `Bearer ${token}`)
      .send({ startNode: 'DEPOT_WEST', goalNode: 'H_CGH', level: 'CRITICAL' });
    assert.equal(res.status, 200);
    assert.ok(res.body.best.edgeIds.length >= 2);
  });

  it('starts the demo emergency', async () => {
    const res = await request(app)
      .post('/api/demo/start')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 201);
    assert.equal(res.body.trip.ambulanceId, 'AMB-001');
    assert.equal(res.body.state.simulation.greenCorridorActive, true);
  });

  it('serves analytics', async () => {
    const res = await request(app).get('/api/analytics').set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.successfulTrips >= 1);
  });

  it('rejects unknown ambulance', async () => {
    const res = await request(app)
      .post('/api/emergencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ ambulanceId: 'NOPE', hospitalId: 'HOS-001', level: 'HIGH' });
    assert.equal(res.status, 400);
  });

  it('recommends a hospital', async () => {
    const res = await request(app)
      .get('/api/hospitals/recommend?ambulanceId=AMB-001')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.recommended.id);
  });

  it('accepts a public contact message', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Riya Student',
      email: 'riya@college.edu',
      topic: 'demo',
      message: 'Please walk me through the green corridor demo.',
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.ok, true);
  });
});
