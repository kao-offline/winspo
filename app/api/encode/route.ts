import type { NextRequest } from "next/server";
import { DatasetError } from "@/lib/types";
import { encodeSelection } from "@/lib/codec";
import { resolveDataset } from "@/lib/datasets";
import { clientIp, datasetErrorResponse, jsonError, jsonOk, optionsResponse } from "@/lib/api";

export const runtime = "nodejs";

function parseListParam(raw: string | null): number[] | null {
  if (!raw) return null;
  const parts = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new DatasetError(
      "invalid_params",
      "indices/slots must be non-negative integers separated by commas.",
      400
    );
  }
  return nums;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const datasetParam = url.searchParams.get("dataset");
  const slotsRaw = url.searchParams.get("slots");
  const indicesRaw = url.searchParams.get("indices");

  try {
    let slots: number[] | null = null;

    if (slotsRaw !== null) {
      slots = parseListParam(slotsRaw);
    } else if (indicesRaw !== null) {
      const indices = parseListParam(indicesRaw);
      if (!datasetParam) {
        throw new DatasetError(
          "invalid_params",
          "Mapping indices to slots requires a dataset param.",
          400
        );
      }
      const dataset = await resolveDataset(datasetParam, clientIp(request));
      slots = indices!.map((index) => {
        const item = dataset.items[index];
        if (!item) {
          throw new DatasetError(
            "invalid_params",
            `Index ${index} is out of range for dataset "${datasetParam}".`,
            400
          );
        }
        return item.slot;
      });
    } else {
      throw new DatasetError(
        "invalid_params",
        "Provide slots=0,2,5 (pure math) or dataset + indices=0,2,5.",
        400
      );
    }

    if (slots === null) slots = [];
    const code = encodeSelection(slots);
    return jsonOk({ code, slots });
  } catch (error) {
    if (error instanceof DatasetError) return datasetErrorResponse(error);
    return jsonError(500, "internal", "Unexpected error encoding selection.");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
