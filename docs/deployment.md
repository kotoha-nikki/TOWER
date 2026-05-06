# Deployment Guide

Tower Map is a Next.js App Router application with server API routes for wallet
identity, saves, and tenant notes.

## Required Services

- Vercel or any Node-compatible Next.js host
- Supabase project
- GitHub repository access

## Environment Variables

Production requires:

```text
NEXT_PUBLIC_SITE_URL=https://www.towermap.fun
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=
AUTH_NONCE_TTL_SECONDS=300
AUTH_SESSION_TTL_SECONDS=604800
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=
```

`SESSION_SECRET` must be at least 32 characters.

## Supabase Setup

Run the schema files in this order:

```text
supabase/wallet-identity.sql
supabase/tenant-saves.sql
supabase/tenant-notes.sql
```

The service role key must only be stored as a server-side environment variable.
Do not expose it to the browser.

## Build Command

```bash
npm install
npm run qa
```

For hosts that separate validation and production build:

```bash
npm run validate:data
npm test
npm run build
```

## Release Checklist

- Data validation passes.
- Moderation report passes.
- Analytics snapshot passes.
- Tests pass.
- Production build passes.
- README version matches `package.json`.
- `CHANGELOG.md` has an entry for the version.
- Release notes are prepared from `docs/release-notes.md`.
