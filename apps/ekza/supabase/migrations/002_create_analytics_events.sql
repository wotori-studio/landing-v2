-- Create analytics_events table for privacy-friendly analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  user_agent TEXT,
  continent TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_domain ON analytics_events(domain);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_hash ON analytics_events(visitor_hash);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path ON analytics_events(path);

-- Enable Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous INSERT (anyone can track events)
CREATE POLICY "Allow anonymous insert on analytics_events"
  ON analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policy: Deny SELECT for anonymous users
-- Only authenticated admin users can read analytics data
CREATE POLICY "Deny anonymous select on analytics_events"
  ON analytics_events
  FOR SELECT
  TO anon
  USING (false);

-- RLS Policy: Deny UPDATE for anonymous users
CREATE POLICY "Deny anonymous update on analytics_events"
  ON analytics_events
  FOR UPDATE
  TO anon
  USING (false);

-- RLS Policy: Deny DELETE for anonymous users
CREATE POLICY "Deny anonymous delete on analytics_events"
  ON analytics_events
  FOR DELETE
  TO anon
  USING (false);

-- Table and column comments
COMMENT ON TABLE analytics_events IS 'Privacy-friendly analytics events table';
COMMENT ON COLUMN analytics_events.id IS 'Unique event identifier';
COMMENT ON COLUMN analytics_events.domain IS 'Website domain (e.g., wotori.io)';
COMMENT ON COLUMN analytics_events.path IS 'Page path (e.g., / or /pricing)';
COMMENT ON COLUMN analytics_events.visitor_hash IS 'Anonymized visitor hash (SHA-256 of IP + User-Agent + date)';
COMMENT ON COLUMN analytics_events.user_agent IS 'User agent string';
COMMENT ON COLUMN analytics_events.continent IS 'Visitor continent';
COMMENT ON COLUMN analytics_events.country IS 'Visitor country';
COMMENT ON COLUMN analytics_events.city IS 'Visitor city';
COMMENT ON COLUMN analytics_events.created_at IS 'Event timestamp';
