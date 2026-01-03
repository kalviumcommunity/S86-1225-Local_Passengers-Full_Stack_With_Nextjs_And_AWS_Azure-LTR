import { fetch } from 'undici';

const DEPLOY_URL = process.env.DEPLOY_URL || 'http://localhost:5174';

describe('Smoke tests - Health endpoint', () => {
  test('GET /api/health returns 200 and ok', async () => {
    const res = await fetch(`${DEPLOY_URL}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
    expect(body.status === 'ok' || body.success === true).toBeTruthy();
  }, 20000);
});
