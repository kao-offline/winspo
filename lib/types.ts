export interface MediaFields {
  thumbnail?: string;
  fullpage?: string;
  video?: string;
  scrollVideo?: string;
}

export interface ItemTags {
  palette: string[];
  layout: string;
  motion: string;
  typography: string;
  category: string;
}

export interface ManifestItem {
  id: number;
  slot?: number;
  title: string;
  url?: string;
  media: MediaFields;
  tags: ItemTags;
}

export interface DatasetManifest {
  name: string;
  version: string;
  description?: string;
  items: ManifestItem[];
}

export interface DatasetTheme {
  primary?: string;
  accent?: string;
  background?: string;
  textColor?: string;
}

export interface DatasetConfig {
  theme?: DatasetTheme;
  logo?: string;
  logoLink?: string;
  font?: string;
  defaultDataset?: boolean;
}

export type DatasetKind = "builtin" | "byo";

export interface ResolvedItem extends ManifestItem {
  slot: number;
  index: number;
  media: MediaFields;
}

export interface ResolvedDataset {
  source: string;
  urlPath: string;
  kind: DatasetKind;
  name: string;
  version: string;
  description?: string;
  items: ResolvedItem[];
  config: DatasetConfig | null;
  folder?: string;
  ref?: string;
  repo?: string;
}

export type DatasetErrorCode =
  | "not_found"
  | "coming_soon"
  | "invalid_manifest"
  | "fetch_failed"
  | "github_404"
  | "rate_limited"
  | "invalid_code"
  | "invalid_params";

export class DatasetError extends Error {
  code: DatasetErrorCode;
  status: number;

  constructor(code: DatasetErrorCode, message: string, status = 400) {
    super(message);
    this.name = "DatasetError";
    this.code = code;
    this.status = status;
  }
}
