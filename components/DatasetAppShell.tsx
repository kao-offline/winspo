import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DatasetError } from "@/lib/types";
import { getBuiltinEntry, resolveDataset } from "@/lib/datasets";
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
}: {
  source: string;
  mode: "gallery" | "lookup";
  embed: boolean;
  initialCode?: string;
  builtin?: boolean;
}) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

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
        <GalleryClient dataset={dataset} embed={embed} initialCode={initialCode} />
      ) : (
        <LookupClient dataset={dataset} embed={embed} initialCode={initialCode} />
      )}
    </ThemeProvider>
  );
}
