/**
 * StackGeist Pinterest Scheduler
 *
 * Publishes one queued pin per day to Pinterest via their v5 API.
 * Deployed as a standalone Cloudflare Worker with a Cron Trigger.
 *
 * Runtime env:
 *   PINTEREST_CLIENT_ID      (secret) — from developers.pinterest.com app
 *   PINTEREST_CLIENT_SECRET  (secret) — same
 *   PINTEREST_REFRESH_TOKEN  (secret) — from one-time OAuth flow (see scripts/pinterest-oauth.mjs)
 *   PINTEREST_BOARD_MAP      (var)    — JSON map of "Board display name" -> board_id
 *   ADMIN_KEY                (secret) — required for /publish-next and /status POSTs
 *   PIN_QUEUE                (D1)     — same D1 DB as the Pages site
 *
 * Routes:
 *   GET  /status         — auth-gated: how many pins queued/published
 *   POST /publish-next   — auth-gated: manually publish the next pin (for testing)
 *   POST /enqueue        — auth-gated: add a pin batch (JSON body)
 *
 * Cron:
 *   Runs once/day at 16:00 UTC (12:00 EDT). Publishes next queued pin.
 */

type Env = {
  PIN_QUEUE: D1Database;
  PINTEREST_CLIENT_ID: string;
  PINTEREST_CLIENT_SECRET: string;
  PINTEREST_REFRESH_TOKEN: string;
  PINTEREST_BOARD_MAP: string; // JSON string
  ADMIN_KEY: string;
};

interface PinRow {
  id: number;
  title: string;
  description: string;
  media_url: string;
  link: string;
  board_name: string;
  scheduled_for: string; // ISO date
  status: 'queued' | 'published' | 'failed';
  pinterest_pin_id: string | null;
  error: string | null;
  attempts: number;
}

async function pinterestAccessToken(env: Env): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: env.PINTEREST_REFRESH_TOKEN,
  });
  const auth = btoa(`${env.PINTEREST_CLIENT_ID}:${env.PINTEREST_CLIENT_SECRET}`);
  const r = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Pinterest token refresh failed: ${r.status} ${txt}`);
  }
  const j = await r.json<{ access_token: string }>();
  return j.access_token;
}

async function publishPin(env: Env, pin: PinRow): Promise<string> {
  const map: Record<string, string> = JSON.parse(env.PINTEREST_BOARD_MAP);
  const boardId = map[pin.board_name];
  if (!boardId) throw new Error(`No board_id for board name "${pin.board_name}" in PINTEREST_BOARD_MAP`);

  const access = await pinterestAccessToken(env);
  const payload = {
    title: pin.title.slice(0, 100),
    description: pin.description.slice(0, 800),
    link: pin.link.slice(0, 2048),
    board_id: boardId,
    media_source: {
      source_type: 'image_url',
      url: pin.media_url,
    },
  };
  const r = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`pin create ${r.status}: ${txt}`);
  const j = JSON.parse(txt) as { id: string };
  return j.id;
}

async function nextPin(env: Env): Promise<PinRow | null> {
  const now = new Date().toISOString();
  const r = await env.PIN_QUEUE.prepare(
    `SELECT * FROM pinterest_queue
     WHERE status = 'queued' AND scheduled_for <= ?
     ORDER BY scheduled_for ASC, id ASC
     LIMIT 1`,
  )
    .bind(now)
    .first<PinRow>();
  return r ?? null;
}

async function markPublished(env: Env, id: number, pinId: string) {
  await env.PIN_QUEUE.prepare(
    `UPDATE pinterest_queue
     SET status = 'published', pinterest_pin_id = ?, published_at = datetime('now')
     WHERE id = ?`,
  )
    .bind(pinId, id)
    .run();
}

async function markFailed(env: Env, id: number, err: string, attempts: number) {
  const status = attempts >= 3 ? 'failed' : 'queued';
  await env.PIN_QUEUE.prepare(
    `UPDATE pinterest_queue
     SET status = ?, error = ?, attempts = ?
     WHERE id = ?`,
  )
    .bind(status, err.slice(0, 500), attempts, id)
    .run();
}

async function publishOne(env: Env): Promise<{ ok: boolean; message: string; pin_id?: string }> {
  const pin = await nextPin(env);
  if (!pin) return { ok: true, message: 'no queued pin ready' };
  try {
    const pinId = await publishPin(env, pin);
    await markPublished(env, pin.id, pinId);
    return { ok: true, message: `published pin id=${pin.id} title="${pin.title}"`, pin_id: pinId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await markFailed(env, pin.id, msg, (pin.attempts ?? 0) + 1);
    return { ok: false, message: msg };
  }
}

function authOk(req: Request, env: Env): boolean {
  const provided = req.headers.get('x-admin-key');
  return !!env.ADMIN_KEY && provided === env.ADMIN_KEY;
}

async function handleStatus(env: Env): Promise<Response> {
  const summary = await env.PIN_QUEUE.prepare(
    `SELECT status, COUNT(*) as n FROM pinterest_queue GROUP BY status`,
  ).all();
  const next = await nextPin(env);
  return Response.json({
    counts: summary.results,
    next: next && {
      id: next.id,
      title: next.title,
      scheduled_for: next.scheduled_for,
      board_name: next.board_name,
    },
    now: new Date().toISOString(),
  });
}

async function handleEnqueue(req: Request, env: Env): Promise<Response> {
  const body = await req.json<{ pins: Array<Omit<PinRow, 'id' | 'status' | 'pinterest_pin_id' | 'error' | 'attempts'>> }>();
  if (!Array.isArray(body.pins)) return new Response('body.pins required', { status: 400 });
  const stmt = env.PIN_QUEUE.prepare(
    `INSERT INTO pinterest_queue
       (title, description, media_url, link, board_name, scheduled_for, status, attempts)
     VALUES (?, ?, ?, ?, ?, ?, 'queued', 0)`,
  );
  const batch = body.pins.map((p) =>
    stmt.bind(p.title, p.description, p.media_url, p.link, p.board_name, p.scheduled_for),
  );
  const results = await env.PIN_QUEUE.batch(batch);
  return Response.json({ inserted: results.length });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (!authOk(req, env)) return new Response('unauthorized', { status: 401 });

    if (req.method === 'GET' && url.pathname === '/status') return handleStatus(env);
    if (req.method === 'POST' && url.pathname === '/publish-next') {
      const result = await publishOne(env);
      return Response.json(result, { status: result.ok ? 200 : 500 });
    }
    if (req.method === 'POST' && url.pathname === '/enqueue') return handleEnqueue(req, env);
    return new Response('not found', { status: 404 });
  },

  async scheduled(_ev: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      publishOne(env).then((r) => console.log(JSON.stringify({ cron: 'publish', ...r }))),
    );
  },
};
