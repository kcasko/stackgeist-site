import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Weekly analytics report for /kits/* pages.
// Landings are attributed by page_path LIKE '/kits/%'.
// Affiliate clicks are attributed by placement LIKE 'kit-%' (see IncomeKitPage.astro).
// Follows the affiliate-report.mjs pattern: pure functions + a thin CLI wrapper
// so tests can drive it without hitting Wrangler or the network.

const DATABASE = 'stackgeist-affiliate-events';
const WRANGLER = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));

export function parseDays(args) {
  const index = args.indexOf('--days');
  if (index === -1) return 7;
  const parsed = Number.parseInt(args[index + 1] || '', 10);
  if (!Number.isFinite(parsed)) return 7;
  return Math.min(90, Math.max(1, parsed));
}

export function parseWrite(args) {
  const index = args.indexOf('--write');
  if (index === -1) return null;
  const next = args[index + 1];
  if (!next || next.startsWith('--')) {
    return { auto: true };
  }
  return { auto: false, path: next };
}

export function buildSql(days) {
  const parsed = Number.parseInt(String(days), 10);
  const safeDays = Math.min(90, Math.max(1, Number.isFinite(parsed) ? parsed : 7));
  // Two aggregates in one round trip via UNION ALL so we can restrict each side
  // to exactly the rows we care about (visits on kit pages, clicks on kit placements).
  return `SELECT
  'landing' AS event_type,
  page_path,
  '' AS placement,
  '' AS utm_content,
  '' AS product_id,
  COUNT(*) AS events
FROM affiliate_events
WHERE event_type = 'landing'
  AND page_path LIKE '/kits/%'
  AND created_at >= datetime('now', '-${safeDays} days')
GROUP BY page_path
UNION ALL
SELECT
  'affiliate_click' AS event_type,
  page_path,
  placement,
  utm_content,
  product_id,
  COUNT(*) AS events
FROM affiliate_events
WHERE event_type = 'affiliate_click'
  AND placement LIKE 'kit-%'
  AND created_at >= datetime('now', '-${safeDays} days')
GROUP BY page_path, placement, utm_content, product_id
ORDER BY event_type, events DESC
LIMIT 1000`;
}

function kitSlugFromPath(pathValue) {
  if (typeof pathValue !== 'string') return '';
  const match = pathValue.match(/^\/kits\/([a-z0-9-]+)\/?$/i);
  return match ? match[1] : '';
}

function kitSlugFromPlacement(placement) {
  if (typeof placement !== 'string' || !placement.startsWith('kit-')) return '';
  return placement.slice(4);
}

export function summarize(rows) {
  const kits = new Map();
  const ensure = (slug) => {
    if (!kits.has(slug)) {
      kits.set(slug, {
        slug,
        landings: 0,
        affiliateClicks: 0,
        links: new Map(),
      });
    }
    return kits.get(slug);
  };

  for (const row of rows) {
    const count = Number(row.events) || 0;
    if (row.event_type === 'landing') {
      const slug = kitSlugFromPath(row.page_path);
      if (!slug) continue;
      ensure(slug).landings += count;
      continue;
    }
    if (row.event_type === 'affiliate_click') {
      const slug = kitSlugFromPlacement(row.placement) || kitSlugFromPath(row.page_path);
      if (!slug) continue;
      const kit = ensure(slug);
      kit.affiliateClicks += count;
      const linkKey = `${row.utm_content || '(no-utm-content)'}\u241f${row.product_id || ''}`;
      const link = kit.links.get(linkKey) || {
        utmContent: row.utm_content || '',
        productId: row.product_id || '',
        clicks: 0,
      };
      link.clicks += count;
      kit.links.set(linkKey, link);
    }
  }

  const kitList = [...kits.values()].map((kit) => ({
    slug: kit.slug,
    landings: kit.landings,
    affiliateClicks: kit.affiliateClicks,
    clickThroughRate: kit.landings
      ? Number(((kit.affiliateClicks / kit.landings) * 100).toFixed(2))
      : null,
    links: [...kit.links.values()].sort((a, b) => b.clicks - a.clicks),
  })).sort((a, b) => b.affiliateClicks - a.affiliateClicks || b.landings - a.landings);

  const totals = kitList.reduce(
    (acc, kit) => {
      acc.landings += kit.landings;
      acc.affiliateClicks += kit.affiliateClicks;
      return acc;
    },
    { landings: 0, affiliateClicks: 0 },
  );

  return {
    totals: {
      ...totals,
      clickThroughRate: totals.landings
        ? Number(((totals.affiliateClicks / totals.landings) * 100).toFixed(2))
        : null,
      kitsWithTraffic: kitList.filter((k) => k.landings > 0 || k.affiliateClicks > 0).length,
    },
    kits: kitList,
    quietKits: kitList.filter((k) => k.landings > 0 && k.affiliateClicks === 0).map((k) => k.slug),
    ghostClicks: kitList.filter((k) => k.affiliateClicks > 0 && k.landings === 0).map((k) => k.slug),
  };
}

export function renderMarkdown(summary, meta) {
  const { days, generatedAt } = meta;
  const lines = [];
  lines.push(`# Kits weekly analytics — last ${days} day${days === 1 ? '' : 's'}`);
  lines.push('');
  lines.push(`_Generated ${generatedAt} from D1 \`${DATABASE}\`._`);
  lines.push('');
  lines.push('## Totals');
  lines.push('');
  const ctr = summary.totals.clickThroughRate;
  lines.push(`- Kit landings: **${summary.totals.landings}**`);
  lines.push(`- Kit affiliate clicks: **${summary.totals.affiliateClicks}**`);
  lines.push(`- Overall CTR: **${ctr === null ? 'n/a' : `${ctr}%`}**`);
  lines.push(`- Kits with any traffic: **${summary.totals.kitsWithTraffic}**`);
  lines.push('');

  if (summary.kits.length === 0) {
    lines.push('_No kit traffic recorded in this window._');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('## Per-kit breakdown');
  lines.push('');
  lines.push('| Kit | Landings | Clicks | CTR |');
  lines.push('| --- | ---: | ---: | ---: |');
  for (const kit of summary.kits) {
    const kctr = kit.clickThroughRate === null ? 'n/a' : `${kit.clickThroughRate}%`;
    lines.push(`| \`${kit.slug}\` | ${kit.landings} | ${kit.affiliateClicks} | ${kctr} |`);
  }
  lines.push('');

  const kitsWithLinks = summary.kits.filter((k) => k.links.length > 0);
  if (kitsWithLinks.length > 0) {
    lines.push('## Link clicks by kit');
    lines.push('');
    for (const kit of kitsWithLinks) {
      lines.push(`### \`${kit.slug}\``);
      lines.push('');
      lines.push('| Link (utm_content) | Product | Clicks |');
      lines.push('| --- | --- | ---: |');
      for (const link of kit.links) {
        lines.push(`| ${link.utmContent || '(no-utm-content)'} | ${link.productId || '—'} | ${link.clicks} |`);
      }
      lines.push('');
    }
  }

  if (summary.quietKits.length > 0) {
    lines.push('## Quiet kits (visits, zero clicks)');
    lines.push('');
    for (const slug of summary.quietKits) lines.push(`- \`${slug}\``);
    lines.push('');
  }

  if (summary.ghostClicks.length > 0) {
    lines.push('## Ghost clicks (clicks without landing rows)');
    lines.push('');
    lines.push('_Usually means the click fired from another page (e.g. an index or a guide) but was attributed to a kit placement._');
    lines.push('');
    for (const slug of summary.ghostClicks) lines.push(`- \`${slug}\``);
    lines.push('');
  }

  return lines.join('\n');
}

export function reportPath(baseDir, generatedAt) {
  const day = generatedAt.slice(0, 10);
  return resolve(baseDir, 'reports', 'weekly', `${day}.md`);
}

export function main(args = process.argv.slice(2), runner = spawnSync, io = null) {
  const days = parseDays(args);
  const write = parseWrite(args);
  const result = runner(process.execPath, [
    WRANGLER,
    'd1',
    'execute',
    DATABASE,
    '--remote',
    '--json',
    '--command',
    buildSql(days),
  ], { encoding: 'utf8', windowsHide: true });

  if (result.error || result.status !== 0) {
    const detail = result.error?.message || (result.stderr || '').trim() || `exit ${result.status}`;
    console.error(`Unable to run Wrangler D1 query: ${detail}`);
    return 1;
  }

  let payload;
  try {
    payload = JSON.parse(result.stdout);
  } catch {
    console.error('Unable to parse Wrangler D1 query output.');
    return 1;
  }
  const first = Array.isArray(payload) ? payload[0] : payload;
  const rows = Array.isArray(first?.results) ? first.results : [];
  const summary = summarize(rows);
  const generatedAt = new Date().toISOString();
  const markdown = renderMarkdown(summary, { days, generatedAt });
  const stdout = (io && io.stdout) || process.stdout;
  stdout.write(markdown + '\n');

  if (write) {
    const baseDir = fileURLToPath(new URL('..', import.meta.url));
    const target = write.auto ? reportPath(baseDir, generatedAt) : resolve(process.cwd(), write.path);
    try {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, markdown + '\n', 'utf8');
      const stderr = (io && io.stderr) || process.stderr;
      stderr.write(`Wrote report to ${target}\n`);
    } catch (err) {
      console.error(`Unable to write report: ${err?.message || err}`);
      return 1;
    }
  }

  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main();
}
