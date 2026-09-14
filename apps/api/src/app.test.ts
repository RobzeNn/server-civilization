import { afterAll, beforeAll, describe, expect, it } from 'vitest';

async function loadApp() {
  process.env.NODE_ENV = 'test';
  process.env.SESSION_SECRET = 'test-session-secret-at-least-32-characters-long';
  process.env.DISCORD_CLIENT_ID = 'test-client-id';
  process.env.DISCORD_CLIENT_SECRET = 'test-client-secret';
  process.env.DISCORD_OAUTH_REDIRECT_URI = 'https://example.com/callback';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';

  const { buildApp } = await import('./app.js');
  return buildApp();
}

describe('API', () => {
  let app: Awaited<ReturnType<typeof loadApp>>;

  beforeAll(async () => {
    app = await loadApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /health returns ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok', version: '0.1.0-test' });
  });
});
