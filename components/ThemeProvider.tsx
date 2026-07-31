"use client";

import { useEffect } from "react";
import type { DatasetConfig } from "@/lib/types";
import { buildThemeVariables, googleFontsHref, resolveFontStack } from "@/lib/theme";

export default function ThemeProvider({
  config,
  children,
}: {
  config: DatasetConfig | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const vars = buildThemeVariables(config);

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }

    const fontStack = resolveFontStack(config?.font);
    root.style.fontFamily = fontStack ?? "";

    const href = googleFontsHref(config?.font);
    if (href) {
      let link = document.getElementById("winsip-font") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = "winsip-font";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = href;
    }

    return () => {
      for (const key of Object.keys(vars)) {
        root.style.removeProperty(key);
      }
      root.style.fontFamily = "";
    };
  }, [config]);

  return <>{children}</>;
}
