# Architecture

Tower Map is structured as a public editorial map with wallet-native interaction
added on top. Public browsing should remain fast and open. Wallet features should
only appear when the visitor wants to save a tenant or leave a note.

## Product Layers

### 1. Public Map Layer

The public map layer contains the parts of the site that anyone can view:

- homepage
- tower image and floor hit areas
- floor panels
- tenant directory
- tenant profiles
- methodology page
- language routes

This layer should not require a wallet connection.

### 2. Content Layer

The content layer stores the curated editorial model:

- floors
- tenants
- categories
- methodology labels
- profile copy
- market tier labels
- language dictionaries

In early versions this can be stored as JSON or TypeScript data modules. As the
project grows, the same model can be backed by Supabase or another structured
content store.

### 3. Identity Layer

The identity layer uses Solana wallet login.

The login flow should use signed messages, not transactions:

1. The client requests a nonce.
2. The wallet signs a readable login message.
3. The server verifies the signature.
4. The app creates a session.

Wallet connection alone should not be treated as login.

### 4. Community Layer

The community layer is built on top of wallet identity:

- saved tenants
- public save counts
- tenant notes
- comment rate limits
- moderation-ready fields

These features should never block normal public browsing.

## Recommended Route Shape

```text
/
/methodology
/profile/[slug]
/ja
/ja/methodology
/ja/profile/[slug]
```

The tenant directory may be implemented as a side sheet instead of a standalone
route. If a route is added later, it should mirror the same tenant data model.

## Data Flow

```text
Static data -> public map -> floor panel -> tenant profile
                    |
                    +-> save count overlay
                    +-> wallet-gated save action
                    +-> wallet-gated tenant note action
```

## Backend Responsibilities

The backend should handle only state that must be trusted:

- wallet nonce creation
- signature verification
- session validation
- saved tenant persistence
- public save counts
- tenant notes
- comment deletion and moderation fields

The backend should not own basic public floor geometry or static editorial copy
unless the project later needs an admin system.

## Supabase Tables

The planned Supabase tables are:

- `users`
- `login_nonces`
- `favorites`
- `comments`

The public tenant registry can remain static until there is a clear need for a
database editor.

## Design Constraint

Tower Map is an editorial interface, not a trading terminal. Architecture choices
should keep the site readable, calm, and inspectable.
