import type { Member } from "@/types";

export interface ParsedExpense {
  payerId: string;
  amountCents: number;
  description: string;
  participantIds: string[];
}

export interface ParseError {
  error: string;
  suggestion?: string;
}

export type ParseResult = { ok: true; data: ParsedExpense } | { ok: false; error: ParseError };

function findMember(name: string, members: Member[]): Member | undefined {
  const lower = name.toLowerCase().trim();
  return members.find(
    (m) =>
      m.name.toLowerCase() === lower ||
      m.name.toLowerCase().startsWith(lower) ||
      lower.startsWith(m.name.toLowerCase().split(" ")[0])
  );
}

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[$,]/g, "").trim();
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num) || num <= 0) return null;
  return Math.round(num * 100);
}

function parseParticipants(raw: string, members: Member[]): Member[] | null {
  const lower = raw.toLowerCase().trim();
  if (
    lower.includes("everyone") ||
    lower.includes("everybody") ||
    lower.includes("all") ||
    lower === "us"
  ) {
    return members;
  }

  const names = raw
    .split(/[,&+]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const found: Member[] = [];
  for (const name of names) {
    const member = findMember(name, members);
    if (!member) return null;
    found.push(member);
  }
  return found.length > 0 ? found : null;
}

function parseExclusion(raw: string, members: Member[]): Member[] | null {
  const match = raw.match(/except\s+(.+)/i);
  if (!match) return null;
  return parseParticipants(match[1], members);
}

export function parseExpense(input: string, members: Member[]): ParseResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: { error: "Please enter an expense description." },
    };
  }

  if (members.length < 2) {
    return {
      ok: false,
      error: { error: "Need at least 2 members to split expenses." },
    };
  }

  const trimmed = input.trim();

  const patterns: {
    regex: RegExp;
    extract: (m: RegExpMatchArray) => {
      payerName: string;
      amount: string;
      description: string;
      participantStr?: string;
      exclusionStr?: string;
    };
  }[] = [
    {
      regex:
        /^(.+?)\s+(?:paid|covered|spent)\s+\$?([\d.]+)\s+(?:for\s+)?(.+?)\s+for\s+(?:everyone\s+|everybody\s+|all\s+)?except\s+(.+)$/i,
      extract: (m) => ({
        payerName: m[1],
        amount: m[2],
        description: m[3],
        exclusionStr: m[4],
      }),
    },
    {
      regex: /^(.+?)\s+(?:paid|covered|spent)\s+\$?([\d.]+)\s+(?:for\s+)?(.+?)\s+for\s+(.+)$/i,
      extract: (m) => ({
        payerName: m[1],
        amount: m[2],
        description: m[3],
        participantStr: m[4],
      }),
    },
    {
      regex: /\$?([\d.]+)\s+(.+?)\s+(?:paid|covered|spent)\s+by\s+(.+)$/i,
      extract: (m) => ({
        payerName: m[3],
        amount: m[1],
        description: m[2],
      }),
    },
    {
      regex: /^(.+?)\s+(?:paid|covered|spent)\s+\$?([\d.]+)\s+(?:for\s+)?(.+)$/i,
      extract: (m) => ({
        payerName: m[1],
        amount: m[2],
        description: m[3],
      }),
    },
    {
      regex: /^(.+?)\s+\$?([\d.]+)\s+(.+)$/i,
      extract: (m) => ({
        payerName: m[1],
        amount: m[2],
        description: m[3],
      }),
    },
  ];

  for (const { regex, extract } of patterns) {
    const match = trimmed.match(regex);
    if (!match) continue;

    const { payerName, amount, description, participantStr, exclusionStr } = extract(match);

    const payer = findMember(payerName, members);
    if (!payer) {
      return {
        ok: false,
        error: {
          error: `Could not find member "${payerName}".`,
          suggestion: `Members: ${members.map((m) => m.name).join(", ")}`,
        },
      };
    }

    const amountCents = parseAmount(amount);
    if (!amountCents) {
      return {
        ok: false,
        error: { error: `Could not parse amount "${amount}".` },
      };
    }

    let participants: Member[];

    if (exclusionStr) {
      const excluded = parseExclusion(`except ${exclusionStr}`, members);
      if (!excluded) {
        return {
          ok: false,
          error: {
            error: `Could not identify excluded member(s) "${exclusionStr}".`,
            suggestion: `Members: ${members.map((m) => m.name).join(", ")}`,
          },
        };
      }
      const excludedIds = new Set(excluded.map((m) => m.id));
      participants = members.filter((m) => !excludedIds.has(m.id));
      if (participants.length === 0) {
        return {
          ok: false,
          error: { error: "Cannot exclude all members." },
        };
      }
    } else if (participantStr) {
      const parsed = parseParticipants(participantStr, members);
      if (!parsed) {
        return {
          ok: false,
          error: {
            error: `Could not identify participant(s) "${participantStr}".`,
            suggestion: `Try: "everyone" or member names like ${members.map((m) => m.name).join(", ")}`,
          },
        };
      }
      participants = parsed;
    } else {
      participants = members;
    }

    const participantIds = [...new Set(participants.map((m) => m.id))];
    if (!participantIds.includes(payer.id)) {
      participantIds.push(payer.id);
    }

    return {
      ok: true,
      data: {
        payerId: payer.id,
        amountCents,
        description: description.trim(),
        participantIds,
      },
    };
  }

  return {
    ok: false,
    error: {
      error: "Could not parse that expense.",
      suggestion: 'Try: "Name paid $50 for description" or "Name $50 description"',
    },
  };
}
