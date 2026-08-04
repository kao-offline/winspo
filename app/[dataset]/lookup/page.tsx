import DatasetAppShell from "@/components/DatasetAppShell";

export const metadata = {
  title: "Lookup — WInspo",
};

export default async function DatasetLookupPage({
  params,
  searchParams,
}: {
  params: Promise<{ dataset: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { dataset } = await params;
  const query = await searchParams;
  const embed = query.embed === "true";
  const initialCode = typeof query.code === "string" ? query.code : undefined;
  const lang = typeof query.lang === "string" ? query.lang : undefined;

  return (
    <DatasetAppShell
      source={dataset}
      mode="lookup"
      embed={embed}
      initialCode={initialCode}
      builtin
      lang={lang}
    />
  );
}
