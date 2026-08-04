import { describe, expect, it } from "vitest";
import {
  EU_LANGUAGES,
  euLanguageForCountry,
  getTranslations,
} from "../lib/i18n";
import type { Localized } from "../lib/i18n";

const STRING_KEYS: (keyof Localized)[] = [
  "tutorialTitle",
  "tutorialIntro",
  "tutorialSwipeNew",
  "tutorialManualPick",
  "tutorialStart",
  "tutorialOpenManual",
  "tutorialStartTour",
  "tourSkip",
  "tourNext",
  "tourDone",
  "manualTitle",
  "manualIntro",
  "manualHow",
  "manualSwipe",
  "manualSwipeBody",
  "manualLibrary",
  "manualLibraryBody",
  "manualByo",
  "manualByoBody",
  "manualLookup",
  "manualLookupBody",
];

describe("i18n", () => {
  it("has a complete, non-empty translation for every EU language", () => {
    expect(EU_LANGUAGES.length).toBe(24);
    for (const lang of EU_LANGUAGES) {
      const t = getTranslations(lang.code);
      for (const key of STRING_KEYS) {
        const value = t[key];
        expect(typeof value, `${lang.code}.${key}`).toBe("string");
        expect(value.length, `${lang.code}.${key}`).toBeGreaterThan(0);
      }
      expect(t.manualSteps, `${lang.code}.manualSteps`).toHaveLength(4);
      for (const step of t.manualSteps) {
        expect(step.length, `${lang.code}.manualStep`).toBeGreaterThan(0);
      }
      expect(t.tourSteps, `${lang.code}.tourSteps`).toHaveLength(6);
      for (const step of t.tourSteps) {
        expect(step.title.length, `${lang.code}.tourStep.title`).toBeGreaterThan(0);
        expect(step.body.length, `${lang.code}.tourStep.body`).toBeGreaterThan(0);
      }
    }
  });

  it("maps EU countries to their official language", () => {
    expect(euLanguageForCountry("PL")).toBe("pl");
    expect(euLanguageForCountry("de")).toBe("de");
    expect(euLanguageForCountry("GR")).toBe("el");
    expect(euLanguageForCountry("CY")).toBe("el");
    expect(euLanguageForCountry("MT")).toBe("mt");
    expect(euLanguageForCountry("FR")).toBe("fr");
    expect(euLanguageForCountry(null)).toBeNull();
  });

  it("returns null for non-EU countries", () => {
    expect(euLanguageForCountry("US")).toBeNull();
    expect(euLanguageForCountry("JP")).toBeNull();
    expect(euLanguageForCountry("BR")).toBeNull();
  });

  it("falls back to English for unknown locales", () => {
    expect(getTranslations("xx").manualTitle).toBe("The WInspo manual");
    expect(getTranslations(null).tutorialStart).toBe("Start browsing");
    expect(getTranslations(undefined).manualIntro).toContain("short");
  });
});
