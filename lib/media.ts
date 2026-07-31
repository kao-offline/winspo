import type { MediaFields } from "./types";

const ABSOLUTE_URL = /^https?:\/\//i;

function isSafeRelativePath(path: string): boolean {
  const segments = path.split("/");
  return !segments.some((segment) => segment === "..");
}

export function resolveMediaUrl(
  path: string | undefined,
  baseUrl: string
): string | undefined {
  if (!path) return undefined;
  if (ABSOLUTE_URL.test(path)) return path;
  if (path.startsWith("//")) return `https:${path}`;
  if (path.startsWith("/")) return path;
  if (!isSafeRelativePath(path)) {
    console.warn(`WInspo: skipping unsafe media path "${path}"`);
    return undefined;
  }
  return baseUrl + path;
}

export function resolveItemMedia(
  media: MediaFields,
  baseUrl: string
): MediaFields {
  return {
    thumbnail: resolveMediaUrl(media.thumbnail, baseUrl),
    fullpage: resolveMediaUrl(media.fullpage, baseUrl),
    video: resolveMediaUrl(media.video, baseUrl),
    scrollVideo: resolveMediaUrl(media.scrollVideo, baseUrl),
  };
}

export function builtinMediaBase(folder: string): string {
  return `/datasets/${folder}/`;
}

export function byoMediaBase(user: string, repo: string, ref: string): string {
  return `https://raw.githubusercontent.com/${user}/${repo}/${ref}/`;
}
