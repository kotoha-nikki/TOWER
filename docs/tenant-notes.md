# Tenant Notes

Tenant Notes are the public comment layer for Tower Map tenant profiles.

They are designed as short, wallet-gated notes rather than open anonymous chat.
The goal is to make each profile feel alive while keeping the surface readable,
moderatable, and tied to wallet identity.

## Product Behavior

- Anyone can read visible notes on a tenant profile.
- A visitor must connect and sign in with a wallet before posting.
- Notes are limited to 480 characters.
- Notes are shown newest-first.
- Authors can soft-delete their own notes.
- Moderation can hide notes without removing the original database row.

## API Surface

```text
GET    /api/notes?tenantSlug=[slug]
POST   /api/notes
DELETE /api/notes
```

### GET

Reads visible notes for one tenant.

```json
{
  "tenantSlug": "example",
  "notes": [],
  "count": 0
}
```

### POST

Requires a signed wallet session.

```json
{
  "tenantSlug": "example",
  "body": "Short public note."
}
```

### DELETE

Requires a signed wallet session. The note is soft-deleted only when the
session user owns the note.

```json
{
  "noteId": "uuid"
}
```

## Moderation Foundation

The `tenant_notes.status` field supports:

```text
visible
hidden
deleted
```

This keeps moderation operationally simple:

- `visible` notes are public.
- `hidden` notes can be removed from the public surface by an operator.
- `deleted` notes were removed by the author or by moderation workflow.

## Rate Limit

The API currently limits each wallet user to 3 notes per 60 seconds. This is a
basic server-side guard that can later be extended with IP-aware limits or an
edge rate-limit provider.

## Database

Run:

```text
supabase/tenant-notes.sql
```

The migration creates:

```text
tenant_notes
public_tenant_notes
```

The service role key remains server-only. The browser talks to the Next.js API,
not directly to the notes table.
