// The console room on the console bmo-web stands up for its browser tests (its tests/support/browser-console.ts),
// with the rooms, messages, TODO board and avatar answered from demo.ts and the server-rendered test names swapped for
// demo names in the page, in both colour schemes. Usage: `bun scripts/shots/console-shot.ts <name> <path> [width]
// [height]`, SKIP=<n> drops the first n messages.
import { chromium } from "playwright-core";

import { OUT, ORIGIN, demoContext, signedIn, swapTexts } from "./console";
import { THEMES } from "./locale";

const [shotName, path, w, h] = process.argv.slice(2);
const session = await signedIn();
const browser = await chromium.launch();

try {
  for (const theme of THEMES) {
    const context = await demoContext(browser, session, theme, Number(w ?? 1440), Number(h ?? 900));
    const page = await context.newPage();

    await page.goto(`${ORIGIN}${path}`);
    await page.waitForTimeout(12000);
    await swapTexts(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}${shotName}.ko.${theme}.png` });
    console.log("saved", `${shotName}.ko.${theme}`);
    await context.close();
  }
} finally {
  await browser.close();
}
