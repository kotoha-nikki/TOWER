# Public Analytics

Tower Map is no longer only a visual directory. The public analytics layer turns
the tower's own registry, save counts, Tenant Notes activity, floor placement,
category coverage, and contract verification status into observable product
signals.

This is the foundation for a future **Tower Pulse** page.

## What The Layer Measures

The analytics snapshot tracks:

- most saved tenants
- most discussed tenants
- hottest floors
- category distribution
- verified CA ratio

These are Tower Map-native observations. They are not price rankings and they
are not generic market data. They describe what the tower itself can see:
attention, commentary, floor heat, registry shape, and verification coverage.

## Data Sources

The snapshot is generated from:

```text
data/floors.json
data/categories.json
data/tenants.json
data/analytics.sample.json
```

The tenant registry is the live public Tower Map registry snapshot. The
analytics input mirrors the public interaction export shape used for saves and
Tenant Notes. In production, the same shape can be populated from Supabase
aggregate queries before generating a public Tower Pulse snapshot.

## Command

```bash
npm run analytics:snapshot
```

The command writes:

```text
reports/analytics-snapshot.json
```

## Snapshot Shape

```json
{
  "generatedAt": "ISO timestamp",
  "source": {},
  "towerPulse": {},
  "mostSavedTenants": [],
  "mostDiscussedTenants": [],
  "hottestFloors": [],
  "categoryDistribution": [],
  "verifiedCaRatio": {}
}
```

## Most Saved Tenants

Saved tenants represent wallet attention. A save is not an endorsement or a
trade signal. It means a signed-in wallet chose to keep that tenant close.

## Most Discussed Tenants

Tenant Notes create a public commentary layer. Discussion count helps identify
which tenant profiles have started to collect community memory.

## Hottest Floors

Floor heat combines registry heat with public interaction counts. It helps show
where the building feels most active without reducing the tower to a raw token
leaderboard.

## Category Distribution

Category distribution shows the current shape of the registry. It helps answer:

- Which wings are most populated?
- Which categories have the most wallet saves?
- Which categories are collecting the most notes?
- Which wings need future review?

## Verified CA Ratio

The verified CA ratio shows how much of the registry has confirmed contract
address coverage.

Tower Map does not invent contract addresses. A pending status is explicit
maintenance data, not a hidden failure.

## Tower Pulse Readiness

This layer prepares the repository for a public Tower Pulse page that can show:

- live tower activity
- saved tenant leaders
- discussion leaders
- hot floors
- registry composition
- CA verification progress

The page can read the generated JSON directly or replace the snapshot with a
server route later.
