import { en } from "./en";
import { ko } from "./ko";

import type { Messages } from "./en";

export type Locale = "en" | "ko";
export type { Messages };

export const LOCALES: Locale[] = ["en", "ko"];

const MESSAGES: Record<Locale, Messages> = { en, ko };

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}

/** The other language's locale, which the language link points to. */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ko" : "en";
}
