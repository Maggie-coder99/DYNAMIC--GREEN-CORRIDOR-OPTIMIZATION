import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, startSimulationClock } from './app.js';
import { config } from './config/env.js';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (!fs.existsSync(dist)) {
  console.warn('dist/ is missing. Run npm run build so the website is served with the API.');
}

const app = createApp();
startSimulationClock();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Pulse Corridor listening on http://0.0.0.0:${config.port}`);
  console.log(`Health check: http://127.0.0.1:${config.port}/api/health`);
});
