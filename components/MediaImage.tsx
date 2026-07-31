"use client";

import { useEffect, useState } from "react";
import { checkAssetHealth } from "@/lib/assetHealth";

interface State {
  src?: string;
  failed: boolean;
}

export default function MediaImage({
  src,
  alt,
  className,
  fallbackSrc,
  kind,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  kind: "builtin" | "byo";
}) {
  const [state, setState] = useState<State>({ src, failed: false });

  if (state.src !== src) {
    setState({ src, failed: false });
  }

  useEffect(() => {
    if (!src || kind === "builtin") return;
    let cancelled = false;
    checkAssetHealth(src, kind).then((health) => {
      if (cancelled) return;
      if (health === "missing" || health === "too-large") {
        console.warn(`WInspo: skipping asset ${src} (${health})`);
        setState((prev) => (prev.src === src ? { src, failed: true } : prev));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [src, kind]);

  const { src: currentSrc, failed } = state;

  if (!currentSrc || failed) {
    if (fallbackSrc && fallbackSrc !== currentSrc) {
      return (
        <MediaImage src={fallbackSrc} alt={alt} className={className} kind={kind} />
      );
    }
    return (
      <div
        className={`flex items-center justify-center bg-primary-soft text-text/40 ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs">no preview</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      draggable={false}
      onError={() => setState((prev) => ({ ...prev, failed: true }))}
    />
  );
}
