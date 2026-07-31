import { decodeSelection, resolveMask } from "./codec";
import type { ResolvedDataset, ResolvedItem } from "./types";

export interface DecodeResult {
  code: string;
  mask: string;
  slots: number[];
  selectedItems: ResolvedItem[];
  unknown: boolean;
  itemCount: number;
}

export function decodeCodeAgainstDataset(
  code: string,
  dataset: ResolvedDataset
): DecodeResult {
  const mask = decodeSelection(code);
  const itemSlots = dataset.items.map((item) => item.slot);
  const { slots, unknown } = resolveMask(mask, itemSlots);
  const slotSet = new Set(slots);
  const selectedItems = dataset.items.filter((item) => slotSet.has(item.slot));
  return {
    code,
    mask: mask.toString(10),
    slots,
    selectedItems,
    unknown,
    itemCount: dataset.items.length,
  };
}
