// Every place the home page shows a screenshot, each by the one screen it shows. A slot names its screen once, for
// every language: each page shows that same screen captured in its own language, `<screen>-<language>-<scheme>.webp`
// under src/assets/shots/, and a language never shows another screen in its place.

export const SLOTS = {
  hero: { wide: "console-room", phone: "console-room-phone" },
  screens: { calendar: "calendar-week", archive: "archive-document", phone: "calendar-phone" },
  whatsNew: { org: "org", catalogue: "catalogue", personalApps: "personal-apps", language: "language", note: "note" },
  tour: { brain: "brain", job: "job", agents: "agents", cards: "cards", drive: "drive", theater: "theater" },
} as const;

/** Every screen a slot shows, once each. */
export function slotScreens(): string[] {
  return [...new Set(Object.values(SLOTS).flatMap((group) => Object.values(group) as string[]))];
}
