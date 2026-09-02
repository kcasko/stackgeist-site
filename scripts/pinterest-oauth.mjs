#!/usr/bin/env node
/**
 * StackGeist Pinterest OAuth Helper
 *
 * One-time: exchange a Pinterest developer app's client_id/secret for a REFRESH TOKEN
 * that the scheduler worker can use forever (Pinterest refresh tokens last ~365 days).
 *
 * Prereq (once, from you):
 *   1. Go to https://developers.pinterest.com/apps/ → Create app.
 *   2. Under "App settings" set redirect URI to:  http://localhost:53682/callback
 *   3. Enable scopes: pins:read, pins:write, boards:read
 *   4. Copy the App ID and App secret and export them:
 *        export PINTEREST_CLIENT_ID=1234567
 *        export PINTEREST_CLIENT_SECRET=abc123...
 *   5. Run this script:  node scripts/pinterest-oauth.mjs
 *   6. Follow the printed URL, authorize, wait for the CLI to print your refresh token.
 *   7. Store it as a wrangler secret:
 *        cd workers/pinterest-scheduler
 *        npx wrangler secret put PINTEREST_REFRESH_TOKEN
 *        (paste the token when prompted)
 */

import http from 'node:http';
import { URL } from 'node:url';
import crypto from 'node:crypto';

const CLIENT_ID = process.env.PINTEREST_CLIENT_ID;
const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET;
const ENV = (process.env.PINTEREST_ENV || 'production').toLowerCase();
const REDIRECT_URI = 'http://localhost:53682/callback';
const SCOPES = 'pins:read,pins:write,boards:read,user_accounts:read';
const API_BASE = ENV === 'sandbox' ? 'https://api-sandbox.pinterest.com/v5' : 'https://api.pinterest.com/v5';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set PINTEREST_CLIENT_ID and PINTEREST_CLIENT_SECRET env vars first.');
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');
const authUrl = new URL('https://www.pinterest.com/oauth/');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('state', state);

console.log(`\n[env: ${ENV}]  API base: ${API_BASE}\n`);
console.log('\nOpen this URL in your browser (must be logged into the Pinterest business account):');
console.log('\n' + authUrl.toString() + '\n');

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://localhost:53682`);
    if (u.pathname !== '/callback') {
      res.writeHead(404).end();
      return;
    }
    const code = u.searchParams.get('code');
    const returnedState = u.searchParams.get('state');
    if (!code || returnedState !== state) {
      res.writeHead(400).end('bad state or missing code');
      server.close();
      process.exit(1);
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    });
    const tokenResp = await fetch(`${API_BASE}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const tokenText = await tokenResp.text();
    if (!tokenResp.ok) {
      res.writeHead(500).end(`token exchange failed: ${tokenText}`);
      console.error('\nToken exchange failed:', tokenResp.status, tokenText);
      server.close();
      process.exit(1);
    }
    const tokenJson = JSON.parse(tokenText);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Success. You can close this tab and return to the terminal.');

    console.log('\n==================== SAVE THIS SECRET ====================');
    console.log('PINTEREST_REFRESH_TOKEN=' + tokenJson.refresh_token);
    console.log('\nNext step:');
    console.log('  cd workers/pinterest-scheduler');
    console.log('  npx wrangler secret put PINTEREST_REFRESH_TOKEN');
    console.log('  (paste the token above when prompted)');
    console.log('\nAlso store these:');
    console.log('  npx wrangler secret put PINTEREST_CLIENT_ID       # value: ' + CLIENT_ID);
    console.log('  npx wrangler secret put PINTEREST_CLIENT_SECRET   # value: <your secret>');
    console.log('  npx wrangler secret put ADMIN_KEY                 # any long random string');
    console.log('==========================================================\n');

    console.log('Fetching your boards to build the PINTEREST_BOARD_MAP...\n');
    const boardsResp = await fetch(`${API_BASE}/boards?page_size=100`, {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const boardsText = await boardsResp.text();
    if (boardsResp.ok) {
      const boardsJson = JSON.parse(boardsText);
      const map = {};
      for (const b of boardsJson.items || []) map[b.name] = b.id;
      console.log('PINTEREST_BOARD_MAP (paste as wrangler var):');
      console.log(JSON.stringify(map, null, 2));
      console.log('\n  npx wrangler secret put PINTEREST_BOARD_MAP');
      console.log('  (paste the single-line JSON when prompted)');
    } else {
      console.error('Boards fetch failed:', boardsResp.status, boardsText);
    }

    server.close();
    process.exit(0);
  } catch (e) {
    console.error(e);
    res.writeHead(500).end(String(e));
    server.close();
    process.exit(1);
  }
});

server.listen(53682, () => {
  console.log('Waiting for Pinterest to redirect to http://localhost:53682/callback ...');
});
