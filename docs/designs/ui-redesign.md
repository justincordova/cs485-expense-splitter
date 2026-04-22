# UI Redesign — Neon Tabletop Theme

## Context

The current UI is functional but bare-bones. A Lovable prototype at `docs/refs/trip-splitter-ai/` demonstrates a polished "neon tabletop" dark theme with a 3-column dashboard layout, category tags, local NL parsing, and seed data. We're adopting its visual design and several UX patterns while keeping our multi-page routing architecture for scalability.

## Goals

- Match the reference's neon tabletop visual aesthetic (dark felt, neon cyan/green/pink/yellow accents, glow effects)
- Add a clean light mode variant that works with the same component structure
- Redesign the trip dashboard to use the reference's 3-column layout (standings | input+ledger | settlement)
- Replace Gemini API NL parsing with an advanced local regex parser (works offline, zero latency)
- Add category tags on expenses, seed demo data, relative timestamps, and member removal guards
- Fix CSP eval() error and all lint warnings

## Non-Goals

- Adding authentication or cloud sync
- Multi-currency support
- Receipt image upload
- Changing the underlying data model (keep Member/Trip/Expense/Balance/Settlement)

## Design

### Architecture Changes

1. **Remove Gemini API route** (`src/app/api/parse-expense/`) and `GEMINI_API_KEY` env var
2. **Remove theme toggle from header** → move into a subtle toggle within the page
3. **Keep routing**: `/` home page with trip cards, `/trips/[id]` for trip dashboard

### Home Page (`/`)

- Dark felt background
- "SplitFair" branding with neon cyan pulse dot
- Grid of trip cards styled like the reference's surface cards (rounded-3xl, neon borders on hover)
- "New Trip" button opens a dialog (not inline form) — name + comma-separated members
- Empty state matches reference: "No trips yet. Create your first trip to get started."

### Trip Dashboard (`/trips/[id]`)

3-column responsive grid:

| Column | Width | Content |
|--------|-------|---------|
| Standings (left) | 3 cols | Member balance cards sorted by net. Top creditor gets neon green glow. Add member button. Remove member (hover, only if no expenses). |
| Center | 5 cols | NL input bar at top ("Play a receipt") with neon cyan gradient border. Ledger list below with category tags (DIN/BEV/TKT/BED/FUN). Detailed form as modal. |
| Settlement (right) | 4 cols | "Endgame" panel with "Optimized path" badge. Transfer cards with arrow icons. "All square" state with checkmark. |

### Theme System

**Dark mode (default):** Neon tabletop
- Background: dark navy `hsl(222, 42%, 7%)`
- Surface: `hsl(223, 30%, 12%)`
- Neon accents: cyan `hsl(186, 95%, 47%)`, green `hsl(146, 100%, 50%)`, pink `hsl(342, 100%, 58%)`, yellow `hsl(46, 100%, 50%)`
- Glow shadows: cyan, green, pink
- Font: Outfit (Google Fonts)

**Light mode:** Clean variant
- Background: white `#ffffff`
- Surface: light gray `#f8f9fa`
- Same accent colors but slightly desaturated for readability
- No glow effects (subtle shadows instead)

### Local NL Parser

Advanced regex-based parser handling:
- "X paid $Y for Z" — standard pattern
- "X $Y Z" — shortened pattern
- "X paid Y for Z" — no dollar sign
- "$Y Z paid by X" — reversed payer
- "X paid $Y for Z for everyone except W" — exclusion
- "X covered $Y for Z for all" — "covered" synonym
- Multiple amount formats: $45, $45.00, 45, 45.50
- Fuzzy name matching (first name match, case-insensitive)
- Default to "all members" if no "for" clause
- Graceful error messages for unparseable input

### Category Tags

Auto-detected from expense description:
- DIN: food, dinner, lunch, breakfast, cafe, coffee, gelato, ramen, sushi, pizza, burger, taco, etc.
- BEV: beer, drink, bar, cocktail, wine, izakaya
- TKT: train, taxi, uber, flight, bus, travel, gas, toll
- BED: hotel, airbnb, stay, accommodation
- FUN: tour, ticket, museum, activity, entry, show
- EXP: default fallback

### Seed Data

On first load (empty localStorage), seed with:
- Trip: "Tokyo Drift '24"
- Members: Leo, Maya T., Jaxon P., Nina
- 4 expenses: ramen, shinkansen, izakaya, teamlab
- Pre-computed with realistic timestamps

### Other UX Improvements

- Relative timestamps: "just now", "3m ago", "2h ago", "5d ago"
- `canRemoveMember()` guard — can't remove members involved in expenses
- Delete expense on hover (trash icon fades in)
- Smooth fade-in animations on new items
- `totalSpent` display in header area
- "Optimized path" badge with savings count vs naive approach

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | Keep multi-page | Scalability, cleaner URLs, matches our architecture |
| NL Parser | Local regex (no API) | Works offline, zero latency, no API key needed |
| Theme | Dark (neon) + Light | User preference, accessibility |
| Layout | 3-column from reference | Information-dense but clear, proven design |
| Font | Outfit | From reference, clean geometric sans-serif |
| Seed data | Yes | Better first impression for demo/submission |

## Rejected Alternatives

- Single-page with dropdown — less scalable, harder to add features later
- Gemini API NL parsing — adds latency, requires API key, overkill for structured input
- Dark-only theme — accessibility concern, some users prefer light mode

## Edge Cases & Constraints

- CSP header must allow `unsafe-eval` in development (Next.js requirement) — add to Content-Security-Policy only in dev
- Tailwind v4 `@theme` API for custom colors — different from v3 `tailwind.config.ts` approach
- Outfit font loaded via Google Fonts or `next/font/google`
- Light mode must tone down glow effects — use box-shadow instead
- Local NL parser will fail on very ambiguous input — show clear error with suggestions

## Open Questions

_None — all resolved._
