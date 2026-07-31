import Link from "next/link";
import { Logo } from "./Logo";

export default function ComingSoon({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="winsip-fade-in max-w-md rounded-2xl border border-border-soft bg-background p-8 text-center">
        <Logo className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-5 text-xl font-bold">{name}</h1>
        <p className="mt-2 text-sm text-text/60">
          {description ?? "This dataset is on the way."}
        </p>
        <p className="mt-2 text-sm font-medium text-primary">Coming soon</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg border border-border-soft px-5 py-2.5 text-sm font-medium hover:bg-primary-soft"
        >
          Back to all datasets
        </Link>
      </div>
    </main>
  );
}
