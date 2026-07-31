import type { NextRequest } from "next/server";
import { DatasetError } from "@/lib/types";
import { resolveDataset } from "@/lib/datasets";
import { decodeCodeAgainstDataset } from "@/lib/decode";
import { computeProfile } from "@/lib/profile";
import { clientIp, datasetErrorResponse, jsonError, jsonOk, optionsResponse } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const datasetParam = url.searchParams.get("dataset");
  const code = url.searchParams.get("code");

  if (!datasetParam || !code) {
    return jsonError(
      400,
      "invalid_params",
      "Both dataset and code query params are required, e.g. /api/decode?dataset=illustro&code=1A2bC"
    );
  }

  try {
    const dataset = await resolveDataset(datasetParam, clientIp(request));
    const decoded = decodeCodeAgainstDataset(code, dataset);
    const profile = computeProfile(decoded.selectedItems);
    return jsonOk({
      dataset: {
        source: dataset.source,
        name: dataset.name,
        version: dataset.version,
        kind: dataset.kind,
      },
      code,
      mask: decoded.mask,
      slots: decoded.slots,
      itemCount: decoded.itemCount,
      unknown: decoded.unknown,
      items: decoded.selectedItems,
      profile,
    });
  } catch (error) {
    if (error instanceof DatasetError) return datasetErrorResponse(error);
    return jsonError(500, "internal", "Unexpected error decoding selection.");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
