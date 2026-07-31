import DatasetAppShell from "@/components/DatasetAppShell";

export const metadata = {
  title: "Browse — WInspo",
};

export default async function DatasetPage({
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

  return (
    <DatasetAppShell
      source={dataset}
      mode="gallery"
      embed={embed}
      initialCode={initialCode}
      builtin
    />
  );
}
