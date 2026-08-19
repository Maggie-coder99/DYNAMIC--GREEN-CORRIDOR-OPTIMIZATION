# Demo guide

1. `npm install` at the repository root.
2. Copy `.env.example` to `.env`.
3. `npm run dev` — API on `:4000`, UI on `:5173`.
4. Open the landing page → **Launch Dashboard**.
5. Sign in as `operator@corridor.demo` / `demo123` / Emergency operator.
6. Click **Start Demo Emergency**.

## Scripted scenario (automatic)

1. AMB-001 dispatched CRITICAL to City General Hospital.
2. Optimizer scores competing paths; best route is selected.
3. Green corridor activates; SIGNAL-01… move to emergency green as the vehicle approaches.
4. After ~18 seconds a congestion spike is applied to the primary edges.
5. If another path is sufficiently faster, the amber banner **Alternative route detected** appears.
6. Click **Switch Route** or let the vehicle continue.
7. On arrival the trip is completed and analytics / history update.

All map layers and KPIs are labeled **Simulation / Demo Data**.
