import { BYO_ASSET_SIZE_LIMIT_BYTES } from "./constants";

export type AssetHealth = "ok" | "missing" | "too-large" | "unknown";

const healthCache = new Map<string, AssetHealth>();

export async function checkAssetHealth(
  src: string,
  kind: "builtin" | "byo"
): Promise<AssetHealth> {
  if (kind === "builtin") return "ok";
  const cached = healthCache.get(src);
  if (cached) return cached;
  let health: AssetHealth = "missing";
  try {
    const res = await fetch(src, { method: "HEAD", redirect: "follow" });
    if (res.ok) {
      const length = Number(res.headers.get("content-length") ?? 0);
      health = length > BYO_ASSET_SIZE_LIMIT_BYTES ? "too-large" : "ok";
    } else {
      health = "missing";
    }
  } catch {
    health = "unknown";
  }
  healthCache.set(src, health);
  return health;
}
