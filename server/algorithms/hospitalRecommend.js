import { haversineMeters } from '../utils/geo.js';

export function recommendHospitals(ambulance, hospitals) {
  if (!ambulance) throw new Error('Ambulance is required');
  if (!Array.isArray(hospitals) || !hospitals.length) {
    throw new Error('No hospitals available');
  }

  return hospitals
    .map((hospital) => {
      const distanceM = haversineMeters(ambulance, hospital);
      const distanceKm = Number((distanceM / 1000).toFixed(2));
      const bedPenalty = hospital.availableBeds <= 0 ? 80 : hospital.availableBeds < 4 ? 8 : 0;
      const statusPenalty = hospital.edStatus === 'Busy' ? 12 : hospital.edStatus === 'Limited' ? 5 : 0;
      const score = Number((distanceKm * 4 + bedPenalty + statusPenalty).toFixed(2));
      const suitable = hospital.availableBeds > 0 && hospital.edStatus !== 'Busy';
      return {
        id: hospital.id,
        name: hospital.name,
        edStatus: hospital.edStatus,
        availableBeds: hospital.availableBeds,
        specialties: hospital.specialties,
        distanceKm,
        score,
        suitable,
        reason: suitable
          ? `Nearest capable facility (${distanceKm} km, ${hospital.availableBeds} beds)`
          : 'Lower priority — busy or no emergency beds',
      };
    })
    .sort((a, b) => a.score - b.score);
}
