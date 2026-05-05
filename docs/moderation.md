# Moderation

Tower Map treats Tenant Notes as a public community layer, not an unmanaged
message board. Notes should make tenant profiles more useful, more contextual,
and more alive while staying readable for visitors who are only here to inspect
the tower.

## Scope

Moderation applies to public user-generated surfaces:

- Tenant Notes
- Content reports
- Wallet-gated posting behavior
- Operator actions against notes or wallets

The tenant registry itself is handled through the data maintenance workflow in
`docs/tenant-registry.md`.

## Tenant Notes Review Rules

Visible notes should be short, contextual, and attached to the tenant page where
they appear.

Allowed examples:

- Project context or useful history
- Civil opinion about floor placement or category fit
- Notes about ecosystem relevance
- Links to credible context, when they are not spammy
- Corrections that can be followed up through a data issue

Remove or hide notes that contain:

- Spam, repeated promotion, referral campaigns, or unrelated links
- Impersonation of Tower Map, a tenant team, or a wallet holder
- Private information, doxxing, or non-consensual personal data
- Harassment, threats, slurs, or targeted abuse
- Phishing, malware, wallet drainers, or instructions meant to compromise users
- Illegal content or requests for illegal activity
- Market manipulation claims presented as guaranteed outcomes
- Extremely low-context noise that degrades the profile surface

Borderline notes can be hidden while a maintainer reviews the report. Deletion
is reserved for author deletion, confirmed abuse, or cleanup after moderation
review.

## Note Statuses

`tenant_notes.status` supports three public moderation states:

```text
visible
hidden
deleted
```

- `visible` notes appear through `/api/notes` and the public profile UI.
- `hidden` notes remain in the database but are removed from public reading.
- `deleted` notes are removed from public reading and marked with `deleted_at`.

The public view and API should only expose notes where `status = 'visible'` and
`deleted_at is null`.

## Operator Actions

The reserved `moderation_actions` table records moderation intent before Tower
Map has a full admin console. Operators can use it as an audit trail for:

- `note_review`
- `hide_note`
- `delete_note`
- `wallet_ban`
- `wallet_unban`

Every action should include a reason. Reasons should be factual and operational,
not personal.

## Hide, Delete, And Wallet Ban Logic

Use the lightest action that protects the community surface.

### Hide A Note

Hide a note when:

- The content appears to violate guidelines.
- The note needs review before it can remain public.
- The note is low-quality enough to disrupt the profile page.

Expected database effect:

```text
tenant_notes.status = 'hidden'
tenant_notes.moderation_reason = [reason]
tenant_notes.updated_at = now()
```

### Delete A Note

Delete a note when:

- The author deletes their own note.
- The content is confirmed abuse, spam, phishing, or private information.
- A hidden note has completed moderation review and should stay removed.

Expected database effect:

```text
tenant_notes.status = 'deleted'
tenant_notes.deleted_at = now()
tenant_notes.moderation_reason = [reason]
tenant_notes.updated_at = now()
```

### Ban A Wallet

Ban a wallet only for repeated or severe abuse:

- Phishing or wallet-drainer links
- Coordinated spam
- Repeated harassment after removals
- Attempts to evade moderation
- Abuse that creates legal, safety, or trust risk

The initial implementation reserves this workflow in `moderation_actions`.
Application-level enforcement can later check the latest wallet action before
allowing note creation.

## Content Reports

Reports should use the GitHub issue form:

```text
.github/ISSUE_TEMPLATE/content_report.yml
```

Reports should include:

- Tenant slug or profile URL
- Note id, wallet label, or visible context
- Reason for review
- Screenshot or copied text when available

Do not require reporters to connect a wallet. Reporting is a safety workflow,
not a wallet-gated feature.

## Operating Principles

- Public reading stays open.
- Wallet signatures create accountability for posting.
- Moderation removes harmful content without changing tenant data.
- Operator actions should be auditable.
- The site should feel like a serious community archive, not an unmanaged chat.
