# Scripts Documentation

This directory contains utility scripts for the landing pages monorepo.

## Available Scripts

### `migrate-supabase.js`

Helper script that displays all Supabase migrations in a format ready for copy-paste execution.

**Usage:**
```bash
pnpm migrate
# or
node scripts/migrate-supabase.js
```

**What it does:**
- Scans `apps/ekza/supabase/migrations/` for SQL migration files
- Displays all migrations with clear formatting
- Provides direct link to Supabase Dashboard SQL Editor
- Shows step-by-step instructions for manual execution

**When to use:**
- When you need to see all migrations in one place
- For quick copy-paste execution in Supabase Dashboard
- As a reference for what migrations exist

## Supabase Migrations

### Automatic Execution (Recommended)

For automatic migration execution, use Supabase CLI:

```bash
cd apps/ekza
SUPABASE_ACCESS_TOKEN="your_token" pnpm supabase db push
```

**First-time setup:**
```bash
cd apps/ekza
SUPABASE_ACCESS_TOKEN="your_token" pnpm supabase link --project-ref snrjxwutqxokeujuiepn
```

**Requirements:**
- Supabase CLI installed (already in devDependencies)
- Access token from: https://supabase.com/dashboard/account/tokens
- Project ref: `snrjxwutqxokeujuiepn`

### Manual Execution

1. Run the helper script:
   ```bash
   pnpm migrate
   ```

2. Open Supabase Dashboard:
   - Go to: https://supabase.com/dashboard/project/snrjxwutqxokeujuiepn/sql/new

3. Copy each migration SQL from the script output

4. Paste into SQL Editor and click "Run"

## Migration Files Location

All migration files are located in:
```
apps/ekza/supabase/migrations/
```

**Current migrations:**
- `000_create_waitlist_users.sql` - Waitlist users table
- `001_create_ekza_subscribers.sql` - Newsletter subscribers table
- `002_create_analytics_events.sql` - Privacy-friendly analytics table

## Adding New Migrations

1. Create a new SQL file in `apps/ekza/supabase/migrations/`
2. Use sequential numbering: `003_description.sql`
3. Run `pnpm migrate` to verify it appears in the output
4. Execute via Supabase CLI or manually in Dashboard

## Troubleshooting

### Migrations not applying

- Check that migration files are in correct directory
- Verify SQL syntax is valid
- Check Supabase Dashboard for error messages

### Connection issues

- Ensure Supabase CLI is installed: `pnpm install`
- Verify access token is valid
- Check project is linked: `pnpm supabase link --project-ref snrjxwutqxokeujuiepn`

### Duplicate migration errors

- This means migration was already applied
- Check migration status in Supabase Dashboard
- Use `--include-all` flag if needed: `pnpm supabase db push --include-all`
