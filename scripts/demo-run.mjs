#!/usr/bin/env node
/**
 * StackGeist Pinterest Scheduler — Local Demo Runner
 *
 * A standalone script that demonstrates the full scheduled-publishing flow
 * against Pinterest's SANDBOX API. Designed to be screen-recorded for the
 * Pinterest standard-access upgrade video.
 *
 * Runs entirely without the deployed Cloudflare Worker so you can produce
 * the demo video before the CF token issue is resolved.
 *
 * Prereq env vars:
 *   PINTEREST_SANDBOX_TOKEN  — access token from the developer dashboard
 *   BOARD_MAP                — JSON: { "CSV Board Name": "sandbox_board_id", ... }
 *   CSV_PATH                 — path to a marketing/pinterest/*.csv batch
 *   MAX_PINS                 — optional int (default 3) — how many to publish in the demo
 *
 * Usage:
 *   node scripts/demo-run.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.PINTEREST_SANDBOX_TOKEN;
const BOARD_MAP = JSON.parse(process.env.BOARD_MAP || '{}');
const CSV_PATH = process.env.CSV_PATH || 'marketing/pinterest/pinterest-setup-expansion-v1.csv';
const MAX_PINS = parseInt(process.env.MAX_PINS || '3', 10);
const API = 'https://api-sandbox.pinterest.com/v5';

if (!TOKEN) { console.error('Set PINTEREST_SANDBOX_TOKEN'); process.exit(1); }
if (Object.keys(BOARD_MAP).length === 0) { console.error('Set BOARD_MAP (JSON string)'); process.exit(1); }

// --- pretty printer ---
const c = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[34m', d: '\x1b[2m', reset: '\x1b[0m' };
const log = (...a) => console.log(...a);
const step = (n, t) => log(`\n${c.b}━━━ Step ${n}: ${t}${c.reset}`);
const info = (k, v) => log(`  ${c.d}${k}:${c.reset} ${v}`);
const ok = (m) => log(`  ${c.g}✓${c.reset} ${m}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// --- minimal CSV parser (same one from pinterest-enqueue.mjs) ---
function parseCsv(text) {
  const lines = [];
  let cur = '', row = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (inQ) {
      if (ch === '"' && next === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); lines.push(row); row = []; cur = ''; }
      else if (ch === '\r') { /* skip */ }
      else cur += ch;
    }
  }
  if (cur || row.length) { row.push(cur); lines.push(row); }
  const header = lines[0].map((h) => h.replace(/^\uFEFF/, '').trim());
  return lines.slice(1).filter((r) => r.some((v) => v && v.trim())).map((r) => {
    const o = {};
    header.forEach((h, i) => (o[h] = (r[i] ?? '').trim()));
    return o;
  });
}

async function api(pathname, init = {}) {
  const r = await fetch(`${API}${pathname}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const text = await r.text();
  let j; try { j = JSON.parse(text); } catch { j = { raw: text }; }
  return { status: r.status, json: j };
}

// ---------------- DEMO ----------------

log(`\n${c.b}═══ StackGeist Pinterest Scheduler — Sandbox Demo ═══${c.reset}`);
info('API base', API);
info('CSV', CSV_PATH);
info('Publishing', `${MAX_PINS} pin(s) from the queue`);

// Step 1: authenticate (implicit — token is presented on each request; we prove it works)
step(1, 'Authenticate with Pinterest v5 (OAuth 2.0 access token)');
const u = await api('/user_account');
if (u.status !== 200) throw new Error(`auth failed: ${u.status} ${JSON.stringify(u.json)}`);
ok(`Authenticated as @${u.json.username} (${u.json.account_type}, ${u.json.board_count} boards in production)`);
await wait(600);

// Step 2: load CSV
step(2, 'Load StackGeist campaign CSV into the local queue');
const raw = fs.readFileSync(path.resolve(CSV_PATH), 'utf8');
const rows = parseCsv(raw);
ok(`Parsed ${rows.length} pins from ${path.basename(CSV_PATH)}`);
rows.slice(0, 3).forEach((r, i) => {
  info(`  [${i + 1}]`, `${r['Title'].slice(0, 60)}  →  board="${r['Pinterest board']}"`);
});
if (rows.length > 3) info('  ...', `+${rows.length - 3} more`);
await wait(1000);

// Step 3: resolve boards via v5
step(3, 'Resolve destination boards via Pinterest v5 /boards');
for (const [name, id] of Object.entries(BOARD_MAP)) {
  const b = await api(`/boards/${id}`);
  if (b.status !== 200) { log(`  ${c.y}!${c.reset} board "${name}" (${id}) not found in sandbox: ${b.json.message || b.status}`); continue; }
  ok(`"${name}"  →  id=${b.json.id}  (pins=${b.json.pin_count})`);
}
await wait(1000);

// Step 4: publish next N pins
step(4, `Publish next ${MAX_PINS} pin(s) via POST /pins`);
const published = [];
for (let i = 0; i < Math.min(MAX_PINS, rows.length); i++) {
  const r = rows[i];
  const boardName = r['Pinterest board'];
  const boardId = BOARD_MAP[boardName];
  if (!boardId) { log(`  ${c.y}skip${c.reset} pin ${i + 1}: no board id for "${boardName}"`); continue; }

  const payload = {
    title: r['Title'].slice(0, 100),
    description: r['Description'].slice(0, 800),
    link: r['Link'].slice(0, 2048),
    board_id: boardId,
    media_source: { source_type: 'image_url', url: r['Media URL'] },
  };
  const t0 = Date.now();
  const p = await api('/pins', { method: 'POST', body: JSON.stringify(payload) });
  const ms = Date.now() - t0;
  if (p.status !== 201 && p.status !== 200) {
    log(`  ${c.r}✗${c.reset} pin ${i + 1} failed (${p.status}): ${JSON.stringify(p.json).slice(0, 300)}`);
    continue;
  }
  ok(`Pin ${i + 1}/${MAX_PINS}  id=${p.json.id}  (${ms}ms)  "${payload.title.slice(0, 50)}..."`);
  info('    thumb', p.json.media?.images?.['150x150']?.url || '(none)');
  published.push({ input: r, output: p.json });
  await wait(400);
}

// Step 5: verify — GET each published pin back
step(5, 'Verify published pins via GET /pins/{id}');
for (const { output } of published) {
  const v = await api(`/pins/${output.id}`);
  if (v.status !== 200) { log(`  ${c.r}✗${c.reset} verify failed for ${output.id}`); continue; }
  ok(`pin ${v.json.id} confirmed on board ${v.json.board_id}, link=${v.json.link.slice(0, 80)}...`);
}

// Summary
log(`\n${c.g}══════════ Demo complete ══════════${c.reset}`);
info('published this run', published.length);
info('remaining in CSV', rows.length - published.length);
info('production env', '(would use api.pinterest.com/v5 with PINTEREST_ENV unset)');
info('scheduled cron', 'workers/pinterest-scheduler runs POST /pins once/day at 16:00 UTC');
log('');
