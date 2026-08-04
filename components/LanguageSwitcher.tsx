"use client";

import { useRouter } from "next/navigation";
import { EU_LANGUAGES } from "@/lib/i18n";

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();

  const changeLanguage = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("lang", value);
    const query = params.toString();
    router.push(`${window.location.pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <label className="flex items-center gap-2 text-xs text-text/60">
      <span className="text-[10px] font-semibold uppercase tracking-wider">
        Language
      </span>
      <select
        value={current}
        onChange={(event) => changeLanguage(event.target.value)}
        aria-label="Language"
        className="rounded-lg border border-border-soft bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      >
        {EU_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </label>
  );
}
