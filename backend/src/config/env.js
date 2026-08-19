import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../../.env', import.meta.url) });
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '8h',
  databaseUrl: process.env.DATABASE_URL || '',
  mapboxSecret: process.env.MAPBOX_SECRET_TOKEN || '',
};
