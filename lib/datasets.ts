import kaoManifest from "../datasets/kao/winspo.json";
import { DatasetError } from "./types";
import type { DatasetManifest, ResolvedDataset, ResolvedItem } from "./types";
import { parseByoSource, fetchByoDataset, isByoSource } from "./byo";
import { builtinMediaBase, byoMediaBase, resolveItemMedia } from "./media";

export interface DatasetEntry {
  id: string;
  name: string;
  description: string;
  accent: string;
  aliasOf?: string;
  comingSoon?: boolean;
}

export const BUILTIN_REGISTRY: DatasetEntry[] = [
  {
    id: "kao",
    name: "Kao",
    description:
      "A broad mix of real website styles — the personal gallery currently driving the built-in demo.",
    accent: "#E8552B",
  },
  {
    id: "root",
    name: "Root",
    description: "General-purpose, broad mix of website styles.",
    accent: "#E8552B",
    aliasOf: "kao",
  },
  {
    id: "illustro",
    name: "Illustro",
    description: "Illustration-heavy, high-motion creative sites.",
    accent: "#7A1E1E",
    comingSoon: true,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Startup/SaaS sites, glassy UI, subtle parallax, muted palettes.",
    accent: "#7A1E1E",
    comingSoon: true,
  },
];

const BUILTIN_MANIFESTS: Record<string, DatasetManifest> = {
  kao: kaoManifest as unknown as DatasetManifest,
};

export function getBuiltinEntry(id: string): DatasetEntry | undefined {
  return BUILTIN_REGISTRY.find((entry) => entry.id === id);
}

export function listBuiltinEntries(): DatasetEntry[] {
  return BUILTIN_REGISTRY;
}

export function canonicalId(id: string): string {
  const entry = getBuiltinEntry(id);
  return entry?.aliasOf ?? id;
}

export function urlPathFor(source: string): string {
  if (isByoSource(source)) return `/${source}`;
  return `/${source}`;
}

function resolveBuiltinItems(manifest: DatasetManifest, folder: string): ResolvedItem[] {
  const base = builtinMediaBase(folder);
  return manifest.items.map((item, index) => ({
    ...item,
    slot: item.slot ?? index,
    index,
    media: resolveItemMedia(item.media ?? {}, base),
  }));
}

function buildBuiltin(source: string): ResolvedDataset {
  const entry = getBuiltinEntry(source);
  if (!entry) {
    throw new DatasetError("not_found", `Unknown dataset "${source}".`, 404);
  }
  if (entry.comingSoon) {
    throw new DatasetError(
      "coming_soon",
      `"${entry.name}" isn't ready yet — it will appear here soon.`,
      404
    );
  }
  const canonical = canonicalId(source);
  const manifest = BUILTIN_MANIFESTS[canonical];
  if (!manifest) {
    throw new DatasetError("not_found", `Dataset "${source}" has no manifest yet.`, 404);
  }
  return {
    source,
    urlPath: `/${source}`,
    kind: "builtin",
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    items: resolveBuiltinItems(manifest, canonical),
    config: null,
    folder: canonical,
  };
}

async function buildByo(source: string, clientKey: string): Promise<ResolvedDataset> {
  const { manifest, config } = await fetchByoDataset(source, clientKey);
  const { user, repo, ref } = parseByoSource(source);
  const base = byoMediaBase(user, repo, ref);
  const items = manifest.items.map((item, index) => ({
    ...item,
    slot: item.slot ?? index,
    index,
    media: resolveItemMedia(item.media ?? {}, base),
  }));
  return {
    source,
    urlPath: `/${source}`,
    kind: "byo",
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    items,
    config,
    ref,
    repo: `${user}/${repo}`,
  };
}

export async function resolveDataset(
  source: string,
  clientKey = "anon"
): Promise<ResolvedDataset> {
  if (isByoSource(source)) {
    return buildByo(source, clientKey);
  }
  return buildBuiltin(source);
}
