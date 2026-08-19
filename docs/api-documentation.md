# API documentation

Base URL (local): `http://localhost:4000`

All routes except `/api/health` and `/api/auth/*` require `Authorization: Bearer <jwt>`.

## Auth

| Method | Path | Body |
| --- | --- | --- |
| POST | `/api/auth/login` | `{ email, password, role? }` |
| GET | `/api/auth/demo-accounts` | |

## Fleet

| Method | Path |
| --- | --- |
| GET/POST | `/api/ambulances` |
| GET/POST | `/api/hospitals` |
| GET | `/api/signals` |
| POST | `/api/signals/:id/override` `{ state }` |
| GET | `/api/traffic` |
| GET | `/api/trips` query: `q, level, sort, dir, page, pageSize` |

## Operations

| Method | Path |
| --- | --- |
| GET | `/api/state` live simulation snapshot |
| POST | `/api/emergencies` `{ ambulanceId, hospitalId, level }` |
| GET | `/api/emergencies` |
| POST | `/api/demo/start` |
| POST | `/api/green-corridor/activate` |
| POST | `/api/green-corridor/deactivate` |
| POST | `/api/routes/optimize` `{ startNode, goalNode, level }` |
| POST | `/api/simulation/pause` resume / tick / recalculate / switch-route / end / reset |
| GET | `/api/analytics` |
| GET | `/api/logs` (administrator) |
| GET | `/api/notifications` |

Errors return `{ error, code }` without stack traces. Validation failures use HTTP 400 and `VALIDATION_ERROR`.
