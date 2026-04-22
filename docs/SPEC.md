# SplitFair

## Vision

SplitFair is a web application for tracking and splitting group trip expenses fairly. It lets users manage multiple trips, add expenses through forms or natural language, compute who owes whom, and generate optimized settlement plans that minimize the number of repayment transactions.

Built as a CS485 programming assignment demonstrating AI-assisted development with a runtime AI feature (local natural language parser).

## Goals

- Manage multiple named trips, each with its own members and expenses
- Add expenses via structured form or natural language input ("Leo paid $60 for ramen for everyone")
- Support partial group participation per expense (subset of members involved)
- Compute net balances across all trip members
- Optimize settlements using a greedy algorithm to minimize transaction count
- Provide clear settlement instructions (who pays whom, how much)
- Demonstrate meaningful use of AI tools in both development and as a runtime feature
- Satisfy all CS485 assignment requirements (source code, project report, AI usage report, README)

## Non-Goals

- User authentication or accounts
- Cloud sync or cross-device sharing
- Multi-currency support (USD only)
- Receipt image upload or OCR
- Offline PWA support
- Mobile app / native wrapper

## Architecture

Next.js 16 application with client-side persistence and a local regex-based natural language parser.

### Key Components

- **Trip Manager**: CRUD for trips, members, and expense records — all stored in localStorage
- **Expense Input**: Dual-mode entry — structured form and natural language parsed by a local regex parser
- **Balance Calculator**: Computes net balances (total paid minus total share) for each member
- **Settlement Optimizer**: Greedy algorithm that minimizes the number of repayment transactions
- **UI Layer**: React components with Tailwind v4, neon tabletop dark theme + clean light theme, Outfit font

### Data Flow

```
User input (form or natural language)
  → Expense record created
  → Stored in localStorage (per trip)
  → Balance Calculator recomputes net balances
  → Settlement Optimizer generates min-transaction payment plan
  → UI updates with balances and settlement instructions
```

For natural language input:
```
User types "Leo paid $85 for ramen"
  → Local regex parser extracts { payer, amount, description, participants }
  → Expense record created and stored
  → Zero latency, works offline
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Stack | Next.js 16 + Bun + TypeScript | From starter template, already production-quality |
| Storage | localStorage | Zero infra, sufficient for class project, data persists in browser |
| Currency | USD only | Keeps scope manageable |
| AI Feature | Local regex parser for NL expense input | Works offline, zero latency, no API key needed, still demonstrates AI-assisted development |
| Settlement Algorithm | Greedy min-transactions | Assignment requires payment optimization |
| Multi-trip | Yes | More realistic and impressive |
| CSS | Tailwind v4 | From starter template |
| Theme | Neon tabletop (dark) + clean light | Visually distinctive, accessible toggle |
| Font | Outfit | Clean geometric sans-serif |
| Validation | Zod v4 | From starter template |
| Testing | Vitest + Testing Library | From starter template |
| Linting/Formatting | Biome + Husky + lint-staged | From starter template |
| Seed Data | Tokyo Drift '24 demo trip | Better first impression for demo/submission |

## Edge Cases & Constraints

- Natural language parsing may fail on ambiguous input — must show clear error and allow manual entry
- localStorage has ~5MB limit — sufficient for reasonable trip data but should handle quota errors
- Expense amounts must be positive numbers
- A member cannot be removed from a trip if they have expenses involving them
- Division rounding: split amounts should sum exactly to the original expense (handle cents)

## Open Questions

_None — all key decisions resolved._

## References

- CS485 Programming Assignment: "Group Trip Expense Splitter" (Project 3)
- Starter template: `~/cs/templates/nextjs-bun-starter`
