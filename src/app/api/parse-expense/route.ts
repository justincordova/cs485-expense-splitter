import { GoogleGenerativeAI, type Schema, type SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const schema: Schema = {
  type: "object" as SchemaType.OBJECT,
  properties: {
    valid: {
      type: "boolean" as SchemaType.BOOLEAN,
      description: "Whether the input is a recognizable expense description",
    },
    payerName: { type: "string" as SchemaType.STRING, description: "Name of the person who paid" },
    amount: { type: "number" as SchemaType.NUMBER, description: "Amount in dollars" },
    description: { type: "string" as SchemaType.STRING, description: "What the expense was for" },
    participantNames: {
      type: "array" as SchemaType.ARRAY,
      items: { type: "string" as SchemaType.STRING },
      description:
        "Names of people splitting the expense. Empty array means split among all members.",
    },
    excludeNames: {
      type: "array" as SchemaType.ARRAY,
      items: { type: "string" as SchemaType.STRING },
      description: "Names to exclude from the split. Only used when someone says 'except X'.",
    },
    errorMessage: {
      type: "string" as SchemaType.STRING,
      description: "Human-readable error if valid is false",
    },
  },
  required: [
    "valid",
    "payerName",
    "amount",
    "description",
    "participantNames",
    "excludeNames",
    "errorMessage",
  ],
};

export async function POST(request: Request) {
  try {
    const { input, memberNames } = (await request.json()) as {
      input: string;
      memberNames: string[];
    };

    if (!input?.trim()) {
      return NextResponse.json({ error: "Please enter an expense description." }, { status: 400 });
    }

    if (!memberNames || memberNames.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 members to split expenses." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Parse this expense description into structured data.

Trip members: ${memberNames.join(", ")}

Expense: "${input}"

Rules:
- First determine if the input is a recognizable expense. It should mention a person paying, an amount of money, and something they paid for. Greetings, questions, random text, or incomplete sentences are NOT valid expenses.
- If the input is NOT a valid expense, set valid=false, payerName="", amount=0, description="", participantNames=[], excludeNames=[], and put a helpful error message in errorMessage (e.g. "That doesn't look like an expense. Try: Leo paid $50 for dinner").
- If the input IS a valid expense:
  - Set valid=true, errorMessage=""
  - Match payerName to the closest member name (case-insensitive, fuzzy match on first name or full name)
  - Amount is in dollars (must be positive)
  - If no specific participants are mentioned, participantNames should be an empty array (meaning everyone splits it)
  - If someone says "except X", put X in excludeNames
  - If specific people are mentioned as participants, put their matched names in participantNames
  - Always match names to the actual member names listed above
  - Keep description concise (e.g. "dinner", "ramen", "hotel", not the full sentence)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as {
      valid: boolean;
      payerName: string;
      amount: number;
      description: string;
      participantNames: string[];
      excludeNames: string[];
      errorMessage: string;
    };

    if (!parsed.valid) {
      return NextResponse.json(
        { ok: false, error: parsed.errorMessage || "Could not parse that expense." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse expense";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
