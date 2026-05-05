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

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  action text not null check (
    action in (
      'note_review',
      'hide_note',
      'delete_note',
      'wallet_ban',
      'wallet_unban'
    )
  ),
  note_id uuid references public.tenant_notes(id) on delete set null,
  tenant_slug text,
  target_wallet_address text,
  actor_user_id uuid references public.wallet_users(id) on delete set null,
  actor_wallet_address text,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tenant_notes_tenant_slug_visible_idx
  on public.tenant_notes (tenant_slug, status, created_at desc)
  where deleted_at is null;

create index if not exists tenant_notes_user_created_idx
  on public.tenant_notes (user_id, created_at desc);

create index if not exists moderation_actions_note_id_idx
  on public.moderation_actions (note_id);

create index if not exists moderation_actions_target_wallet_idx
  on public.moderation_actions (target_wallet_address, created_at desc);

create index if not exists moderation_actions_action_created_idx
  on public.moderation_actions (action, created_at desc);

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
alter table public.moderation_actions enable row level security;

comment on table public.tenant_notes is
  'Wallet-gated public notes for Tower Map tenant profiles.';

comment on table public.moderation_actions is
  'Reserved audit log for Tenant Notes moderation actions.';

comment on column public.tenant_notes.status is
  'Moderation foundation: visible, hidden, or deleted.';

comment on column public.moderation_actions.action is
  'Moderation workflow action: note_review, hide_note, delete_note, wallet_ban, or wallet_unban.';

comment on column public.moderation_actions.target_wallet_address is
  'Wallet address affected by a moderation action, used for wallet-level restrictions.';

comment on view public.public_tenant_notes is
  'Public reading surface for visible tenant notes.';
