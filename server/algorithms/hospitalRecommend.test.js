import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { recommendHospitals } from './hospitalRecommend.js';

describe('hospital recommendation', () => {
  const ambulance = { lat: 18.5164, lng: 73.8421 };
  const hospitals = [
    { id: 'H1', name: 'Far Busy', lat: 18.54, lng: 73.89, availableBeds: 8, edStatus: 'Busy', specialties: ['Trauma'] },
    { id: 'H2', name: 'Near Open', lat: 18.518, lng: 73.846, availableBeds: 6, edStatus: 'Accepting', specialties: ['ICU'] },
    { id: 'H3', name: 'No beds', lat: 18.517, lng: 73.845, availableBeds: 0, edStatus: 'Accepting', specialties: ['General'] },
  ];

  it('ranks the nearby accepting hospital first', () => {
    const ranked = recommendHospitals(ambulance, hospitals);
    assert.equal(ranked[0].id, 'H2');
    assert.equal(ranked[0].suitable, true);
  });
});
