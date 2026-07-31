import Link from "next/link";

export default function ErrorState({
  title,
  message,
  hint,
}: {
  title: string;
  message: string;
  hint?: string;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="winsip-fade-in max-w-md rounded-2xl border border-border-soft bg-background p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-2xl font-bold text-accent">
          !
        </div>
        <h1 className="mt-5 text-xl font-bold">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-text/60">{message}</p>
        {hint && <p className="mt-3 text-xs text-text/40">{hint}</p>}
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
