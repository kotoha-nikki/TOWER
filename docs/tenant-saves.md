# Tenant Saves

Tenant saves turn wallet identity into a public attention signal.

## Product Behavior

- Public visitors can read save counts.
- Signed-in wallets can save or unsave tenants.
- Directory cards show save counts beside tenant metadata.
- Tenant profile pages expose the primary Save / Saved control.
- The save count is public; the wallet identity behind each save is handled by
  server-side API routes.

## API

```text
GET  /api/favorites
GET  /api/favorites?tenantSlug=<slug>
POST /api/favorites
```

`GET /api/favorites` returns all public counts plus the current wallet's saved
slugs when a valid session cookie exists.

`POST /api/favorites` requires a wallet session and accepts:

```json
{
  "tenantSlug": "solana",
  "saved": true
}
```

## Database

Run `supabase/tenant-saves.sql` after the wallet identity schema.

```text
tenant_saves
tenant_save_counts
```

`tenant_saves` enforces one save per wallet user per tenant with a unique
constraint on `(user_id, tenant_slug)`.

## Identity Dependency

This layer depends on the wallet identity layer:

- `wallet_users`
- `wallet_login_nonces`
- signed `tower_session` cookie

The client never writes directly to Supabase. It calls `/api/favorites`, and the
server resolves the wallet session before mutating save state.
