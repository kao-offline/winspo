import type { ItemTags } from "./types";

export type TagCategory = "palette" | "layout" | "motion" | "typography" | "category";

export interface CategoryAggregate {
  top: string[];
  counts: Record<string, number>;
}

export interface DesignProfile {
  summary: string;
  byCategory: Record<TagCategory, CategoryAggregate>;
}

export const TAG_CATEGORIES: TagCategory[] = [
  "palette",
  "layout",
  "motion",
  "typography",
  "category",
];

const MOTION_PHRASES: Record<string, string> = {
  high: "high motion",
  medium: "medium motion",
  low: "low motion",
  none: "minimal motion",
};

function aggregate(values: string[]): CategoryAggregate {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = value?.trim();
    if (key) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  const sorted = Object.entries(counts).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  return { top: sorted.slice(0, 2).map(([key]) => key), counts };
}

function valuesFor(item: ItemTags, category: TagCategory): string[] {
  if (category === "palette") {
    return item.palette;
  }
  return [item[category]];
}

function palettePhrase(top: string[]): string | null {
  if (top.length === 0) return null;
  if (top.length === 1) return `${top[0]} palettes`;
  return `${top.join(" and ")} palettes`;
}

function motionPhrase(top: string[]): string | null {
  if (top.length === 0) return null;
  return top.map((value) => MOTION_PHRASES[value] ?? `${value} motion`).join(", ");
}

function typographyPhrase(top: string[]): string | null {
  if (top.length === 0) return null;
  return top.map((value) => `${value} typography`).join(" and ");
}

function layoutPhrase(top: string[]): string | null {
  if (top.length === 0) return null;
  return top.map((value) => `${value} layouts`).join(" and ");
}

function categoryPhrase(top: string[]): string | null {
  if (top.length === 0) return null;
  return top.map((value) => `${value}-style sites`).join(", ");
}

export function computeProfile(items: Array<{ tags: ItemTags }>): DesignProfile {
  const byCategory = {} as Record<TagCategory, CategoryAggregate>;
  const allValues: Record<TagCategory, string[]> = {
    palette: [],
    layout: [],
    motion: [],
    typography: [],
    category: [],
  };

  for (const item of items) {
    for (const category of TAG_CATEGORIES) {
      allValues[category].push(...valuesFor(item.tags, category));
    }
  }

  for (const category of TAG_CATEGORIES) {
    byCategory[category] = aggregate(allValues[category]);
  }

  let summary: string;
  if (items.length === 0) {
    summary = "Nothing selected yet.";
  } else {
    const parts: string[] = [];
    const palette = palettePhrase(byCategory.palette.top);
    const motion = motionPhrase(byCategory.motion.top);
    const typography = typographyPhrase(byCategory.typography.top);
    const layout = layoutPhrase(byCategory.layout.top);
    const category = categoryPhrase(byCategory.category.top);
    if (palette) parts.push(palette);
    if (motion) parts.push(motion);
    if (typography) parts.push(typography);
    if (layout) parts.push(layout);
    if (category) parts.push(`mostly ${category}`);
    summary =
      parts.length > 0
        ? `This selection leans: ${parts.join("; ")}.`
        : "This selection has no discernible direction yet.";
  }

  return { summary, byCategory };
}
