import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Logo } from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getTranslations } from "@/lib/i18n";
import { detectLocale, localeFromCountryHeader } from "@/lib/geo";

export const metadata: Metadata = {
  title: "Manual — WInspo",
};

export default async function ManualPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const lang = typeof query.lang === "string" ? query.lang : undefined;

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const country =
    headerList.get("x-vercel-ip-country") ?? headerList.get("cf-ipcountry");
  const locale =
    lang ??
    localeFromCountryHeader(country) ??
    (await detectLocale(ip).catch(() => "en"));
  const t = getTranslations(locale);
  const langSuffix = `?lang=${encodeURIComponent(locale)}`;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border-soft">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-4">
          <Link href="/home" aria-label="WInspo home" className="flex items-center gap-2.5">
            <Logo className="h-10 w-10 text-primary" />
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            <Link
              href={`/${langSuffix}`}
              className="rounded-md px-3 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Root dataset
            </Link>
            <Link
              href={`/home${langSuffix}`}
              className="rounded-md px-3 py-1.5 text-text/70 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight">{t.manualTitle}</h1>
          <LanguageSwitcher current={locale} />
        </div>
        <p className="mt-3 text-base leading-relaxed text-text/70">
          {t.manualIntro}
        </p>

        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text/50">
            {t.manualHow}
          </h2>
          <ol className="mt-4 space-y-3">
            {t.manualSteps.map((step, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border-soft p-4 text-sm leading-relaxed"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-soft bg-primary-soft p-5">
            <h3 className="text-sm font-bold text-primary">{t.manualSwipe}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text/70">
              {t.manualSwipeBody}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-primary-soft p-5">
            <h3 className="text-sm font-bold text-primary">{t.manualLibrary}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text/70">
              {t.manualLibraryBody}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft p-5">
            <h3 className="text-sm font-bold">{t.manualByo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text/70">
              {t.manualByoBody}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft p-5">
            <h3 className="text-sm font-bold">{t.manualLookup}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text/70">
              {t.manualLookupBody}
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={`/${langSuffix}`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.tutorialStart}
          </Link>
          <Link
            href="/dev"
            className="rounded-lg border border-border-soft px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft"
          >
            Developer tools
          </Link>
        </div>
      </main>

      <footer className="border-t border-border-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-text/50">
          <span>WInspo manual</span>
          <nav className="flex items-center gap-3">
            <Link href={`/${langSuffix}`} className="transition-colors hover:text-primary">
              Root dataset
            </Link>
            <Link href={`/dev${langSuffix}`} className="transition-colors hover:text-primary">
              Dev tools
            </Link>
            <Link href={`/home${langSuffix}`} className="transition-colors hover:text-primary">
              Home
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
