create extension if not exists pgcrypto;

create table if not exists public.wallet_users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.wallet_login_nonces (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  nonce text not null unique,
  message text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz
);

create index if not exists wallet_login_nonces_wallet_address_idx
  on public.wallet_login_nonces (wallet_address);

create index if not exists wallet_login_nonces_expires_at_idx
  on public.wallet_login_nonces (expires_at);

alter table public.wallet_users enable row level security;
alter table public.wallet_login_nonces enable row level security;

comment on table public.wallet_users is
  'Wallet identities that have signed into Tower Map.';

comment on table public.wallet_login_nonces is
  'One-time wallet login challenges used for signed-message authentication.';
