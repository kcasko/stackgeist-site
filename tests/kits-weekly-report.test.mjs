import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, readFile as read } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const rootUrl = new URL('../', import.meta.url);

test('parseDays clamps to a 1-90 day window and defaults to 7', async () => {
  const { parseDays } = await import('../scripts/kits-weekly-report.mjs');
  assert.equal(parseDays([]), 7);
  assert.equal(parseDays(['--days', '7']), 7);
  assert.equal(parseDays(['--days', '0']), 1);
  assert.equal(parseDays(['--days', '9999']), 90);
  assert.equal(parseDays(['--days', 'garbage']), 7);
});

test('parseWrite recognises the --write flag with and without an explicit path', async () => {
  const { parseWrite } = await import('../scripts/kits-weekly-report.mjs');
  assert.equal(parseWrite([]), null);
  assert.deepEqual(parseWrite(['--write']), { auto: true });
  assert.deepEqual(parseWrite(['--write', '--days', '7']), { auto: true });
  assert.deepEqual(parseWrite(['--write', 'out/x.md']), { auto: false, path: 'out/x.md' });
});

test('buildSql restricts to /kits/ landings and kit-* placements inside the requested window', async () => {
  const { buildSql } = await import('../scripts/kits-weekly-report.mjs');
  const sql = buildSql(7);
  assert.match(sql, /FROM affiliate_events/);
  assert.match(sql, /page_path LIKE '\/kits\/%'/);
  assert.match(sql, /placement LIKE 'kit-%'/);
  assert.match(sql, /datetime\('now', '-7 days'\)/);
  assert.match(sql, /event_type = 'landing'/);
  assert.match(sql, /event_type = 'affiliate_click'/);
  // Clamp still applies.
  assert.match(buildSql(999), /'-90 days'/);
  assert.match(buildSql(0), /'-1 days'/);
});

test('summarize groups landings by kit slug and clicks by placement + utm_content', async () => {
  const { summarize } = await import('../scripts/kits-weekly-report.mjs');
  const summary = summarize([
    { event_type: 'landing', page_path: '/kits/help-desk-homelab-starter-kit', events: 12 },
    { event_type: 'landing', page_path: '/kits/help-desk-homelab-starter-kit/', events: 3 },
    { event_type: 'landing', page_path: '/kits/usb-c-desk-survival-kit', events: 5 },
    { event_type: 'landing', page_path: '/kits/quiet-kit', events: 4 },
    { event_type: 'landing', page_path: '/guides/something', events: 99 }, // ignored
    { event_type: 'affiliate_click', page_path: '/kits/help-desk-homelab-starter-kit', placement: 'kit-help-desk-homelab-starter-kit', utm_content: 'wd_elements', product_id: 'B0C2V1512F', events: 4 },
    { event_type: 'affiliate_click', page_path: '/kits/help-desk-homelab-starter-kit', placement: 'kit-help-desk-homelab-starter-kit', utm_content: 'tp_link_switch', product_id: '', events: 2 },
    { event_type: 'affiliate_click', page_path: '/guides/other', placement: 'kit-ghost-only-kit', utm_content: 'x', product_id: '', events: 1 },
  ]);

  assert.equal(summary.totals.landings, 24); // 15 + 5 + 4
  assert.equal(summary.totals.affiliateClicks, 7);
  assert.equal(summary.totals.kitsWithTraffic, 4);
  assert.equal(summary.totals.clickThroughRate, Number(((7 / 24) * 100).toFixed(2)));

  const help = summary.kits.find((k) => k.slug === 'help-desk-homelab-starter-kit');
  assert.equal(help.landings, 15);
  assert.equal(help.affiliateClicks, 6);
  assert.equal(help.clickThroughRate, Number(((6 / 15) * 100).toFixed(2)));
  assert.deepEqual(help.links.map((l) => l.utmContent), ['wd_elements', 'tp_link_switch']);
  assert.equal(help.links[0].productId, 'B0C2V1512F');

  assert.deepEqual(summary.quietKits.slice().sort(), ['quiet-kit', 'usb-c-desk-survival-kit']);
  assert.deepEqual(summary.ghostClicks, ['ghost-only-kit']);
});

test('renderMarkdown includes totals, per-kit table, link breakdown, quiet + ghost sections', async () => {
  const { summarize, renderMarkdown } = await import('../scripts/kits-weekly-report.mjs');
  const summary = summarize([
    { event_type: 'landing', page_path: '/kits/a-kit', events: 10 },
    { event_type: 'landing', page_path: '/kits/quiet-kit', events: 3 },
    { event_type: 'affiliate_click', page_path: '/kits/a-kit', placement: 'kit-a-kit', utm_content: 'thing_one', product_id: 'B000', events: 2 },
    { event_type: 'affiliate_click', page_path: '/kits/a-kit', placement: 'kit-ghost-kit', utm_content: 'thing_two', product_id: '', events: 1 },
  ]);
  const md = renderMarkdown(summary, { days: 7, generatedAt: '2026-09-19T12:00:00.000Z' });
  assert.match(md, /Kits weekly analytics — last 7 days/);
  assert.match(md, /Kit landings: \*\*13\*\*/);
  assert.match(md, /Kit affiliate clicks: \*\*3\*\*/);
  assert.match(md, /Per-kit breakdown/);
  assert.match(md, /`a-kit` \| 10 \| 2 \|/);
  assert.match(md, /Link clicks by kit/);
  assert.match(md, /thing_one \| B000 \| 2/);
  assert.match(md, /Quiet kits/);
  assert.match(md, /`quiet-kit`/);
  assert.match(md, /Ghost clicks/);
  assert.match(md, /`ghost-kit`/);
});

test('renderMarkdown says so when nothing is recorded', async () => {
  const { summarize, renderMarkdown } = await import('../scripts/kits-weekly-report.mjs');
  const md = renderMarkdown(summarize([]), { days: 7, generatedAt: '2026-09-19T12:00:00.000Z' });
  assert.match(md, /No kit traffic recorded/);
});

test('reportPath composes reports/weekly/YYYY-MM-DD.md relative to the site root', async () => {
  const { reportPath } = await import('../scripts/kits-weekly-report.mjs');
  const p = reportPath('/tmp/site', '2026-09-19T04:20:00.000Z');
  assert.match(p.replaceAll('\\', '/'), /\/tmp\/site\/reports\/weekly\/2026-09-19\.md$/);
});

test('main surfaces a friendly error and no secrets when Wrangler fails', async () => {
  const { main } = await import('../scripts/kits-weekly-report.mjs');
  let message = '';
  const originalError = console.error;
  console.error = (value) => { message = String(value); };
  try {
    const exit = main(
      ['--days', '7'],
      () => ({ status: 1, stderr: 'D1 offline', stdout: '' }),
      { stdout: { write: () => {} }, stderr: { write: () => {} } },
    );
    assert.equal(exit, 1);
  } finally {
    console.error = originalError;
  }
  assert.match(message, /Unable to run Wrangler D1 query/);
  assert.doesNotMatch(message, /Bearer|API token|account_id/i);
});

test('main writes a markdown report when --write is provided', async () => {
  const { main } = await import('../scripts/kits-weekly-report.mjs');
  const tmp = await mkdtemp(join(tmpdir(), 'kits-report-'));
  const target = join(tmp, 'weekly.md');
  try {
    const fakeResult = {
      status: 0,
      stdout: JSON.stringify([{
        results: [
          { event_type: 'landing', page_path: '/kits/a-kit', events: 3 },
          { event_type: 'affiliate_click', page_path: '/kits/a-kit', placement: 'kit-a-kit', utm_content: 'x', product_id: 'B0', events: 1 },
        ],
      }]),
    };
    let stdoutBuf = '';
    let stderrBuf = '';
    const exit = main(
      ['--days', '7', '--write', target],
      () => fakeResult,
      { stdout: { write: (s) => { stdoutBuf += s; } }, stderr: { write: (s) => { stderrBuf += s; } } },
    );
    assert.equal(exit, 0);
    assert.match(stdoutBuf, /Kits weekly analytics/);
    assert.match(stderrBuf, /Wrote report to/);
    const written = await read(target, 'utf8');
    assert.match(written, /`a-kit` \| 3 \| 1 \|/);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('package.json exposes the analytics:weekly script', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', rootUrl), 'utf8'));
  assert.equal(pkg.scripts['analytics:weekly'], 'node scripts/kits-weekly-report.mjs');
});
