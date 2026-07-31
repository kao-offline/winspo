import { z } from "zod";
import { DatasetError } from "./types";
import type { DatasetConfig, DatasetManifest, MediaFields } from "./types";

const mediaSchema = z
  .object({
    thumbnail: z.string().optional(),
    fullpage: z.string().optional(),
    video: z.string().optional(),
    scrollVideo: z.string().optional(),
  })
  .strict();

const tagsSchema = z.object({
  palette: z.array(z.string()),
  layout: z.string(),
  motion: z.string(),
  typography: z.string(),
  category: z.string(),
});

const itemSchema = z.object({
  id: z.number().int().nonnegative(),
  slot: z.number().int().nonnegative().optional(),
  title: z.string().min(1),
  url: z.string().optional(),
  media: mediaSchema.optional(),
  tags: tagsSchema,
});

export const manifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

const themeSchema = z.object({
  primary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  textColor: z.string().optional(),
});

export const configSchema = z.object({
  theme: themeSchema.optional(),
  logo: z.string().optional(),
  logoLink: z.string().optional(),
  font: z.string().optional(),
  defaultDataset: z.boolean().optional(),
});

function zodErrorToString(error: z.ZodError): string {
  return error.issues
    .slice(0, 6)
    .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("; ");
}

export function parseManifest(raw: unknown): DatasetManifest {
  const result = manifestSchema.safeParse(raw);
  if (!result.success) {
    throw new DatasetError(
      "invalid_manifest",
      `Invalid winspo.json manifest: ${zodErrorToString(result.error)}`,
      422
    );
  }
  const manifest = result.data as DatasetManifest;
  for (const item of manifest.items) {
    if (item.media === undefined) {
      item.media = {} as MediaFields;
    }
  }
  return manifest;
}

export function parseConfig(raw: unknown): DatasetConfig | null {
  if (raw === null || raw === undefined || (typeof raw === "object" && Object.keys(raw as object).length === 0)) {
    return null;
  }
  const result = configSchema.safeParse(raw);
  if (!result.success) {
    console.warn(`WInspo: ignoring malformed winspo.config.json (${zodErrorToString(result.error)})`);
    return null;
  }
  return result.data as DatasetConfig;
}
