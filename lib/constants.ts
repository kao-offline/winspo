export const APP_NAME = "WInspo";

export const DEFAULT_THEME = {
  primary: "#E8552B",
  accent: "#7A1E1E",
  background: "#FFFFFF",
  textColor: "#1A1A1A",
} as const;

export const BYO_CACHE_TTL_MS = 10 * 60 * 1000;
export const BYO_ASSET_SIZE_LIMIT_BYTES = 30 * 1024 * 1024;
export const MAX_FETCH_TIMEOUT_MS = 15000;

export const FONT_MAP: Record<string, string> = {
  Inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  "DM Sans": "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  "Space Grotesk": "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  "IBM Plex Mono": "'IBM Plex Mono', ui-monospace, monospace",
  Georgia: "Georgia, 'Times New Roman', serif",
  Bricolage: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
};

export function fontFamilyFor(font?: string): string | null {
  if (!font) return null;
  const known = FONT_MAP[font];
  if (known) return known;
  return `'${font.replace(/[^a-zA-Z0-9 _-]/g, "")}', ui-sans-serif, system-ui, sans-serif`;
}

export function googleFontsHref(font?: string): string | null {
  if (!font) return null;
  const key = font.trim();
  if (key === "Inter") return "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  if (key === "DM Sans") return "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap";
  if (key === "Space Grotesk") return "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap";
  if (key === "Bricolage") return "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&display=swap";
  if (key === "IBM Plex Mono") return "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap";
  return null;
}
