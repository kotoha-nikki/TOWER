# Data Model

Tower Map uses a small set of structured objects to describe the building.

The main entities are:

- floor
- tenant
- category
- score fields
- verification fields

## Floor

A floor is a visual and editorial tier inside the tower.

```ts
type Floor = {
  floorNumber: number
  slug: string
  label: string
  tier: "penthouse" | "upper" | "mid" | "lower" | "lobby"
  narrative: string
  signalBands: string[]
  primaryCategories: string[]
}
```

Floors are not random rows. They express relative market gravity and cultural
visibility.

## Tenant

A tenant is a project, token, meme, app, infrastructure layer, or community that
belongs in the Tower Map reading surface.

```ts
type Tenant = {
  slug: string
  name: string
  ticker: string
  floor: number
  category: string
  description: string
  heat: number
  marketCapTier: MarketCapTier
  poolTier: PoolTier
  coingeckoId?: string
  contractAddress?: string | null
  contractStatus: "verified" | "pending-verification" | "not-applicable"
  sources: string[]
}
```

## Heat

`heat` is a 0 to 100 editorial signal score.

It can include:

- current attention
- cultural velocity
- social visibility
- recognizability
- narrative activity

Heat is not the same as market cap.

## Market Cap Tier

`marketCapTier` is a readable size band. It avoids false precision in the UI.

```text
Mega       >= 1B
Large      >= 250M
Mid-Large  >= 75M
Mid        >= 25M
Small-Mid  >= 5M
Emerging   >= 1M
Micro      < 1M
```

These bands are presentation tiers, not investment claims.

## Pool Tier

`poolTier` describes rough liquidity visibility.

```text
Large   strong liquidity presence
Medium  visible but more sensitive to movement
Small   thin or early liquidity
Unknown unavailable or pending data
```

## Contract Status

Contract addresses must not be invented.

```text
verified              confirmed from an official source or trusted registry
pending-verification  known tenant, address not yet verified
not-applicable        native layer or non-contract entry
```

## Exclusion Rules

Tower Map generally excludes assets that do not behave like normal tenants:

- stablecoins
- wrapped assets
- bridged assets
- staked SOL derivatives
- LP tokens
- tokenized stocks
- tokenized ETFs
- treasury and fund products

These assets can matter to the ecosystem, but they do not fit the editorial
tenant model.

## Why This Is Not Random Ranking

The tower uses a combined editorial framework:

- market gravity
- liquidity visibility
- cultural heat
- continuity
- native fit

This creates a map of ecosystem signal rather than a raw price leaderboard.
