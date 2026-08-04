"use client";

import Link from "next/link";
import { DatasetError } from "@/lib/types";
import type { ResolvedDataset } from "@/lib/types";
import { decodeCodeAgainstDataset } from "@/lib/decode";
import { computeProfile } from "@/lib/profile";
import MediaImage from "./MediaImage";
import ProfileBlock from "./ProfileBlock";

export default function LookupPopup({
  dataset,
  code,
  onClose,
}: {
  dataset: ResolvedDataset;
  code: string;
  onClose: () => void;
}) {
  let result;
  let error: string | null = null;
  try {
    result = decodeCodeAgainstDataset(code, dataset);
  } catch (err) {
    error = err instanceof DatasetError ? err.message : "Couldn't decode that code.";
  }

  const profile = result ? computeProfile(result.selectedItems) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="winsip-fade-in flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Selection preview"
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-border-soft px-6 py-4">
          <h2 className="min-w-0 flex-1 text-lg font-bold">
            {result ? `${result.selectedItems.length} selected` : "Selection"}
          </h2>
          {result?.unknown && (
            <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-medium text-accent">
              Some items are no longer in this dataset edition
            </span>
          )}
          <Link
            href={`${dataset.urlPath}/lookup?code=${encodeURIComponent(code)}`}
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Open full lookup
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-text/60 transition-colors hover:bg-primary-soft"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {error ? (
            <div className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {profile && <ProfileBlock profile={profile} />}

              {result!.selectedItems.length === 0 ? (
                <div className="rounded-xl border border-border-soft p-10 text-center text-sm text-text/50">
                  This code selects nothing. It may be an empty selection or the
                  code may not belong to this dataset.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {result!.selectedItems.map((item) => (
                    <article key={item.id} className="flex min-w-0 flex-col">
                      <a
                        href={item.media.fullpage ?? item.media.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-video overflow-hidden rounded-xl border border-border-soft bg-primary-soft"
                      >
                        <MediaImage
                          src={item.media.thumbnail}
                          alt={`${item.title} preview`}
                          kind={dataset.kind}
                          className="h-full w-full object-cover object-top"
                        />
                      </a>
                      <h3 className="mt-2 truncate text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs uppercase tracking-wide text-text/50">
                        {item.tags.category}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
