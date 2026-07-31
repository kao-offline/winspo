"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ResolvedDataset, ResolvedItem } from "@/lib/types";
import { encodeSelection } from "@/lib/codec";
import { codeMessage, postToParent, readyMessage, selectionMessage } from "@/lib/embed";
import DatasetHeader from "./DatasetHeader";
import MediaImage from "./MediaImage";
import MediaVideo from "./MediaVideo";
import { Logo } from "./Logo";

const storageKeyFor = (source: string) => `winsip:selection:${source}`;

function loadSavedSelection(source: string): Set<number> {
  try {
    const raw = localStorage.getItem(storageKeyFor(source));
    if (raw) return new Set(JSON.parse(raw) as number[]);
  } catch {
    // ignore corrupted local state
  }
  return new Set();
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export default function GalleryClient({
  dataset,
  embed,
  initialCode,
}: {
  dataset: ResolvedDataset;
  embed: boolean;
  initialCode?: string;
}) {
  const [selected, setSelected] = useState<Set<number>>(() =>
    loadSavedSelection(dataset.source)
  );
  const [source, setSource] = useState(dataset.source);
  if (source !== dataset.source) {
    setSource(dataset.source);
    setSelected(loadSavedSelection(dataset.source));
  }
  const [step, setStep] = useState<"browse" | "code">("browse");
  const [code, setCode] = useState("");
  const [detail, setDetail] = useState<ResolvedItem | null>(null);
  const [query, setQuery] = useState("");
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (embed) postToParent(readyMessage(dataset.source, dataset.items.length));
  }, [embed, dataset.source, dataset.items.length]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyFor(dataset.source), JSON.stringify([...selected]));
    } catch {
      // ignore storage quota errors
    }
    if (embed) postToParent(selectionMessage(dataset.source, [...selected]));
  }, [selected, embed, dataset.source]);

  const selectedItems = useMemo(
    () => dataset.items.filter((item) => selected.has(item.id)),
    [selected, dataset.items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dataset.items;
    return dataset.items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.category.toLowerCase().includes(q)
    );
  }, [query, dataset.items]);

  const toggle = (item: ResolvedItem) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const finish = () => {
    const nextCode = encodeSelection(selectedItems.map((item) => item.slot));
    setCode(nextCode);
    setStep("code");
    if (embed) {
      postToParent(codeMessage(dataset.source, nextCode, [...selected]));
    }
  };

  const copyCode = async () => {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
    if (codeRef.current) codeRef.current.select();
  };

  if (step === "code") {
    return (
      <div className="flex min-h-screen flex-col">
        {!embed && <DatasetHeader dataset={dataset} mode="gallery" />}
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
          <Logo className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 text-2xl font-bold">Your selection code</h1>
          <p className="mt-2 text-sm text-text/60">
            Share the dataset link together with the code — the code only works
            against the exact dataset it was generated from.
          </p>

          <div className="mt-8 flex items-center gap-2 rounded-2xl border border-border-soft bg-primary-soft p-3">
            <input
              readOnly
              value={code}
              ref={codeRef}
              aria-label="Generated selection code"
              className="w-full min-w-0 bg-transparent text-center font-mono text-3xl font-bold tracking-widest focus:outline-none"
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              type="button"
              onClick={copyCode}
              className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-border-soft p-4 text-left text-sm">
            <p className="font-semibold">Share this link with your designer:</p>
            <p className="mt-1 break-all font-mono text-xs text-text/70">
              {typeof window !== "undefined" ? window.location.origin : ""}
              {dataset.urlPath}?code={code}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`${dataset.urlPath}/lookup?code=${code}`}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              View this selection
            </Link>
            <button
              type="button"
              onClick={() => setStep("browse")}
              className="rounded-lg border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
            >
              Adjust selection
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!embed && <DatasetHeader dataset={dataset} mode="gallery" />}

      {initialCode && (
        <div className="border-b border-border-soft bg-accent-soft/40">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-sm">
            <span>This link includes a selection code.</span>
            <Link
              href={`${dataset.urlPath}/lookup?code=${encodeURIComponent(initialCode)}`}
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              View it
            </Link>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-xl font-bold">
              {dataset.name}
              {embed ? "" : ""}
            </h1>
            <p className="text-xs text-text/50">
              {dataset.items.length} references · v{dataset.version}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              aria-label="Search references"
              className="w-40 rounded-lg border border-border-soft bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs font-medium text-text/50 transition-colors hover:text-primary"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <p className="mt-3 text-sm text-text/60">
            Tap a reference to select it.{" "}
            <span className="font-semibold text-primary">
              {selected.size} selected
            </span>
            .
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <article key={item.id} className="group flex min-w-0 flex-col">
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Deselect" : "Select"} ${item.title}`}
                  className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border bg-primary-soft text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary ring-2 ring-primary"
                      : "border-border-soft hover:border-primary/50"
                  }`}
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(item.id)}
                  onBlur={() => setHoverId(null)}
                >
                  <MediaImage
                    src={item.media.thumbnail}
                    alt={`${item.title} preview`}
                    kind={dataset.kind}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {item.media.video && hoverId === item.id && (
                    <div className="absolute inset-0 bg-black/10">
                      <MediaVideo
                        src={item.media.video}
                        kind={dataset.kind}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  {isSelected && (
                    <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow">
                      ✓
                    </span>
                  )}
                </button>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">{item.title}</h3>
                  <button
                    type="button"
                    onClick={() => setDetail(item)}
                    className="shrink-0 text-xs text-text/50 transition-colors hover:text-primary"
                  >
                    Full page
                  </button>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text/50">
                  <span className="truncate uppercase tracking-wide">
                    {item.tags.category}
                  </span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.title} live`}
                      className="shrink-0 transition-colors hover:text-primary"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-text/50">
            No references match “{query}”.
          </p>
        )}
      </main>

      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
          <div className="winsip-fade-in mx-auto flex w-fit items-center gap-4 rounded-full border border-border-soft bg-background px-5 py-3 shadow-xl">
            <span className="text-sm font-semibold">
              {selected.size} selected
            </span>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs text-text/50 transition-colors hover:text-primary"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={finish}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="winsip-fade-in flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${detail.title} detail`}
          >
            <div className="flex items-center gap-3 border-b border-border-soft px-5 py-3">
              <h2 className="min-w-0 flex-1 truncate text-base font-semibold">
                {detail.title}
              </h2>
              {detail.url && (
                <a
                  href={detail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Open live site
                </a>
              )}
              <button
                type="button"
                onClick={() => setDetail(null)}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-lg text-text/60 transition-colors hover:bg-primary-soft"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-5 overflow-y-auto p-5 md:grid-cols-[1fr_220px]">
              <div className="min-w-0 space-y-4">
                {detail.media.scrollVideo || detail.media.video ? (
                  <MediaVideo
                    src={detail.media.scrollVideo ?? detail.media.video}
                    kind={dataset.kind}
                    className="w-full rounded-lg border border-border-soft"
                  />
                ) : null}
                {detail.media.fullpage && (
                  <a
                    href={detail.media.fullpage}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open full-page screenshot in a new tab"
                    className="block overflow-hidden rounded-lg border border-border-soft"
                  >
                    <MediaImage
                      src={detail.media.fullpage}
                      alt={`${detail.title} full-page screenshot`}
                      kind={dataset.kind}
                      className="w-full"
                    />
                  </a>
                )}
                {!detail.media.scrollVideo &&
                  !detail.media.video &&
                  !detail.media.fullpage && (
                    <div className="rounded-lg border border-border-soft p-8 text-center text-sm text-text/50">
                      No full-page media for this reference.
                    </div>
                  )}
              </div>
              <div className="space-y-3">
                {detail.media.thumbnail && (
                  <MediaImage
                    src={detail.media.thumbnail}
                    alt={`${detail.title} thumbnail`}
                    kind={dataset.kind}
                    className="w-full rounded-lg border border-border-soft"
                  />
                )}
                <div className="rounded-lg bg-primary-soft p-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {detail.tags.palette.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-background px-1.5 py-0.5 capitalize text-text/70"
                      >
                        {tag}
                      </span>
                    ))}
                    {[
                      detail.tags.layout,
                      detail.tags.motion,
                      detail.tags.typography,
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-background px-1.5 py-0.5 capitalize text-text/70"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="rounded bg-background px-1.5 py-0.5 capitalize text-text/70">
                      {detail.tags.category}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggle(detail);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                    selected.has(detail.id)
                      ? "border border-border-soft hover:bg-primary-soft"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  {selected.has(detail.id)
                    ? "Remove from selection"
                    : "Add to selection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
