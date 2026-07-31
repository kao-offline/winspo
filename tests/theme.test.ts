import { describe, expect, it, vi } from "vitest";
import { isValidColor, normalizeTheme, buildThemeVariables } from "../lib/theme";
import { DEFAULT_THEME } from "../lib/constants";

describe("theme color handling", () => {
  it("accepts hex and rgb colors", () => {
    expect(isValidColor("#E8552B")).toBe(true);
    expect(isValidColor("#fff")).toBe(true);
    expect(isValidColor("rgb(232, 85, 43)")).toBe(true);
    expect(isValidColor("rgba(232, 85, 43, 0.5)")).toBe(true);
  });

  it("rejects malformed colors", () => {
    expect(isValidColor("orange")).toBe(false);
    expect(isValidColor("#GGGGGG")).toBe(false);
    expect(isValidColor("rgb(300, 0, 0)")).toBe(false);
    expect(isValidColor("")).toBe(false);
  });

  it("drops malformed theme values and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const theme = normalizeTheme({ primary: "banana", accent: "#7A1E1E" });
    expect(theme.primary).toBeUndefined();
    expect(theme.accent).toBe("#7A1E1E");
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("falls back to defaults for missing values", () => {
    const vars = buildThemeVariables(null);
    expect(vars["--color-primary"]).toBe(DEFAULT_THEME.primary);
    expect(vars["--color-background"]).toBe(DEFAULT_THEME.background);
  });

  it("applies configured colors over defaults", () => {
    const vars = buildThemeVariables({ theme: { primary: "#112233" } });
    expect(vars["--color-primary"]).toBe("#112233");
    expect(vars["--color-accent"]).toBe(DEFAULT_THEME.accent);
  });
});
