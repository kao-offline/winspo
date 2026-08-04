"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import type { ResolvedDataset } from "@/lib/types";

export default function DatasetHeader({
  dataset,
  mode,
  search,
  actions,
}: {
  dataset: ResolvedDataset;
  mode: "gallery" | "lookup";
  search?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link href="/home" className="shrink-0" aria-label="WInspo home">
          <Logo className="h-10 w-10 text-primary" />
        </Link>
        {search && <div className="w-full max-w-sm">{search}</div>}
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {actions}
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
