import { DEFAULT_THEME } from "./constants";
import type { DatasetConfig, DatasetTheme } from "./types";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RGB_CHANNEL = /(?:1?\d{1,2}|2[0-4]\d|25[0-5])/;
const RGB_COLOR = new RegExp(
  `^rgba?\\(\\s*${RGB_CHANNEL.source}\\s*,\\s*${RGB_CHANNEL.source}\\s*,\\s*${RGB_CHANNEL.source}\\s*(?:,\\s*(?:0|1|0?\\.\\d+)\\s*)?\\)$`
);

export function isValidColor(value: string): boolean {
  return HEX_COLOR.test(value.trim()) || RGB_COLOR.test(value.trim());
}

export function normalizeTheme(theme: DatasetTheme | undefined): DatasetTheme {
  if (!theme) return {};
  const clean: DatasetTheme = {};
  for (const key of ["primary", "accent", "background", "textColor"] as const) {
    const raw = theme[key];
    if (raw !== undefined) {
      if (isValidColor(raw)) {
        clean[key] = raw.trim();
      } else {
        console.warn(`WInspo: ignoring malformed theme color "${key}" = "${raw}" (expected hex or rgb()).`);
      }
    }
  }
  return clean;
}

export function buildThemeVariables(config: DatasetConfig | null): Record<string, string> {
  const theme = normalizeTheme(config?.theme);
  return {
    "--color-primary": theme.primary ?? DEFAULT_THEME.primary,
    "--color-accent": theme.accent ?? DEFAULT_THEME.accent,
    "--color-background": theme.background ?? DEFAULT_THEME.background,
    "--color-text": theme.textColor ?? DEFAULT_THEME.textColor,
  };
}

export function resolveFontStack(font: string | undefined): string | null {
  if (!font) return null;
  const cleaned = font.trim();
  if (!cleaned) return null;
  const known: Record<string, string> = {
    Inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
    "DM Sans": "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    "Space Grotesk": "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', ui-monospace, monospace",
    Georgia: "Georgia, 'Times New Roman', serif",
    Bricolage: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
  };
  if (known[cleaned]) return known[cleaned];
  return `'${cleaned.replace(/[^a-zA-Z0-9 _-]/g, "")}', ui-sans-serif, system-ui, sans-serif`;
}

export function googleFontsHref(font: string | undefined): string | null {
  if (!font) return null;
  const key = font.trim();
  const map: Record<string, string> = {
    Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "DM Sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
    "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
    Bricolage: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&display=swap",
    "IBM Plex Mono": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
  };
  return map[key] ?? null;
}

export function mergeConfigTheme(config: DatasetConfig | null) {
  return buildThemeVariables(config);
}
