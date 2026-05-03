create table if not exists public.tenant_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wallet_users(id) on delete cascade,
  wallet_address text not null,
  tenant_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, tenant_slug)
);

create index if not exists tenant_saves_tenant_slug_idx
  on public.tenant_saves (tenant_slug);

create index if not exists tenant_saves_wallet_address_idx
  on public.tenant_saves (wallet_address);

create or replace view public.tenant_save_counts as
  select
    tenant_slug,
    count(*)::integer as save_count
  from public.tenant_saves
  group by tenant_slug;

alter table public.tenant_saves enable row level security;

comment on table public.tenant_saves is
  'Wallet-authenticated tenant saves used for public Tower Map save counts.';

comment on view public.tenant_save_counts is
  'Public aggregate save counts by tenant slug.';
