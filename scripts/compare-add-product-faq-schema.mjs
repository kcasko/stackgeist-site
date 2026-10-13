#!/usr/bin/env node
// One-shot: give every /gear/budget-tech/compare/*.astro page Product + FAQ
// schema in addition to the existing articleSchema. Reads offers from the
// ComparisonAffiliateCta prop already on the page, pulls the "Pick X if..."
// section text for Product descriptions, and builds 3 FAQ pairs from the
// existing Pick/When/Verdict section copy. Idempotent — if a page already has
// comparisonProductSchemas() in __sd, it's skipped.
//
// Run with: node scripts/compare-add-product-faq-schema.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const COMPARE_DIR = path.join(SITE_ROOT, 'src', 'pages', 'gear', 'budget-tech', 'compare');

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractOffers(src) {
  // Grab the FIRST offers={[...]} block (the quickpick + verdict share one data shape).
  const m = src.match(/offers=\{(\[.+?\])\}/s);
  if (!m) return null;
  // The attribute value is a JS array literal using double-quoted strings — valid JSON.
  try { return JSON.parse(m[1]); } catch { return null; }
}

function extractSection(src, kicker) {
  // Finds <section class="content-section"> ... <p class="page-kicker">{kicker}</p> ... </section>
  const re = new RegExp(
    `<section[^>]*content-section[^>]*>\\s*<p class="page-kicker">${kicker}[^<]*</p>([\\s\\S]*?)</section>`,
    'i',
  );
  const m = src.match(re);
  if (!m) return '';
  // Drop H2 "section-heading" blocks — they're labels like "Pick X if..." not content.
  const body = m[1].replace(/<h2[^>]*>[\s\S]*?<\/h2>/g, '');
  return stripHtml(body);
}

function firstSentence(s, maxLen = 300) {
  if (!s) return '';
  const dot = s.indexOf('. ');
  const first = dot > 20 ? s.slice(0, dot + 1) : s;
  return first.length > maxLen ? first.slice(0, maxLen - 1).trimEnd() + '…' : first;
}

function extractTitle(src) {
  const m = src.match(/<h1 class="page-title">([^<]+)<\/h1>/);
  return m ? m[1].trim() : '';
}

function extractHeadline(src) {
  const m = src.match(/articleSchema\(\{\s*headline:\s*"([^"]+)"/);
  return m ? m[1] : '';
}

function extractDescription(src) {
  const m = src.match(/articleSchema\(\{[^}]*description:\s*"([^"]+)"/s);
  return m ? m[1] : '';
}

function pickKicker(src, name) {
  // Look for "<p class="page-kicker">When NAME wins</p>" or "Pick NAME if..." pattern.
  // We search by name first word for robustness.
  const first = name.split(' ')[0];
  for (const re of [
    new RegExp(`When ${first}[^<]{0,80}wins`, 'i'),
    new RegExp(`Pick ${first}[^<]{0,80}`, 'i'),
  ]) {
    const m = src.match(re);
    if (m) return m[0];
  }
  return null;
}

function buildFaqs(src, offers, title) {
  const faqs = [];
  // Q1: Which should I buy? -- use verdict section
  const verdict = extractSection(src, 'The verdict')
    || extractSection(src, 'Verdict');
  if (verdict) {
    faqs.push({
      question: offers.length >= 2
        ? `${offers[0].name} vs ${offers[1].name}: which should I buy?`
        : `Should I buy the ${offers[0].name}?`,
      answer: firstSentence(verdict, 500),
    });
  }
  // Q2+Q3: per-offer "when does X win"
  for (const offer of offers) {
    const kicker = pickKicker(src, offer.name);
    const text = kicker ? extractSection(src, kicker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : '';
    if (text) {
      faqs.push({
        question: `When should I pick the ${offer.name}?`,
        answer: firstSentence(text, 500),
      });
    } else if (offer.fit) {
      faqs.push({
        question: `When should I pick the ${offer.name}?`,
        answer: firstSentence(offer.fit, 500),
      });
    }
  }
  return faqs.slice(0, 4);
}

function patchSource(src, offers, faqs) {
  // Replace the __sd const line.
  // We expect: const __sd = [articleSchema({ ... })];
  const re = /const __sd = \[(articleSchema\(\{[^}]+\}\))\];/s;
  if (!re.test(src)) return null;

  // Build a short description for each product from its "fit" + the article description context.
  const prodArg = offers.map((o) => {
    const desc = o.fit && o.fit.length > 40 ? o.fit : `${o.name} — see the comparison for fit, tradeoffs, and when to skip.`;
    return `    { name: ${JSON.stringify(o.name)}, description: ${JSON.stringify(desc.slice(0, 300))}, amazonUrl: ${JSON.stringify(o.amazonUrl)} }`;
  }).join(',\n');

  const faqArg = faqs.map((q) =>
    `    { question: ${JSON.stringify(q.question)}, answer: ${JSON.stringify(q.answer)} }`
  ).join(',\n');

  const replacement = `const __sd = [
  __ARTICLE_SCHEMA__,
  ...comparisonProductSchemas([
${prodArg}
  ]),
${faqs.length ? `  faqSchema({ questions: [\n${faqArg}\n  ] }),` : ''}
];`;

  // Use a function to avoid String.replace treating $1, $$ etc. inside content
  // as replacement patterns (e.g. a verdict answer containing "$130" would
  // otherwise collapse into the backreference).
  let next = src.replace(re, (_match, article) =>
    replacement.replace('__ARTICLE_SCHEMA__', article),
  );

  // Fix import line: ensure comparisonProductSchemas is imported from structured-data.
  next = next.replace(
    /import \{ ([^}]+) \} from '([^']+structured-data)';/,
    (_m, members, from) => {
      const set = new Set(members.split(',').map((s) => s.trim()).filter(Boolean));
      set.add('comparisonProductSchemas');
      if (faqs.length) set.add('faqSchema');
      return `import { ${Array.from(set).join(', ')} } from '${from}';`;
    },
  );

  return next;
}

async function main() {
  const files = (await readdir(COMPARE_DIR)).filter((f) => f.endsWith('.astro') && f !== 'index.astro');
  let changed = 0;
  const report = [];
  for (const name of files) {
    const file = path.join(COMPARE_DIR, name);
    const src = await readFile(file, 'utf8');
    if (src.includes('comparisonProductSchemas(')) {
      report.push({ file: name, status: 'skip-already-patched' });
      continue;
    }
    const offers = extractOffers(src);
    if (!offers || offers.length === 0) {
      report.push({ file: name, status: 'skip-no-offers' });
      continue;
    }
    const title = extractTitle(src);
    const faqs = buildFaqs(src, offers, title);
    const next = patchSource(src, offers, faqs);
    if (!next || next === src) {
      report.push({ file: name, status: 'skip-no-patch-point' });
      continue;
    }
    await writeFile(file, next, 'utf8');
    changed++;
    report.push({ file: name, status: 'patched', offers: offers.length, faqs: faqs.length });
  }
  console.log(JSON.stringify({ changed, total: files.length, report }, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
