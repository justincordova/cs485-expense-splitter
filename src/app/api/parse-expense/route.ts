import { GoogleGenerativeAI, type Schema, type SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const schema: Schema = {
  type: "object" as SchemaType.OBJECT,
  properties: {
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
  },
  required: ["payerName", "amount", "description", "participantNames", "excludeNames"],
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
- Match payerName to the closest member name (case-insensitive, fuzzy match)
- Amount is in dollars
- If no specific participants are mentioned, participantNames should be an empty array (meaning everyone splits it)
- If someone says "except X", put X in excludeNames
- If specific people are mentioned as participants, put their matched names in participantNames
- Always match names to the actual member names listed above`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as {
      payerName: string;
      amount: number;
      description: string;
      participantNames: string[];
      excludeNames: string[];
    };

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse expense";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
