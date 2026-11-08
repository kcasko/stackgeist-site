import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'scripts/editorial-release.mjs');

function fixture(items = []) {
  const root = mkdtempSync(join(tmpdir(), 'stackgeist-editorial-'));
  mkdirSync(join(root, 'editorial', 'staged'), { recursive: true });
  mkdirSync(join(root, 'src', 'data'), { recursive: true });
  mkdirSync(join(root, 'public', 'illustrations'), { recursive: true });
  writeFileSync(join(root, 'editorial', 'queue.json'),
    JSON.stringify({ version: 1, timezone: 'America/Detroit', articles: items }, null, 2));
  writeFileSync(join(root, 'src', 'data', 'catalog.ts'),
    'export const CATALOG: Entry[] = [\n];\n');
  return root;
}
function item(slug, overrides = {}) {
  return {
    slug, status: 'approved', section: 'fixes', type: 'troubleshooting',
    topic: 'wireless', title: slug, headline: 'How to troubleshoot ' + slug,
    dek: 'Learn how to isolate the problem before replacing hardware.',
    publishDate: '2026-11-16', approvedBy: 'kcasko',
    approvedAt: '2026-11-08T10:00:00-05:00',
    assets: [], ...overrides,
  };
}
function staged(root, slug, { image = '' } = {}) {
  const p = join(root, 'editorial', 'staged', slug + '.astro');
  writeFileSync(p, '---\nimport ContentLayout from "../../layouts/ContentLayout.astro";\n---\n' +
    '<ContentLayout><h1>Fix for ' + slug + '</h1><p>Real instructions.</p>' +
    (image ? '<img src="/illustrations/' + image + '" alt="Diagram" />' : '') +
    '</ContentLayout>\n');
}
function run(root, args = []) {
  return spawnSync(process.execPath,
    [SCRIPT, '--root', root, '--today', '2026-11-16', ...args],
    { encoding: 'utf8' });
}
function cleanup(root) { rmSync(root, { recursive: true, force: true }); }

test('empty queue is a safe no-op, including when --publish is requested', () => {
  const root = fixture();
  try {
    const before = readFileSync(join(root, 'editorial', 'queue.json'), 'utf8');
    const r = run(root, ['--publish']);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /Nothing changed/);
    assert.equal(readFileSync(join(root, 'editorial', 'queue.json'), 'utf8'), before);
  } finally { cleanup(root); }
});

test('an idea never publishes, even with an early date and existing draft', () => {
  const article = item('printer-offline', { status: 'draft' });
  const root = fixture([article]);
  try {
    staged(root, article.slug);
    const r = run(root, ['--publish']);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(!existsSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro')));
  } finally { cleanup(root); }
});

test('dry run checks the approved draft but does not mutate any file', () => {
  const article = item('printer-offline');
  const root = fixture([article]);
  try {
    staged(root, article.slug);
    const before = readFileSync(join(root, 'editorial', 'queue.json'), 'utf8');
    const r = run(root, ['--dry-run']);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /Validated the staged article/);
    assert.equal(readFileSync(join(root, 'editorial', 'queue.json'), 'utf8'), before);
    assert.ok(!existsSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro')));
  } finally { cleanup(root); }
});

test('publishes exactly the earliest approved article and updates catalog', () => {
  const first = item('printer-offline', { publishDate: '2026-11-09' });
  const later = item('headphones-silent', { publishDate: '2026-11-16' });
  const root = fixture([later, first]);
  try {
    staged(root, first.slug);
    staged(root, later.slug);
    const r = run(root, ['--publish']);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(existsSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro')));
    assert.ok(!existsSync(join(root, 'src', 'pages', 'guides', 'headphones-silent.astro')));
    assert.ok(!existsSync(join(root, 'editorial', 'staged', 'printer-offline.astro')));
    const output = JSON.parse(readFileSync(join(root, 'editorial', 'queue.json'), 'utf8'));
    assert.equal(output.articles.find(x => x.slug === first.slug).status, 'published');
    assert.equal(output.articles.find(x => x.slug === later.slug).status, 'approved');
    assert.match(readFileSync(join(root, 'src', 'data', 'catalog.ts'), 'utf8'),
      /href: "\/guides\/printer-offline\/"/);
  } finally { cleanup(root); }
});

test('manual Publish Now requires exact slug and explicit approval', () => {
  const first = item('headphones-silent', { publishDate: '2027-01-04' });
  const root = fixture([first]);
  try {
    staged(root, first.slug);
    const check = run(root, ['--publish']);
    assert.equal(check.status, 0, check.stderr);
    assert.ok(!existsSync(join(root, 'src', 'pages', 'guides', 'headphones-silent.astro')));
    const manual = run(root, ['--publish', '--slug', 'headphones-silent']);
    assert.equal(manual.status, 0, manual.stderr);
    assert.ok(existsSync(join(root, 'src', 'pages', 'guides', 'headphones-silent.astro')));
    const repeat = run(root, ['--publish', '--slug', 'headphones-silent']);
    assert.notEqual(repeat.status, 0);
    assert.match(repeat.stderr, /not owner-approved/i);
  } finally { cleanup(root); }
});

test('rejects an unreviewed approval record and never creates public files', () => {
  const root = fixture([item('printer-offline', { approvedBy: '' })]);
  try {
    staged(root, 'printer-offline');
    const r = run(root, ['--publish']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /owner approval/);
    assert.ok(!existsSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro')));
  } finally { cleanup(root); }
});

test('refuses to overwrite an existing article or catalog route', () => {
  const root = fixture([item('printer-offline')]);
  try {
    staged(root, 'printer-offline');
    mkdirSync(join(root, 'src', 'pages', 'guides'), { recursive: true });
    writeFileSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro'), 'existing');
    const r = run(root, ['--publish']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Refusing to overwrite/);
    assert.equal(readFileSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro'), 'utf8'), 'existing');
  } finally { cleanup(root); }
});

test('assets must be staged and cannot replace existing illustrations', () => {
  const article = item('printer-offline', {
    assets: [{
      source: 'editorial/staged/assets/printer-offline/printer.svg',
      target: 'public/illustrations/printer.svg',
    }],
  });
  const root = fixture([article]);
  try {
    staged(root, article.slug, { image: 'printer.svg' });
    let r = run(root, ['--publish']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Missing asset/);
    mkdirSync(join(root, 'editorial', 'staged', 'assets', 'printer-offline'), { recursive: true });
    writeFileSync(join(root, article.assets[0].source), '<svg></svg>');
    r = run(root, ['--publish']);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(existsSync(join(root, article.assets[0].target)));
  } finally { cleanup(root); }
});

test('rejects malicious route traversal slugs', () => {
  const root = fixture([item('../outside')]);
  try {
    const r = run(root, ['--publish']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid article slug/);
  } finally { cleanup(root); }
});


test('future-dated approved article is still validated in pull-request checks', () => {
  const article = item('printer-offline', { publishDate: '2027-02-15' });
  const root = fixture([article]);
  try {
    const invalid = run(root, ['--validate-all']);
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /Missing staged article/);
    staged(root, article.slug);
    const valid = run(root, ['--validate-all']);
    assert.equal(valid.status, 0, valid.stderr);
    assert.match(valid.stdout, /validation passed for 1 article/);
    assert.ok(!existsSync(join(root, 'src', 'pages', 'guides', 'printer-offline.astro')));
  } finally { cleanup(root); }
});


test('post-build verification catches missing pages, sitemap entries and images', () => {
  const root = fixture([item('printer-offline')]);
  try {
    staged(root, 'printer-offline');
    assert.equal(run(root, ['--publish']).status, 0);
    const verify = () => spawnSync(process.execPath,
      [join(process.cwd(), 'scripts/editorial-verify-build.mjs'), '--slug', 'printer-offline'],
      { cwd: root, encoding: 'utf8' });
    let result = verify();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /was not generated/);
    const dir = join(root, 'dist', 'guides', 'printer-offline');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'),
      '<html><body><h1>Printer fix</h1><img src="/illustrations/printer.svg" /></body></html>');
    writeFileSync(join(root, 'dist', 'sitemap.xml'), '<loc>https://stackgeist.dev/guides/printer-offline/</loc>');
    result = verify();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Broken publication images/);
    mkdirSync(join(root, 'dist', 'illustrations'), { recursive: true });
    writeFileSync(join(root, 'dist', 'illustrations', 'printer.svg'), '<svg/>');
    result = verify();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /BUILD VERIFIED/);
  } finally { cleanup(root); }
});
