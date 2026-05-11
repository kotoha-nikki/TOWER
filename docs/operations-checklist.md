# Operations Checklist

This checklist keeps Tower Map's daily maintenance work repeatable.

## Daily Public Health Pass

- Confirm the public website is expected to be online.
- Confirm public routes remain documented.
- Refresh the registry report.
- Refresh the moderation report.
- Refresh the analytics snapshot.
- Generate the Tower Health summary.
- Run the Node test suite.
- Run the release consistency check before tagging.

## Registry Review

- Tenant count is recorded.
- Floor count is recorded.
- Category coverage is recorded.
- Duplicate tickers are inspected.
- Pending contract verification remains tracked.
- High-occupancy floors remain visible for placement review.

## Moderation Review

- Community guidelines are present.
- Content report template is present.
- Tenant Notes public read model remains visible-notes-only.
- Hidden, deleted, wallet ban, and wallet unban actions remain documented.

## Analytics Review

- Save counts are included.
- Note counts are included.
- Hottest floors are generated.
- Category distribution is generated.
- Verified CA ratio is generated.

## Public Status Review

- Tower Health reports `healthy`.
- Wallet layer reports `healthy`.
- Public route coverage reports `healthy`.
- Scheduled review items are framed as tracked maintenance work.

## Release Readiness

Before a version release:

```bash
npm run qa
npm run release:check
```

The release should describe the product layer added, the files changed, and the
operational reason for the update.
