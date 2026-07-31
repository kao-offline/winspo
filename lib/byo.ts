import { DatasetError } from "./types";
import type { DatasetConfig, DatasetManifest } from "./types";
import { parseConfig, parseManifest } from "./validate";
import { BYO_CACHE_TTL_MS, MAX_FETCH_TIMEOUT_MS } from "./constants";
import { rateLimit } from "./rateLimit";

const BYO_PREFIX = "byo/";
const REF_PATTERN = /^[A-Za-z0-9._-]+$/;

export interface ByoRef {
  user: string;
  repo: string;
  ref: string;
}

export function isByoSource(source: string): boolean {
  return source === "byo" || source.startsWith(BYO_PREFIX);
}

export function parseByoSource(source: string): ByoRef {
  const rest = source.slice(BYO_PREFIX.length);
  const atIndex = rest.lastIndexOf("@");
  const path = atIndex === -1 ? rest : rest.slice(0, atIndex);
  const refPart = atIndex === -1 ? "" : rest.slice(atIndex + 1);

  const slash = path.indexOf("/");
  const user = path.slice(0, slash);
  const repo = slash === -1 ? "" : path.slice(slash + 1);

  if (!user || !repo) {
    throw new DatasetError(
      "not_found",
      "Invalid BYO dataset reference. Expected byo/{githubUsername}/{repo}[@ref].",
      404
    );
  }

  const ref = refPart || "main";
  if (!REF_PATTERN.test(ref)) {
    throw new DatasetError(
      "not_found",
      `Invalid ref "${refPart}". Use a tag or branch name (no slashes).`,
      404
    );
  }

  return { user, repo, ref };
}

interface CacheEntry {
  manifest: DatasetManifest;
  config: DatasetConfig | null;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

function rawFileUrl(user: string, repo: string, ref: string, file: string): string {
  return `https://raw.githubusercontent.com/${encodeURIComponent(user)}/${encodeURIComponent(
    repo
  )}/${ref}/${file}`;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MAX_FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "winsip/1.0", Accept: "application/json" },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchByoDataset(
  source: string,
  clientKey: string
): Promise<{ manifest: DatasetManifest; config: DatasetConfig | null }> {
  const { user, repo, ref } = parseByoSource(source);
  const cacheKey = `${user}/${repo}@${ref}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < BYO_CACHE_TTL_MS) {
    return { manifest: cached.manifest, config: cached.config };
  }

  const limited = rateLimit(`byo:${clientKey}`, 60, 60_000);
  if (!limited.ok) {
    throw new DatasetError(
      "rate_limited",
      `Too many requests from this client. Try again in about ${limited.retryAfterSec}s.`,
      429
    );
  }

  const manifestUrl = rawFileUrl(user, repo, ref, "winspo.json");
  const manifestRes = await fetchWithTimeout(manifestUrl);
  if (!manifestRes.ok) {
    if (manifestRes.status === 404) {
      throw new DatasetError(
        "github_404",
        `Couldn't find winspo.json in ${user}/${repo}@${ref}. Make sure the repo is public and the file exists at its root.`,
        404
      );
    }
    throw new DatasetError(
      "fetch_failed",
      `Failed to fetch winspo.json from GitHub (HTTP ${manifestRes.status}).`,
      502
    );
  }

  let raw: unknown;
  try {
    raw = await manifestRes.json();
  } catch {
    throw new DatasetError("invalid_manifest", "winspo.json is not valid JSON.", 422);
  }

  const manifest = parseManifest(raw);

  let config: DatasetConfig | null = null;
  const configRes = await fetchWithTimeout(rawFileUrl(user, repo, ref, "winspo.config.json"));
  if (configRes.ok) {
    let configRaw: unknown = null;
    try {
      configRaw = await configRes.json();
    } catch {
      console.warn("WInspo: winspo.config.json is not valid JSON, ignoring it.");
    }
    config = parseConfig(configRaw);
  }

  cache.set(cacheKey, { manifest, config, fetchedAt: Date.now() });
  return { manifest, config };
}
