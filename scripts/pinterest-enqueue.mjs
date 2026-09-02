#!/usr/bin/env node
/**
 * Load a Pinterest CSV batch into the scheduler queue.
 *
 * Usage:
 *   SCHEDULER_URL=https://stackgeist-pinterest-scheduler.<subdomain>.workers.dev \
 *   ADMIN_KEY=<value> \
 *   node scripts/pinterest-enqueue.mjs marketing/pinterest/pinterest-setup-expansion-v1.csv
 *
 * The CSV must have header row:
 *   Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords
 * (this is the format your existing batches already use)
 */

import fs from 'node:fs';
import path from 'node:path';

const CSV_PATH = process.argv[2];
const SCHEDULER_URL = process.env.SCHEDULER_URL;
const ADMIN_KEY = process.env.ADMIN_KEY;
if (!CSV_PATH || !SCHEDULER_URL || !ADMIN_KEY) {
  console.error('Usage: SCHEDULER_URL=... ADMIN_KEY=... node scripts/pinterest-enqueue.mjs <csv>');
  process.exit(1);
}

function parseCsv(text) {
  const lines = [];
  let cur = '', row = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (inQ) {
      if (c === '"' && next === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); lines.push(row); row = []; cur = ''; }
      else if (c === '\r') { /* skip */ }
      else cur += c;
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

const raw = fs.readFileSync(path.resolve(CSV_PATH), 'utf8');
const rows = parseCsv(raw);
const pins = rows.map((r) => ({
  title: r['Title'],
  description: r['Description'],
  media_url: r['Media URL'],
  link: r['Link'],
  board_name: r['Pinterest board'],
  scheduled_for: r['Publish date'] || new Date().toISOString(),
}));

console.log(`Parsed ${pins.length} pins from ${CSV_PATH}`);
if (pins.length === 0) process.exit(0);

const resp = await fetch(`${SCHEDULER_URL}/enqueue`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
  body: JSON.stringify({ pins }),
});
const text = await resp.text();
console.log(resp.status, text);
if (!resp.ok) process.exit(1);
