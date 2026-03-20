# Landing Pages Monorepo

A modern monorepo for Wotori Studio's landing pages built with Next.js, Supabase, and Turborepo.

## 🎯 About Wotori Studio

**Wotori Studio** is a decentralized animation and production studio building platforms and content for cross-cultural collaboration in web3. We develop creator-first products in gaming, media, and digital ownership, partnering with teams, investors, and communities to launch connected ecosystems at global scale.

This monorepo serves as the foundation for our public-facing projects and will continue to grow as we launch new initiatives.

## 🏗 Project Structure

```
.
├── apps/
│   ├── wotori/          # Wotori Studio landing page (Next.js)
│   └── ekza/             # Ekza Space landing page (Next.js)
├── packages/
│   ├── ui/               # Shared UI component library (shadcn/ui)
│   ├── locales/         # Translations and i18n utilities
│   └── config/           # Shared configurations (TS, ESLint, Tailwind)
└── package.json          # Root package.json with pnpm workspaces
```

## 🚀 Quick Start

### Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Start both applications in development mode
pnpm dev
```

Applications will be available at:
- **Wotori Studio**: http://localhost:3000
- **Ekza Space**: http://localhost:3001

### Environment Setup

1. Copy `.env.example` to `.env.local` in the root and in `apps/ekza/`:

```bash
cp .env.example .env.local
cp .env.example apps/ekza/.env.local
```

2. Fill in environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

3. Apply Supabase migrations:

```bash
# Via Supabase CLI
supabase db push

# Or via Supabase Dashboard SQL Editor
# Copy and run: apps/ekza/supabase/migrations/001_create_waitlist_users.sql
```

## 📦 Commands

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Install dependencies
make install

# Setup project (install + create .env files)
make setup

# Start both applications in development mode
make dev

# Start only Wotori (port 3000)
make dev-wotori

# Start only Ekza (port 3001)
make dev-ekza

# Build all applications
make build

# TypeScript type checking
make type-check

# Validate project (type-check + build + lint)
make validate

# Full setup test
make test-setup

# Project information
make info
```

### Direct pnpm Commands

```bash
# Development (runs both projects in parallel)
pnpm dev

# Build all projects
pnpm build

# Linting
pnpm lint

# Clean
pnpm clean

# Format code
pnpm format
```

## 🎨 Shared Components

Components from `packages/ui` are available in both applications:

```tsx
import { Button } from "@repo/ui";
```

## 🌍 Localization

Translations are located in `packages/locales/src/translations.json`. Supported languages: `en`, `ru`, `zh`.

Usage in components:

```tsx
import { useI18n } from "../lib/i18n-provider";

function MyComponent() {
  const { t } = useI18n();
  return <h1>{t("wotori.intro.title")}</h1>;
}
```

## 🗄 Database (Supabase)

### Tables

- `waitlist_users` - Waitlist signups for ekza.io

### Row Level Security (RLS)

- Anonymous users can create records in `waitlist_users`
- Data reading is only available via service role key

## 📧 Email (Resend)

After successful waitlist registration, a welcome email is sent via Resend.

## 🚢 Deployment

### Vercel

1. Connect the repository to Vercel
2. Configure two projects:
   - `apps/wotori` → wotori.io
   - `apps/ekza` → ekza.io
3. Add environment variables from `.env.example`
4. Deployment will happen automatically on push to main

### Vercel Monorepo Configuration

For each project, specify:
- **Root Directory**: `apps/wotori` or `apps/ekza`
- **Build Command**: `cd ../.. && pnpm build --filter=@repo/wotori` (or `@repo/ekza`)
- **Install Command**: `pnpm install`

## 🔧 Development

### Adding a New Component to packages/ui

1. Create component in `packages/ui/src/components/`
2. Export it from `packages/ui/src/index.ts`
3. Component is automatically available in both applications

### Adding a New Translation

1. Open `packages/locales/src/translations.json`
2. Add key to all languages (en, ru, zh)
3. Changes apply automatically

## 📝 License

MIT

---

**Built with ❤️ by Wotori Studio**
