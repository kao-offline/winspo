import { describe, expect, it } from "vitest";
import { computeProfile } from "../lib/profile";
import type { ItemTags } from "../lib/types";

function tags(partial: Partial<ItemTags> & { palette?: string[] }): { tags: ItemTags } {
  return {
    tags: {
      palette: partial.palette ?? ["bright"],
      layout: partial.layout ?? "asymmetric",
      motion: partial.motion ?? "medium",
      typography: partial.typography ?? "display-sans",
      category: partial.category ?? "portfolio",
    },
  };
}

describe("design profile", () => {
  it("aggregates the most frequent tags per category", () => {
    const items = [
      tags({ palette: ["bright", "warm"], motion: "high", category: "portfolio" }),
      tags({ palette: ["bright", "warm"], motion: "high", category: "portfolio" }),
      tags({ palette: ["dark", "cool"], motion: "low", category: "product" }),
    ];

    const profile = computeProfile(items);
    expect(profile.byCategory.palette.top).toEqual(["bright", "warm"]);
    expect(profile.byCategory.motion.top[0]).toBe("high");
    expect(profile.byCategory.category.top[0]).toBe("portfolio");
  });

  it("produces a human-readable summary", () => {
    const items = [
      tags({ palette: ["bright", "warm"], motion: "high", typography: "display-serif", category: "portfolio" }),
      tags({ palette: ["bright", "warm"], motion: "high", typography: "display-serif", category: "portfolio" }),
    ];
    const profile = computeProfile(items);
    expect(profile.summary).toContain("bright and warm palettes");
    expect(profile.summary).toContain("high motion");
    expect(profile.summary).toContain("display-serif typography");
    expect(profile.summary).toContain("mostly portfolio-style sites");
  });

  it("handles an empty selection", () => {
    const profile = computeProfile([]);
    expect(profile.summary).toBe("Nothing selected yet.");
    for (const category of Object.values(profile.byCategory)) {
      expect(category.top).toEqual([]);
    }
  });

  it("is deterministic for the same input", () => {
    const items = [tags({ palette: ["bright"], motion: "high" })];
    expect(computeProfile(items).summary).toBe(computeProfile(items).summary);
  });
});
