# Maintenance Guide

This document describes the routine checks used to keep Tower Map coherent.

## Data Maintenance

Run:

```bash
npm run validate:data
```

This checks:

- Floor count and floor number range
- Tenant slug uniqueness
- Tenant floor references
- Tenant category references
- Heat range
- Contract verification consistency

## QA Pass

Run:

```bash
npm run qa
```

This runs data validation, tests, and the production build.

It also refreshes the registry and moderation operations reports.

## Tenant Registry Updates

When updating `data/tenants.json`:

- Keep slugs lowercase and route-safe.
- Do not invent contract addresses.
- Use `pending-verification` until a CA is verified.
- Keep stablecoins, wrapped assets, LP tokens, and generic financial instruments out of the tenant model.
- Make floor movement explainable by signal, not random reshuffling.

## Interactive Layers

Wallet identity, saves, and notes must stay server-mediated:

- Browser code calls `/api/*`.
- Supabase service role key remains server-only.
- Wallet signatures create sessions, not transactions.
- Public counts and notes should be readable without wallet login.

## Moderation Checks

Run:

```bash
npm run moderation:report
```

This checks:

- moderation documentation
- community guidelines
- content report issue template
- public note visibility filters
- reserved moderation action coverage

Moderation workflow details live in `docs/moderation.md`.
