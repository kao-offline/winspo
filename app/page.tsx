import type { Metadata } from "next";
import DatasetAppShell from "@/components/DatasetAppShell";

export const metadata: Metadata = {
  title: "Root dataset — WInspo",
};

export default async function RootDatasetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const embed = query.embed === "true";
  const initialCode = typeof query.code === "string" ? query.code : undefined;
  const lang = typeof query.lang === "string" ? query.lang : undefined;

  return (
    <DatasetAppShell
      source="root"
      mode="gallery"
      embed={embed}
      initialCode={initialCode}
      builtin
      lang={lang}
    />
  );
}
