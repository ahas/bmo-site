// What a capture shows in each language the site is read in: the locale given on the command line, and the
// console's own words for the keys a bundle's screens borrow from the console (`common.*`), read from the console's
// language pack in that language, which bmo-web holds.

/** The languages every screen is captured in, one capture each, as every page of the site shows its own. */
export const LOCALES = ["en", "ko", "ja", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

/** The colour schemes every screen is captured in, one capture each, as the site shows the one matching its own. */
export const THEMES = ["dark", "light"] as const;

export type Theme = (typeof THEMES)[number];

export function localeOf(argument: string | undefined): Locale {
  if ((LOCALES as readonly string[]).includes(argument ?? "")) return argument as Locale;

  throw new Error(`name the capture's locale: ${LOCALES.join(", ")}`);
}

/** The language a capture's browser speaks, which the console and the units' screens follow for a reader naming none. */
export function browserLocale(locale: Locale): string {
  return { en: "en-US", ko: "ko-KR", ja: "ja-JP", zh: "zh-CN" }[locale];
}

/** The name of the language pack the console and the units keep for the locale. */
export function packName(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : locale;
}

const PACKS: Record<Locale, () => Promise<{ default: { common: Record<string, unknown> } }>> = {
  en: () => import("../../../web/client/apps/web/i18n/locales/en.yaml"),
  ko: () => import("../../../web/client/apps/web/i18n/locales/ko.yaml"),
  ja: () => import("../../../web/client/apps/web/i18n/locales/ja.yaml"),
  zh: () => import("../../../web/client/apps/web/i18n/locales/zh-CN.yaml"),
};

/** The console's `common` words in the locale. */
export async function commonWords(locale: Locale): Promise<Record<string, unknown>> {
  return (await PACKS[locale]()).default.common;
}

/** Sets a mounted Vue app's vue-i18n locale and merges words into it, in the page. */
export const SWITCH_LOCALE = ({ selector, locale, words }: { selector: string; locale: string; words: Record<string, unknown> }): boolean => {
  const host = document.querySelector(selector) as (Element & { __vue_app__?: { _context: { provides: Record<PropertyKey, any> } } }) | null;
  const provides = host?.__vue_app__?._context.provides ?? {};
  // The i18n instance the app was given, found among what the app provides by its global composer.
  const i18n = Reflect.ownKeys(provides)
    .map((key) => provides[key])
    .find((value) => typeof value?.global?.mergeLocaleMessage === "function");
  const composer = i18n?.global;

  if (!composer) return false;

  composer.mergeLocaleMessage(locale, words);
  if (typeof composer.locale === "object" && composer.locale !== null && "value" in composer.locale) composer.locale.value = locale;
  else composer.locale = locale;

  return true;
};

/** Moves a mounted Vue app's router away and back, so screens that read the locale as they mount read it again. */
export const REMOUNT_ROUTE = async ({ selector, away }: { selector: string; away: string }): Promise<boolean> => {
  const host = document.querySelector(selector) as (Element & { __vue_app__?: { _context: { provides: Record<PropertyKey, any> } } }) | null;
  const provides = host?.__vue_app__?._context.provides ?? {};
  const router = Reflect.ownKeys(provides)
    .map((key) => provides[key])
    .find((value) => typeof value?.push === "function" && value?.currentRoute !== undefined);

  if (!router) return false;

  const back = router.currentRoute.value.fullPath;

  await router.push(away);
  await new Promise((done) => setTimeout(done, 300));
  await router.push(back);

  return true;
};
