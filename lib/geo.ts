import { euLanguageForCountry, FALLBACK_LOCALE } from "./i18n";

const CACHE_TTL = 24 * 60 * 60 * 1000;
const cache = new Map<string, { locale: string; expires: number }>();

export function localeFromCountryHeader(country?: string | null): string | null {
  return euLanguageForCountry(country);
}

export function detectLocale(clientIp: string): Promise<string> {
  const now = Date.now();
  const cached = cache.get(clientIp);
  if (cached && cached.expires > now) {
    return Promise.resolve(cached.locale);
  }

  if (!clientIp || clientIp === "local" || clientIp === "::1" || clientIp === "127.0.0.1") {
    cache.set(clientIp, { locale: FALLBACK_LOCALE, expires: now + CACHE_TTL });
    return Promise.resolve(FALLBACK_LOCALE);
  }

  const lookup = async (): Promise<string> => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(
        `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`,
        { signal: controller.signal, headers: { Accept: "application/json" } }
      );
      clearTimeout(timer);
      const data = (await res.json()) as { country_code?: string; error?: boolean };
      if (data && !data.error && data.country_code) {
        return euLanguageForCountry(data.country_code) ?? FALLBACK_LOCALE;
      }
    } catch {
      // fall through to secondary lookup
    }

    try {
      const res = await fetch(
        `http://ip-api.com/json/${encodeURIComponent(clientIp)}?fields=status,countryCode`,
        { signal: AbortSignal.timeout(2500) }
      );
      const data = (await res.json()) as { status?: string; countryCode?: string };
      if (data.status === "success" && data.countryCode) {
        return euLanguageForCountry(data.countryCode) ?? FALLBACK_LOCALE;
      }
    } catch {
      // offline or blocked — default to English
    }

    return FALLBACK_LOCALE;
  };

  return lookup().then((locale) => {
    cache.set(clientIp, { locale, expires: Date.now() + CACHE_TTL });
    return locale;
  });
}
