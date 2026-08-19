# Database design

See `database/schema/schema.sql` and `database/seed/seed.sql`.

## Entities

- **users** — demo operators and roles
- **ambulances** — fleet, status, last known point
- **hospitals** — destination capacity
- **traffic_signals** — intersection state machine
- **traffic_data** — per-edge density samples
- **emergency_trips** — dispatch records, ETAs, time saved
- **routes** — scored candidates for a trip
- **trip_events** / **notifications** — audit and operator alerts

## Runtime used by the prototype

The Express API ships with a **seeded in-memory store** (`server/models/store.js`) so `npm run dev` works without installing PostgreSQL. The SQL files match that model for Supabase / Railway when you are ready to persist.

Set `DATABASE_URL` only after you implement a `pg` adapter; the current version documents the schema rather than requiring a live cluster.
