# Quick Start: Newsletter Subscription Setup

## 📋 What you need to do

### 1. SQL Query in Supabase

Open **Supabase Dashboard** → **SQL Editor** and execute SQL from file:
```
apps/ekza/supabase/migrations/001_create_ekza_subscribers.sql
```

Or copy and execute this query:

```sql
CREATE TABLE IF NOT EXISTS ekza_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ekza_subscribers_email ON ekza_subscribers(email);

ALTER TABLE ekza_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on ekza_subscribers"
  ON ekza_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Deny anonymous select on ekza_subscribers"
  ON ekza_subscribers
  FOR SELECT
  TO anon
  USING (false);
```

### 2. Configure .env.local

Create `apps/ekza/.env.local` file and add:

```env
# Server-side only variables (not exposed to browser for security)
SUPABASE_URL=https://snrjxwutqxokeujuiepn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_If2spF4zvVtBqmNQ39nOBg_sJr5XGi7
```

**Note:** Use `SUPABASE_*` prefix (not `NEXT_PUBLIC_*`) - these are server-side only variables.

**Where to find project URL:**
1. Open Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy **Project URL** (looks like `https://xxxxx.supabase.co`)

**Your anon key is already provided above** - use it.

### 3. Done! 🎉

Restart dev server:
```bash
pnpm dev
```

The subscription form will appear on the main page in the "Subscribe to Newsletter" section.

---

Detailed documentation: see `docs/NEWSLETTER_SETUP.md`
