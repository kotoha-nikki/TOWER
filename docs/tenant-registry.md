# Tenant Registry

Tower Map keeps its tenant registry as structured data in `data/tenants.json`.

This registry mirrors the current public Tower Map API snapshot. It is not a
synthetic list, and the app reads it as the source for public floor placement,
tenant profiles, category tags, and verification state.

## Source

```text
https://www.towermap.fun/api/tower
```

Snapshot metadata is stored in `data/registry-meta.json`.

```text
floors: 23
tenant records: 287
unique tickers: 284
```

## Placement Fields

Each tenant includes:

- `floor`: the current public floor assignment
- `category`: normalized category label used by the app
- `sourceCategory`: category label from the public API snapshot
- `heat`: editorial heat score
- `marketCapTier`: readable size tier
- `poolTier`: readable liquidity tier
- `change24h`: source 24h movement when available
- `direction`: up, down, flat, or null

## Verification Fields

Contract addresses are handled conservatively.

- `contractStatus: "verified"` means the address has been confirmed from an
  official source or trusted registry.
- `contractStatus: "pending-verification"` means the tenant is in the tower,
  but the address should not be displayed as official yet.
- `contractStatus: "not-applicable"` is used for entries such as the base layer.

`coingeckoId` and `contractAddress` remain nullable. They should be added only
when verified, not inferred from ticker symbols.

## Duplicate Tickers

If the public source includes more than one tenant with the same ticker, the
registry keeps each record and gives the route slug a floor-aware suffix. This
preserves the public tower layout while keeping profile URLs stable.

## Editorial Position

Tower Map is an editorial map, not a raw price leaderboard. Floor placement is
based on combined signal: market gravity, liquidity visibility, cultural heat,
continuity, category fit, and public ecosystem relevance.

The registry avoids filling the tower with generic financial instruments that do
not behave like native tenants in the Tower Map model.
