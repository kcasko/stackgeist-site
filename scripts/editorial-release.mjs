#!/usr/bin/env node
/**
 * Fail-closed, one-article-per-run release tool for StackGeist.
 * Drafts live outside src/pages and public until an approved release is due.
 * Usage:
 *   node scripts/editorial-release.mjs --dry-run
 *   node scripts/editorial-release.mjs --publish
 *   node scripts/editorial-release.mjs --publish --slug printer-offline-windows-11
 * Tests may override --root and --today; production uses America/Detroit.
 */
import {
  readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync,
  unlinkSync, appendFileSync, statSync,
} from 'node:fs';
import { resolve, join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE = 'editorial/queue.json';
const CATALOG = 'src/data/catalog.ts';
const PREFIXES = {
  fixes: 'src/pages/guides',
  labs: 'src/pages/labs',
  learning: 'src/pages/certs',
  gear: 'src/pages/gear',
};
const TYPES = new Set([
  'troubleshooting', 'topic', 'buying-guide',
  'lab', 'lab-hardware', 'certification', 'course-review', 'study-log', 'product',
]);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message) { throw new Error(message); }
function requireText(value, name) {
  if (typeof value !== 'string' || !value.trim()) fail(name + ' must not be empty');
  return value.trim();
}
function checkDate(value, name) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) fail(name + ' must be YYYY-MM-DD');
  const date = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    fail(name + ' is not a real calendar date');
  }
}
function checkISO(value, name) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value) ||
      !Number.isFinite(Date.parse(value))) fail(name + ' requires an ISO timestamp');
}
function inside(root, rel) {
  if (typeof rel !== 'string' || rel.includes('\\') ||
      rel.startsWith('/') || rel.split('/').includes('..')) fail('Unsafe path: ' + rel);
  const p = resolve(root, rel);
  if (!p.startsWith(resolve(root) + sep)) fail('Path outside repository: ' + rel);
  return p;
}
function displayDate(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(now).map(part => [part.type, part.value]),
  );
  return parts.year + '-' + parts.month + '-' + parts.day;
}
function parseArgs(argv) {
  const opts = { root: DEFAULT_ROOT, dryRun: true, validateAll: false, today: displayDate(), slug: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--validate-all') opts.validateAll = true;
    else if (a === '--publish') opts.dryRun = false;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--root') opts.root = resolve(requireText(argv[++i], '--root'));
    else if (a === '--today') { opts.today = requireText(argv[++i], '--today'); checkDate(opts.today, '--today'); }
    else if (a === '--slug') opts.slug = requireText(argv[++i], '--slug');
    else fail('Unknown argument: ' + a);
  }
  if (opts.slug && !SLUG_RE.test(opts.slug)) fail('Article slug must be lowercase kebab-case');
  return opts;
}
function load(root) {
  const queue = JSON.parse(readFileSync(inside(root, QUEUE), 'utf8'));
  if (queue.version !== 1 || !Array.isArray(queue.articles)) fail('Invalid editorial queue structure');
  const slugs = new Set();
  for (const entry of queue.articles) {
    if (!entry || typeof entry !== 'object' || !SLUG_RE.test(entry.slug)) fail('Invalid article slug');
    if (slugs.has(entry.slug)) fail('Duplicate article slug: ' + entry.slug);
    slugs.add(entry.slug);
    if (!['idea', 'research', 'draft', 'review', 'approved', 'published'].includes(entry.status)) {
      fail('Invalid status for ' + entry.slug);
    }
    if (entry.status === 'approved') {
      if (!Object.hasOwn(PREFIXES, entry.section)) fail('Invalid section for ' + entry.slug);
      if (!TYPES.has(entry.type)) fail('Invalid catalog type for ' + entry.slug);
      for (const field of ['topic', 'title', 'headline', 'dek']) {
        requireText(entry[field], entry.slug + '.' + field);
      }
      checkDate(entry.publishDate, entry.slug + '.publishDate');
      if (entry.approvedBy !== 'kcasko') fail(entry.slug + ' requires explicit owner approval by kcasko');
      checkISO(entry.approvedAt, entry.slug + '.approvedAt');
      if (entry.approvedAt.slice(0, 10) > displayDate()) {
        fail(entry.slug + ' has future approval timestamp');
      }
      if (entry.assets != null && !Array.isArray(entry.assets)) fail('Assets must be an array');
    }
  }
  return queue;
}
function expectedPaths(entry) {
  const source = 'editorial/staged/' + entry.slug + '.astro';
  const target = PREFIXES[entry.section] + '/' + entry.slug + '.astro';
  const catalogHref = '/' + PREFIXES[entry.section].replace('src/pages/', '') + '/' + entry.slug + '/';
  return { source, target, catalogHref };
}
function validateAssets(root, entry) {
  const result = [];
  for (const asset of entry.assets ?? []) {
    if (!asset || !SLUG_RE.test(entry.slug)) fail('Invalid asset configuration');
    const { source, target } = asset;
    if (typeof source !== 'string' || !source.startsWith('editorial/staged/assets/' + entry.slug + '/') ||
        typeof target !== 'string' || !target.startsWith('public/illustrations/')) {
      fail('Assets must come from editorial/staged/assets/<slug>/ and go into public/illustrations/');
    }
    const fileName = source.split('/').at(-1);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(svg|png|webp|jpg|jpeg)$/.test(fileName)) {
      fail('Unsupported asset filename: ' + fileName);
    }
    if (target.split('/').at(-1) !== fileName) fail('Asset filename must match source: ' + target);
    const src = inside(root, source), dest = inside(root, target);
    if (!existsSync(src) || !statSync(src).isFile()) fail('Missing asset: ' + source);
    if (existsSync(dest)) fail('Refusing to overwrite an existing asset: ' + target);
    result.push({ source: src, target: dest });
  }
  if (new Set(result.map(asset => asset.target)).size !== result.length) fail('Duplicate asset destinations');
  return result;
}
function validateArticle(root, entry, catalog) {
  const { source, target, catalogHref } = expectedPaths(entry);
  const from = inside(root, source), to = inside(root, target);
  if (!existsSync(from) || !statSync(from).isFile()) fail('Missing staged article: ' + source);
  if (existsSync(to)) fail('Refusing to overwrite published article: ' + target);
  const body = readFileSync(from, 'utf8');
  if (!body.startsWith('---') || !body.includes('</ContentLayout>') || !/<h1\b/i.test(body)) {
    fail('Staged article must have Astro frontmatter, h1 and ContentLayout: ' + source);
  }
  if (catalog.includes('href: "' + catalogHref + '"')) {
    fail('Catalog already includes this article: ' + catalogHref);
  }
  const assets = validateAssets(root, entry);
  const sourceImageRefs = [...body.matchAll(/\/illustrations\/([A-Za-z0-9._-]+)/g)]
    .map(m => m[1]);
  for (const fileName of sourceImageRefs) {
    const published = inside(root, 'public/illustrations/' + fileName);
    if (!existsSync(published) && !assets.some(a => a.target === published)) {
      fail('Missing image for ' + entry.slug + ': ' + fileName);
    }
  }
  return { entry, from, to, catalogHref, assets };
}
function catalogRow(entry, catalogHref, today) {
  const fields = [
    ['href', catalogHref], ['section', entry.section], ['type', entry.type],
    ['topic', entry.topic], ['title', entry.title],
    ['headline', entry.headline], ['dek', entry.dek], ['updated', today],
  ];
  return '  {\n' + fields.map(([k, v]) =>
    '    ' + k + ': ' + JSON.stringify(v) + ',').join('\n') + '\n  },\n';
}
function output(changed, slug = '') {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT,
      'published=' + (changed ? 'true' : 'false') + '\nslug=' + slug + '\n');
  }
}
function main(args = process.argv.slice(2)) {
  const opts = parseArgs(args), root = opts.root;
  const queue = load(root);
  if (opts.validateAll) {
    const approvedArticles = queue.articles.filter(item => item.status === 'approved');
    const catalog = readFileSync(inside(root, CATALOG), 'utf8');
    for (const item of approvedArticles) validateArticle(root, item, catalog);
    console.log('Approved staging validation passed for', approvedArticles.length, 'article(s).');
    output(false);
    return;
  }
  let approved = queue.articles.filter(item => item.status === 'approved');
  if (opts.slug) {
    const matching = queue.articles.find(a => a.slug === opts.slug);
    if (!matching) fail('Article not in editorial queue: ' + opts.slug);
    if (matching.status !== 'approved') fail('Article is not owner-approved: ' + opts.slug);
    approved = [matching]; // Intentional, explicit Publish Now override
  } else {
    approved = approved.filter(item => item.publishDate <= opts.today);
  }
  approved.sort((a, b) => a.publishDate.localeCompare(b.publishDate) || a.slug.localeCompare(b.slug));
  if (!approved.length) {
    console.log('No approved articles due for publication. Nothing changed.');
    output(false);
    return;
  }

  const selected = approved[0];
  const catalogPath = inside(root, CATALOG);
  const catalog = readFileSync(catalogPath, 'utf8');
  const anchor = 'export const CATALOG: Entry[] = [';
  if (!catalog.includes(anchor)) fail('Catalog insertion point not found');
  const release = validateArticle(root, selected, catalog);
  console.log('Selected:', selected.slug, '| due:', selected.publishDate,
    '| Michigan date:', opts.today, '| mode:', opts.dryRun ? 'DRY RUN' : 'PUBLISH');
  if (opts.dryRun) {
    console.log('Validated the staged article and assets. No files changed.');
    output(false, selected.slug);
    return;
  }

  const editedCatalog = catalog.replace(anchor,
    anchor + '\n' + catalogRow(selected, release.catalogHref, opts.today));
  // All validations above must complete before the first write.
  mkdirSync(dirname(release.to), { recursive: true });
  copyFileSync(release.from, release.to);
  for (const asset of release.assets) {
    mkdirSync(dirname(asset.target), { recursive: true });
    copyFileSync(asset.source, asset.target);
  }
  writeFileSync(catalogPath, editedCatalog, 'utf8');
  selected.status = 'published';
  selected.publishedAt = new Date().toISOString();
  selected.publishedDate = opts.today;
  writeFileSync(inside(root, QUEUE), JSON.stringify(queue, null, 2) + '\n', 'utf8');
  unlinkSync(release.from);
  for (const asset of release.assets) unlinkSync(asset.source);
  console.log('Staged for release:', release.catalogHref,
    '| build and tests must pass BEFORE Git commit and deployment.');
  output(true, selected.slug);
}
try { main(); } catch (error) {
  console.error('EDITORIAL RELEASE BLOCKED:', error.message);
  process.exitCode = 1;
}
