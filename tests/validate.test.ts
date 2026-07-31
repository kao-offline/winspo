import { describe, expect, it, vi } from "vitest";
import { parseManifest, parseConfig } from "../lib/validate";
import { DatasetError } from "../lib/types";

const validItem = {
  id: 1,
  title: "Studio Nova",
  url: "https://example.com",
  media: { thumbnail: "assets/1-thumb.jpg" },
  tags: {
    palette: ["bright", "warm"],
    layout: "asymmetric",
    motion: "high",
    typography: "display-serif",
    category: "portfolio",
  },
};

const validManifest = {
  name: "illustro",
  version: "1.0.0",
  description: "Illustration-heavy creative sites",
  items: [validItem],
};

describe("manifest validation", () => {
  it("accepts a valid manifest", () => {
    const parsed = parseManifest(validManifest);
    expect(parsed.name).toBe("illustro");
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].slot).toBeUndefined();
  });

  it("accepts manifests without any media", () => {
    expect(
      parseManifest({ ...validManifest, items: [{ ...validItem, media: undefined }] }).items[0]
        .media
    ).toEqual({});
  });

  it("rejects a manifest without items", () => {
    expect(() => parseManifest({ name: "x", version: "1", items: [] })).toThrow(DatasetError);
  });

  it("rejects an item missing required tags", () => {
    expect(() =>
      parseManifest({ ...validManifest, items: [{ ...validItem, tags: undefined }] })
    ).toThrow(DatasetError);
  });

  it("rejects an item missing tag fields", () => {
    expect(() =>
      parseManifest({
        ...validManifest,
        items: [{ ...validItem, tags: { palette: ["bright"] } }],
      })
    ).toThrow(DatasetError);
  });

  it("rejects non-JSON shapes gracefully", () => {
    expect(() => parseManifest(null)).toThrow(DatasetError);
    expect(() => parseManifest("nope")).toThrow(DatasetError);
    expect(() => parseManifest({})).toThrow(DatasetError);
  });

  it("reports the first few issues in the message", () => {
    try {
      parseManifest({ name: "", version: "1", items: [] });
      expect.unreachable();
    } catch (error) {
      expect((error as DatasetError).code).toBe("invalid_manifest");
      expect((error as DatasetError).message).toContain("items");
    }
  });
});

describe("config validation", () => {
  it("accepts a full config", () => {
    const config = parseConfig({
      theme: { primary: "#E8552B", accent: "#7A1E1E", background: "#FFFFFF", textColor: "#1A1A1A" },
      logo: "assets/logo.svg",
      logoLink: "https://designerstudio.com",
      font: "Inter",
      defaultDataset: true,
    });
    expect(config?.theme?.primary).toBe("#E8552B");
    expect(config?.font).toBe("Inter");
  });

  it("returns null for empty configs", () => {
    expect(parseConfig(null)).toBeNull();
    expect(parseConfig(undefined)).toBeNull();
    expect(parseConfig({})).toBeNull();
  });

  it("warns and returns null for malformed configs", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseConfig({ theme: "not-an-object" })).toBeNull();
    expect(parseConfig({ defaultDataset: "yes" })).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
