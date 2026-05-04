# Registry Operations

Tower Map keeps the tenant registry inspectable through a repeatable operations
script. The registry is curated, but the maintenance workflow should still be
auditable.

## Command

```bash
npm run registry:report
```

The command reads:

```text
data/floors.json
data/categories.json
data/tenants.json
```

It writes:

```text
reports/registry-summary.json
```

## What The Report Checks

- Total tenant count
- Tenant count per floor
- Tenant count per category
- Contract address status counts
- Empty floors
- Overcrowded floors
- Duplicate tickers
- Basic review flags for maintenance

## Why This Exists

Tower Map is an editorial map, not a random token board. Floor placement should
be explainable by signal, category fit, visibility, continuity, and market
gravity.

The registry report gives maintainers a quick inspection layer before any
public data update:

- Are too many tenants collecting on one floor?
- Are some categories underrepresented?
- Are contract addresses still pending verification?
- Are ticker collisions creating confusion?
- Are any floors empty after a registry edit?

## Maintenance Rhythm

Run the report before:

- Updating tenant data
- Publishing a release
- Reviewing CA verification status
- Changing floor placement rules
- Preparing a public registry note

## Output Shape

The summary file is intentionally JSON so it can later feed a dashboard,
release bot, or public analytics page.

```json
{
  "generatedAt": "ISO timestamp",
  "registry": {},
  "floorOccupancy": [],
  "categoryCoverage": [],
  "contractStatus": {},
  "duplicateTickers": [],
  "emptyFloors": [],
  "overcrowdedFloors": [],
  "reviewFlags": {}
}
```

This is the first operations layer for keeping the tower orderly as the number
of residents grows.
