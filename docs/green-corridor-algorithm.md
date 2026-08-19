# Green corridor algorithm

Goal: create a **moving** corridor, not a city-wide green wash.

## Inputs

- Ambulance lat/lng and speed
- Ordered signal nodes on the selected route
- Already-passed nodes
- Emergency priority

## Lookahead window

| Priority | Lookahead | Max simultaneous emergency-green |
| --- | --- | --- |
| CRITICAL | 900 m | 3 |
| HIGH | 700 m | 2 |
| MEDIUM | 500 m | 2 |
| LOW | 350 m | 1 |

Only signals **ahead** of the vehicle and **inside** the lookahead are switched to `EMERGENCY_GREEN`.

Activation is staggered (`activationDelaySec = order * 6`) and each signal has an estimated clearance time (`eta + 12s`).

When the ambulance passes a node, that signal leaves the window and resumes its normal red/yellow/green cycle.

## Outputs

Returned as `corridorPlan`:

- `activate[]` with distance, ETA, priority order, clearance estimate
- `upcoming[]` remaining intersections

This is the behavior demonstrated by **Start Demo Emergency**.
