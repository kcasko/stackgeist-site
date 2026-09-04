#!/usr/bin/env node
// Inject Product+FAQ schema (gear pages) and Article+FAQ schema (guide pages)
// into StackGeist .astro pages. Idempotent — skips pages that already have
// `structuredData=` on their ContentLayout tag.
//
// Usage:  node scripts/inject-schema.mjs

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(fileURLToPath(import.meta.url)) + '/..';
const HELPER_IMPORT = "import { productSchema, articleSchema, howToSchema, faqSchema } from '../../../lib/structured-data';";
const HELPER_IMPORT_GUIDE = "import { articleSchema, howToSchema, faqSchema } from '../../lib/structured-data';";

const HOW_TO_GUIDES = new Set([
  'desk-layout-basics.astro',
  'cable-management.astro',
  'usb-c-dock-compatibility.astro',
  'keyboard-mouse-fit.astro',
  'better-video-calls.astro',
  'cheap-desk-upgrades.astro',
]);

const BRAND_HINTS = ['Acodot','Anker','Logitech','Elgato','CalDigit','Razer','Ergotron','Sennheiser','SanDisk','Samsung','WD','Sabrent','Kroser','INIU','Alfa','CanaKit','Levo','SteelSeries','MobSF','MSI','ASUS','Corsair','HyperX','Keychron','Glorious','MOUNTAIN'];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.astro')) out.push(p);
  }
  return out;
}

// Strip HTML tags for a plain-text derivation.
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function extractString(src, regex) {
  const m = src.match(regex);
  return m ? stripTags(m[1]) : '';
}

function extractHeroImage(src) {
  const m = src.match(/<img[^>]*class="hero"[^>]*src="([^"]+)"/);
  return m ? m[1] : undefined;
}

function extractFaqs(src) {
  const cards = [];
  // FAQ section .card blocks: <div class="card"><h3>Q</h3><p>A</p></div>
  const re = /<div class="card">\s*<h3>([^<]+)<\/h3>\s*<p>([^<]+)<\/p>\s*<\/div>/g;
  let m;
  while ((m = re.exec(src))) {
    cards.push({ question: stripTags(m[1]), answer: stripTags(m[2]) });
  }
  return cards;
}

function extractSteps(src) {
  const steps = [];
  // Take each <h2 class="section-heading"> as a step name, next paragraph as text.
  const re = /<h2 class="section-heading"[^>]*>([^<]+)<\/h2>\s*<p[^>]*>([^<]+)<\/p>/g;
  let m;
  while ((m = re.exec(src))) {
    const name = stripTags(m[1]);
    const text = stripTags(m[2]);
    if (name && text) steps.push({ name, text });
  }
  return steps;
}

function detectBrand(title) {
  for (const b of BRAND_HINTS) if (title.toLowerCase().includes(b.toLowerCase())) return b;
  return undefined;
}

function buildImportPath(file) {
  const rel = relative(join(REPO, 'src'), file).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1; // pages/gear/x/y.astro -> 3
  return '../'.repeat(depth) + 'lib/structured-data';
}

let touched = 0, skipped = 0, missingData = 0;
const missing = [];

function extractPropValue(src, tag, prop) {
  // Look inside `<Tag ... prop="..." ... />` or with different quote style.
  const tagRegex = new RegExp(`<${tag}\\s+([\\s\\S]*?)/>`, 'm');
  const t = src.match(tagRegex);
  if (!t) return '';
  const inside = t[1];
  // string prop
  let m = inside.match(new RegExp(`\\b${prop}=\"([^\"]+)\"`));
  if (m) return stripTags(m[1]);
  m = inside.match(new RegExp(`\\b${prop}=\\{['\`]([^'\`]+)['\`]\\}`));
  if (m) return stripTags(m[1]);
  return '';
}

function injectGear(file) {
  let src = readFileSync(file, 'utf8');
  if (src.includes('structuredData=')) { skipped++; return; }
  let title = extractString(src, /<h1 class="page-title"[^>]*>([^<]+)<\/h1>/);
  let description = extractString(src, /<p class="page-lead"[^>]*>([^<]+)<\/p>/);
  let image = extractHeroImage(src);
  let faqs = extractFaqs(src);
  // Fallback: ProductDetailSimple component
  if (!title) {
    title = extractPropValue(src, 'ProductDetailSimple', 'productName') || extractPropValue(src, 'ProductDetailSimple', 'heading')
         || extractPropValue(src, 'ProductRecommendation', 'productName') || extractPropValue(src, 'ProductRecommendation', 'heading');
  }
  if (!description) {
    description = extractPropValue(src, 'ProductDetailSimple', 'intro') || extractPropValue(src, 'ProductDetailSimple', 'why')
                || extractPropValue(src, 'ProductRecommendation', 'intro') || extractPropValue(src, 'ProductRecommendation', 'why');
  }
  if (!image) {
    const raw = extractPropValue(src, 'ProductDetailSimple', 'imageUrl') || extractPropValue(src, 'ProductRecommendation', 'imageUrl');
    if (raw) image = raw.startsWith('http') ? raw : `https://stackgeist.dev${raw.startsWith('/') ? '' : '/'}${raw}`;
  }
  if (!title || !description) { missingData++; missing.push({ file, reason: 'no title/lead' }); return; }
  const brand = detectBrand(title);
  const rel = relative(join(REPO, 'src', 'pages'), file).replace(/\\/g, '/').replace(/\.astro$/, '').replace(/\/index$/, '');
  const url = `https://stackgeist.dev/${rel}`;
  const importPath = buildImportPath(file);
  const importLine = `import { productSchema, faqSchema } from '${importPath}';`;

  src = src.replace(/(---\r?\n(?:[^]*?))(\r?\n---)/, (_, head, tail) => {
    if (head.includes(importPath)) return head + tail;
    return head + '\n' + importLine + tail;
  });

  const brandExpr = brand ? `, brand: '${brand.replace(/'/g, "\\'")}'` : '';
  const imgExpr = image ? `, image: '${image.replace(/'/g, "\\'")}'` : '';
  const dataConst =
`const __sd = [productSchema({ name: ${JSON.stringify(title)}, description: ${JSON.stringify(description)}, url: '${url}'${imgExpr}${brandExpr} })${faqs.length ? `, faqSchema({ questions: ${JSON.stringify(faqs)} })` : ''}];`;

  src = src.replace(/(---\r?\n(?:[^]*?))(\r?\n---)/, (_, head, tail) => head + '\n' + dataConst + tail);
  src = src.replace(/<ContentLayout\s+/, '<ContentLayout structuredData={__sd} ');

  writeFileSync(file, src);
  touched++;
}

function injectGuide(file) {
  let src = readFileSync(file, 'utf8');
  if (src.includes('structuredData=')) { skipped++; return; }
  const title = extractString(src, /<h1 class="page-title"[^>]*>([^<]+)<\/h1>/);
  const description = extractString(src, /<p class="page-lead"[^>]*>([^<]+)<\/p>/);
  if (!title || !description) { missingData++; missing.push({ file, reason: 'no title/lead' }); return; }
  const image = extractHeroImage(src);
  const faqs = extractFaqs(src);
  const rel = relative(join(REPO, 'src', 'pages'), file).replace(/\\/g, '/').replace(/\.astro$/, '');
  const url = `https://stackgeist.dev/${rel}`;
  const importPath = buildImportPath(file);
  const importLine = `import { articleSchema, howToSchema, faqSchema } from '${importPath}';`;
  const today = new Date().toISOString().split('T')[0];

  const base = file.split(/[\\/]/).pop();
  const isHowTo = HOW_TO_GUIDES.has(base);
  const steps = isHowTo ? extractSteps(src) : [];

  src = src.replace(/(---\r?\n(?:[^]*?))(\r?\n---)/, (_, head, tail) => {
    if (head.includes(importPath)) return head + tail;
    return head + '\n' + importLine + tail;
  });

  const imgExpr = image ? `, image: '${image.replace(/'/g, "\\'")}'` : '';
  const parts = [
    `articleSchema({ headline: ${JSON.stringify(title)}, description: ${JSON.stringify(description)}, url: '${url}'${imgExpr}, dateModified: '${today}' })`,
  ];
  if (steps.length >= 2) {
    parts.push(`howToSchema({ name: ${JSON.stringify(title)}, description: ${JSON.stringify(description)}, steps: ${JSON.stringify(steps)}${imgExpr} })`);
  }
  if (faqs.length) {
    parts.push(`faqSchema({ questions: ${JSON.stringify(faqs)} })`);
  }
  const dataConst = `const __sd = [${parts.join(', ')}];`;

  src = src.replace(/(---\r?\n(?:[^]*?))(\r?\n---)/, (_, head, tail) => head + '\n' + dataConst + tail);
  src = src.replace(/<ContentLayout\s+/, '<ContentLayout structuredData={__sd} ');

  writeFileSync(file, src);
  touched++;
}

const gearDir = join(REPO, 'src/pages/gear');
const guideDir = join(REPO, 'src/pages/guides');

for (const f of walk(gearDir)) {
  const base = f.split(/[\\/]/).pop();
  if (base === 'index.astro') continue;
  // Skip compare pages — they're comparison articles, handled as Article schema below.
  if (f.includes('/compare/') || f.includes('\\compare\\')) continue;
  injectGear(f);
}

// Compare pages get articleSchema.
for (const f of walk(join(gearDir, 'budget-tech/compare'))) {
  const base = f.split(/[\\/]/).pop();
  if (base === 'index.astro') continue;
  injectGuide(f); // same logic works: reads title/lead/FAQ, makes Article schema
}

for (const f of walk(guideDir)) {
  const base = f.split(/[\\/]/).pop();
  if (base === 'index.astro') continue;
  injectGuide(f);
}

console.log(JSON.stringify({ touched, skipped, missingData, missing: missing.slice(0, 10) }, null, 2));
