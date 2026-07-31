import { decodeBase62, encodeBase62, isValidCode } from "./base62";
import { DatasetError } from "./types";

export function slotsToMask(slots: Iterable<number>): bigint {
  let mask = 0n;
  for (const slot of slots) {
    mask |= 1n << BigInt(slot);
  }
  return mask;
}

export function encodeSelection(slots: Iterable<number>): string {
  return encodeBase62(slotsToMask(slots));
}

export function decodeSelection(code: string): bigint {
  const clean = String(code).trim();
  if (!isValidCode(clean)) {
    throw new DatasetError(
      "invalid_code",
      "Invalid code. Use only letters and numbers (A-Z, a-z, 0-9).",
      400
    );
  }
  return decodeBase62(clean);
}

export interface ResolvedMask {
  slots: number[];
  unknown: boolean;
}

export function resolveMask(mask: bigint, itemSlots: number[]): ResolvedMask {
  const slotSet = new Set(itemSlots);
  const maxSlot = itemSlots.length > 0 ? Math.max(...itemSlots) : -1;
  const slots: number[] = [];
  let unknown = false;

  for (let bit = 0; bit <= maxSlot; bit++) {
    if ((mask & (1n << BigInt(bit))) !== 0n) {
      if (slotSet.has(bit)) {
        slots.push(bit);
      } else {
        unknown = true;
      }
    }
  }

  if (maxSlot >= 0 && (mask >> BigInt(maxSlot + 1)) !== 0n) {
    unknown = true;
  }

  return { slots, unknown };
}
