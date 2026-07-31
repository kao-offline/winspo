import DatasetAppShell from "@/components/DatasetAppShell";

export const metadata = {
  title: "BYO dataset — WInspo",
};

export default async function ByoDatasetPage({
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

  return (
    <DatasetAppShell
      source={source}
      mode="gallery"
      embed={embed}
      initialCode={initialCode}
    />
  );
}
