"use client";

import { useMemo, useState } from "react";
import type { ResolvedDataset } from "@/lib/types";
import { DatasetError } from "@/lib/types";
import { decodeCodeAgainstDataset } from "@/lib/decode";
import type { DecodeResult } from "@/lib/decode";
import { computeProfile } from "@/lib/profile";
import type { DesignProfile } from "@/lib/profile";
import DatasetHeader from "./DatasetHeader";
import MediaImage from "./MediaImage";

function ProfileBlock({ profile }: { profile: DesignProfile }) {
  return (
    <section className="rounded-2xl border border-border-soft bg-primary-soft p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Design profile
      </h2>
      <p className="mt-2 text-base font-medium leading-relaxed">{profile.summary}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(
          [
            ["palette", profile.byCategory.palette],
            ["layout", profile.byCategory.layout],
            ["motion", profile.byCategory.motion],
            ["typography", profile.byCategory.typography],
            ["category", profile.byCategory.category],
          ] as const
        ).map(([label, agg]) => (
          <div key={label} className="rounded-lg bg-background/70 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text/40">
              {label}
            </div>
            <div className="mt-1 text-xs font-medium">
              {agg.top.length > 0 ? agg.top.join(", ") : "—"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LookupClient({
  dataset,
  embed,
  initialCode,
}: {
  dataset: ResolvedDataset;
  embed: boolean;
  initialCode?: string;
}) {
  const [input, setInput] = useState(initialCode ?? "");
  const [submitted, setSubmitted] = useState<string | null>(
    initialCode?.trim() || null
  );

  const { result, error } = useMemo(() => {
    if (submitted === null) return { result: null as DecodeResult | null, error: null };
    const code = submitted.trim();
    if (!code) {
      return { result: null, error: "Enter a selection code first." };
    }
    try {
      return { result: decodeCodeAgainstDataset(code, dataset), error: null };
    } catch (err) {
      return {
        result: null,
        error: err instanceof DatasetError ? err.message : "Couldn't decode that code.",
      };
    }
  }, [submitted, dataset]);

  const profile = useMemo(
    () => (result ? computeProfile(result.selectedItems) : null),
    [result]
  );

  return (
    <div className="flex min-h-screen flex-col">
      {!embed && <DatasetHeader dataset={dataset} mode="lookup" />}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold">Look up a selection</h1>
          <p className="mt-1 text-sm text-text/60">
            Paste the code your client generated. The code only works against
            this exact dataset ({dataset.name} v{dataset.version}) — share the
            dataset link together with the code.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(input.trim());
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Paste selection code…"
              aria-label="Selection code"
              spellCheck={false}
              autoCapitalize="off"
              className="min-w-0 flex-1 rounded-lg border border-border-soft bg-background px-4 py-2.5 font-mono text-sm focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Decode
            </button>
          </form>
          {error && (
            <p className="mt-3 rounded-lg bg-accent-soft px-4 py-2.5 text-sm text-accent">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="winsip-fade-in mx-auto mt-8 max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold">
                {result.selectedItems.length} selected
              </h2>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                Resolved against {dataset.name} v{dataset.version}
              </span>
            </div>

            {result.unknown && (
              <div className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
                Some items in this code are no longer in this edition of the
                dataset — it may have changed since this selection was made.
              </div>
            )}

            {result.selectedItems.length === 0 ? (
              <div className="rounded-xl border border-border-soft p-8 text-center text-sm text-text/50">
                This code selects nothing. It may be an empty selection or the
                code may not belong to this dataset.
              </div>
            ) : (
              <>
                {profile && <ProfileBlock profile={profile} />}

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {result.selectedItems.map((item) => (
                    <article key={item.id} className="flex min-w-0 flex-col">
                      <a
                        href={item.media.fullpage ?? item.media.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border-soft bg-primary-soft"
                      >
                        <MediaImage
                          src={item.media.thumbnail}
                          alt={`${item.title} preview`}
                          kind={dataset.kind}
                          className="h-full w-full object-cover object-top"
                        />
                      </a>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-medium">
                          {item.title}
                        </h3>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${item.title} live`}
                            className="shrink-0 text-xs text-text/50 transition-colors hover:text-primary"
                          >
                            Open site ↗
                          </a>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] uppercase tracking-wide text-text/50">
                        {item.tags.category}
                      </p>
                    </article>
                  ))}
                </div>
              </>
            )}

            <p className="text-center text-xs text-text/40">
              Code “{result.code}” · resolved in this dataset&apos;s item order
              ({result.itemCount} items)
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
