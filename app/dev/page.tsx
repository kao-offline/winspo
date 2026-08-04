import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import DevTools from "@/components/DevTools";

export const metadata: Metadata = {
  title: "Developer tools — WInspo",
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-primary-soft px-1.5 py-0.5 font-mono text-[11px]">
      {children}
    </code>
  );
}

function Endpoint({
  method,
  path,
  children,
}: {
  method: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-soft p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white">
          {method}
        </span>
        <code className="font-mono text-xs text-text/80">{path}</code>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-text/70">{children}</p>
    </div>
  );
}

export default function DevPage() {
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
              href="/home"
              className="rounded-md px-3 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/dev"
              className="rounded-md bg-primary-soft px-3 py-1.5 text-primary"
            >
              Dev tools
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-black tracking-tight">Developer tools</h1>
        <p className="mt-2 text-sm leading-relaxed text-text/70">
          WInspo exposes a small public API for building on top of datasets, a
          BYO dataset format, and an embed mode with a postMessage contract.
          Everything below is CORS-open and requires no key.
        </p>

        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            Playground
          </h2>
          <div className="mt-3">
            <DevTools />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            Public API
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-text/60">
            All endpoints answer <Code>GET</Code> and <Code>OPTIONS</Code> with{" "}
            <Code>Access-Control-Allow-Origin: *</Code>. Errors come back as{" "}
            <Code>{`{ "error": { "code": "...", "message": "..." } }`}</Code>.
          </p>
          <div className="mt-3 space-y-3">
            <Endpoint method="GET" path="/api/datasets/{source}">
              Returns the full resolved dataset: items with absolute media URLs,
              plus optional theme config. <Code>source</Code> is a built-in
              dataset (<Code>kao</Code>, <Code>root</Code>) or a BYO path
              (<Code>byo/&#123;user&#125;/&#123;repo&#125;@&#123;ref&#125;</Code>).
            </Endpoint>
            <Endpoint method="GET" path="/api/encode?dataset={source}&slots={0,1,2}">
              Encodes comma-separated slot numbers into a base62 code. Returns{" "}
              <Code>{`{ "code": "7", "slots": [0, 1, 2] }`}</Code>.
            </Endpoint>
            <Endpoint method="GET" path="/api/decode?dataset={source}&code={code}">
              Decodes a code against a dataset. Returns the matched items, the
              aggregated design profile, and an <Code>unknown</Code> flag when
              the code references slots missing from this dataset edition.
            </Endpoint>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            Dataset format
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-text/60">
            A dataset is a public GitHub repo with a{" "}
            <Code>winspo.json</Code> manifest at its root. Load it at{" "}
            <Code>/byo/&#123;username&#125;/&#123;repo&#125;@&#123;ref&#125;</Code> —
            optional <Code>winspo.config.json</Code> re-themes the app.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text/60">
            Each item has a stable <Code>slot</Code> (a permanent bit position)
            and required <Code>tags</Code>. <Code>media</Code> is optional and
            relative to the repo root. Never reuse a slot after deleting an
            item — old codes would silently decode to the wrong reference.
          </p>
          <pre className="mt-3 overflow-auto rounded-xl border border-border-soft bg-background/70 p-4 text-[11px] leading-relaxed">
{`{
  "name": "my-dataset",
  "version": "1.0.0",
  "description": "My favorite sites.",
  "items": [
    {
      "id": 1,
      "slot": 0,
      "title": "Example",
      "url": "https://example.com/",
      "media": {
        "thumbnail": "assets/example-thumb.webp",
        "fullpage": "assets/example-fullpage.webp",
        "video": "assets/example-clip.mp4"
      },
      "tags": {
        "palette": ["bright", "warm"],
        "layout": "asymmetric",
        "motion": "medium",
        "typography": "display-serif",
        "category": "portfolio"
      }
    }
  ]
}`}
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            Embed mode
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-text/60">
            Append <Code>?embed</Code> to any dataset or lookup URL to hide
            chrome and post messages to the parent window via{" "}
            <Code>window.parent.postMessage(msg, &quot;*&quot;)</Code>.
          </p>
          <div className="mt-3 overflow-auto rounded-xl border border-border-soft">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-border-soft text-text/50">
                  <th className="px-4 py-2 font-semibold">Type</th>
                  <th className="px-4 py-2 font-semibold">Payload</th>
                  <th className="px-4 py-2 font-semibold">When</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["winspo:ready", "{ datasetSource, itemCount }", "on load"],
                  ["winspo:selection", "{ datasetSource, selectedItemIds }", "on every selection change"],
                  ["winspo:code", "{ datasetSource, code, selectedItemIds }", "when the user finishes"],
                ].map(([type, payload, when]) => (
                  <tr key={type} className="border-b border-border-soft last:border-b-0">
                    <td className="px-4 py-2 font-mono text-[11px] text-primary">{type}</td>
                    <td className="px-4 py-2 font-mono text-[11px] text-text/80">{payload}</td>
                    <td className="px-4 py-2 text-text/60">{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-text/50">
          <span>Developer tools for WInspo — no login, no accounts, just a code.</span>
          <nav className="flex items-center gap-3">
            <Link href="/" className="transition-colors hover:text-primary">
              Root dataset
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
