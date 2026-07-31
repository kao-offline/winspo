import { NextResponse } from "next/server";
import { DatasetError } from "./types";

export function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, Accept",
    "Access-Control-Max-Age": "86400",
  };
}

function applyCors(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(corsHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}

export function jsonOk(data: unknown): NextResponse {
  return applyCors(NextResponse.json(data));
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>
): NextResponse {
  return applyCors(
    NextResponse.json({ error: code, message, ...extra }, { status })
  );
}

export function datasetErrorResponse(error: DatasetError): NextResponse {
  return jsonError(error.status, error.code, error.message);
}

export function optionsResponse(): NextResponse {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "local";
}
