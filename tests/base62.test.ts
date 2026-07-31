import { describe, expect, it } from "vitest";
import { encodeBase62, decodeBase62, isValidCode } from "../lib/base62";

describe("base62", () => {
  it("round-trips small and large integers", () => {
    const values = [0n, 1n, 61n, 62n, 63n, 3843n, 123456789n, 1n << 40n, (1n << 80n) - 1n];
    for (const value of values) {
      expect(decodeBase62(encodeBase62(value))).toBe(value);
    }
  });

  it("encodes known values", () => {
    expect(encodeBase62(0n)).toBe("0");
    expect(encodeBase62(1n)).toBe("1");
    expect(encodeBase62(61n)).toBe("z");
    expect(encodeBase62(62n)).toBe("10");
    expect(encodeBase62(3843n)).toBe("zz");
  });

  it("decodes known values", () => {
    expect(decodeBase62("0")).toBe(0n);
    expect(decodeBase62("10")).toBe(62n);
    expect(decodeBase62("zz")).toBe(3843n);
  });

  it("rejects characters outside the base62 alphabet", () => {
    expect(() => decodeBase62("01-")).toThrow();
    expect(() => decodeBase62("01_")).toThrow();
    expect(decodeBase62("")).toBe(0n);
  });

  it("isValidCode matches the base62 alphabet", () => {
    expect(isValidCode("Ab3z9")).toBe(true);
    expect(isValidCode("abc-")).toBe(false);
    expect(isValidCode("abc def")).toBe(false);
  });
});
