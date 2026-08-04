"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTranslations } from "@/lib/i18n";

type ExampleKind = "none" | "finish" | "code";

interface TourStepSpec {
  target: string | null;
  example: ExampleKind;
}

type PlacementSide = "right" | "left" | "top" | "bottom" | "center";

interface Placement {
  left: number;
  top: number;
  side: PlacementSide;
  targetX: number;
  targetY: number;
  tipWidth: number;
  tipHeight: number;
}

const STEPS: TourStepSpec[] = [
  { target: '[data-tour="card"]', example: "none" },
  { target: '[data-tour="search"]', example: "none" },
  { target: '[data-tour="fullpage"]', example: "none" },
  { target: '[data-tour="swipe"]', example: "none" },
  { target: '[data-tour="finish"]', example: "finish" },
  { target: null, example: "code" },
];

const MARGIN = 16;
const GAP = 16;
const TIP_WIDTH = 320;
const TIP_HEIGHT = 200;
const ARROW_SIZE = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function TourOverlay({
  locale,
  open,
  onClose,
}: {
  locale: string;
  open: boolean;
  onClose: () => void;
}) {
  const t = getTranslations(locale);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef<number>(-1);

  const stepCount = STEPS.length;
  const spec = STEPS[step] ?? STEPS[STEPS.length - 1];
  const stepText = t.tourSteps[step] ?? t.tourSteps[t.tourSteps.length - 1];
  const isLast = step === stepCount - 1;
  const showGhostFinish = spec.example === "finish" && !targetRect;

  const measure = useCallback(() => {
    if (!open) return;
    const el = spec.target ? document.querySelector(spec.target) : null;
    if (!el) {
      setTargetRect(null);
      setPlacement({
        left: 0,
        top: 0,
        side: "center",
        targetX: 0,
        targetY: 0,
        tipWidth: 0,
        tipHeight: 0,
      });
      return;
    }
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    const tip = tipRef.current;
    const tipWidth = tip?.offsetWidth ?? TIP_WIDTH;
    const tipHeight = tip?.offsetHeight ?? TIP_HEIGHT;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let side: PlacementSide;
    if (rect.right + GAP + tipWidth <= viewportWidth - MARGIN) side = "right";
    else if (rect.left - GAP - tipWidth >= MARGIN) side = "left";
    else if (rect.bottom + GAP + tipHeight <= viewportHeight - MARGIN) side = "bottom";
    else side = "top";

    let left: number;
    let top: number;
    if (side === "right") {
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - tipHeight / 2;
    } else if (side === "left") {
      left = rect.left - GAP - tipWidth;
      top = rect.top + rect.height / 2 - tipHeight / 2;
    } else if (side === "bottom") {
      left = rect.left + rect.width / 2 - tipWidth / 2;
      top = rect.bottom + GAP;
    } else {
      left = rect.left + rect.width / 2 - tipWidth / 2;
      top = rect.top - GAP - tipHeight;
    }

    left = clamp(left, MARGIN, Math.max(MARGIN, viewportWidth - tipWidth - MARGIN));
    top = clamp(top, MARGIN, Math.max(MARGIN, viewportHeight - tipHeight - MARGIN));

    setPlacement({
      left,
      top,
      side,
      targetX: rect.left + rect.width / 2,
      targetY: rect.top + rect.height / 2,
      tipWidth,
      tipHeight,
    });
  }, [open, spec]);

  useEffect(() => {
    if (!open) return;
    if (previousStep.current !== step) {
      previousStep.current = step;
      const el = spec.target ? document.querySelector(spec.target) : null;
      if (el) {
        el.scrollIntoView({ block: "center", inline: "center" });
        const timer = window.setTimeout(measure, 60);
        return () => window.clearTimeout(timer);
      }
      const frame = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(frame);
    }
  }, [open, step, spec, measure]);

  useEffect(() => {
    if (!open || !tipRef.current) return;
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [open, step, measure]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const next = () => {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  };

  const arrow =
    placement && placement.side !== "center"
      ? (() => {
          const vertical = clamp(
            placement.targetY - placement.top - ARROW_SIZE / 2,
            0,
            Math.max(0, placement.tipHeight - ARROW_SIZE)
          );
          const horizontal = clamp(
            placement.targetX - placement.left - ARROW_SIZE / 2,
            0,
            Math.max(0, placement.tipWidth - ARROW_SIZE)
          );
          if (placement.side === "right")
            return {
              style: { left: -ARROW_SIZE / 2, top: vertical },
              className: "border-b border-l",
            };
          if (placement.side === "left")
            return {
              style: { right: -ARROW_SIZE / 2, top: vertical },
              className: "border-r border-t",
            };
          if (placement.side === "bottom")
            return {
              style: { top: -ARROW_SIZE / 2, left: horizontal },
              className: "border-t border-l",
            };
          return {
            style: { bottom: -ARROW_SIZE / 2, left: horizontal },
            className: "border-b border-r",
          };
        })()
      : null;

  const tooltip = (
    <div
      ref={tipRef}
      className="winsip-fade-in pointer-events-auto relative w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-border-soft bg-background p-5 shadow-2xl"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {step + 1}
        </span>
        <h2 className="min-w-0 flex-1 text-lg font-bold leading-tight">
          {stepText.title}
        </h2>
        <span className="shrink-0 text-xs font-semibold text-text/40">
          {step + 1} / {stepCount}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text/80">{stepText.body}</p>

      {spec.example === "code" && (
        <div className="mt-4 rounded-xl border border-border-soft bg-primary-soft p-3 text-center">
          <div className="font-mono text-2xl font-bold tracking-widest">7K2</div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
              Copy
            </span>
            <span className="rounded-lg border border-border-soft px-3 py-1.5 text-xs font-medium">
              View this selection
            </span>
          </div>
          <p className="mt-2 break-all font-mono text-[10px] text-text/50">
            winspo.app/kao?code=7K2
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-xs font-medium text-text/50 transition-colors hover:text-primary"
        >
          {t.tourSkip}
        </button>
        <button
          type="button"
          onClick={next}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {isLast ? t.tourDone : t.tourNext}
        </button>
      </div>

      {arrow && (
        <span
          className={`pointer-events-none absolute z-10 h-3 w-3 rotate-45 border-border-soft bg-background ${arrow.className}`}
          style={arrow.style}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label={t.tutorialTitle}
    >
      {targetRect ? (
        <>
          <div
            className="pointer-events-auto fixed bg-black/60"
            style={{ top: 0, left: 0, right: 0, height: targetRect.top }}
          />
          <div
            className="pointer-events-auto fixed bg-black/60"
            style={{ top: targetRect.bottom, left: 0, right: 0, bottom: 0 }}
          />
          <div
            className="pointer-events-auto fixed bg-black/60"
            style={{ top: targetRect.top, left: 0, width: targetRect.left, height: targetRect.height }}
          />
          <div
            className="pointer-events-auto fixed bg-black/60"
            style={{ top: targetRect.top, left: targetRect.right, right: 0, height: targetRect.height }}
          />
          <div
            className="winsip-pulse pointer-events-none fixed rounded-xl border-2 border-primary"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
        </>
      ) : (
        <div className="pointer-events-auto fixed inset-0 bg-black/60" />
      )}

      {showGhostFinish && (
        <>
          <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[71] flex justify-center">
            <div className="winsip-fade-in flex items-center gap-4 rounded-full border border-border-soft bg-background px-5 py-3 shadow-xl">
              <span className="text-sm font-semibold">2 selected</span>
              <span className="text-xs text-text/50">Clear</span>
              <span className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
                Finish
              </span>
            </div>
          </div>
          <span
            className="pointer-events-none fixed bottom-[84px] left-1/2 z-[71] h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-border-soft bg-background"
            aria-hidden="true"
          />
        </>
      )}

      {placement && placement.side !== "center" ? (
        <div
          className="pointer-events-none absolute"
          style={{ left: placement.left, top: placement.top }}
        >
          {tooltip}
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center p-4 pb-28">
          {tooltip}
        </div>
      )}
    </div>
  );
}
