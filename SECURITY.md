# Security Policy

Tower Map is a public information and interaction layer. It does not require
users to submit private keys, seed phrases, or custody assets.

## Supported Scope

Security reports may cover:

- wallet login message verification
- session handling
- Supabase access rules
- tenant comments and saved tenant APIs
- public data integrity issues
- accidental exposure of secrets

## Wallet Safety

Tower Map wallet login should only request a signed message.

It must not request:

- token transfers
- approvals
- swaps
- minting
- staking
- private keys or seed phrases

## Reporting

Please open a private security advisory on GitHub when available.

If private reporting is not available, open an issue with minimal public detail
and request a maintainer contact.

## Data Integrity

Tenant placement, contract addresses, and methodology data should be traceable.
Unverified contract addresses must remain marked as pending.
