# Privacy-Friendly Analytics Setup

This document describes how to set up and use the custom, GDPR-compliant analytics system for the landing pages monorepo.

## Overview

The analytics system is designed to be:
- **GDPR-compliant**: No raw IP addresses stored, no cookies used
- **Privacy-friendly**: Visitor data is anonymized using SHA-256 hashing
- **Non-blocking**: Analytics tracking runs asynchronously in the background
- **Universal**: Works across all apps in the monorepo

## Architecture

The analytics system consists of:
1. **Database table** (`analytics_events`) - Stores anonymized event data
2. **Server Action** (`trackEvent`) - Handles data collection and anonymization
3. **React Component** (`AnalyticsTracker`) - Automatically tracks page views

## Step 1: Database Setup (Supabase)

### Execute SQL Migration

1. Open your Supabase project in the Dashboard
2. Navigate to **SQL Editor**
3. Copy and execute the contents of:
   ```
   apps/ekza/supabase/migrations/002_create_analytics_events.sql
   ```

This will create:
- `analytics_events` table with all required columns
- Indexes for efficient querying
- Row Level Security (RLS) policies:
  - Allows anonymous `INSERT` (anyone can track events)
  - Denies `SELECT`, `UPDATE`, `DELETE` for anonymous users (only admins can read)

### Table Structure

```sql
analytics_events
├── id (UUID, primary key)
├── domain (TEXT) - Website domain
├── path (TEXT) - Page path
├── visitor_hash (TEXT) - Anonymized visitor identifier
├── user_agent (TEXT) - User agent string
├── continent (TEXT) - Visitor continent
├── country (TEXT) - Visitor country
├── city (TEXT) - Visitor city
└── created_at (TIMESTAMPTZ) - Event timestamp
```

## Step 2: Environment Variables

Make sure your `.env.local` file contains Supabase credentials:

```env
# Server-side only variables (not exposed to browser for security)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** These variables use `SUPABASE_*` prefix (not `NEXT_PUBLIC_*`) because they are only used in Server Actions and should not be exposed to the browser.

## Step 3: Install Dependencies

The analytics package is already added to your app's dependencies. If you need to install it manually:

```bash
pnpm install
```

The `@repo/analytics` package will be installed as a workspace dependency.

## Step 4: Integration

### Add to Root Layout

Import and add the `AnalyticsTracker` component to your root layout:

```tsx
// apps/ekza/src/app/layout.tsx
import { AnalyticsTracker } from "@repo/analytics";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
```

The component is invisible and will automatically track page views on all pages.

## How It Works

### Data Collection

1. **Client-side**: `AnalyticsTracker` uses `usePathname()` and sends:
   - A **first-party visitor id** stored in `localStorage` under `repo_analytics_vid` (random UUID, stable until the user clears site data)
   - The visitor’s **local calendar date** `YYYY-MM-DD` (same “day” in their timezone)
2. **Server-side**: `trackEvent` reads geo and UA from Vercel headers only (not stored as raw IP).

### Privacy Protection

**Anonymization Process:**
1. `visitor_hash = SHA256(visitorKey + "|" + clientLocalDate)` — not tied to IP, so **CGNAT / rotating mobile IPs** do not split one device into many “visitors” in one day.
2. Only the hash is stored in the database (`visitor_hash`). The raw `visitorKey` is never stored.
3. Raw IP is never stored or logged.
4. **localStorage** is used (not cookies) for the anonymous id.

**Result:**
- Same browser + same calendar day → same `visitor_hash` (stable unique visitors per day)
- New day → new hash for that browser
- Clearing site data → new visitor id

### Non-Blocking Execution

- Server Action runs asynchronously
- Database errors are caught and logged, but never thrown
- Page rendering is never blocked by analytics
- If database is unavailable, site continues to work normally

## Querying Analytics Data

Since RLS policies prevent anonymous reads, you'll need to:

1. **Use Supabase Dashboard**: Access data directly in Table Editor (as admin)
2. **Create Admin API**: Build an authenticated endpoint for reading analytics
3. **Use Service Role Key**: For server-side admin operations

### Example: Query by Domain

```sql
SELECT 
  path,
  COUNT(*) as views,
  COUNT(DISTINCT visitor_hash) as unique_visitors
FROM analytics_events
WHERE domain = 'wotori.io'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY path
ORDER BY views DESC;
```

### Example: Daily Visitors

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT visitor_hash) as unique_visitors,
  COUNT(*) as total_views
FROM analytics_events
WHERE domain = 'wotori.io'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Troubleshooting

### Events Not Being Tracked

1. **Check Supabase configuration**:
   - Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set (without `NEXT_PUBLIC_` prefix)
   - Check browser console for warnings

2. **Check database**:
   - Verify `analytics_events` table exists
   - Check RLS policies are active
   - Verify INSERT policy allows anonymous access

3. **Check Vercel headers**:
   - Headers are only available on Vercel deployments
   - Local development will use `127.0.0.1` as IP

### Database Errors

- Analytics failures are logged to console but don't break the site
- Check server logs for `[Analytics]` prefixed messages
- Ensure Supabase is accessible from your deployment

## Privacy Compliance

This analytics system is designed to be GDPR-compliant:

✅ **No raw IP addresses stored**
✅ **No cookies used**
✅ **Data is anonymized before storage**
✅ **RLS policies prevent unauthorized access**
✅ **No personal data collected**

However, you should still:
- Add analytics disclosure to your privacy policy
- Inform users about data collection (if required by your jurisdiction)
- Provide opt-out mechanism if needed

## Using in Other Apps

To use analytics in other apps (e.g., `apps/wotori`):

1. Add dependency to `apps/wotori/package.json`:
   ```json
   {
     "dependencies": {
       "@repo/analytics": "workspace:*"
     }
   }
   ```

2. Add to root layout:
   ```tsx
   import { AnalyticsTracker } from "@repo/analytics";
   ```

3. Run SQL migration in your Supabase project (same table works for all apps)

4. Ensure environment variables are set

## File Structure

```
packages/analytics/
├── src/
│   ├── track.ts              # Server Action for tracking
│   ├── analytics-tracker.tsx  # React component
│   └── index.ts              # Exports
├── package.json
└── tsconfig.json

apps/ekza/
├── supabase/migrations/
│   └── 002_create_analytics_events.sql
└── src/app/
    └── layout.tsx  # Integration point
```
