-- Prevent repeated imports of the same campaign row.
-- Each Pinterest destination link includes a unique utm_content value, making
-- the complete link a stable campaign-row identity.

CREATE UNIQUE INDEX IF NOT EXISTS idx_pinterest_queue_unique_link
  ON pinterest_queue (link);
