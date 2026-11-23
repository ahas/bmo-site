import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "playwright-core";

import { DIST, serveDist } from "./serve";

import type { Browser, Page } from "playwright-core";

// The built pages opened in a real browser at a desktop's width, a tablet's and a phone's: every key section stands
// on the page with its heading, every picture has its words and is a capture in the page's own capture language
// (Korean on /ko/, English on every other page, read from the picture's file name), the language menu reaches every
// version, and nothing is wider than the window. Run `bun run build` first; the test reads dist/ as a static host serves it, and is
// skipped where the browser build Playwright pins is not on the machine.

const ready = (() => {
  try {
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
})();

const WIDTHS = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, mobile: false },
  { name: "tablet", viewport: { width: 1024, height: 768 }, mobile: false },
  { name: "phone", viewport: { width: 390, height: 844 }, mobile: true },
];

const PAGES = [
  { path: "/", lang: "en", capture: "en" },
  { path: "/ko/", lang: "ko", capture: "ko" },
  { path: "/ja/", lang: "ja", capture: "en" },
  { path: "/zh/", lang: "zh-Hans", capture: "en" },
];

const SECTIONS = ["#hero-title", "#how-title", "#features-title", "#screens-title", "#download-title", "#repositories-title", "#closing-title"];

let browser: Browser;
let site: ReturnType<typeof serveDist>;

beforeAll(async () => {
  if (!ready) return;
  if (!existsSync(join(DIST, "index.html"))) throw new Error("dist/ holds no built site: run `bun run build` first");

  site = serveDist();
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  site?.stop();
});

async function opened(width: (typeof WIDTHS)[number], path: string): Promise<Page> {
  const context = await browser.newContext({ viewport: width.viewport, isMobile: width.mobile, hasTouch: width.mobile, reducedMotion: "reduce" });
  const page = await context.newPage();

  await page.goto(`${site.origin}${path}`, { waitUntil: "load" });

  return page;
}

describe.skipIf(!ready)("the built pages", () => {
  for (const width of WIDTHS) {
    for (const entry of PAGES) {
      test(`${entry.path} at the ${width.name}'s width`, async () => {
        const page = await opened(width, entry.path);

        expect(await page.locator("html").getAttribute("lang")).toBe(entry.lang);

        for (const selector of SECTIONS) {
          const heading = page.locator(selector);

          await heading.scrollIntoViewIfNeeded();
          expect(await heading.isVisible()).toBe(true);
          expect(((await heading.textContent()) ?? "").trim().length).toBeGreaterThan(0);
        }

        expect(await page.locator(".feature").count()).toBe(9);
        expect(await page.locator("a.repo").count()).toBeGreaterThan(30);

        // Every picture loads and carries words for a reader who cannot see it.
        await page.evaluate(async () => {
          for (const image of Array.from(document.images)) image.loading = "eager";
          await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => undefined)));
        });
        const pictures = await page.locator("img").evaluateAll((images) =>
          (images as HTMLImageElement[]).map((image) => ({
            alt: image.alt,
            loaded: image.complete && image.naturalWidth > 0,
            file: (image.currentSrc || image.src).split("/").pop() ?? "",
            sources: Array.from(image.closest("picture")?.querySelectorAll("source") ?? []).flatMap((source) => source.srcset.split(",").map((one) => one.trim().split(" ")[0]!.split("/").pop()!)),
          }))
        );

        expect(pictures.length).toBeGreaterThan(0);
        for (const picture of pictures) {
          expect(picture.alt.length).toBeGreaterThan(10);
          expect(picture.loaded).toBe(true);
          // Every file the picture may show is a capture in the page's capture language.
          for (const file of [picture.file, ...picture.sources]) expect(file).toMatch(new RegExp(`-${entry.capture}\\.`));
        }

        // Nothing reaches past the window's right edge, at the top or after scrolling to the end.
        for (const at of ["top", "end"]) {
          if (at === "end") await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, window: window.innerWidth }));

          expect(widths.page).toBeLessThanOrEqual(widths.window);
        }

        const wider = await page.evaluate(() =>
          Array.from(document.querySelectorAll("body *"))
            .filter((element) => {
              const box = element.getBoundingClientRect();
              return box.width > 0 && box.right > window.innerWidth + 1 && getComputedStyle(element).position !== "fixed";
            })
            .filter((element) => !element.closest(".hero-glow"))
            .map((element) => element.tagName + "." + (element as HTMLElement).className)
        );

        expect(wider).toEqual([]);

        // The language menu opens, stands inside the window and reaches every version.
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator(".lang-menu summary").click();
        const links = page.locator(".lang-list a");

        expect(await links.evaluateAll((all) => all.map((link) => link.getAttribute("href")))).toEqual(["/", "/ko/", "/ja/", "/zh/"]);
        for (const box of await links.evaluateAll((all) => all.map((link) => link.getBoundingClientRect().toJSON()))) {
          expect(box.left).toBeGreaterThanOrEqual(0);
          expect(box.right).toBeLessThanOrEqual(width.viewport.width);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
        expect(await page.locator(".lang-list a[aria-current=page]").getAttribute("href")).toBe(entry.path);

        await page.context().close();
      }, 60_000);
    }
  }

  test("an unknown address answers with the not-found page", async () => {
    const answer = await fetch(`${site.origin}/no-such-page`);

    expect(answer.status).toBe(404);
    expect(await answer.text()).toContain("404");
  });

  test("the hero's download button points at an installer or the download section", async () => {
    const page = await opened(WIDTHS[0]!, "/");
    const href = (await page.locator("#primary-download").getAttribute("href")) ?? "";

    expect(href === "#download" || href.startsWith("https://")).toBe(true);
    await page.context().close();
  });
});
