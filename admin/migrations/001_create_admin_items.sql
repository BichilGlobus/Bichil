CREATE TABLE IF NOT EXISTS admin_items (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_admin_items_category ON admin_items(category);
