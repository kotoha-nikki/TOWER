create table if not exists public.tenant_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wallet_users(id) on delete cascade,
  wallet_address text not null,
  tenant_slug text not null,
  body text not null check (char_length(trim(body)) between 1 and 480),
  status text not null default 'visible' check (status in ('visible', 'hidden', 'deleted')),
  moderation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists tenant_notes_tenant_slug_visible_idx
  on public.tenant_notes (tenant_slug, status, created_at desc)
  where deleted_at is null;

create index if not exists tenant_notes_user_created_idx
  on public.tenant_notes (user_id, created_at desc);

create or replace view public.public_tenant_notes as
  select
    id,
    tenant_slug,
    wallet_address,
    body,
    created_at
  from public.tenant_notes
  where status = 'visible'
    and deleted_at is null;

alter table public.tenant_notes enable row level security;

comment on table public.tenant_notes is
  'Wallet-gated public notes for Tower Map tenant profiles.';

comment on column public.tenant_notes.status is
  'Moderation foundation: visible, hidden, or deleted.';

comment on view public.public_tenant_notes is
  'Public reading surface for visible tenant notes.';
