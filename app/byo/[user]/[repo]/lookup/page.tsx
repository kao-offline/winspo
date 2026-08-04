import DatasetAppShell from "@/components/DatasetAppShell";

export const metadata = {
  title: "Lookup — WInspo",
};

export default async function ByoDatasetLookupPage({
  params,
  searchParams,
}: {
  params: Promise<{ user: string; repo: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user, repo } = await params;
  const query = await searchParams;
  const source = `byo/${user}/${repo}`;
  const embed = query.embed === "true";
  const initialCode = typeof query.code === "string" ? query.code : undefined;
  const lang = typeof query.lang === "string" ? query.lang : undefined;

  return (
    <DatasetAppShell
      source={source}
      mode="lookup"
      embed={embed}
      initialCode={initialCode}
      lang={lang}
    />
  );
}
