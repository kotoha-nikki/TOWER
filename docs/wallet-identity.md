# Wallet Identity Layer

Tower Map uses wallet signatures as the identity layer for saves, public counts,
and tenant notes.

## Flow

1. The browser detects Phantom, Solflare, or Backpack from injected wallet
   providers.
2. The visitor connects a wallet.
3. The app requests a one-time nonce from `/api/auth/nonce`.
4. The wallet signs the exact login message.
5. `/api/auth/verify` verifies the Ed25519 signature, consumes the nonce, upserts
   the wallet user in Supabase, and sets an HttpOnly session cookie.
6. `/api/auth/session` reads the signed cookie for the public UI.
7. `/api/auth/logout` clears the session cookie.

## Tables

Run `supabase/wallet-identity.sql` in the Supabase SQL editor.

```text
wallet_users
wallet_login_nonces
```

The server uses the Supabase service role key. Public browser code never receives
the service role key.

## Environment

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=
AUTH_NONCE_TTL_SECONDS=300
AUTH_SESSION_TTL_SECONDS=604800
```

`SESSION_SECRET` must be at least 32 characters.

## Security Notes

- Nonces are one-time use and expire quickly.
- The signed message states that it does not authorize a transaction.
- Sessions are stored in HttpOnly cookies and signed with HMAC-SHA256.
- Wallet addresses are validated as 32-byte base58 public keys.
- Candidate wallet features such as saves and tenant notes should read identity
  from `/api/auth/session`, not from client-only wallet state.
