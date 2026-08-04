import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import DatasetPickerForm from "@/components/DatasetPickerForm";
import { BUILTIN_REGISTRY, canonicalId } from "@/lib/datasets";
import kaoManifest from "../../datasets/kao/winspo.json";
import rootManifest from "../../datasets/root/winspo.json";

export const metadata: Metadata = {
  title: "WInspo — gather design direction from clients",
};

const counts: Record<string, number> = {
  kao: kaoManifest.items.length,
  root: rootManifest.items.length,
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border-soft">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-4">
          <Link href="/home" aria-label="WInspo home" className="flex items-center gap-2.5">
            <Logo className="h-10 w-10 text-primary" />
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Root dataset
            </Link>
            <Link
              href="/manual"
              className="rounded-md px-3 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Manual
            </Link>
            <Link
              href="/dev"
              className="rounded-md px-3 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Dev tools
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <section className="max-w-2xl">
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Gather design direction from clients,{" "}
            <span className="text-primary">painlessly.</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text/70">
            Clients browse a gallery of website &amp; app references, select
            what feels right, and get a short shareable code. Designers paste
            the code back in to see exactly what was picked — plus an
            auto-generated design profile.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse the root dataset
            </Link>
            <Link
              href="/dev"
              className="rounded-lg border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
            >
              Developer tools
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            Browse a dataset
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUILTIN_REGISTRY.map((entry) => {
              const count = counts[entry.id] ?? counts[canonicalId(entry.id)];
              if (entry.comingSoon) {
                return (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-dashed border-border-soft p-6"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{entry.name}</span>
                      <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Coming soon
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text/60">
                      {entry.description}
                    </p>
                  </div>
                );
              }
              return (
                <Link
                  key={entry.id}
                  href={`/${entry.id}`}
                  className="group rounded-2xl border border-border-soft p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{entry.name}</span>
                    <span className="text-lg text-primary transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-text/60">
                    {entry.description}
                  </p>
                  <p className="mt-3 text-xs font-medium text-text/40">
                    {count ?? 0} references
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12 max-w-2xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            Bring your own dataset
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text/60">
            Point WInspo at any public GitHub repo with a{" "}
            <code className="rounded bg-primary-soft px-1 py-0.5 font-mono text-[11px]">
              winspo.json
            </code>{" "}
            at its root. It loads at{" "}
            <code className="rounded bg-primary-soft px-1 py-0.5 font-mono text-[11px]">
              /byo/&#123;username&#125;/&#123;repo&#125;
            </code>
            , and an optional{" "}
            <code className="rounded bg-primary-soft px-1 py-0.5 font-mono text-[11px]">
              winspo.config.json
            </code>{" "}
            re-themes the app to match the repo.
          </p>
          <DatasetPickerForm />
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["1. Browse & select", "Clients tap the references that feel right for the project."],
            ["2. Share a code", "WInspo packs the selection into a short code — no sign-up needed."],
            ["3. Designer decodes", "Paste the code into the lookup page to see the selection plus an auto-generated design profile."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-primary-soft p-5">
              <h3 className="text-sm font-bold text-primary">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text/70">
                {body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-text/50">
          <span>
            Selection codes encode only item slots, never the dataset — always
            share the dataset link together with the code.
          </span>
          <nav className="flex items-center gap-3">
            <Link href="/" className="transition-colors hover:text-primary">
              Root dataset
            </Link>
            <Link href="/manual" className="transition-colors hover:text-primary">
              Manual
            </Link>
            <Link href="/dev" className="transition-colors hover:text-primary">
              Dev tools
            </Link>
            <Link href="/home" className="transition-colors hover:text-primary">
              Home
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
