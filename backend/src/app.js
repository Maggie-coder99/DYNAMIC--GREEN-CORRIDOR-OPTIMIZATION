import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { fleetRouter } from './routes/fleet.js';
import { opsRouter } from './routes/ops.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { store } from './models/store.js';
import { tickSimulation } from './services/simulationService.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: config.frontendOrigin.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '200kb' }));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 240,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests', code: 'RATE_LIMIT' },
    }),
  );

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'green-corridor-api',
      demoMode: true,
      database: config.databaseUrl ? 'postgres' : 'seed-store',
      time: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api', fleetRouter);
  app.use('/api', opsRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export function startSimulationClock() {
  const timer = setInterval(() => {
    const sim = store.simulation();
    if (sim.running && !sim.paused) tickSimulation(store);
  }, 1000);
  if (typeof timer.unref === 'function') timer.unref();
  return timer;
}
