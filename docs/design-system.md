# Design System

Tower Map should feel like an editorial city guide, an architectural archive,
and a calm crypto-native interface.

The design should not feel like a casino, launchpad, or generic price dashboard.

## Visual Direction

The current direction is:

- paper/editorial base
- ink-like dark text
- thin borders
- measured red accents
- quiet metadata labels
- large architectural imagery
- compact but readable panels

## Mood

Keywords:

- editorial
- architectural
- observant
- refined
- technical
- under construction
- living archive

Avoid:

- loud gradients
- casino colors
- noisy animations
- oversized social widgets
- default wallet modal styling
- generic dashboard cards everywhere

## Typography

Use a strong editorial display style for hero text and a clean sans or mono style
for metadata.

Recommended usage:

- display type for major page titles
- sans type for body copy
- mono type for tickers, floor numbers, labels, and small data points

Do not overuse all caps. Reserve it for labels, tickers, and interface metadata.

## Color Roles

```text
paper        warm page background
ink          main text
muted-ink    secondary copy
line         borders and separators
signal-red   active links, labels, and small emphasis
signal-gold  highlights and selected states
teal         chart or data contrast
```

The palette should support long reading sessions.

## Components

### Header

The header should stay minimal:

- brand mark or ticker
- navigation
- language switcher
- wallet button

### Tower Map

The tower is the main object. UI should support inspection rather than compete
with it.

### Floor Panel

Floor panels should show:

- floor number
- floor title
- tenant count
- short floor narrative
- selected tenants

### Tenant Profile

Tenant profiles should feel like archive pages:

- tenant identity
- floor placement
- description
- category
- heat
- market cap tier
- liquidity tier
- save count
- tenant notes

### Wallet Modal

Wallet UI should be custom and editorial. The app may use wallet adapter logic,
but the visual layer should match Tower Map.

## Copywriting

Copy should be clear, slightly literary, and never overhyped.

Good:

- "A living high-rise map of ecosystem signal."
- "Currently in residence on Floor 18."
- "Wallet-signed notes from tower visitors."

Avoid:

- "Buy now"
- "Moon soon"
- "Guaranteed"
- "Official ranking"

## Japanese Layer

Japanese copy can be softer and more diary-like in public updates, but the product
interface should remain clean and usable.

GitHub technical documentation should stay English-first.
