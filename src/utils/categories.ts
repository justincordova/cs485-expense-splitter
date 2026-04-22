export type Category = "DIN" | "BEV" | "TKT" | "BED" | "FUN" | "EXP";

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  DIN: [
    "food",
    "dinner",
    "lunch",
    "breakfast",
    "cafe",
    "coffee",
    "gelato",
    "ramen",
    "sushi",
    "pizza",
    "burger",
    "taco",
    "restaurant",
    "meal",
    "brunch",
    "snack",
    "dine",
    "ichiran",
  ],
  BEV: ["beer", "drink", "bar", "cocktail", "wine", "izakaya", "shots", "whiskey", "sake", "pub"],
  TKT: [
    "train",
    "taxi",
    "uber",
    "flight",
    "bus",
    "travel",
    "gas",
    "toll",
    "shinkansen",
    "metro",
    "subway",
    "lyft",
    "ferry",
    "parking",
  ],
  BED: ["hotel", "airbnb", "stay", "accommodation", "hostel", "motel", "resort", "lodging"],
  FUN: [
    "tour",
    "ticket",
    "museum",
    "activity",
    "entry",
    "show",
    "teamlab",
    "disneyland",
    "park",
    "concert",
    "movie",
    "experience",
    "attraction",
  ],
  EXP: [],
};

export function detectCategory(description: string): Category {
  const lower = description.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    if (cat === "EXP") continue;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return cat;
    }
  }
  return "EXP";
}

const CATEGORY_STYLES: Record<
  Category,
  { label: string; bgDark: string; bgLight: string; textDark: string; textLight: string }
> = {
  DIN: {
    label: "DIN",
    bgDark: "hsla(46, 100%, 50%, 0.15)",
    bgLight: "hsla(46, 80%, 50%, 0.12)",
    textDark: "hsl(46, 100%, 65%)",
    textLight: "hsl(46, 80%, 35%)",
  },
  BEV: {
    label: "BEV",
    bgDark: "hsla(342, 100%, 58%, 0.15)",
    bgLight: "hsla(342, 80%, 50%, 0.12)",
    textDark: "hsl(342, 100%, 70%)",
    textLight: "hsl(342, 80%, 40%)",
  },
  TKT: {
    label: "TKT",
    bgDark: "hsla(186, 95%, 47%, 0.15)",
    bgLight: "hsla(186, 80%, 47%, 0.12)",
    textDark: "hsl(186, 95%, 60%)",
    textLight: "hsl(186, 80%, 35%)",
  },
  BED: {
    label: "BED",
    bgDark: "hsla(262, 80%, 60%, 0.15)",
    bgLight: "hsla(262, 60%, 50%, 0.12)",
    textDark: "hsl(262, 80%, 75%)",
    textLight: "hsl(262, 60%, 40%)",
  },
  FUN: {
    label: "FUN",
    bgDark: "hsla(146, 100%, 50%, 0.15)",
    bgLight: "hsla(146, 70%, 40%, 0.12)",
    textDark: "hsl(146, 100%, 65%)",
    textLight: "hsl(146, 70%, 30%)",
  },
  EXP: {
    label: "EXP",
    bgDark: "hsla(215, 14%, 60%, 0.15)",
    bgLight: "hsla(215, 14%, 50%, 0.1)",
    textDark: "hsl(215, 14%, 60%)",
    textLight: "hsl(215, 14%, 40%)",
  },
};

export function getCategoryStyle(category: Category) {
  return CATEGORY_STYLES[category];
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_STYLES[category].label;
}
