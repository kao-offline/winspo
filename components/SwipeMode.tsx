"use client";

import { useCallback, useEffect, useState } from "react";
import type { ResolvedItem } from "@/lib/types";
import MediaImage from "./MediaImage";

const MAX_ROUNDS = 3;

type RoundCount = 1 | 2 | 3;

export default function SwipeMode({
  items,
  selected,
  kind,
  onKeep,
  onReject,
  onPreview,
  onExit,
  previewOpen,
}: {
  items: ResolvedItem[];
  selected: Set<number>;
  kind: "builtin" | "byo";
  onKeep: (item: ResolvedItem) => void;
  onReject: (item: ResolvedItem) => void;
  onPreview: (item: ResolvedItem) => void;
  onExit: () => void;
  previewOpen: boolean;
}) {
  const [roundCount, setRoundCount] = useState<RoundCount | null>(null);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<ResolvedItem[]>(items);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);

  const current = deck[index];
  const done = index >= deck.length;
  const survivors = deck.filter((item) => selected.has(item.id));
  const canContinue = round < (roundCount ?? 1) && survivors.length > 1;

  const start = (count: RoundCount) => {
    setRoundCount(count);
    setRound(1);
    setDeck(items);
    setIndex(0);
    setLeaving(null);
  };

  const continueRound = () => {
    setRound((r) => r + 1);
    setDeck(survivors);
    setIndex(0);
    setLeaving(null);
  };

  const advance = useCallback(
    (direction: "left" | "right") => {
      if (leaving !== null || done || !current) return;
      if (direction === "right") onKeep(current);
      else onReject(current);
      setLeaving(direction);
      window.setTimeout(() => {
        setIndex((i) => i + 1);
        setLeaving(null);
      }, 220);
    },
    [leaving, done, current, onKeep, onReject]
  );

  useEffect(() => {
    if (previewOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") advance("left");
      if (event.key === "ArrowRight") advance("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, previewOpen]);

  if (roundCount === null) {
    return (
      <div className="winsip-fade-in mx-auto mt-16 max-w-md rounded-2xl border border-border-soft p-8 text-center">
        <h2 className="text-xl font-bold">How many rounds?</h2>
        <p className="mt-2 text-sm text-text/60">
          Each round you re-review what you kept and eliminate more. You can do 1, 2 or 3
          rounds — capped at {MAX_ROUNDS}.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {([1, 2, 3] as const).map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => start(count)}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-border-soft bg-background transition-colors hover:border-primary hover:bg-primary-soft"
            >
              <span className="text-2xl font-bold">{count}</span>
              <span className="text-xs text-text/50">{count > 1 ? "rounds" : "round"}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onExit}
          className="mt-6 text-sm text-text/50 transition-colors hover:text-primary"
        >
          Back to the library
        </button>
      </div>
    );
  }

  if (done) {
    const keptCount = survivors.length;
    return (
      <div className="winsip-fade-in mx-auto mt-16 max-w-md rounded-2xl border border-border-soft p-10 text-center">
        <h2 className="text-xl font-bold">
          {canContinue ? `Round ${round} done` : "All done"}
        </h2>
        <p className="mt-2 text-sm text-text/60">
          {canContinue
            ? `You kept ${keptCount} of ${deck.length} references from round ${round}.`
            : `Final selection: ${keptCount} reference${keptCount === 1 ? "" : "s"}.`}
        </p>
        {canContinue ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={continueRound}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Continue to round {round + 1}
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-full border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
            >
              Back to the library
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onExit}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to the library
          </button>
        )}
      </div>
    );
  }

  const isSelected = current ? selected.has(current.id) : false;
  const progress = deck.length > 0 ? Math.min(index, deck.length) : 0;

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-semibold text-text/50">
          Round {round} · {Math.min(progress + 1, deck.length)} / {deck.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-soft">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${deck.length ? (progress / deck.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-soft bg-primary-soft shadow-xl">
        {current && (
          <>
            <MediaImage
              src={current.media.thumbnail}
              alt={`${current.title} preview`}
              kind={kind}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-200 ${
                leaving === "left"
                  ? "-translate-x-24 -rotate-6 opacity-0"
                  : leaving === "right"
                    ? "translate-x-24 rotate-6 opacity-0"
                    : ""
              }`}
            />
            {!leaving && (
              <button
                type="button"
                onClick={() => onPreview(current)}
                className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-primary"
              >
                Full page ↗
              </button>
            )}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white ${
                leaving ? "opacity-0" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold leading-tight">{current.title}</h2>
                {isSelected && (
                  <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold">
                    Selected ✓
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-sm">
                {[current.tags.category, current.tags.layout, current.tags.typography].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => advance("left")}
          disabled={leaving !== null}
          aria-label="Reject"
          title="Eliminate"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border-soft text-3xl text-text/50 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          ✕
        </button>
        <div className="text-center text-sm text-text/50">
          {isSelected ? "Keep it — tap ✕ to eliminate" : "Swipe right to keep, left to eliminate"}
          <br />
          <span className="text-xs">or use ← → keys</span>
        </div>
        <button
          type="button"
          onClick={() => advance("right")}
          disabled={leaving !== null}
          aria-label="Keep"
          title="Keep"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
