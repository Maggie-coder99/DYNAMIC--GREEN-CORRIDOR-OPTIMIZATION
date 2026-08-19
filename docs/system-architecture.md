# System architecture

This project is an **academic software simulation**. It does not control real ambulances or municipal traffic signals.

```
User (Operator / Traffic Control / Admin)
        │
        ▼
React + Vite frontend (Pulse Corridor UI)
        │  REST JSON  (optional future: Socket.IO)
        ▼
Express API
        ├── Auth (JWT demo login)
        ├── Fleet (ambulances, hospitals, signals)
        ├── Simulation kernel (timer tick)
        ├── Optimization engine
        │       ├── Route scorer (time, traffic, delay, distance)
        │       └── Green corridor windowing
        └── Seeded data store  (PostgreSQL schema provided for production)
                │
                ▼
        Map tiles (CARTO / OSM, optional Mapbox via env)
```

## Simulation loop

```
Ambulance simulation tick (1s)
    → update traffic densities (random walk + demo spike)
    → move ambulance along selected polyline
    → update ETA / distance remaining
    → green corridor: activate only signals inside lookahead
    → re-score alternative paths
    → notify operator if a better route appears
    → complete trip at destination
```

## Roles

| Role | Access |
| --- | --- |
| Emergency operator | Dispatch, corridor, map, ETA |
| Traffic control | Signal board, manual simulated overrides |
| Administrator | Analytics, history, logs, fleet |

## Future ML hook

`server/algorithms/routeOptimizer.js` is intentionally isolated. A later Python (FastAPI) service could replace `estimateTravelTimeSec` with a learned travel-time model without rewriting the UI.
