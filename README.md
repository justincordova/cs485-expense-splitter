# SplitFair

Fair expense splitting for group trips. Add expenses through a structured form or natural language, compute who owes whom, and get an optimized settlement plan that minimizes the number of repayment transactions.

Built as a CS485 programming assignment demonstrating AI-assisted development with a runtime AI feature.

## Features

- **Multi-trip management** — create and manage multiple named trips, each with its own members and expenses
- **Dual expense entry** — structured form or natural language input ("Justin paid $60 for dinner for everyone")
- **Balance calculation** — computes net balances (total paid minus total share) for each member
- **Optimized settlement** — greedy algorithm minimizes the number of repayment transactions
- **Partial participation** — split expenses among a subset of trip members
- **Light/dark theme** — toggle between themes, preference persists across sessions
- **Responsive design** — works on desktop and mobile

## Tech Stack

- **Next.js 16** with App Router and React 19
- **Bun** as the JavaScript runtime and package manager
- **TypeScript** in strict mode
- **Tailwind CSS v4** with CSS custom properties for theming
- **Zod v4** for runtime validation
- **Vitest** + Testing Library for tests
- **Biome** for linting and formatting
- **Gemini 2.0 Flash API** for natural language expense parsing

## Setup

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0

### Install

```bash
bun install
```

### Environment

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:

```
GEMINI_API_KEY=your_key_here
```

Get your key at [Google AI Studio](https://aistudio.google.com/apikey). The key is optional — without it, the natural language feature will show a fallback message and manual entry still works.

### Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run type-check` | TypeScript type checking |
| `bun lint` | Lint with Biome |
| `bun run test` | Run tests with Vitest |
| `bun run test:coverage` | Run tests with coverage report |

## Architecture

- `src/types/` — TypeScript interfaces (Member, Trip, Expense, Balance, Settlement)
- `src/services/` — localStorage persistence layer
- `src/utils/` — Pure functions (balance calculator, settlement optimizer, split helper, formatters)
- `src/hooks/` — React context and hooks for shared state
- `src/components/` — UI components
- `src/app/` — Next.js App Router pages and API route
- `src/app/api/parse-expense/` — Gemini API integration for NL expense parsing

## How It Works

1. Create a trip and add members
2. Add expenses via form or natural language
3. View per-member balances (paid, owed, net)
4. View optimized settlement plan (who pays whom, how much)

All data is stored in your browser's localStorage — no server, no accounts, no sync.

## Testing

```bash
bun run test
```

Tests cover the storage service, equal split algorithm, balance calculator, and settlement optimizer.
