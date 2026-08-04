"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedDataset, ResolvedItem } from "@/lib/types";
import { encodeSelection } from "@/lib/codec";
import { codeMessage, postToParent, readyMessage, selectionMessage } from "@/lib/embed";
import DatasetHeader from "./DatasetHeader";
import LanguageSwitcher from "./LanguageSwitcher";
import MediaImage from "./MediaImage";
import MediaVideo from "./MediaVideo";
import SwipeMode from "./SwipeMode";
import LookupPopup from "./LookupPopup";
import TutorialModal from "./TutorialModal";
import TourOverlay from "./TourOverlay";
import { Logo } from "./Logo";

const storageKeyFor = (source: string) => `winsip:selection:${source}`;
const TUTORIAL_SEEN_KEY = "winsip:tutorial-seen";

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
  locale,
}: {
  dataset: ResolvedDataset;
  embed: boolean;
  initialCode?: string;
  locale: string;
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
  const [detailTab, setDetailTab] = useState<"fullpage" | "video" | "info">("fullpage");
  const [query, setQuery] = useState("");
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid");
  const [lookupCode, setLookupCode] = useState<string | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(() => {
    if (embed) return false;
    try {
      return localStorage.getItem(TUTORIAL_SEEN_KEY) !== "1";
    } catch {
      return false;
    }
  });
  const [tourOpen, setTourOpen] = useState(false);
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

  const keep = (item: ResolvedItem) => {
    setSelected((prev) => {
      if (prev.has(item.id)) return prev;
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
  };

  const reject = (item: ResolvedItem) => {
    setSelected((prev) => {
      if (!prev.has(item.id)) return prev;
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });
  };

  const openDetail = (item: ResolvedItem) => {
    setDetail(item);
    if (item.media.fullpage) setDetailTab("fullpage");
    else if (item.media.scrollVideo || item.media.video) setDetailTab("video");
    else setDetailTab("info");
  };

  const finish = () => {
    const nextCode = encodeSelection(selectedItems.map((item) => item.slot));
    setCode(nextCode);
    setStep("code");
    setTourOpen(false);
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

  const closeTutorial = () => {
    setTutorialOpen(false);
    try {
      localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  const startTour = () => {
    closeTutorial();
    setStep("browse");
    setViewMode("grid");
    setTourOpen(true);
  };

  const searchBox = (
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search references…"
      aria-label="Search references"
      data-tour="search"
      className="w-full rounded-lg border border-border-soft bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
    />
  );

  const headerActions = (
    <>
      <LanguageSwitcher current={locale} />
      <button
        type="button"
        onClick={() => setViewMode((mode) => (mode === "swipe" ? "grid" : "swipe"))}
        data-tour="swipe"
        className={`rounded-md px-3 py-1.5 transition-colors ${
          viewMode === "swipe"
            ? "bg-primary-soft text-primary"
            : "text-text/70 hover:bg-primary-soft hover:text-primary"
        }`}
      >
        {viewMode === "swipe" ? "Library" : "Swipe"}
      </button>
      <button
        type="button"
        onClick={() => setTutorialOpen(true)}
        aria-label="Help"
        className="rounded-md px-2.5 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
      >
        ?
      </button>
    </>
  );

  if (step === "code") {
    return (
      <div className="flex min-h-screen flex-col">
        {!embed && (
          <DatasetHeader dataset={dataset} mode="gallery" search={searchBox} actions={headerActions} />
        )}
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
          <Logo className="mx-auto h-16 w-16 text-primary" />
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
              className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
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
            <button
              type="button"
              onClick={() => setLookupCode(code)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              View this selection
            </button>
            <button
              type="button"
              onClick={() => setStep("browse")}
              className="rounded-full border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
            >
              Adjust selection
            </button>
          </div>
        </main>

        {lookupCode && (
          <LookupPopup
            dataset={dataset}
            code={lookupCode}
            onClose={() => setLookupCode(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!embed && (
        <DatasetHeader dataset={dataset} mode="gallery" search={searchBox} actions={headerActions} />
      )}

      {initialCode && (
        <div className="border-b border-border-soft bg-accent-soft/40">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-sm">
            <span>This link includes a selection code.</span>
            <button
              type="button"
              onClick={() => setLookupCode(initialCode)}
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              View it
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-32 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">{dataset.name}</h1>
            <p className="text-xs text-text/50">
              {dataset.items.length} references · v{dataset.version}
            </p>
          </div>
        </div>

        {viewMode === "swipe" ? (
          <SwipeMode
            items={dataset.items}
            selected={selected}
            kind={dataset.kind}
            onKeep={keep}
            onReject={reject}
            onPreview={openDetail}
            onExit={() => setViewMode("grid")}
            previewOpen={detail !== null}
          />
        ) : (
          <>
            <p className="mt-4 text-sm text-text/60">
              Tap a reference to select it.{" "}
              <span className="font-semibold text-primary">{selected.size} selected</span>.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const isSelected = selected.has(item.id);
                return (
                  <article key={item.id} className="group flex min-w-0 flex-col">
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? "Deselect" : "Select"} ${item.title}`}
                      data-tour="card"
                      className={`relative aspect-video w-full overflow-hidden rounded-xl border bg-primary-soft text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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
                        className="h-full w-full object-cover object-top"
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
                        <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-base font-bold text-white shadow">
                          ✓
                        </span>
                      )}
                    </button>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <h3 className="truncate text-base font-semibold">{item.title}</h3>
                      <button
                        type="button"
                        onClick={() => openDetail(item)}
                        data-tour="fullpage"
                        className="shrink-0 text-sm text-text/50 transition-colors hover:text-primary"
                      >
                        Full page
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text/50">
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
          </>
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
              data-tour="finish"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 bg-black/70"
          onClick={() => setDetail(null)}
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-3 px-8 pt-4">
            <div className="flex overflow-hidden rounded-full bg-background shadow-lg ring-1 ring-border-soft">
              {(
                [
                  ["fullpage", "Image", !!detail.media.fullpage],
                  ["video", "Video", !!(detail.media.scrollVideo || detail.media.video)],
                ] as const
              )
                .filter(([, , show]) => show)
                .map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDetailTab(key);
                    }}
                    className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
                      detailTab === key
                        ? "bg-primary text-white"
                        : "text-text/60 hover:bg-primary-soft hover:text-primary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
            </div>
            <button
              type="button"
              onClick={() => setDetail(null)}
              aria-label="Close"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background text-2xl font-bold text-text shadow-lg ring-1 ring-border-soft transition-colors hover:bg-primary-soft"
            >
              ✕
            </button>
          </div>

          <div
            className="winsip-fade-in mx-auto flex h-[calc(100vh-6rem)] max-w-[90rem] gap-3 px-6 pb-5 pt-[4.5rem]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${detail.title} detail`}
          >
            <div className="flex w-[32%] min-w-[280px] shrink-0 flex-col overflow-y-auto rounded-3xl bg-background p-6 shadow-2xl ring-1 ring-border-soft">
              <h2 className="text-xl font-bold">{detail.title}</h2>

              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text/50">
                    Category
                  </div>
                  <p className="mt-1 text-base font-bold">
                    {detail.tags.category}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text/50">
                    Palette
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {detail.tags.palette.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-soft px-2.5 py-1 text-xs capitalize text-text/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {(
                  [
                    ["Layout", detail.tags.layout],
                    ["Motion", detail.tags.motion],
                    ["Typography", detail.tags.typography],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text/50">
                      {label}
                    </div>
                    <p className="mt-1 capitalize">{value}</p>
                  </div>
                ))}
                {detail.url && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text/50">
                      Live site
                    </div>
                    <a
                      href={detail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block break-all text-primary underline-offset-2 hover:underline"
                    >
                      {detail.url}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-3 pt-6">
                {detail.media.thumbnail && (
                  <MediaImage
                    src={detail.media.thumbnail}
                    alt={`${detail.title} thumbnail`}
                    kind={dataset.kind}
                    className="w-full rounded-xl border border-border-soft"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    toggle(detail);
                  }}
                  className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
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

            <div className="flex-1 overflow-y-auto rounded-3xl bg-background shadow-2xl ring-1 ring-border-soft">
              {detailTab === "fullpage" &&
                (detail.media.fullpage ? (
                  <a
                    href={detail.media.fullpage}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open full-page screenshot in a new tab"
                    className="block"
                  >
                    <MediaImage
                      src={detail.media.fullpage}
                      alt={`${detail.title} full-page screenshot`}
                      kind={dataset.kind}
                      className="h-auto w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="flex h-full items-center justify-center p-12 text-base text-text/50">
                    No full-page screenshot for this reference.
                  </div>
                ))}

              {detailTab === "video" &&
                (detail.media.scrollVideo || detail.media.video ? (
                  <MediaVideo
                    src={detail.media.scrollVideo ?? detail.media.video}
                    kind={dataset.kind}
                    controls
                    className="h-auto w-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-12 text-base text-text/50">
                    No video for this reference.
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {lookupCode && (
        <LookupPopup
          dataset={dataset}
          code={lookupCode}
          onClose={() => setLookupCode(null)}
        />
      )}

      {!embed && (
        <TutorialModal
          locale={locale}
          open={tutorialOpen}
          onClose={closeTutorial}
          onStartTour={startTour}
        />
      )}

      {!embed && step === "browse" && (
        <TourOverlay
          locale={locale}
          open={tourOpen && !detail && !lookupCode}
          onClose={() => setTourOpen(false)}
        />
      )}
    </div>
  );
}
