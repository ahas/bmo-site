// The console room on the console bmo-web stands up for its browser tests (its tests/support/browser-console.ts),
// with the rooms, messages, TODO board and avatar answered from demo.ts and the server-rendered test names swapped for
// demo names in the page, in the language given and in both colour schemes. Usage:
// `bun scripts/shots/console-shot.ts <en|ko|ja|zh> <name> <path> [width] [height]`, SKIP=<n> drops the first n
// messages: the room is `room /rooms/42`, and the phone's `room-phone /rooms/42 390 844` with SKIP=3, so that every
// language's conversation fits the phone from the same message on.
import { chromium } from "playwright-core";

import { OUT, ORIGIN, demoContext, shown, signedIn, swapTexts } from "./console";
import { MESSAGES } from "./demo";
import { THEMES, localeOf } from "./locale";

const [language, shotName, path, w, h] = process.argv.slice(2);
const locale = localeOf(language);

if (!shotName || !path) throw new Error("name the capture and the console path it opens");

const session = await signedIn();
const browser = await chromium.launch();

try {
  for (const theme of THEMES) {
    const context = await demoContext(browser, session, theme, locale, Number(w ?? 1440), Number(h ?? 900));
    const page = await context.newPage();

    await page.goto(`${ORIGIN}${path}`);
    // The room stands once BMO's last answer does, its first words being enough to find it.
    await shown(page, MESSAGES[locale].at(-1)!.text.slice(0, 6), 6000);
    await swapTexts(page, locale);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}${shotName}.${locale}.${theme}.png` });
    console.log("saved", `${shotName}.${locale}.${theme}`);
    await context.close();
  }
} finally {
  await browser.close();
}
