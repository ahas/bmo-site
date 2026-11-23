import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";
import { zh } from "./zh";

import type { Messages } from "./en";

export type Locale = "en" | "ko" | "ja" | "zh";
export type { Messages };

/** The languages the site is read in, in the order the language menu lists them, each by its own name. */
export const LOCALES: { code: Locale; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "简体中文" },
];

const MESSAGES: Record<Locale, Messages> = { en, ko, ja, zh };

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}

/**
 * The language the page's screenshots are captured in. The platform's screens speak English and Korean; a page in
 * any other language shows the English captures.
 */
export function captureLocale(locale: Locale): "en" | "ko" {
  return locale === "ko" ? "ko" : "en";
}
