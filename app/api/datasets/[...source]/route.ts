import type { NextRequest } from "next/server";
import { DatasetError } from "@/lib/types";
import { resolveDataset } from "@/lib/datasets";
import { clientIp, datasetErrorResponse, jsonError, jsonOk, optionsResponse } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ source: string[] }> }
) {
  const { source } = await ctx.params;
  const sourceStr = source.join("/");
  try {
    const dataset = await resolveDataset(sourceStr, clientIp(request));
    return jsonOk({
      source: dataset.source,
      kind: dataset.kind,
      name: dataset.name,
      version: dataset.version,
      description: dataset.description,
      itemCount: dataset.items.length,
      items: dataset.items,
      config: dataset.config,
    });
  } catch (error) {
    if (error instanceof DatasetError) return datasetErrorResponse(error);
    return jsonError(500, "internal", "Unexpected error resolving dataset.");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
