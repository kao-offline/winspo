"use client";

import { useEffect, useState } from "react";
import { checkAssetHealth } from "@/lib/assetHealth";

export default function MediaVideo({
  src,
  className,
  kind,
  fallback,
  controls = false,
}: {
  src?: string;
  className?: string;
  kind: "builtin" | "byo";
  fallback?: React.ReactNode;
  controls?: boolean;
}) {
  const [ready, setReady] = useState<"loading" | "ok" | "fail">(
    kind === "builtin" ? "ok" : "loading"
  );
  const [lastSrc, setLastSrc] = useState<string | undefined>(src);

  if (lastSrc !== src) {
    setLastSrc(src);
    setReady(kind === "builtin" ? "ok" : "loading");
  }

  useEffect(() => {
    if (!src || kind === "builtin") return;
    let cancelled = false;
    checkAssetHealth(src, kind).then((health) => {
      if (cancelled) return;
      if (health === "missing" || health === "too-large") {
        console.warn(`WInspo: skipping video asset ${src} (${health})`);
        setReady((prev) => (prev === "fail" ? prev : "fail"));
      } else {
        setReady((prev) => (prev === "ok" ? prev : "ok"));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [src, kind]);

  if (!src || ready === "loading") return null;
  if (ready === "fail") return <>{fallback ?? null}</>;

  return (
    <video
      src={src}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      controls={controls}
      preload="none"
      onError={() => setReady("fail")}
    />
  );
}
