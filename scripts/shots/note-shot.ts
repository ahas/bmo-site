// A note open in the notes screen on bmo-note's own browser stack (its tests/browser/stack.ts: a throwaway note
// service and the bundle's dev host), with demo notes in each language: the English ones written as one reader
// and read in English, the Korean ones (bmo-note's own Korean fixture) written as another and read in Korean.
// Usage: `bun scripts/shots/note-shot.ts`.
import { chromium } from "playwright-core";

import { FIXTURE, seeded } from "../../../note/client/tests/browser/fixture.ts";
import { stoodUp } from "../../../note/client/tests/browser/stack.ts";

import type { FixtureNote } from "../../../note/client/tests/browser/fixture.ts";
import type { Browser, Page } from "playwright-core";

const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const WAIT_MS = 300_000;

const ENGLISH: FixtureNote[] = [
  { id: "en-launch", icon: "🚀", title: "Mobile app launch checklist", text: "Submit the store review and check the push notification copy\nPrepare the help center article and the release notes\nName who watches the dashboards on launch day\nPlan a rollback if the crash rate climbs" },
  { id: "en-weekly", icon: "📝", title: "Weekly sync · third week of November", text: "Present: planning, engineering, design\nDecided: the app ships in the first week of December\nBefore the next sync, share the first draft of the marketing budget" },
  { id: "en-reading", icon: "📚", title: "Reading list: onboarding for new teammates", text: "What a new teammate reads in the first week\nThe development setup guide and the code review principles" },
  { id: "en-trip", icon: "✈️", title: "Conference trip: schedule and hotel", text: "Morning train at 7, two nights near the venue\nPartner meeting on the second day at 2 pm" },
  { id: "en-idea", icon: "", title: "Ideas", text: "Show the most recently opened notes first in search" },
];
// The calendar emoji draws an English month on its face, so the Korean shot gives that note another icon.
const KOREAN = FIXTURE.notes.filter((note) => note.title !== "").map((note) => (note.icon === "\u{1f4c5}" ? { ...note, icon: "\u{1f4dd}" } : note));
// The fixture's writer places every line after the first above the ones before it, so the lines are handed over
// in that order to read top to bottom as written.
const inOrder = (note: FixtureNote): FixtureNote => {
  const [first, ...rest] = note.text.split("\n");

  return { ...note, text: [first, ...rest.reverse()].join("\n") };
};
const READERS = { en: "1", ko: "3" } as const;

async function opened(browser: Browser, host: string, locale: "en" | "ko", path: string, phone: boolean): Promise<Page> {
  const context = await browser.newContext({
    viewport: phone ? { width: 390, height: 844 } : { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    isMobile: phone,
    hasTouch: phone,
    colorScheme: "dark",
    locale: locale === "ko" ? "ko-KR" : "en-US",
    reducedMotion: "reduce",
  });

  context.setDefaultTimeout(WAIT_MS);
  await context.addCookies([
    { name: "nuxt-color-mode", value: "dark", url: host },
    { name: "bmo-dev-locale", value: locale, url: host },
    { name: "bmo-dev-reader", value: READERS[locale], url: host },
  ]);

  const page = await context.newPage();

  await page.goto(`${host}${path}`);
  await page.locator("[data-note-bar]").first().waitFor();

  return page;
}

const stack = await stoodUp();
const browser = await chromium.launch();

try {
  // The dev host builds the editor's sources on the first asks, reloading the page as it does.
  for (let pass = 0; pass < 2; pass += 1) {
    const page = await opened(browser, stack.host, "en", "/note", false);

    await page.locator("[data-navigator-list]").waitFor();
    await page.waitForTimeout(3_000);
    await page.context().close();
  }

  for (const [locale, notes] of [["en", ENGLISH], ["ko", KOREAN]] as const) {
    const page = await opened(browser, stack.host, locale, "/note", false);

    await page.locator("[data-navigator-list]").waitFor();
    await seeded(page, [...notes].reverse().map(inOrder));
    await page.evaluate(async (id) => {
      await fetch(`/proxy/note/notes/${id}/pin`, { method: "PUT" });
    }, notes[1]!.id);
    await page.context().close();

    for (const phone of [false, true]) {
      const shot = await opened(browser, stack.host, locale, `/note/${notes[0]!.id}`, phone);

      await shot.evaluate(() => document.fonts.ready);
      await shot.waitForTimeout(4_000);
      // The dev host's own banner names the host in English and is no part of the screen; it is taken away.
      await shot.evaluate(() => {
        const banner = Array.from(document.querySelectorAll("body *")).find((element) => {
          const box = element.getBoundingClientRect();

          return box.top < 2 && box.height < 60 && box.width > 300 && (element.textContent ?? "").includes("dev host");
        }) as HTMLElement | undefined;

        if (banner) banner.style.display = "none";
      });
      await shot.waitForTimeout(500);
      await shot.screenshot({ path: `${OUT}${phone ? "note-phone" : "note"}.${locale}.png` });
      console.log("saved", `${phone ? "note-phone" : "note"}.${locale}`);
      await shot.context().close();
    }
  }
} finally {
  await browser.close();
  await stack.down();
}
