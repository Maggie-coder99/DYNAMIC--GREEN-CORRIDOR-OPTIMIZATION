-- Dynamic Green Corridor Optimization for Ambulance
-- PostgreSQL schema (production / Supabase). The demo API uses an equivalent in-memory seed store.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('emergency_operator', 'traffic_control', 'administrator')),
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ambulances (
  id TEXT PRIMARY KEY,
  registration TEXT UNIQUE NOT NULL,
  driver TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Available', 'On Emergency', 'Returning', 'Maintenance')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  node_id TEXT NOT NULL,
  equipment TEXT[] NOT NULL DEFAULT ARRAY['BLS'],
  speed_kmh INTEGER NOT NULL DEFAULT 40,
  station TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  node_id TEXT NOT NULL,
  emergency_capacity INTEGER NOT NULL,
  available_beds INTEGER NOT NULL,
  ed_status TEXT NOT NULL,
  specialties TEXT[] NOT NULL,
  address TEXT
);

CREATE TABLE traffic_signals (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL,
  name TEXT NOT NULL,
  road TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('RED', 'YELLOW', 'GREEN', 'EMERGENCY_GREEN')),
  cycle_sec INTEGER NOT NULL,
  green_sec INTEGER NOT NULL,
  remaining_sec INTEGER NOT NULL,
  traffic_density INTEGER NOT NULL CHECK (traffic_density BETWEEN 0 AND 100),
  queue_length INTEGER NOT NULL DEFAULT 0,
  estimated_delay_sec INTEGER NOT NULL DEFAULT 0,
  emergency_priority BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE traffic_data (
  id SERIAL PRIMARY KEY,
  edge_id TEXT NOT NULL,
  from_node TEXT NOT NULL,
  to_node TEXT NOT NULL,
  road TEXT,
  distance_km NUMERIC(6,2) NOT NULL,
  base_speed_kmh INTEGER NOT NULL,
  traffic_density INTEGER NOT NULL,
  average_speed NUMERIC(5,1) NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE emergency_trips (
  id TEXT PRIMARY KEY,
  ambulance_id TEXT NOT NULL REFERENCES ambulances(id),
  hospital_id TEXT NOT NULL REFERENCES hospitals(id),
  emergency_level TEXT NOT NULL CHECK (emergency_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  start_node TEXT NOT NULL,
  goal_node TEXT NOT NULL,
  distance_km NUMERIC(6,2),
  original_eta_sec INTEGER,
  optimized_eta_sec INTEGER,
  time_saved_sec INTEGER,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ
);

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  trip_id TEXT REFERENCES emergency_trips(id) ON DELETE CASCADE,
  score NUMERIC(10,3) NOT NULL,
  edge_ids TEXT[] NOT NULL,
  node_ids TEXT[] NOT NULL,
  travel_time_sec INTEGER NOT NULL,
  is_selected BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE trip_events (
  id SERIAL PRIMARY KEY,
  trip_id TEXT REFERENCES emergency_trips(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_trips_started ON emergency_trips (started_at DESC);
CREATE INDEX idx_traffic_edge ON traffic_data (edge_id);
CREATE INDEX idx_signals_state ON traffic_signals (state);
