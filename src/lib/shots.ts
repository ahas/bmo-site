import { SLOTS } from "./slots";

import type { Locale } from "../i18n";

// The screenshots a page shows, each captured in the page's own language and in both colour schemes. A capture's file
// name ends in both, `<screen>-<language>-<scheme>.webp`, which the browser test reads: the page shows the dark capture
// where it stands dark and the light one where it stands light. Which screen each place shows is src/lib/slots.ts.

export interface Themed {
  dark: ImageMetadata;
  light: ImageMetadata;
}

const FILES = import.meta.glob<{ default: ImageMetadata }>("../assets/shots/*.webp", { eager: true });

/** One screen's captures in a language, in both colour schemes. */
export function shot(screen: string, locale: Locale): Themed {
  const one = (scheme: "dark" | "light") => {
    const file = FILES[`../assets/shots/${screen}-${locale}-${scheme}.webp`];

    if (!file) throw new Error(`no capture ${screen}-${locale}-${scheme}.webp under src/assets/shots/`);

    return file.default;
  };

  return { dark: one("dark"), light: one("light") };
}

/** A group of slots' screens in a language, in the order the group names them, each by its slot's key. */
export function slotShots<Group extends keyof typeof SLOTS>(group: Group, locale: Locale): { key: keyof (typeof SLOTS)[Group]; shot: Themed }[] {
  return (Object.entries(SLOTS[group]) as [keyof (typeof SLOTS)[Group], string][]).map(([key, screen]) => ({ key, shot: shot(screen, locale) }));
}
