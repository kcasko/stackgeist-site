import { pathToFileURL } from 'node:url';

const DATASET = 'stackgeist_affiliate_events';

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
  blob1 AS event_type,
  blob2 AS page_path,
  blob3 AS source,
  blob4 AS medium,
  blob5 AS campaign,
  blob6 AS content,
  blob7 AS placement,
  blob8 AS product_id,
  SUM(_sample_interval * double1) AS events
FROM ${DATASET}
WHERE timestamp >= NOW() - INTERVAL '${safeDays}' DAY
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

export async function main(args = process.argv.slice(2), env = process.env) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    console.error('Missing CLOUDFLARE_ACCOUNT_ID and/or CLOUDFLARE_API_TOKEN. Add Account Analytics Read credentials to the environment.');
    return 1;
  }

  const days = parseDays(args);
  let response;
  try {
    response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/analytics_engine/sql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'text/plain',
      },
      body: buildSql(days),
    });
  } catch (error) {
    console.error(`Analytics request failed: ${error instanceof Error ? error.message : 'network error'}`);
    return 1;
  }

  if (!response.ok) {
    console.error(`Analytics request failed with HTTP ${response.status}.`);
    return 1;
  }

  const payload = await response.json();
  const rows = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.result?.data)
      ? payload.result.data
      : [];
  console.log(JSON.stringify({ days, rowCount: rows.length, ...summarize(rows) }, null, 2));
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}
