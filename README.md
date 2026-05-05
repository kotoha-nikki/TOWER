# Tower Map

![Tower Map night banner](public/banner.png)

**An editorial high-rise map for tracking signal, culture, liquidity, and
market gravity across the Solana ecosystem.**

Tower Map turns ecosystem research into a living building. Every project is a
tenant. Every floor represents a different mix of visibility, liquidity,
cultural heat, continuity, and editorial relevance.

It is not a generic token list or a raw price leaderboard. It is a curated map:
part directory, part archive, part public attention layer.

少しずつ、塔に灯りを入れていく。

## Current Release

```text
version: 1.1.2
status: public tower + wallet identity + saves + tenant notes + moderation + registry operations
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
- Tenant Notes for wallet-gated public comments
- Moderation foundation, rate limit, and soft delete for notes
- Tenant Notes moderation rules and community guidelines
- Content report issue workflow
- Moderation operations report
- Data validation scripts
- Registry operations report
- Node test suite
- Release consistency checks
- Deployment, maintenance, changelog, issue, and PR workflows

## Core Narrative

Tower Map treats the ecosystem as a high-rise.

- Higher floors carry stronger combined signal.
- Tenants are projects, tokens, memes, apps, infrastructure, and communities.
- Floors are editorial tiers, not random rows.
- Saves turn wallet attention into a public signal.
- Tenant Notes turn profiles into living rooms of commentary.
- Moderation keeps Tenant Notes community-readable instead of unmanaged.
- Registry operations keep the building inspectable as it grows.
- Japanese is part of the product surface, not just a translation pass.

## Product Pillars

**Editorial map**

Tower Map is a reading layer for ecosystem signal. It groups tenants by market
gravity, cultural heat, liquidity visibility, continuity, and native fit.

**Curated tenant registry**

The registry avoids stablecoins, wrapped assets, LP tokens, and generic
financial instruments that do not behave like native ecosystem tenants.

**Public by default**

The tower, methodology, directory, profiles, save counts, and visible tenant
notes are browsable without login.

**Wallet-native interaction**

Wallet signatures create identity for saves and tenant notes. The signed
message does not authorize transactions.

**Moderated community surface**

Tenant Notes are public and wallet-gated, but they are not an unmanaged message
board. Tower Map documents review rules, content reports, hidden/deleted note
states, and wallet-level restriction logic so profiles can stay useful and safe.

**Operations-minded registry**

Tenant data is checked by scripts, tests, and generated reports before release.
The registry has floor occupancy, category coverage, CA status, duplicate
ticker, and review flag visibility.

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
POST   /api/auth/nonce      create one-time wallet login challenge
POST   /api/auth/verify     verify signed message and create session
GET    /api/auth/session    read current wallet session
POST   /api/auth/logout     clear session

GET    /api/favorites       read public save counts and wallet saved slugs
POST   /api/favorites       save or unsave a tenant

GET    /api/notes           read visible tenant notes
POST   /api/notes           create a wallet-gated tenant note
DELETE /api/notes           soft-delete a note owned by the current wallet
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

## Registry Operations

The registry is not maintained as a random list. Tower Map includes an
operations report for inspecting tenant data before releases.

```bash
npm run registry:report
```

The report writes:

```text
reports/registry-summary.json
```

It tracks:

- Floor occupancy
- Category coverage
- CA verification status
- Empty floors
- Overcrowded floors
- Duplicate tickers
- Maintenance review flags

## Moderation Model

Tower Map allows public Tenant Notes, but the comment layer is designed as a
moderated community surface.

```bash
npm run moderation:report
```

The report writes:

```text
reports/moderation-summary.json
```

It checks:

- Tenant Notes review rules
- Community guidelines
- Content report issue template
- Visible / hidden / deleted note states
- Reserved `moderation_actions` workflow
- Hide note, delete note, wallet ban, and wallet unban action coverage

Moderation documentation:

```text
docs/moderation.md
docs/community-guidelines.md
```

## Supabase Tables

Run these SQL files in Supabase:

```text
supabase/wallet-identity.sql
supabase/tenant-saves.sql
supabase/tenant-notes.sql
```

They create:

```text
wallet_users
wallet_login_nonces
tenant_saves
tenant_save_counts
tenant_notes
moderation_actions
public_tenant_notes
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

Full QA pass:

```bash
npm run qa
```

Data validation only:

```bash
npm run validate:data
```

Registry operations report:

```bash
npm run registry:report
```

Moderation operations report:

```bash
npm run moderation:report
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
|   +-- api/notes/
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
|   +-- tenant-notes.tsx
|   +-- tenant-save-control.tsx
|   +-- tower-experience.tsx
|   +-- wallet-identity.tsx
+-- data/
|   +-- categories.json
|   +-- floors.json
|   +-- registry-meta.json
|   +-- tenants.json
+-- scripts/
|   +-- check-release.mjs
|   +-- registry-report.mjs
|   +-- moderation-report.mjs
|   +-- validate-data.mjs
+-- tests/
|   +-- data-integrity.test.mjs
|   +-- routes.test.mjs
+-- docs/
|   +-- architecture.md
|   +-- data-model.md
|   +-- deployment.md
|   +-- design-system.md
|   +-- i18n.md
|   +-- maintenance.md
|   +-- methodology.md
|   +-- moderation.md
|   +-- community-guidelines.md
|   +-- project-overview.md
|   +-- registry-operations.md
|   +-- release-notes.md
|   +-- roadmap.md
|   +-- tenant-notes.md
|   +-- tenant-registry.md
|   +-- tenant-saves.md
|   +-- wallet-identity.md
+-- lib/
|   +-- auth/
|   +-- i18n.ts
|   +-- tower-data.ts
+-- public/
|   +-- banner.png
+-- reports/
|   +-- registry-summary.json
|   +-- moderation-summary.json
+-- supabase/
|   +-- tenant-notes.sql
|   +-- tenant-saves.sql
|   +-- wallet-identity.sql
+-- .github/
|   +-- ISSUE_TEMPLATE/
|   +-- PULL_REQUEST_TEMPLATE.md
+-- CHANGELOG.md
```

## Builder Notes

This repository is built in visible layers, like a tower under construction.

The foundation is no longer empty: the public map, registry, language layer,
wallet identity, save system, tenant notes layer, QA workflow, and registry
operations layer are already in place. Future layers can add richer moderation
tooling, operations dashboards, data maintenance workflows, and more editorial
surfaces.

この塔は、少しずつ上に伸びていきます。
