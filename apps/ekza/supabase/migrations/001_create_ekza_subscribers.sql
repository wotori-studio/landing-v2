-- Create ekza_subscribers table for newsletter subscriptions
CREATE TABLE IF NOT EXISTS ekza_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast email lookup
CREATE INDEX IF NOT EXISTS idx_ekza_subscribers_email ON ekza_subscribers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE ekza_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous INSERT (anyone can subscribe)
CREATE POLICY "Allow anonymous insert on ekza_subscribers"
  ON ekza_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policy: Deny SELECT for anonymous users
-- (only authenticated users with permissions can read data)
CREATE POLICY "Deny anonymous select on ekza_subscribers"
  ON ekza_subscribers
  FOR SELECT
  TO anon
  USING (false);

-- Table and column comments
COMMENT ON TABLE ekza_subscribers IS 'Ekza Space newsletter subscribers table';
COMMENT ON COLUMN ekza_subscribers.id IS 'Unique subscriber identifier';
COMMENT ON COLUMN ekza_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN ekza_subscribers.created_at IS 'Subscription date and time';
