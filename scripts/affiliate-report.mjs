import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DATABASE = 'stackgeist-affiliate-events';
const WRANGLER = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));

export function parseDays(args) {
  const index = args.indexOf('--days');
  if (index === -1) return 30;
  const parsed = Number.parseInt(args[index + 1] || '', 10);
  if (!Number.isFinite(parsed)) return 30;
  return Math.min(365, Math.max(1, parsed));
}

export function buildSql(days) {
  const safeDays = Math.min(365, Math.max(1, Number.parseInt(String(days), 10) || 30));
  return `SELECT
  event_type,
  page_path,
  utm_source AS source,
  utm_medium AS medium,
  utm_campaign AS campaign,
  utm_content AS content,
  placement,
  product_id,
  COUNT(*) AS events
FROM affiliate_events
WHERE created_at >= datetime('now', '-${safeDays} days')
GROUP BY event_type, page_path, source, medium, campaign, content, placement, product_id
ORDER BY events DESC
LIMIT 500`;
}

function summarize(rows) {
  const campaigns = new Map();
  const pages = new Map();
  const placements = new Map();
  const products = new Map();
  const add = (map, key, eventType, count) => {
    const current = map.get(key) || { landings: 0, affiliateClicks: 0 };
    if (eventType === 'landing') current.landings += count;
    if (eventType === 'affiliate_click') current.affiliateClicks += count;
    map.set(key, current);
  };

  for (const row of rows) {
    const count = Number(row.events) || 0;
    add(campaigns, [row.source, row.medium, row.campaign, row.content].filter(Boolean).join(' / ') || '(direct or unattributed)', row.event_type, count);
    add(pages, row.page_path || '(unknown)', row.event_type, count);
    if (row.placement) add(placements, row.placement, row.event_type, count);
    if (row.product_id) add(products, row.product_id, row.event_type, count);
  }

  const finish = (map) => [...map.entries()].map(([name, value]) => ({
    name,
    ...value,
    clickThroughRate: value.landings ? Number(((value.affiliateClicks / value.landings) * 100).toFixed(2)) : null,
  })).sort((a, b) => b.affiliateClicks - a.affiliateClicks || b.landings - a.landings);

  return {
    campaigns: finish(campaigns),
    pages: finish(pages),
    placements: finish(placements),
    products: finish(products),
  };
}

export function main(args = process.argv.slice(2), runner = spawnSync) {
  const days = parseDays(args);
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
  console.log(JSON.stringify({ days, rowCount: rows.length, ...summarize(rows) }, null, 2));
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main();
}
