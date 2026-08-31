CREATE TABLE IF NOT EXISTS affiliate_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL CHECK (event_type IN ('landing', 'affiliate_click')),
  page_path TEXT NOT NULL,
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  placement TEXT NOT NULL DEFAULT '',
  product_id TEXT NOT NULL DEFAULT '',
  schema_version TEXT NOT NULL CHECK (schema_version = '1')
);

CREATE INDEX IF NOT EXISTS idx_affiliate_events_created_at
  ON affiliate_events(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_events_type_created
  ON affiliate_events(event_type, created_at);
