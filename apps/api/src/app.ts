import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env.js';
import authPlugin from './plugins/auth.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import civilizationRoutes from './routes/civilization.js';

const PUBLIC_ROUTES = new Set(['/health', '/auth/discord']);

function isOriginAllowed(origin: string): boolean {
  if (env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
    return true;
  }

  const allowed =
    env.ACTIVITY_ALLOWED_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  if (allowed.includes(origin)) return true;
  if (allowed.includes('*')) return true;

  try {
    const { hostname } = new URL(origin);
    return allowed.some((pattern) => {
      if (pattern.startsWith('*.')) {
        const suffix = pattern.slice(1);
        return hostname.endsWith(suffix);
      }
      return false;
    });
  } catch {
    return false;
  }
}

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development',
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (isOriginAllowed(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('CORS origin not allowed'), false);
    },
    credentials: true,
  });

  await app.register(jwt, {
    secret: env.SESSION_SECRET,
  });

  await app.register(authPlugin, { publicRoutes: PUBLIC_ROUTES });

  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(meRoutes, { prefix: '/api/me' });
  await app.register(civilizationRoutes, { prefix: '/api/civilization' });

  return app;
}
