# Route optimization

The optimizer does **not** pick the geographically shortest path.

## Graph

The city is a directed graph of depots, signalized intersections, and hospitals (`server/data/city.js`). Because the demo graph is small, the engine enumerates **all simple paths** (depth-limited) and scores them. This is easy to replace with Dijkstra / A* on a larger network.

## Score (lower is better)

```
score =
  (travelTimeMinutes * 0.40 * priorityMultiplier)
  + (averageTrafficDensity * 0.25)
  + (signalDelaySeconds / 30 * 0.20)
  + (distanceKm * 8 * 0.15)
```

Priority multipliers:

- CRITICAL 1.35
- HIGH 1.20
- MEDIUM 1.05
- LOW 1.00

Travel time itself already includes a congestion speed factor:

```
speed = baseSpeed * (1 - density/100 * 0.58)
```

plus estimated stop delay at red/yellow signals. Emergency-green signals contribute almost no delay.

## Recalculation

Every simulation tick re-scores paths from the trip origin to the hospital under **current** densities. If another candidate is at least ~12% faster, the API exposes it as `simulation.alternative` and the UI offers **Switch Route**.
