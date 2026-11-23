// What a capture shows in each language the site is read in: the locale given on the command line, and the
// console's own words for the keys a bundle's screens borrow from the console (`common.*`). The Korean words are
// read from the console's language pack, which bmo-web holds; the console holds no English pack, so the English
// ones are written here.

export type Locale = "en" | "ko";

export function localeOf(argument: string | undefined): Locale {
  if (argument === "en" || argument === "ko") return argument;

  throw new Error("name the capture's locale: en or ko");
}

const ENGLISH_COMMON = {
  status: { loading: "Loading", no_match: "No match", no_choices: "No items" },
  title: { discard_changes: "Discard unsaved changes?" },
  action: {
    cancel: "Cancel",
    close: "Close",
    discard: "Discard",
    save: "Save",
    previous_month: "Previous month",
    next_month: "Next month",
    previous_year: "Previous year",
    next_year: "Next year",
    refresh: "Refresh",
    see_all: "See all",
    back: "Back",
    share: "Share",
    download: "Download",
    more: "More",
  },
  aria: { search_named: "Search {name}" },
  placeholder: { search: "Search" },
};

/** The console's `common` words in the locale. */
export async function commonWords(locale: Locale): Promise<Record<string, unknown>> {
  if (locale === "en") return ENGLISH_COMMON;

  const pack = (await import("../../../web/client/apps/web/i18n/locales/ko.yaml")) as { default: { common: Record<string, unknown> } };

  return pack.default.common;
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
