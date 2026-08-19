import { createApp, startSimulationClock } from './app.js';
import { config } from './config/env.js';

const app = createApp();
startSimulationClock();

app.listen(config.port, () => {
  console.log(`Green Corridor API listening on http://localhost:${config.port}`);
});
