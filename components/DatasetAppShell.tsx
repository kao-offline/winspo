import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DatasetError } from "@/lib/types";
import { getBuiltinEntry, resolveDataset } from "@/lib/datasets";
import { detectLocale, localeFromCountryHeader } from "@/lib/geo";
import { FALLBACK_LOCALE } from "@/lib/i18n";
import ThemeProvider from "./ThemeProvider";
import GalleryClient from "./GalleryClient";
import LookupClient from "./LookupClient";
import ComingSoon from "./ComingSoon";
import ErrorState from "./ErrorState";

export default async function DatasetAppShell({
  source,
  mode,
  embed,
  initialCode,
  builtin = false,
  lang,
}: {
  source: string;
  mode: "gallery" | "lookup";
  embed: boolean;
  initialCode?: string;
  builtin?: boolean;
  lang?: string;
}) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const country =
    headerList.get("x-vercel-ip-country") ?? headerList.get("cf-ipcountry");
  const locale =
    lang ??
    localeFromCountryHeader(country) ??
    (await detectLocale(ip).catch(() => FALLBACK_LOCALE));

  let dataset;
  try {
    dataset = await resolveDataset(source, ip);
  } catch (error) {
    if (error instanceof DatasetError) {
      if (builtin && error.code === "coming_soon") {
        const entry = getBuiltinEntry(source);
        return <ComingSoon name={entry?.name ?? source} description={entry?.description} />;
      }
      if (builtin && error.code === "not_found") {
        notFound();
      }
      return (
        <ErrorState
          title="Can't load this dataset"
          message={error.message}
          hint={
            error.code === "github_404"
              ? "A BYO dataset needs a public GitHub repo with winspo.json at its root."
              : undefined
          }
        />
      );
    }
    throw error;
  }

  return (
    <ThemeProvider config={dataset.config}>
      {mode === "gallery" ? (
        <GalleryClient
          dataset={dataset}
          embed={embed}
          initialCode={initialCode}
          locale={locale}
        />
      ) : (
        <LookupClient
          dataset={dataset}
          embed={embed}
          initialCode={initialCode}
          locale={locale}
        />
      )}
    </ThemeProvider>
  );
}
