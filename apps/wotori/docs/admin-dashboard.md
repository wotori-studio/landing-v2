# Admin Analytics Dashboard

Secure admin dashboard for viewing website analytics and visitor statistics.

## Access

- **Admin hub (login + overview):** `https://your-domain.com/admin` — if not authenticated, you see the password form; after login, the hub with links to sub-sections.
- **Analytics:** `https://your-domain.com/admin/analytics` — middleware requires a valid session; without it you are redirected to `/admin`.
- **Query params:** `days` = `7` | `30` | `90` (period). `epage` = Recent Events list page (1-based); omit for page 1. Example: `/admin/analytics?days=30&epage=3`.

**Access is password-protected.** `/admin/login` redirects to `/admin` (legacy URL).

## Setup

### Environment Variables

Add the admin password to your `.env.local` file:

```env
ADMIN_PASSWORD=your_secure_password_here
```

**Important:**
- Use a strong, unique password
- Never commit the password to git
- Add `ADMIN_PASSWORD` to Vercel environment variables for production

### Security Features

- **Password Protection**: Access requires password authentication
- **Rate Limiting**: Protection against brute force attacks (max 5 attempts per 15 minutes, 30-minute block after max attempts)
- **Session Management**: Secure HTTP-only cookies (24-hour expiration)
- **Session Token Validation**: Session tokens are validated on every request
- **Timing-Safe Comparison**: Prevents timing attacks on password verification
- **Middleware Protection**: `/admin/analytics` (and nested paths) are protected at the middleware level; `/admin` itself is not, so the login UI can load without a cookie
- **Server-Side Only**: All authentication logic runs on the server (password never exposed to client)
- **Secure Cookies**: HTTP-only, secure flag in production (HTTPS only), SameSite protection

## Features

The dashboard displays:

1. **Overview Statistics**
   - Total page views
   - Unique visitors count

2. **Top Pages**
   - Most visited pages
   - Views and unique visitors per page

3. **Views by Country**
   - Geographic distribution of visitors
   - Visual bar charts

4. **Daily Statistics**
   - Day-by-day breakdown
   - Views and unique visitors per day

5. **Recent Events**
   - Last 20 page views
   - Domain, path, location, and timestamp

## Usage

1. Navigate to `/admin`
2. Enter your admin password
3. You'll land on the admin hub; open **Analytics** for the dashboard
4. Session lasts 24 hours (or until logout)

## Data Source

The dashboard reads from the `analytics_events` table in Supabase using the service role key, which bypasses RLS policies for admin access.

## Logout

Click **Logout** in the admin navigation bar to end your session.

## Troubleshooting

### Login succeeds then immediately asks for password again (production)

The app signs in via **`POST /api/admin/login`**, which returns **JSON + `Set-Cookie`** on the same response, then the browser does a full navigation to **`/admin`**. This avoids Server Action + `router.push()` races on Vercel.

If the cookie still does not stick, check the items below. Middleware only runs on **`/admin/analytics`**, so `/admin` should not strip or block the session cookie.

**Analytics loaded in the Server Component** (`fetchAnalyticsStatsFromDb` on `/admin/analytics`), not via a Server Action from the client — avoids cases where `verifyAdminSession()` inside a Server Action did not see cookies even though the page RSC did.

Also check:

1. **`ADMIN_PASSWORD` in Vercel** — no accidental spaces or extra quotes (we trim and strip wrapping quotes).
2. **`secure` cookie** — enabled on all Vercel deploys (preview + production) over HTTPS.

### "Admin access is not configured"
- Check that `ADMIN_PASSWORD` is set in `.env.local`
- Restart dev server after adding the variable

### "Failed to load analytics"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check that `analytics_events` table exists
- Ensure service role key has proper permissions

### Session expires too quickly
- Default session duration is 24 hours
- You can modify `maxAge` in `admin-auth.ts` if needed

## Security Notes

### Password Security
- Password is stored only in environment variables (never in code)
- Password is hashed using SHA-256 before comparison
- Timing-safe comparison prevents timing attacks
- All authentication happens server-side (password never sent to client)

### Session Security
- Session tokens are cryptographically secure (SHA-256 hash)
- Session tokens are validated on every request
- Session cookies are HTTP-only (not accessible via JavaScript)
- Cookies use `secure` flag in production (HTTPS only)
- Cookies use `sameSite: "lax"` to prevent CSRF attacks
- Sessions expire after 24 hours

### Brute Force Protection
- Maximum 5 failed login attempts per 15-minute window
- IP address is blocked for 30 minutes after max attempts
- Rate limiting is enforced per IP address
- Failed attempts are tracked and cleared on successful login

### Why it works on localhost but breaks on Vercel (until fixed)

Typical differences:

1. **Environment variables** — `.env.local` is only on your machine. On Vercel you must set `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc. in the project **Environment Variables** for Production (and Preview if needed). A missing service role key breaks analytics load on the server.
2. **HTTPS and cookies** — Production uses `secure` cookies. Local `http://localhost` often uses non-secure cookies. Wrong domain / mixed hosts can prevent the session cookie from being sent.
3. **Serverless** — Each request may run in a fresh isolate; that’s fine as long as env and cookies are correct. There is no “sticky server” requirement.
4. **Server Actions vs RSC** — Calling admin APIs from the **browser** via Server Actions sometimes did not see the same cookies as **Server Components**. Analytics data is loaded in the **Server Component** for `/admin/analytics` so behavior matches localhost and Vercel.

### Production Recommendations
- Use a strong, unique password (at least 20 characters, mix of letters, numbers, symbols)
- Never commit `.env.local` to git
- Rotate the password periodically
- Monitor failed login attempts in logs
- Consider using Redis or database for rate limiting in production (instead of in-memory)
- Consider adding 2FA for additional security
