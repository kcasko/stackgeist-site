import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('shared layouts provide a keyboard skip link and pages expose a named main target', async () => {
  for (const path of ['src/layouts/Layout.astro', 'src/layouts/ContentLayout.astro']) {
    assert.match(await read(path), /class="skip-link"/);
  }
  assert.match(await read('src/layouts/ContentLayout.astro'), /id="main-content"/);
  assert.match(await read('src/pages/index.astro'), /id="main-content"/);
});

test('homepage has a semantic primary heading', async () => {
  assert.match(await read('src/pages/index.astro'), /<h1\b/);
});

test('interactive mind map is not hidden from assistive technology', async () => {
  const source = await read('src/components/MindMap.astro');
  assert.doesNotMatch(source, /<pre[^>]*aria-hidden="true"[^>]*>[\s\S]*?<button/);
  assert.match(source, /aria-controls=/);
});

test('mobile menu exposes state, relationship, and focus-safe close behavior', async () => {
  const source = await read('src/components/Header.astro');
  assert.match(source, /aria-controls="mobile-menu"/);
  assert.match(source, /id="mobile-menu"/);
  assert.match(source, /Close menu/);
  assert.match(source, /toggle\.focus\(\)/);
});

test('budget catalog includes search, filtering, status, and section jumps', async () => {
  const source = await read('src/pages/gear/budget-tech/index.astro');
  for (const token of ['data-catalog-search', 'data-catalog-filter', 'data-catalog-status', 'catalog-jumps', 'data-catalog-card']) {
    assert.match(source, new RegExp(token));
  }
});

test('Logitech page uses the catalog image and decision jump navigation', async () => {
  const source = await read('src/pages/gear/budget-tech/logitech-c920x-hd-webcam.astro');
  assert.match(source, /71YN85pLGcL/);
  assert.doesNotMatch(source, /71YmyIWpVOL/);
  assert.match(source, /class="decision-nav"/);
  for (const id of ['verdict', 'specs', 'compatibility', 'alternatives', 'buy-or-skip']) {
    assert.match(source, new RegExp(`id="${id}"`));
  }
});

test('content CSS constrains prose and preserves mobile intent context', async () => {
  const content = await read('src/styles/content.css');
  const map = await read('src/components/MindMap.astro');
  assert.match(content, /max-width:\s*76ch/);
  assert.doesNotMatch(map, /\.node-intent,\s*\.leaf-note\s*\{\s*display:\s*none/);
});
