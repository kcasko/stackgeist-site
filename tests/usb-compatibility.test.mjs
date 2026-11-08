import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('USB-C compatibility checker page exists and uses the site layout', async () => {
  const source = await read('src/pages/tools/usb-c-compatibility/index.astro');
  assert.match(source, /import Layout from/);
  assert.match(source, /UsbCompatibilityChecker/);
  assert.match(source, /<h1[^>]*>/);
  assert.match(source, /USB-C dock and monitor compatibility checker/);
  assert.match(source, /<Layout\s/);
});

test('USB-C compatibility checker component exposes a complete form without requiring an account', async () => {
  const source = await read('src/components/UsbCompatibilityChecker.astro');

  // Form controls for required inputs.
  assert.match(source, /name="usbType"/);
  assert.match(source, /name="dpAltMode"/);
  assert.match(source, /name="displayCount"/);
  assert.match(source, /name="os"/);
  assert.match(source, /name="pdWatts"/);

  // Result container and references.
  assert.match(source, /id="usb-compat-result"/);
  assert.match(source, /id="usb-compat-summary"/);
  assert.match(source, /id="usb-compat-recommendations"/);
  assert.match(source, /id="usb-compat-references"/);

  // No email, login, or account prompt.
  assert.doesNotMatch(source, /type="email"/i);
  assert.doesNotMatch(source, /sign in|sign up|log in|create account/i);

  // Accessibility basics.
  assert.match(source, /aria-labelledby="usb-compat-title"/);
  assert.match(source, /<label/);
  assert.match(source, /<fieldset/);
  assert.match(source, /<legend/);
});

test('USB-C compatibility checker is catalogued and indexable', async () => {
  const catalog = await read('src/data/catalog.ts');
  assert.match(catalog, /\/tools\/usb-c-compatibility\//);
  assert.match(catalog, /USB-C dock and monitor compatibility checker/);
});

test('USB-C compatibility checker explains limits and does not guarantee merchant compatibility', async () => {
  const page = await read('src/pages/tools/usb-c-compatibility/index.astro');
  const component = await read('src/components/UsbCompatibilityChecker.astro');

  // The tool must not promise universal compatibility.
  assert.match(page, /What it does not do/);
  assert.match(page, /does not store a laptop database/);
  assert.match(component, /cannot guarantee/);
  assert.match(component, /manufacturer specs/);

  // References to credible sources.
  assert.match(component, /usb\.org/);
  assert.match(component, /displayport\.org/);
});

test('USB-C tool links directly to canonical non-redirected content', async () => {
  const page = await read('src/pages/tools/usb-c-compatibility/index.astro');
  const redirects = await read('public/_redirects');
  const redirected = new Set([...redirects.matchAll(/^([^\s#]+)\s+[^\s]+\s+30[128]/gm)].map((match) => match[1]));
  const hrefs = [...page.matchAll(/href="(\/[^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    assert.ok(!redirected.has(href), `Tool should link directly instead of through redirect: ${href}`);
  }
});
