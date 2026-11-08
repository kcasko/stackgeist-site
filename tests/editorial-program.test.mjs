import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const current = [
  'logitech-brio-not-detected-windows-11',
  'usb-c-hub-ethernet-works-hdmi-doesnt',
  'microsd-card-not-detected',
  'mx-master-3s-scroll-wheel-not-working',
  'keychron-v6-max-bluetooth-not-connecting',
  'laptop-charger-wattage',
  'govee-strip-lights-not-connecting-wifi',
  'benq-screenbar-flickering',
  'office-chair-gas-cylinder-replacement',
];

test('every current-batch guide has substantive diagnostic detail and sources', { skip: !existsSync('dist') }, () => {
  for (const slug of current) {
    const html = readFileSync('dist/guides/' + slug + '/index.html', 'utf8');
    assert.ok(!html.includes('Editorial deep dive'), slug + ' still has machine-written editorial scaffold');
    assert.ok(html.match(/<h2/), slug + ' missing useful sections');
    assert.ok(html.includes('Sources'), slug + ' missing authoritative sources');
    assert.ok(html.includes('2026-11-08'), slug + ' missing current editorial date');
  }
});

test('original diagrams are present and never represented as real screenshots', { skip: !existsSync('dist') }, () => {
  const diagrams = [
    'webcam-detection-branches.svg',
    'usb-c-data-versus-video.svg',
    'microsd-read-only-triage.svg',
  ];
  for (const file of diagrams) {
    const path = 'dist/illustrations/' + file;
    assert.ok(existsSync(path), file);
    const data = readFileSync(path, 'utf8');
    assert.match(data, /<svg\b/);
    assert.match(data, /role="img"/);
  }
});

test('editorial ledger has unique routes and distinguishes pending from completed', () => {
  const { items } = JSON.parse(readFileSync('reports/editorial-expansion-inventory.json', 'utf8'));
  assert.ok(items.length >= 100);
  assert.equal(new Set(items.map(i => i.route)).size, items.length);
  for (const slug of current) {
    assert.equal(items.find(i => i.route === '/guides/' + slug + '/')?.status, 'expanded-current-batch');
  }
  assert.ok(items.some(i => i.status === 'source-verification-required'));
  assert.ok(items.some(i => i.status === 'needs-editorial-review'));
});
