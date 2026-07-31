import { describe, expect, it } from "vitest";
import { encodeSelection, decodeSelection, resolveMask } from "../lib/codec";
import { DatasetError } from "../lib/types";

describe("selection codec", () => {
  it("round-trips a selection", () => {
    const slots = [0, 3, 7, 44];
    const code = encodeSelection(slots);
    const mask = decodeSelection(code);
    const { slots: decoded, unknown } = resolveMask(mask, slots);
    expect(decoded).toEqual(slots);
    expect(unknown).toBe(false);
  });

  it("encodes empty selection as 0", () => {
    const code = encodeSelection([]);
    expect(code).toBe("0");
    const mask = decodeSelection(code);
    expect(resolveMask(mask, [0, 1, 2])).toEqual({ slots: [], unknown: false });
  });

  it("is order-independent across item reordering thanks to stable slots", () => {
    const datasetA = [{ slot: 0 }, { slot: 1 }, { slot: 2 }];
    const datasetB = [{ slot: 2 }, { slot: 0 }, { slot: 1 }]; // reordered

    const code = encodeSelection([1]); // slot 1 selected
    const mask = decodeSelection(code);

    const a = resolveMask(mask, datasetA.map((i) => i.slot));
    const b = resolveMask(mask, datasetB.map((i) => i.slot));
    expect(a.slots).toEqual([1]);
    expect(b.slots).toEqual([1]);
    expect(encodeSelection([1])).toBe(code);
  });

  it("flags unknown bits above the dataset's max slot", () => {
    const mask = (1n << 50n) | 1n; // slot 50 and slot 0
    const { slots, unknown } = resolveMask(mask, [0, 1, 2, 3]);
    expect(slots).toEqual([0]);
    expect(unknown).toBe(true);
  });

  it("flags slots that were deleted from the dataset", () => {
    const mask = (1n << 2n) | (1n << 5n); // slot 5 missing from dataset
    const { slots, unknown } = resolveMask(mask, [0, 1, 2, 3, 4, 6]);
    expect(slots).toEqual([2]);
    expect(unknown).toBe(true);
  });

  it("is deterministic", () => {
    const a = encodeSelection([2, 5, 9]);
    const b = encodeSelection([2, 5, 9]);
    expect(a).toBe(b);
  });

  it("rejects invalid codes", () => {
    expect(() => decodeSelection("not-a-code!")).toThrow(DatasetError);
    expect(() => decodeSelection("123_")).toThrow(DatasetError);
    try {
      decodeSelection("!!!!");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(DatasetError);
      expect((error as DatasetError).code).toBe("invalid_code");
    }
  });

  it("handles large datasets (100+ items)", () => {
    const slots = [0, 1, 99, 100, 127];
    const code = encodeSelection(slots);
    const mask = decodeSelection(code);
    const { slots: decoded, unknown } = resolveMask(mask, slots);
    expect(decoded).toEqual(slots);
    expect(unknown).toBe(false);
  });
});
