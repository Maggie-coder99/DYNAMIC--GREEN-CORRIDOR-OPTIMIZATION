import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config/env.js';
import { publicRouter } from './routes/public.js';
import { authRouter } from './routes/auth.js';
import { fleetRouter } from './routes/fleet.js';
import { opsRouter } from './routes/ops.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { store } from './models/store.js';
import { tickSimulation } from './services/simulationService.js';

const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          workerSrc: ["'self'", 'blob:'],
        },
      },
    }),
  );
  const corsOrigin =
    config.nodeEnv === 'production' && config.frontendOrigin
      ? config.frontendOrigin.split(',').map((s) => s.trim())
      : true;
  app.use(
    cors({
      origin: corsOrigin,
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

  app.use('/api', publicRouter);
  app.use('/api/auth', authRouter);
  app.use('/api', fleetRouter);
  app.use('/api', opsRouter);

  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      return res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

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
