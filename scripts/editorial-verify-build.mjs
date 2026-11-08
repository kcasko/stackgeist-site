#!/usr/bin/env node
/**
 * Run AFTER building the candidate site and BEFORE publishing a scheduled article.
 * Confirms the one newly released page is present, indexable and has its assets.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(process.cwd());
const slugIndex = process.argv.indexOf('--slug');
const slug = slugIndex !== -1 ? process.argv[slugIndex + 1] : '';
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('EDITORIAL BUILD CHECK: Provide an exact safe --slug');
  process.exit(1);
}
const queue = JSON.parse(readFileSync(join(root, 'editorial/queue.json'), 'utf8'));
const entry = queue.articles.find(item => item.slug === slug);
if (!entry || entry.status !== 'published') {
  console.error('EDITORIAL BUILD CHECK: Article was not released: ' + slug);
  process.exit(1);
}
const dirs = { fixes: 'guides', learning: 'certs', labs: 'labs', gear: 'gear' };
const dir = dirs[entry.section];
if (!dir) throw new Error('Invalid section for released article: ' + entry.section);
const href = '/' + dir + '/' + slug + '/';
const target = join(root, 'dist', dir, slug, 'index.html');
if (!existsSync(target)) throw new Error('Published route was not generated: ' + href);
const html = readFileSync(target, 'utf8');
if (!/<h1\b/i.test(html)) throw new Error('Published route lacks h1: ' + href);
if (/<meta[^>]*name=["']robots["'][^>]*noindex/i.test(html)) {
  throw new Error('Published route is incorrectly noindex: ' + href);
}
if (!readFileSync(join(root, 'dist/sitemap.xml'), 'utf8').includes(href)) {
  throw new Error('Published route missing from sitemap: ' + href);
}
const missing = [];
for (const match of html.matchAll(/<img\b[^>]*\bsrc=["'](\/illustrations\/[^"'?#]+)["']/gi)) {
  const rel = match[1].replace(/^\//, '');
  if (rel.includes('..') || !existsSync(join(root, 'dist', rel))) missing.push(rel);
}
if (missing.length) throw new Error('Broken publication images: ' + missing.join(', '));
const cat = readFileSync(join(root, 'src/data/catalog.ts'), 'utf8');
if (!cat.includes('href: "' + href + '"')) {
  throw new Error('Published route is missing from the search catalog: ' + href);
}
console.log('EDITORIAL BUILD VERIFIED:', href, '| sitemap, catalog, images and indexable HTML confirmed.');
