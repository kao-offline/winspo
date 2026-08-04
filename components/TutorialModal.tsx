"use client";

import Link from "next/link";
import { getTranslations } from "@/lib/i18n";
import { Logo } from "./Logo";

export default function TutorialModal({
  locale,
  open,
  onClose,
  onStartTour,
}: {
  locale: string;
  open: boolean;
  onClose: () => void;
  onStartTour: () => void;
}) {
  const t = getTranslations(locale);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="winsip-fade-in max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-background p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t.tutorialTitle}
      >
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 text-primary" />
          <h2 className="flex-1 text-2xl font-black tracking-tight">{t.tutorialTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-text/60 transition-colors hover:bg-primary-soft"
          >
            ✕
          </button>
        </div>

        <ul className="mt-6 space-y-4">
          {[t.tutorialIntro, t.tutorialSwipeNew, t.tutorialManualPick].map(
            (line, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-text/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{line}</span>
              </li>
            )
          )}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartTour}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.tutorialStartTour}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
          >
            {t.tutorialStart}
          </button>
          <Link
            href={`/manual?lang=${encodeURIComponent(locale)}`}
            className="rounded-lg border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
          >
            {t.tutorialOpenManual}
          </Link>
        </div>
      </div>
    </div>
  );
}
