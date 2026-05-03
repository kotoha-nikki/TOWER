# Tower Map

![Tower Map draft banner](public/banner.png)

**An editorial high-rise map for tracking signal, culture, liquidity, and market
gravity across the Solana ecosystem.**

Tower Map turns ecosystem research into a living building. Every project is a
tenant. Every floor represents a different mix of visibility, liquidity,
cultural heat, continuity, and editorial relevance.

It is not a generic token list or a raw price leaderboard. It is a curated map:
part directory, part archive, part public attention layer.

まだ建設中。でも、もう人が住みはじめています。

## Current Release

```text
version: 1.0.7
status: public tower + wallet identity + tenant saves
website: https://www.towermap.fun/
repository: https://github.com/kotoha-nikki/TOWER
```

## What Is Live

- Public tower homepage
- Interactive floor map
- Tenant directory side sheet
- Tenant profile pages
- Methodology page
- English and Japanese interface layer
- Live tenant registry data
- Contract address verification fields
- Phantom / Solflare / Backpack wallet connect
- Signed-message wallet login
- Supabase wallet identity layer
- Public tenant save counts
- Save / Saved controls for signed-in wallets

## Core Narrative

Tower Map treats the Solana ecosystem as a high-rise.

- Higher floors carry stronger combined signal.
- Tenants are projects, tokens, memes, apps, infrastructure, and communities.
- Floors are editorial tiers, not random rows.
- Saves turn wallet attention into a public signal.
- Japanese is part of the product surface, not just a translation pass.

## Product Pillars

**Editorial map**

Tower Map is a reading layer for ecosystem signal. It groups tenants by market
gravity, cultural heat, liquidity visibility, continuity, and native fit.

**Curated tenant registry**

The registry avoids stablecoins, wrapped assets, LP tokens, and generic
financial instruments that do not behave like native ecosystem tenants.

**Public by default**

The tower, methodology, directory, and profiles are browsable without login.

**Wallet-native interaction**

Wallet signatures create identity for saves, public counts, and future tenant
notes. The signed message does not authorize transactions.

**International surface**

The app is English-first in code and technical documentation, with Japanese as a
public cultural layer.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Supabase
- Ed25519 wallet signature verification with `tweetnacl`
- Base58 wallet encoding with `bs58`
- HttpOnly HMAC-signed session cookies

## App Routes

```text
/                      public English tower
/en                   English tower
/ja                   Japanese tower
/methodology          default methodology
/en/methodology       English methodology
/ja/methodology       Japanese methodology
/profile/[slug]       default tenant profile
/en/profile/[slug]    English tenant profile
/ja/profile/[slug]    Japanese tenant profile
```

## API Routes

```text
POST /api/auth/nonce      create one-time wallet login challenge
POST /api/auth/verify     verify signed message and create session
GET  /api/auth/session    read current wallet session
POST /api/auth/logout     clear session

GET  /api/favorites       read public save counts and wallet saved slugs
POST /api/favorites       save or unsave a tenant
```

## Data Layers

```text
data/floors.json          floor schema
data/categories.json      category schema
data/tenants.json         live tenant registry snapshot
data/registry-meta.json   registry metadata
```

The tenant registry mirrors the public Tower Map API snapshot and keeps
verification fields separate from display fields. Contract addresses are not
invented.

## Supabase Tables

Run these SQL files in Supabase:

```text
supabase/wallet-identity.sql
supabase/tenant-saves.sql
```

They create:

```text
wallet_users
wallet_login_nonces
tenant_saves
tenant_save_counts
```

The browser never receives the Supabase service role key. Mutations go through
server API routes.

## Environment

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

## Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Security check:

```bash
npm audit --omit=dev
```

## Project Structure

```text
.
+-- app/
|   +-- api/auth/
|   +-- api/favorites/
|   +-- en/
|   +-- ja/
|   +-- methodology/
|   +-- profile/
|   +-- globals.css
|   +-- layout.tsx
|   +-- page.tsx
+-- components/
|   +-- localized-home-page.tsx
|   +-- localized-methodology-page.tsx
|   +-- localized-profile-page.tsx
|   +-- site-header.tsx
|   +-- tenant-save-control.tsx
|   +-- tower-experience.tsx
|   +-- wallet-identity.tsx
+-- data/
|   +-- categories.json
|   +-- floors.json
|   +-- registry-meta.json
|   +-- tenants.json
+-- docs/
|   +-- architecture.md
|   +-- data-model.md
|   +-- design-system.md
|   +-- i18n.md
|   +-- methodology.md
|   +-- project-overview.md
|   +-- roadmap.md
|   +-- tenant-registry.md
|   +-- tenant-saves.md
|   +-- wallet-identity.md
+-- lib/
|   +-- auth/
|   +-- i18n.ts
|   +-- tower-data.ts
+-- public/
|   +-- banner.png
+-- supabase/
|   +-- tenant-saves.sql
|   +-- wallet-identity.sql
```

## Builder Notes

This repository is built in visible layers, like a tower under construction.

The foundation is no longer empty: the public map, registry, language layer,
wallet identity, and save system are already in place. Future layers will add
tenant notes, moderation fields, operations tooling, and richer data maintenance.

この塔は、少しずつ上に伸びていきます。
