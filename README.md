# Tower Map

![Tower Map draft banner](public/banner.png)

**An editorial high-rise map for tracking signal, culture, and market gravity across the Solana ecosystem.**

Tower Map is built around a simple visual idea: the ecosystem is a living building.
Every project is a tenant. Every floor carries a different level of visibility, liquidity,
cultural heat, and long-term relevance.

The map is not meant to be a plain token list. It is a curated tower: part directory,
part archive, part market-reading surface.

## What Is Tower Map?

Tower Map turns ecosystem research into a navigable high-rise.

- Floors represent relative market gravity and cultural signal.
- Tenants represent Solana projects, tokens, memes, apps, infrastructure, and communities.
- Profiles collect the basic context around each tenant.
- Methodology explains why a tenant belongs in the tower.
- Wallet identity, saves, public counts, and tenant notes turn the map into a living archive.

## Product Pillars

**Editorial map**

Tower Map is designed as a visual reading layer for the Solana ecosystem, not a generic dashboard.

**Curated tenant registry**

The tower avoids stablecoins, wrapped assets, LP tokens, and other instruments that do not behave like native ecosystem tenants.

**Public by default**

The tower, floors, methodology, and tenant profiles are meant to be browsable without logging in.

**Wallet-native interaction**

Wallet login supports saved tenants, public save counts, and wallet-signed tenant notes.

**International surface**

The interface is designed for English first, with Japanese as an important cultural layer.

## Repository Status

This repository now contains the public tower experience, bilingual interface layer,
methodology documents, and the live tenant registry snapshot used by the app.

The building is still being constructed in visible layers. Each release adds another
piece of the tower rather than hiding the process.

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
|   +-- site-header.tsx
|   +-- tenant-save-control.tsx
|   +-- tower-experience.tsx
|   +-- wallet-identity.tsx
+-- data/
|   +-- categories.json
|   +-- floors.json
|   +-- registry-meta.json
|   +-- tenants.json
|   +-- tenants.sample.json
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
+-- public/
|   +-- banner.png
+-- lib/
|   +-- auth/
|   +-- i18n.ts
|   +-- tower-data.ts
+-- supabase/
|   +-- tenant-saves.sql
|   +-- wallet-identity.sql
+-- .env.example
+-- .gitignore
+-- CONTRIBUTING.md
+-- LICENSE
+-- next.config.mjs
+-- package.json
+-- README.md
+-- SECURITY.md
+-- tsconfig.json
```

## Builder Note

まだ建設中です。

この塔は、少しずつ階を増やしていきます。
まだ空いている部屋も、これから住人が入ってくる予定です。

The tower is still a sketch. Floors, tenants, public rooms, and community features
will be built step by step.

## Japanese Layer

Tower Map is English-first for code and technical documentation, but Japanese is
part of the public product surface.

日本語レイヤーは、ただの翻訳ではなく、この塔を少しやわらかく読むための入口です。

## Links

- Website: https://www.towermap.fun/
- Repository: https://github.com/kotoha-nikki/TOWER
