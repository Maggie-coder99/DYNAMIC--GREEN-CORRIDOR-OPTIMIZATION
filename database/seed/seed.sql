-- Sample seed for PostgreSQL / Supabase. Passwords shown here are DEMO ONLY.

INSERT INTO users (id, name, email, password_hash, role, title) VALUES
  ('USR-OP-01', 'Ananya Rao', 'operator@corridor.demo', 'demo123', 'emergency_operator', 'Emergency Dispatch Operator'),
  ('USR-TC-01', 'Vikram Shah', 'traffic@corridor.demo', 'demo123', 'traffic_control', 'Traffic Control Operator'),
  ('USR-AD-01', 'Meera Iyer', 'admin@corridor.demo', 'demo123', 'administrator', 'System Administrator');

INSERT INTO ambulances (id, registration, driver, status, lat, lng, node_id, equipment, speed_kmh, station) VALUES
  ('AMB-001', 'MH-12-EM-4401', 'Sanjay Kulkarni', 'Available', 18.5164, 73.8421, 'DEPOT_WEST', ARRAY['ALS','Defibrillator','Ventilator'], 48, 'West Depot'),
  ('AMB-002', 'MH-12-EM-4402', 'Farah Qureshi', 'Available', 18.5315, 73.8479, 'DEPOT_NORTH', ARRAY['ALS','Defibrillator'], 46, 'North Depot'),
  ('AMB-003', 'MH-12-EM-2188', 'Rohit Deshmukh', 'On Emergency', 18.5198, 73.8612, 'S6', ARRAY['BLS'], 42, 'Central Staging'),
  ('AMB-004', 'MH-12-EM-3309', 'Priya Nair', 'Available', 18.5104, 73.8548, 'DEPOT_SOUTH', ARRAY['ALS','Neonatal'], 44, 'South Depot'),
  ('AMB-005', 'MH-12-EM-1190', 'Imran Shaikh', 'Returning', 18.5246, 73.8695, 'S8', ARRAY['ALS'], 40, 'East Loop'),
  ('AMB-006', 'MH-12-EM-5521', 'Kavita Jadhav', 'Maintenance', 18.5142, 73.8410, 'DEPOT_WEST', ARRAY['BLS'], 0, 'West Depot Workshop');

INSERT INTO hospitals (id, name, short_name, lat, lng, node_id, emergency_capacity, available_beds, ed_status, specialties, address) VALUES
  ('HOS-001', 'City General Hospital', 'City General', 18.5289, 73.8741, 'H_CGH', 24, 7, 'Accepting', ARRAY['Trauma','ICU','Cardiac'], 'Bund Garden Road, Vidyapur'),
  ('HOS-002', 'Riverside Trauma Center', 'Riverside Trauma', 18.5118, 73.8452, 'H_RTC', 18, 4, 'Busy', ARRAY['Trauma','Neuro'], 'Mutha Riverfront, West Vidyapur'),
  ('HOS-003', 'Metro Heart Institute', 'Metro Heart', 18.5352, 73.8518, 'H_MHI', 12, 6, 'Accepting', ARRAY['Cardiac','ICU'], 'Shivaji Nagar Medical Cluster'),
  ('HOS-004', 'University Medical Center', 'UMC', 18.5086, 73.8624, 'H_UMC', 20, 9, 'Accepting', ARRAY['General','Pediatric'], 'University Road, South Campus'),
  ('HOS-005', 'Pediatric Emergency Hospital', 'Pediatric EH', 18.5224, 73.8688, 'H_PEH', 10, 3, 'Limited', ARRAY['Pediatric','NICU'], 'Koregaon Medical Lane');

INSERT INTO traffic_signals (id, node_id, name, road, lat, lng, state, cycle_sec, green_sec, remaining_sec, traffic_density, queue_length, estimated_delay_sec, emergency_priority) VALUES
  ('SIG-01', 'S1', 'SIGNAL-01', 'FC Road / West Junction', 18.5178, 73.8466, 'GREEN', 90, 32, 18, 42, 8, 12, FALSE),
  ('SIG-02', 'S2', 'SIGNAL-02', 'JM Road Crossing', 18.5196, 73.8514, 'RED', 96, 30, 22, 58, 10, 40, FALSE),
  ('SIG-03', 'S3', 'SIGNAL-03', 'Ganeshkhind Arterial', 18.5218, 73.8562, 'GREEN', 88, 28, 14, 71, 13, 18, FALSE),
  ('SIG-04', 'S4', 'SIGNAL-04', 'University Circle', 18.5244, 73.8618, 'YELLOW', 100, 34, 4, 48, 9, 20, FALSE),
  ('SIG-05', 'S5', 'SIGNAL-05', 'Bund Garden Approach', 18.5268, 73.8674, 'RED', 92, 30, 26, 64, 12, 44, FALSE),
  ('SIG-06', 'S6', 'SIGNAL-06', 'Central Market Junction', 18.5192, 73.8588, 'GREEN', 84, 26, 16, 40, 7, 10, FALSE),
  ('SIG-07', 'S7', 'SIGNAL-07', 'Station Road', 18.5226, 73.8640, 'RED', 90, 28, 19, 52, 9, 36, FALSE),
  ('SIG-08', 'S8', 'SIGNAL-08', 'Koregaon Gate', 18.5254, 73.8702, 'GREEN', 86, 24, 11, 46, 8, 12, FALSE),
  ('SIG-09', 'S9', 'SIGNAL-09', 'South Link / River Road', 18.5146, 73.8502, 'GREEN', 80, 30, 21, 28, 5, 8, FALSE),
  ('SIG-10', 'S10', 'SIGNAL-10', 'Laxmi Road East', 18.5168, 73.8576, 'RED', 88, 28, 17, 49, 9, 32, FALSE),
  ('SIG-11', 'S11', 'SIGNAL-11', 'Shivaji Nagar Circle', 18.5296, 73.8544, 'GREEN', 94, 32, 24, 31, 6, 9, FALSE),
  ('SIG-12', 'S12', 'SIGNAL-12', 'North Connector', 18.5272, 73.8598, 'YELLOW', 90, 30, 3, 45, 8, 16, FALSE);
