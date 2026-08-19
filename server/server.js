import { createApp, startSimulationClock } from './app.js';
import { config } from './config/env.js';

const app = createApp();
startSimulationClock();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Pulse Corridor website listening on http://0.0.0.0:${config.port}`);
});
