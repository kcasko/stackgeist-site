import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

const validPayload = {
  eventType: 'affiliate_click',
  pagePath: '/gear/budget-tech/example',
  utmSource: 'pinterest',
  utmMedium: 'organic',
  utmCampaign: 'budget-tech',
  utmContent: 'pin-01',
  placement: 'product-verdict',
  productId: 'B0C2V1512F',
  schemaVersion: '1',
};

test('analytics contract accepts only bounded allowlisted event fields', async () => {
  const { validateEventPayload } = await import('../functions/api/events.ts');
  const clean = validateEventPayload({ ...validPayload, email: 'not-collected@example.com', userAgent: 'not-collected' });
  assert.deepEqual(clean, validPayload);
  assert.equal(validateEventPayload({ ...validPayload, eventType: 'page_view' }), null);
  assert.equal(validateEventPayload({ ...validPayload, pagePath: `/${'x'.repeat(300)}` }), null);
  assert.equal(validateEventPayload(null), null);
});

test('analytics endpoint rejects unsafe requests and writes accepted events', async () => {
  const { onRequest } = await import('../functions/api/events.ts');
  const points = [];
  const env = { AFFILIATE_ANALYTICS: { writeDataPoint: (point) => points.push(point) } };
  const invoke = (request) => onRequest({ request, env });

  assert.equal((await invoke(new Request('https://stackgeist.dev/api/events'))).status, 405);
  assert.equal((await invoke(new Request('https://stackgeist.dev/api/events', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' }))).status, 415);
  assert.equal((await invoke(new Request('https://stackgeist.dev/api/events', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://example.com' }, body: JSON.stringify(validPayload) }))).status, 403);
  assert.equal((await invoke(new Request('https://stackgeist.dev/api/events', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }))).status, 400);

  const response = await invoke(new Request('https://stackgeist.dev/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://stackgeist.dev' },
    body: JSON.stringify({ ...validPayload, email: 'discard-me@example.com' }),
  }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(points.length, 1);
  assert.deepEqual(points[0].blobs, Object.values(validPayload));
  assert.deepEqual(points[0].doubles, [1]);
  assert.equal(points[0].indexes.length, 1);
  assert.match(points[0].indexes[0], /^affiliate_click:\d{4}-\d{2}-\d{2}$/);
  assert.doesNotMatch(JSON.stringify(points[0]), /discard-me|email|userAgent/);
});

test('browser attribution is session-only, minimal, and loaded by both layouts', async () => {
  const source = await read('src/scripts/affiliate-attribution.ts');
  assert.match(source, /sessionStorage/);
  assert.match(source, /utm_source/);
  assert.match(source, /utm_medium/);
  assert.match(source, /utm_campaign/);
  assert.match(source, /utm_content/);
  assert.match(source, /sendBeacon/);
  assert.match(source, /keepalive:\s*true/);
  assert.match(source, /data-affiliate-link/);
  assert.match(source, /tag=deskrespawn-20/);
  assert.doesNotMatch(source, /document\.cookie|userAgent|\.referrer|localStorage/);

  const { extractProductId, readCampaign } = await import('../src/scripts/affiliate-attribution.ts');
  assert.equal(extractProductId('https://www.amazon.com/dp/B0C2V1512F?tag=deskrespawn-20'), 'B0C2V1512F');
  assert.equal(extractProductId('https://example.com/product'), '');
  assert.deepEqual(readCampaign(new URL('https://stackgeist.dev/gear?utm_source=pinterest&utm_medium=organic&utm_campaign=budget&utm_content=pin-01&email=ignored').searchParams), {
    utmSource: 'pinterest',
    utmMedium: 'organic',
    utmCampaign: 'budget',
    utmContent: 'pin-01',
  });

  for (const layout of ['src/layouts/Layout.astro', 'src/layouts/ContentLayout.astro']) {
    assert.match(await read(layout), /affiliate-attribution/);
  }
});

test('wrangler declares the affiliate analytics dataset binding', async () => {
  const wrangler = await read('wrangler.jsonc');
  assert.match(wrangler, /"binding"\s*:\s*"AFFILIATE_ANALYTICS"/);
  assert.match(wrangler, /"dataset"\s*:\s*"stackgeist_affiliate_events"/);
});

test('privacy policy accurately describes minimal session attribution', async () => {
  const privacy = await read('src/pages/privacy.astro');
  for (const token of ['sessionStorage', 'UTM source', 'UTM medium', 'UTM campaign', 'UTM content', 'CTA placement', 'product identifier', '/api/events', 'Analytics Engine']) {
    assert.match(privacy, new RegExp(token.replace('/', '\\/'), 'i'));
  }
  assert.match(privacy, /no first-party analytics cookies/i);
  assert.match(privacy, /no persistent visitor identifier/i);
  assert.doesNotMatch(privacy, /do not currently run first-party analytics/i);
});

test('aggregate report clamps its window and uses sampled-weight aggregation', async () => {
  const { buildSql, parseDays } = await import('../scripts/affiliate-report.mjs');
  assert.equal(parseDays(['--days', '30']), 30);
  assert.equal(parseDays(['--days', '0']), 1);
  assert.equal(parseDays(['--days', '999']), 365);
  assert.equal(parseDays([]), 30);
  const sql = buildSql(7);
  assert.match(sql, /stackgeist_affiliate_events/);
  assert.match(sql, /_sample_interval/);
  assert.match(sql, /INTERVAL '7' DAY/);
  assert.match(sql, /blob5 AS campaign/);
  assert.match(sql, /blob7 AS placement/);
});

test('aggregate report fails safely when credentials are missing', async () => {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/affiliate-report.mjs', '--days', '1'], {
    cwd: new URL('../', import.meta.url),
    env: { PATH: process.env.PATH },
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /CLOUDFLARE_ACCOUNT_ID.*CLOUDFLARE_API_TOKEN/);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /Bearer|token value|account value/i);

  const packageJson = JSON.parse(await read('package.json'));
  assert.equal(packageJson.scripts['analytics:report'], 'node scripts/affiliate-report.mjs');
});
