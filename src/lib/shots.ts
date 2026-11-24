// The screenshots each capture language shows. Every picture on a page is captured in that page's capture language
// (`captureLocale`) and in both colour schemes, and its file name ends in both, `<name>-<language>-<scheme>.webp`,
// which the browser test reads: the page shows the dark capture where it stands dark and the light one where it
// stands light. Several of the console's screens are captured in Korean alone, so the English pages lead with the
// notes screen and show only the screens captured in English.

type Capture = "en" | "ko";

export interface Themed {
  dark: ImageMetadata;
  light: ImageMetadata;
}

const FILES = import.meta.glob<{ default: ImageMetadata }>("../assets/shots/*.webp", { eager: true });

/** One screen's captures in a language, in both colour schemes. */
function themed(name: string, capture: Capture): Themed {
  const one = (scheme: "dark" | "light") => {
    const file = FILES[`../assets/shots/${name}-${capture}-${scheme}.webp`];

    if (!file) throw new Error(`no capture ${name}-${capture}-${scheme}.webp under src/assets/shots/`);

    return file.default;
  };

  return { dark: one("dark"), light: one("light") };
}

export const HERO_SHOTS: Record<Capture, { wide: Themed; phone: Themed }> = {
  en: { wide: themed("note", "en"), phone: themed("note-phone", "en") },
  ko: { wide: themed("console-room", "ko"), phone: themed("console-room-phone", "ko") },
};

/** The first gallery's pictures by the key of the caption each language writes for them. */
export const SCREEN_SHOTS: Record<Capture, { calendar: Themed; archive: Themed; phone: Themed }> = {
  en: { calendar: themed("calendar-week", "en"), archive: themed("archive-document", "en"), phone: themed("calendar-phone", "en") },
  ko: { calendar: themed("calendar-week", "ko"), archive: themed("archive-document", "ko"), phone: themed("note-phone", "ko") },
};

export type TourKey = "brain" | "agents" | "job" | "cards" | "drive" | "theater";

/** The tour's screens in the order each capture language shows them, by the key of their words. */
export const TOUR_SHOTS: Record<Capture, { key: TourKey; shot: Themed }[]> = {
  en: [
    { key: "drive", shot: themed("drive", "en") },
    { key: "theater", shot: themed("theater", "en") },
  ],
  ko: [
    { key: "brain", shot: themed("brain", "ko") },
    { key: "job", shot: themed("job", "ko") },
    { key: "agents", shot: themed("agents", "ko") },
    { key: "cards", shot: themed("cards", "ko") },
    { key: "drive", shot: themed("drive", "ko") },
    { key: "theater", shot: themed("theater", "ko") },
  ],
};

export type NewKey = "org" | "catalogue" | "personalApps" | "language" | "note";

/**
 * The new screens the what's-new section shows, by the key of their words. The English pages already lead with the
 * notes screen, so only the Korean page shows it here.
 */
export const NEW_SHOTS: Record<Capture, { key: NewKey; shot: Themed }[]> = {
  en: [
    { key: "org", shot: themed("org", "en") },
    { key: "catalogue", shot: themed("catalogue", "en") },
    { key: "personalApps", shot: themed("personal-apps", "en") },
    { key: "language", shot: themed("language", "en") },
  ],
  ko: [
    { key: "org", shot: themed("org", "ko") },
    { key: "catalogue", shot: themed("catalogue", "ko") },
    { key: "personalApps", shot: themed("personal-apps", "ko") },
    { key: "language", shot: themed("language", "ko") },
    { key: "note", shot: themed("note", "ko") },
  ],
};

/** A screen's captures in a language by the name of its files, or null where that language has no capture of it. */
export function shotByName(name: string, capture: Capture): Themed | null {
  return FILES[`../assets/shots/${name}-${capture}-dark.webp`] && FILES[`../assets/shots/${name}-${capture}-light.webp`] ? themed(name, capture) : null;
}
