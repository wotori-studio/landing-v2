-- Create waitlist_users table
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for waitlist signups)
CREATE POLICY "Allow anonymous inserts"
  ON waitlist_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Deny all selects (only service role can read)
CREATE POLICY "Deny all selects"
  ON waitlist_users
  FOR SELECT
  TO anon
  USING (false);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_waitlist_users_updated_at
  BEFORE UPDATE ON waitlist_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
