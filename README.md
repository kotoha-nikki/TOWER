# Tower Map

![Tower Map night banner](public/banner.png)

**An editorial high-rise map for tracking signal, culture, liquidity, and
market gravity across the Solana ecosystem.**

少しずつ、塔に灯りを入れていく。

Tower Map turns ecosystem research into a living building. Every project is a
tenant. Every floor represents a different mix of visibility, liquidity,
cultural heat, continuity, and editorial relevance.

It is not a generic token list or a raw price leaderboard. It is a curated map:
part directory, part archive, part public attention layer.

## Official Links

This repository is the open build record for Tower Map.

- Website: [towermap.fun](https://www.towermap.fun)
- X: [@TowerMapFun](https://x.com/TowerMapFun)
- Telegram: [Tower Map](https://t.me/TowerMap)
- Repository: [kotoha-nikki/TOWER](https://github.com/kotoha-nikki/TOWER)
- Releases: [Tower Map releases](https://github.com/kotoha-nikki/TOWER/releases)

## Current Release

```text
version: 1.1.6
status: public tower + wallet identity + saves + tenant notes + moderation + analytics + tower health
website: https://www.towermap.fun
x: https://x.com/TowerMapFun
telegram: https://t.me/TowerMap
repository: https://github.com/kotoha-nikki/TOWER
```

## Why Tower Map Exists

Crypto ecosystems are not flat.

Some projects have market gravity. Some have cultural heat. Some are quiet but
structural. Some are loud for a week and disappear. Some slowly become part of
the building.

Tower Map gives that shape a public interface.

- Tenants are projects, tokens, memes, apps, infrastructure, and communities.
- Floors are editorial tiers, not random rows.
- Saves turn wallet attention into a public signal.
- Tenant Notes let profiles collect public memory.
- Moderation keeps public rooms readable.
- Analytics turns tower activity into an observation layer.

## Current Build Layers

- Public tower homepage
- Interactive floor map
- Tenant directory side sheet
- Tenant profile pages
- Methodology page
- English interface with a Japanese public layer
- Live tenant registry data
- Contract address verification fields
- Phantom / Solflare / Backpack wallet connect
- Signed-message wallet login
- Supabase wallet identity layer
- Public tenant save counts
- Save / Saved controls for signed-in wallets
- Tenant Notes for wallet-gated public comments
- Tenant Notes moderation rules and community guidelines
- Content report issue workflow
- Registry operations report
- Moderation operations report
- Public analytics snapshot
- Tower Pulse implementation plan
- Tower Health status summary
- Node test suite and release checks

## Product Pillars

**Editorial map**

Tower Map is a reading layer for ecosystem signal. It groups tenants by market
gravity, cultural heat, liquidity visibility, continuity, and native fit.

**Curated tenant registry**

The registry avoids stablecoins, wrapped assets, LP tokens, and generic
financial instruments that do not behave like native ecosystem tenants.

**Public by default**

The tower, methodology, directory, profiles, save counts, and visible Tenant
Notes are browsable without login.

**Wallet-native interaction**

Wallet signatures create identity for saves and Tenant Notes. The signed
message does not authorize a transaction or move funds.

**Moderated community surface**

Tenant Notes are public and wallet-gated, but they are not an unmanaged message
board. Tower Map documents review rules, content reports, hidden/deleted note
states, and wallet-level restriction logic so profiles can stay useful and safe.

**Public analytics**

Tower Map produces its own public observation data from the registry, wallet
saves, Tenant Notes activity, floor heat, category coverage, and contract
verification status. This prepares the product for a future Tower Pulse page.

**Tower health**

Tower Map summarizes public route coverage, wallet readiness, registry review,
moderation readiness, analytics freshness, and scheduled maintenance work into a
healthy operations layer.

## Moderation Model

Tenant Notes use a visible-notes-only public read model. Hidden notes, deleted
notes, content reports, and wallet-level restrictions are documented as
moderation operations so public rooms stay readable as the tower grows.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Supabase
- Ed25519 wallet signature verification with `tweetnacl`
- Base58 wallet encoding with `bs58`
- HttpOnly HMAC-signed session cookies
- Node test runner
- Generated operations reports

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

Planned Tower Pulse routes:

```text
/pulse
/en/pulse
/ja/pulse
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
data/floors.json            floor schema
data/categories.json        category schema
data/tenants.json           live tenant registry snapshot
data/analytics.sample.json  public analytics export shape
data/registry-meta.json     registry metadata
```

The tenant registry mirrors the public Tower Map API snapshot and keeps
verification fields separate from display fields. Contract addresses are not
invented.

## Operations

Tower Map includes repeatable checks so the building stays inspectable as it
grows.

```bash
npm run validate:data
npm run registry:report
npm run moderation:report
npm run analytics:snapshot
npm run status:report
npm test
npm run release:check
```

Generated reports:

```text
reports/registry-summary.json
reports/moderation-summary.json
reports/analytics-snapshot.json
reports/status-summary.json
```

Operations documentation:

```text
docs/registry-operations.md
docs/moderation.md
docs/community-guidelines.md
docs/analytics.md
docs/status.md
docs/operations-checklist.md
docs/tower-pulse.md
docs/tower-pulse-implementation.md
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

Security check:

```bash
npm audit --omit=dev
```

## Repository Map

```text
app/          Next.js routes and API routes
components/   shared React components
data/         floor, category, tenant, registry, and analytics data
docs/         architecture, operations, moderation, analytics, and roadmap docs
lib/          data helpers and wallet auth utilities
public/       public visual assets
reports/      generated registry, moderation, and analytics reports
scripts/      validation and report generation scripts
supabase/     database schema files
tests/        Node test suite
```

## Builder Notes

This repository is built in visible layers, like a tower under construction.

The public map, registry, language layer, wallet identity, save system, Tenant
Notes layer, QA workflow, registry operations, moderation workflow, public
analytics layer, and Tower Pulse implementation plan are already in place.

この塔は、まだ建設中です。
