import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { buildSql as buildAffiliateSql } from '../scripts/affiliate-report.mjs';
import { buildSql as buildKitSql } from '../scripts/kits-weekly-report.mjs';

test('report SQL preserves untagged activity and filters synthetic traffic', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(`CREATE TABLE affiliate_events (
      event_type TEXT, page_path TEXT, utm_source TEXT, utm_medium TEXT,
      utm_campaign TEXT, utm_content TEXT, placement TEXT,
      product_id TEXT, created_at TEXT
    )`);
    const add = db.prepare(`INSERT INTO affiliate_events
      (event_type, page_path, utm_source, utm_medium, utm_campaign,
       utm_content, placement, product_id, created_at)
      VALUES (?, ?, ?, ?, NULL, ?, ?, NULL, datetime('now'))`);
    add.run('landing', '/kits/dual-monitor-desk-kit/', null, null, null, null);
    add.run('affiliate_click', '/kits/dual-monitor-desk-kit/', null, null, null, 'kit-dual-monitor-desk-kit');
    add.run('landing', '/guides/usb-c-dock-only-one-monitor/', null, null, null, null);
    add.run('landing', '/kits/dual-monitor-desk-kit/', 'hermes', null, null, null);
    add.run('affiliate_click', '/kits/dual-monitor-desk-kit/', null, 'verification', null, 'kit-dual-monitor-desk-kit');
    add.run('affiliate_click', '/kits/dual-monitor-desk-kit/', null, null, 'synthetic_smoke', 'kit-dual-monitor-desk-kit');

    const all = db.prepare(buildAffiliateSql(7)).all();
    assert.equal(all.reduce((sum, row) => sum + row.events, 0), 3);
    assert.equal(all.filter((row) => row.event_type === 'affiliate_click').reduce((sum, row) => sum + row.events, 0), 1);

    const kits = db.prepare(buildKitSql(7)).all();
    assert.equal(kits.filter((row) => row.event_type === 'landing').reduce((sum, row) => sum + row.events, 0), 1);
    assert.equal(kits.filter((row) => row.event_type === 'affiliate_click').reduce((sum, row) => sum + row.events, 0), 1);
  } finally {
    db.close();
  }
});

test('kit search links use an honest action label', async () => {
  const component = await readFile(new URL('../src/components/IncomeKitPage.astro', import.meta.url), 'utf8');
  assert.match(component, /Browse options on Amazon/);
  assert.doesNotMatch(component, /Check Price on Amazon/);
});

test('USB-C checker never guesses a port class bandwidth or guaranteed display count', async () => {
  const source = await readFile(new URL('../src/components/UsbCompatibilityChecker.astro', import.meta.url), 'utf8');
  assert.match(source, /Compatibility is not confirmed/);
  assert.match(source, /maximum external-display count/);
  assert.match(source, /DisplayLink adapter only after confirming driver support/);
  assert.doesNotMatch(source, /maxDpBw|dpBandwidth|nativeDisplays|nativeBandwidth|All \\u0024\\{displays.length\\} display/);
  assert.doesNotMatch(source, /dpVersion: "hbr[23]"|dpLanes: 4/);
});
