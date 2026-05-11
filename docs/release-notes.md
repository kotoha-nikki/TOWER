# Release Notes

## v1.1.6 - Tower Health And Status Layer

Tower Map added a public operations health layer.

Highlights:

- Tower Health documentation
- Operations checklist
- Status sample data
- Status report generation script
- Generated `reports/status-summary.json`
- Public route health summary
- Wallet interaction readiness summary
- Registry, moderation, analytics, and release health summary
- Scheduled review items framed as tracked maintenance work

## v1.1.5 - Tower Pulse Implementation Plan

Tower Map added implementation planning for the future Tower Pulse page.

Highlights:

- Tower Pulse implementation plan
- Planned `/pulse`, `/en/pulse`, and `/ja/pulse` routes
- Component ownership notes
- Analytics snapshot data source guidance
- Empty state and mobile layout guidance
- Accessibility notes
- Future Supabase aggregate path

## v1.1.3 - Public Analytics Layer

Tower Map added the first public analytics layer.

Highlights:

- Public analytics documentation
- Analytics export sample data
- Analytics snapshot generation script
- Most saved tenants
- Most discussed tenants
- Hottest floors
- Category distribution
- Verified CA ratio
- Generated `reports/analytics-snapshot.json`
- Foundation for a future Tower Pulse page

## v1.1.2 - Moderation And Safety Layer

Tower Map added the first moderation and safety workflow for Tenant Notes.

Highlights:

- Tenant Notes moderation rules
- Community guidelines
- Content report issue template
- Reserved Supabase `moderation_actions` audit table
- Hidden note, deleted note, wallet ban, and wallet unban workflow notes
- Moderation report script
- Generated `reports/moderation-summary.json`

## v1.1.1 - Registry Operations

Tower Map added the first registry operations layer.

Highlights:

- Registry report script
- Floor occupancy summary
- Category coverage summary
- Contract verification status counts
- Duplicate ticker inspection
- Empty and overcrowded floor review flags
- Generated `reports/registry-summary.json`

## v1.0.8 - Tenant Notes

Tower Map added public tenant notes with wallet-gated posting.

Highlights:

- Tenant Notes API
- Profile-page notes panel
- Moderation foundation
- Soft delete
- Basic rate limit
- Supabase notes schema
- Updated README banner

## v1.0.7 - Tenant Saves

Tower Map added saved tenants and public save counts.

Highlights:

- Save / Saved control
- Public save counts
- Supabase saves table
- Wallet-session protected mutations

## v1.0.6 - Wallet Identity

Tower Map added wallet connect and signed-message login.

Highlights:

- Phantom / Solflare / Backpack connection surface
- Nonce challenge
- Signature verification
- HttpOnly session cookie
- Supabase wallet users
