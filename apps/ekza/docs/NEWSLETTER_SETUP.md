# Newsletter Subscription Setup

This document contains step-by-step instructions for setting up the newsletter subscription functionality for the Ekza project.

## 1. Database (Supabase)

### Step 1: Execute SQL Query

1. Open your project in Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of file `apps/ekza/supabase/migrations/001_create_ekza_subscribers.sql`
4. Paste the SQL query into the editor and click **Run**

This query will create:
- `ekza_subscribers` table with fields:
  - `id` (UUID, primary key)
  - `email` (TEXT, unique)
  - `created_at` (TIMESTAMP)
- Index for fast email lookup
- Row Level Security (RLS) policies:
  - Allows anonymous `INSERT` (anyone can subscribe)
  - Denies anonymous `SELECT` (only authenticated users can read data)

### Alternative: Execute SQL directly

If you prefer to execute SQL directly, here's the query:

```sql
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
CREATE POLICY "Deny anonymous select on ekza_subscribers"
  ON ekza_subscribers
  FOR SELECT
  TO anon
  USING (false);
```

## 2. Environment Variables Setup

### Step 1: Create .env.local file

Create `.env.local` file in the `apps/ekza/` folder (if it doesn't exist):

```bash
cd apps/ekza
touch .env.local
```

### Step 2: Get data from Supabase

1. Open your project in Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Find the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (public key for client applications)

### Step 3: Fill .env.local

Open `apps/ekza/.env.local` file and add the following variables:

```env
# Supabase Configuration
# Server-side only variables (not exposed to browser for security)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:**
- Replace `https://your-project-id.supabase.co` with your actual Project URL from Supabase Dashboard
- Replace `your_anon_key_here` with your anon/public key from Supabase Dashboard
- **Use `SUPABASE_*` prefix (not `NEXT_PUBLIC_*`)** - these variables are only used in Server Actions and should not be exposed to the browser
- Do not commit `.env.local` file to git (it should already be in `.gitignore`)

### Example of filled .env.local:

```env
# Supabase Configuration
SUPABASE_URL=https://snrjxwutqxokeujuiepn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_If2spF4zvVtBqmNQ39nOBg_sJr5XGi7
```

**Note:** These variables are server-side only and are not exposed to the browser, ensuring better security.

## 3. Verification

After setup:

1. Make sure `.env.local` file is created and filled
2. Restart Next.js dev server:
   ```bash
   pnpm dev
   ```
3. Open page `http://localhost:3001` (or the port where ekza is running)
4. Scroll to the "Subscribe to Newsletter" section
5. Try subscribing by entering an email
6. Check in Supabase Dashboard (Table Editor → `ekza_subscribers`) that the record appeared

## 4. File Structure

Created files:

- `apps/ekza/supabase/migrations/001_create_ekza_subscribers.sql` - SQL migration
- `apps/ekza/src/app/actions/newsletter.ts` - Server Action for handling subscription
- `apps/ekza/src/components/newsletter-form.tsx` - React form component
- `apps/ekza/src/app/page.tsx` - updated main page (added newsletter section)

## 5. Troubleshooting

### Error: "Database is not configured"
- Check that `.env.local` file exists in `apps/ekza/` folder
- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables are filled (without `NEXT_PUBLIC_` prefix)
- Restart dev server after changing `.env.local`

### Error: "relation 'ekza_subscribers' does not exist"
- Make sure you executed the SQL query in Supabase SQL Editor
- Check in Supabase Dashboard (Table Editor) that `ekza_subscribers` table exists

### Error: "new row violates row-level security policy"
- Check that RLS policies are created correctly
- Make sure "Allow anonymous insert on ekza_subscribers" policy is active

## 6. Additional Information

- Supabase client is already configured in `apps/ekza/src/lib/supabase.ts`
- Form uses Next.js Server Actions for secure data handling
- Email validation is performed both on client (HTML5) and server (Zod)
- All errors are handled and displayed to the user
