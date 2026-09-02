-- Pinterest publish queue for stackgeist-pinterest-scheduler worker.
-- Lives in the same D1 database as affiliate_events (stackgeist-affiliate-events).

CREATE TABLE IF NOT EXISTS pinterest_queue (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  media_url         TEXT NOT NULL,        -- public image URL Pinterest fetches
  link              TEXT NOT NULL,        -- destination URL with UTM params
  board_name        TEXT NOT NULL,        -- resolved to board_id via env var map
  scheduled_for     TEXT NOT NULL,        -- ISO8601; pin only publishes at/after this time
  status            TEXT NOT NULL DEFAULT 'queued'
                       CHECK (status IN ('queued','published','failed')),
  pinterest_pin_id  TEXT,
  error             TEXT,
  attempts          INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  published_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_pinterest_queue_ready
  ON pinterest_queue (status, scheduled_for);
