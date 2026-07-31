"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import type { ResolvedDataset } from "@/lib/types";

export default function DatasetHeader({
  dataset,
  mode,
}: {
  dataset: ResolvedDataset;
  mode: "gallery" | "lookup";
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="WInspo home">
          <Logo className="h-6 w-6 text-primary" />
          <span className="text-sm font-bold tracking-tight">WInspo</span>
        </Link>
        <span className="h-4 w-px bg-border-soft" aria-hidden="true" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-tight">{dataset.name}</div>
          <div className="truncate text-[11px] leading-tight text-text/50">v{dataset.version}</div>
        </div>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link
            href={dataset.urlPath}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              mode === "gallery"
                ? "bg-primary-soft text-primary"
                : "text-text/70 hover:bg-primary-soft hover:text-primary"
            }`}
          >
            Browse
          </Link>
          <Link
            href={`${dataset.urlPath}/lookup`}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              mode === "lookup"
                ? "bg-primary-soft text-primary"
                : "text-text/70 hover:bg-primary-soft hover:text-primary"
            }`}
          >
            Lookup
          </Link>
        </nav>
      </div>
    </header>
  );
}
