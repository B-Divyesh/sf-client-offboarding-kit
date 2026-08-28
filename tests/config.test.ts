import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('production delivery configuration', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));

  it('sets security policies as response headers', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
  });

  it('sets immutable caching only for hashed assets', () => {
    const assets = config.routes.find((route: { route: string }) => route.route === '/assets/*');
    const serviceWorker = config.routes.find((route: { route: string }) => route.route === '/sw.js');
    expect(assets.headers['Cache-Control']).toContain('immutable');
    expect(serviceWorker.headers['Cache-Control']).toContain('no-store');
  });

  it('sets the manifest MIME type and real 404 response', () => {
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    expect(config.routes.find((route: { route: string }) => route.route === '/404.html').statusCode).toBe(404);
  });

  it('lists every app route explicitly', () => {
    const routes = config.routes.map((route: { route: string }) => route.route);
    expect(routes).toEqual(expect.arrayContaining(['/demo', '/packet/engagement', '/packet/assets', '/packet/access-tasks', '/packet/support', '/packet/acknowledgement', '/packet/export']));
  });

  it('does not precache a URL that intentionally responds with 404', () => {
    const serviceWorker = readFileSync('public/sw.js', 'utf8');
    expect(serviceWorker).not.toContain("'/404.html'");
  });
});
