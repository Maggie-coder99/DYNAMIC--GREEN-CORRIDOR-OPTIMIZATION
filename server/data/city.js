/**
 * Simulated metro graph for Vidyapur (mapped onto Pune, India OSM tiles
 * so roads look authentic). All traffic, ambulances, and signals are simulated.
 */

export const CITY = {
  name: 'Vidyapur Metro',
  region: 'Academic simulation overlay',
  center: { lat: 18.5204, lng: 73.8567 },
  defaultZoom: 14,
};

export const PRIORITY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const SIGNAL_STATES = ['RED', 'YELLOW', 'GREEN', 'EMERGENCY_GREEN'];

export const AMBULANCE_STATUSES = ['Available', 'On Emergency', 'Returning', 'Maintenance'];

export const USERS = [
  {
    id: 'USR-OP-01',
    name: 'Ananya Rao',
    email: 'operator@corridor.demo',
    password: 'demo123',
    role: 'emergency_operator',
    title: 'Emergency Dispatch Operator',
  },
  {
    id: 'USR-TC-01',
    name: 'Vikram Shah',
    email: 'traffic@corridor.demo',
    password: 'demo123',
    role: 'traffic_control',
    title: 'Traffic Control Operator',
  },
  {
    id: 'USR-AD-01',
    name: 'Meera Iyer',
    email: 'admin@corridor.demo',
    password: 'demo123',
    role: 'administrator',
    title: 'System Administrator',
  },
];

export const HOSPITALS = [
  {
    id: 'HOS-001',
    name: 'City General Hospital',
    shortName: 'City General',
    lat: 18.5289,
    lng: 73.8741,
    nodeId: 'H_CGH',
    emergencyCapacity: 24,
    availableBeds: 7,
    edStatus: 'Accepting',
    specialties: ['Trauma', 'ICU', 'Cardiac'],
    address: 'Bund Garden Road, Vidyapur',
  },
  {
    id: 'HOS-002',
    name: 'Riverside Trauma Center',
    shortName: 'Riverside Trauma',
    lat: 18.5118,
    lng: 73.8452,
    nodeId: 'H_RTC',
    emergencyCapacity: 18,
    availableBeds: 4,
    edStatus: 'Busy',
    specialties: ['Trauma', 'Neuro'],
    address: 'Mutha Riverfront, West Vidyapur',
  },
  {
    id: 'HOS-003',
    name: 'Metro Heart Institute',
    shortName: 'Metro Heart',
    lat: 18.5352,
    lng: 73.8518,
    nodeId: 'H_MHI',
    emergencyCapacity: 12,
    availableBeds: 6,
    edStatus: 'Accepting',
    specialties: ['Cardiac', 'ICU'],
    address: 'Shivaji Nagar Medical Cluster',
  },
  {
    id: 'HOS-004',
    name: 'University Medical Center',
    shortName: 'UMC',
    lat: 18.5086,
    lng: 73.8624,
    nodeId: 'H_UMC',
    emergencyCapacity: 20,
    availableBeds: 9,
    edStatus: 'Accepting',
    specialties: ['General', 'Pediatric'],
    address: 'University Road, South Campus',
  },
  {
    id: 'HOS-005',
    name: 'Pediatric Emergency Hospital',
    shortName: 'Pediatric EH',
    lat: 18.5224,
    lng: 73.8688,
    nodeId: 'H_PEH',
    emergencyCapacity: 10,
    availableBeds: 3,
    edStatus: 'Limited',
    specialties: ['Pediatric', 'NICU'],
    address: 'Koregaon Medical Lane',
  },
];

export const AMBULANCES = [
  {
    id: 'AMB-001',
    registration: 'MH-12-EM-4401',
    driver: 'Sanjay Kulkarni',
    status: 'Available',
    lat: 18.5164,
    lng: 73.8421,
    nodeId: 'DEPOT_WEST',
    equipment: ['ALS', 'Defibrillator', 'Ventilator'],
    speedKmh: 48,
    station: 'West Depot',
  },
  {
    id: 'AMB-002',
    registration: 'MH-12-EM-4402',
    driver: 'Farah Qureshi',
    status: 'Available',
    lat: 18.5315,
    lng: 73.8479,
    nodeId: 'DEPOT_NORTH',
    equipment: ['ALS', 'Defibrillator'],
    speedKmh: 46,
    station: 'North Depot',
  },
  {
    id: 'AMB-003',
    registration: 'MH-12-EM-2188',
    driver: 'Rohit Deshmukh',
    status: 'On Emergency',
    lat: 18.5198,
    lng: 73.8612,
    nodeId: 'S6',
    equipment: ['BLS'],
    speedKmh: 42,
    station: 'Central Staging',
  },
  {
    id: 'AMB-004',
    registration: 'MH-12-EM-3309',
    driver: 'Priya Nair',
    status: 'Available',
    lat: 18.5104,
    lng: 73.8548,
    nodeId: 'DEPOT_SOUTH',
    equipment: ['ALS', 'Neonatal'],
    speedKmh: 44,
    station: 'South Depot',
  },
  {
    id: 'AMB-005',
    registration: 'MH-12-EM-1190',
    driver: 'Imran Shaikh',
    status: 'Returning',
    lat: 18.5246,
    lng: 73.8695,
    nodeId: 'S8',
    equipment: ['ALS'],
    speedKmh: 40,
    station: 'East Loop',
  },
  {
    id: 'AMB-006',
    registration: 'MH-12-EM-5521',
    driver: 'Kavita Jadhav',
    status: 'Maintenance',
    lat: 18.5142,
    lng: 73.8410,
    nodeId: 'DEPOT_WEST',
    equipment: ['BLS'],
    speedKmh: 0,
    station: 'West Depot Workshop',
  },
];

/** Graph nodes used by the optimizer (depots, signals, hospitals). */
export const NODES = {
  DEPOT_WEST: { id: 'DEPOT_WEST', lat: 18.5164, lng: 73.8421, type: 'depot', name: 'West Depot' },
  DEPOT_NORTH: { id: 'DEPOT_NORTH', lat: 18.5315, lng: 73.8479, type: 'depot', name: 'North Depot' },
  DEPOT_SOUTH: { id: 'DEPOT_SOUTH', lat: 18.5104, lng: 73.8548, type: 'depot', name: 'South Depot' },
  S1: { id: 'S1', lat: 18.5178, lng: 73.8466, type: 'signal', name: 'SIGNAL-01', road: 'FC Road / West Junction' },
  S2: { id: 'S2', lat: 18.5196, lng: 73.8514, type: 'signal', name: 'SIGNAL-02', road: 'JM Road Crossing' },
  S3: { id: 'S3', lat: 18.5218, lng: 73.8562, type: 'signal', name: 'SIGNAL-03', road: 'Ganeshkhind Arterial' },
  S4: { id: 'S4', lat: 18.5244, lng: 73.8618, type: 'signal', name: 'SIGNAL-04', road: 'University Circle' },
  S5: { id: 'S5', lat: 18.5268, lng: 73.8674, type: 'signal', name: 'SIGNAL-05', road: 'Bund Garden Approach' },
  S6: { id: 'S6', lat: 18.5192, lng: 73.8588, type: 'signal', name: 'SIGNAL-06', road: 'Central Market Junction' },
  S7: { id: 'S7', lat: 18.5226, lng: 73.8640, type: 'signal', name: 'SIGNAL-07', road: 'Station Road' },
  S8: { id: 'S8', lat: 18.5254, lng: 73.8702, type: 'signal', name: 'SIGNAL-08', road: 'Koregaon Gate' },
  S9: { id: 'S9', lat: 18.5146, lng: 73.8502, type: 'signal', name: 'SIGNAL-09', road: 'South Link / River Road' },
  S10: { id: 'S10', lat: 18.5168, lng: 73.8576, type: 'signal', name: 'SIGNAL-10', road: 'Laxmi Road East' },
  S11: { id: 'S11', lat: 18.5296, lng: 73.8544, type: 'signal', name: 'SIGNAL-11', road: 'Shivaji Nagar Circle' },
  S12: { id: 'S12', lat: 18.5272, lng: 73.8598, type: 'signal', name: 'SIGNAL-12', road: 'North Connector' },
  H_CGH: { id: 'H_CGH', lat: 18.5289, lng: 73.8741, type: 'hospital', name: 'City General Hospital' },
  H_RTC: { id: 'H_RTC', lat: 18.5118, lng: 73.8452, type: 'hospital', name: 'Riverside Trauma Center' },
  H_MHI: { id: 'H_MHI', lat: 18.5352, lng: 73.8518, type: 'hospital', name: 'Metro Heart Institute' },
  H_UMC: { id: 'H_UMC', lat: 18.5086, lng: 73.8624, type: 'hospital', name: 'University Medical Center' },
  H_PEH: { id: 'H_PEH', lat: 18.5224, lng: 73.8688, type: 'hospital', name: 'Pediatric Emergency Hospital' },
};

/**
 * Directed edges. distanceKm is road distance, baseSpeedKmh is free-flow,
 * trafficSeed is the starting density (0-100).
 */
export const EDGES = [
  { id: 'E01', from: 'DEPOT_WEST', to: 'S1', distanceKm: 0.55, baseSpeedKmh: 38, trafficSeed: 42, road: 'Depot Approach' },
  { id: 'E02', from: 'S1', to: 'S2', distanceKm: 0.62, baseSpeedKmh: 36, trafficSeed: 58, road: 'FC Road Eastbound' },
  { id: 'E03', from: 'S2', to: 'S3', distanceKm: 0.61, baseSpeedKmh: 34, trafficSeed: 71, road: 'JM Road' },
  { id: 'E04', from: 'S3', to: 'S4', distanceKm: 0.72, baseSpeedKmh: 40, trafficSeed: 48, road: 'Ganeshkhind Arterial' },
  { id: 'E05', from: 'S4', to: 'S5', distanceKm: 0.68, baseSpeedKmh: 37, trafficSeed: 64, road: 'University Corridor' },
  { id: 'E06', from: 'S5', to: 'H_CGH', distanceKm: 0.78, baseSpeedKmh: 32, trafficSeed: 55, road: 'Hospital Approach' },
  { id: 'E07', from: 'S2', to: 'S6', distanceKm: 0.82, baseSpeedKmh: 42, trafficSeed: 35, road: 'Market Bypass' },
  { id: 'E08', from: 'S6', to: 'S7', distanceKm: 0.66, baseSpeedKmh: 39, trafficSeed: 40, road: 'Station Road' },
  { id: 'E09', from: 'S7', to: 'S8', distanceKm: 0.74, baseSpeedKmh: 36, trafficSeed: 52, road: 'East Arterial' },
  { id: 'E10', from: 'S8', to: 'H_CGH', distanceKm: 0.55, baseSpeedKmh: 30, trafficSeed: 46, road: 'Koregaon to CGH' },
  { id: 'E11', from: 'S3', to: 'S7', distanceKm: 0.88, baseSpeedKmh: 41, trafficSeed: 33, road: 'Diagonal Connector' },
  { id: 'E12', from: 'S5', to: 'S8', distanceKm: 0.42, baseSpeedKmh: 28, trafficSeed: 62, road: 'Garden Link' },
  { id: 'E13', from: 'DEPOT_WEST', to: 'S9', distanceKm: 0.92, baseSpeedKmh: 44, trafficSeed: 28, road: 'River Road' },
  { id: 'E14', from: 'S9', to: 'S10', distanceKm: 0.85, baseSpeedKmh: 40, trafficSeed: 37, road: 'South Collector' },
  { id: 'E15', from: 'S10', to: 'S6', distanceKm: 0.38, baseSpeedKmh: 33, trafficSeed: 49, road: 'Market South' },
  { id: 'E16', from: 'S10', to: 'S7', distanceKm: 0.92, baseSpeedKmh: 38, trafficSeed: 44, road: 'Laxmi Extension' },
  { id: 'E17', from: 'DEPOT_NORTH', to: 'S11', distanceKm: 0.72, baseSpeedKmh: 40, trafficSeed: 31, road: 'North Spur' },
  { id: 'E18', from: 'S11', to: 'S12', distanceKm: 0.66, baseSpeedKmh: 38, trafficSeed: 45, road: 'Shivaji Connector' },
  { id: 'E19', from: 'S12', to: 'S4', distanceKm: 0.52, baseSpeedKmh: 36, trafficSeed: 50, road: 'North to University' },
  { id: 'E20', from: 'S12', to: 'S5', distanceKm: 0.88, baseSpeedKmh: 39, trafficSeed: 41, road: 'North Garden' },
  { id: 'E21', from: 'S11', to: 'H_MHI', distanceKm: 0.68, baseSpeedKmh: 30, trafficSeed: 34, road: 'Heart Institute Drive' },
  { id: 'E22', from: 'S9', to: 'H_RTC', distanceKm: 0.62, baseSpeedKmh: 32, trafficSeed: 39, road: 'Trauma Access' },
  { id: 'E23', from: 'S10', to: 'H_UMC', distanceKm: 1.05, baseSpeedKmh: 35, trafficSeed: 43, road: 'Campus Road' },
  { id: 'E24', from: 'S8', to: 'H_PEH', distanceKm: 0.38, baseSpeedKmh: 26, trafficSeed: 36, road: 'Pediatric Lane' },
  { id: 'E25', from: 'S7', to: 'H_PEH', distanceKm: 0.52, baseSpeedKmh: 28, trafficSeed: 41, road: 'Clinic Street' },
  { id: 'E26', from: 'DEPOT_SOUTH', to: 'S9', distanceKm: 0.58, baseSpeedKmh: 36, trafficSeed: 40, road: 'South to River' },
  { id: 'E27', from: 'DEPOT_SOUTH', to: 'S10', distanceKm: 0.78, baseSpeedKmh: 37, trafficSeed: 47, road: 'South Collector' },
  { id: 'E28', from: 'S4', to: 'S8', distanceKm: 0.98, baseSpeedKmh: 40, trafficSeed: 38, road: 'Express Cut' },
  { id: 'E29', from: 'S1', to: 'S9', distanceKm: 0.52, baseSpeedKmh: 34, trafficSeed: 30, road: 'West Drop' },
  { id: 'E30', from: 'S6', to: 'S4', distanceKm: 0.72, baseSpeedKmh: 35, trafficSeed: 54, road: 'Market to University' },
];

export const SIGNALS = [
  { id: 'SIG-01', nodeId: 'S1', cycleSec: 90, greenSec: 32 },
  { id: 'SIG-02', nodeId: 'S2', cycleSec: 96, greenSec: 30 },
  { id: 'SIG-03', nodeId: 'S3', cycleSec: 88, greenSec: 28 },
  { id: 'SIG-04', nodeId: 'S4', cycleSec: 100, greenSec: 34 },
  { id: 'SIG-05', nodeId: 'S5', cycleSec: 92, greenSec: 30 },
  { id: 'SIG-06', nodeId: 'S6', cycleSec: 84, greenSec: 26 },
  { id: 'SIG-07', nodeId: 'S7', cycleSec: 90, greenSec: 28 },
  { id: 'SIG-08', nodeId: 'S8', cycleSec: 86, greenSec: 24 },
  { id: 'SIG-09', nodeId: 'S9', cycleSec: 80, greenSec: 30 },
  { id: 'SIG-10', nodeId: 'S10', cycleSec: 88, greenSec: 28 },
  { id: 'SIG-11', nodeId: 'S11', cycleSec: 94, greenSec: 32 },
  { id: 'SIG-12', nodeId: 'S12', cycleSec: 90, greenSec: 30 },
];

/** Historic completed trips so analytics are meaningful on first load. */
export const HISTORIC_TRIPS = [
  { id: 'TRP-1042', ambulanceId: 'AMB-002', hospitalId: 'HOS-003', level: 'HIGH', distanceKm: 3.4, originalEtaSec: 720, optimizedEtaSec: 540, timeSavedSec: 180, status: 'Completed', startedAt: '2026-08-17T08:14:00.000Z', endedAt: '2026-08-17T08:23:00.000Z' },
  { id: 'TRP-1043', ambulanceId: 'AMB-001', hospitalId: 'HOS-001', level: 'CRITICAL', distanceKm: 4.1, originalEtaSec: 840, optimizedEtaSec: 600, timeSavedSec: 240, status: 'Completed', startedAt: '2026-08-17T11:02:00.000Z', endedAt: '2026-08-17T11:12:00.000Z' },
  { id: 'TRP-1044', ambulanceId: 'AMB-004', hospitalId: 'HOS-004', level: 'MEDIUM', distanceKm: 2.8, originalEtaSec: 540, optimizedEtaSec: 480, timeSavedSec: 60, status: 'Completed', startedAt: '2026-08-17T15:40:00.000Z', endedAt: '2026-08-17T15:48:00.000Z' },
  { id: 'TRP-1045', ambulanceId: 'AMB-003', hospitalId: 'HOS-002', level: 'HIGH', distanceKm: 3.9, originalEtaSec: 780, optimizedEtaSec: 660, timeSavedSec: 120, status: 'Completed', startedAt: '2026-08-18T06:22:00.000Z', endedAt: '2026-08-18T06:33:00.000Z' },
  { id: 'TRP-1046', ambulanceId: 'AMB-001', hospitalId: 'HOS-005', level: 'CRITICAL', distanceKm: 2.2, originalEtaSec: 480, optimizedEtaSec: 300, timeSavedSec: 180, status: 'Completed', startedAt: '2026-08-18T09:05:00.000Z', endedAt: '2026-08-18T09:10:00.000Z' },
  { id: 'TRP-1047', ambulanceId: 'AMB-002', hospitalId: 'HOS-001', level: 'HIGH', distanceKm: 4.6, originalEtaSec: 900, optimizedEtaSec: 720, timeSavedSec: 180, status: 'Completed', startedAt: '2026-08-18T13:18:00.000Z', endedAt: '2026-08-18T13:30:00.000Z' },
  { id: 'TRP-1048', ambulanceId: 'AMB-005', hospitalId: 'HOS-001', level: 'LOW', distanceKm: 1.8, originalEtaSec: 420, optimizedEtaSec: 390, timeSavedSec: 30, status: 'Completed', startedAt: '2026-08-18T16:44:00.000Z', endedAt: '2026-08-18T16:51:00.000Z' },
  { id: 'TRP-1049', ambulanceId: 'AMB-004', hospitalId: 'HOS-003', level: 'MEDIUM', distanceKm: 3.1, originalEtaSec: 660, optimizedEtaSec: 540, timeSavedSec: 120, status: 'Completed', startedAt: '2026-08-19T07:10:00.000Z', endedAt: '2026-08-19T07:19:00.000Z' },
  { id: 'TRP-1050', ambulanceId: 'AMB-001', hospitalId: 'HOS-002', level: 'CRITICAL', distanceKm: 3.6, originalEtaSec: 780, optimizedEtaSec: 510, timeSavedSec: 270, status: 'Completed', startedAt: '2026-08-19T10:28:00.000Z', endedAt: '2026-08-19T10:37:00.000Z' },
  { id: 'TRP-1051', ambulanceId: 'AMB-002', hospitalId: 'HOS-004', level: 'HIGH', distanceKm: 4.0, originalEtaSec: 810, optimizedEtaSec: 630, timeSavedSec: 180, status: 'Completed', startedAt: '2026-08-19T12:01:00.000Z', endedAt: '2026-08-19T12:12:00.000Z' },
];

export const SYSTEM_LOGS = [
  { id: 'LOG-01', level: 'info', message: 'Simulation kernel online. Demo data source active.', at: '2026-08-19T08:00:00.000Z' },
  { id: 'LOG-02', level: 'info', message: 'Traffic seed applied to 30 corridor edges.', at: '2026-08-19T08:00:02.000Z' },
  { id: 'LOG-03', level: 'warn', message: 'AMB-006 marked Maintenance — excluded from dispatch.', at: '2026-08-19T08:15:00.000Z' },
];
