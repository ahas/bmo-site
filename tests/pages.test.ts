import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "playwright-core";

import { DIST, serveDist } from "./serve";

import type { Browser, Page } from "playwright-core";

// The built pages opened in a real browser at a desktop's width, a tablet's and a phone's, in the dark colour scheme
// and the light one: every key section stands on the page with its heading, what's new holds its ten items and the
// download section its two desktop apps, every picture has its words and is a
// capture in the page's own capture language (Korean on /ko/, English on every other page) and in the scheme the
// page stands in, both read from the picture's file name, the comparison stands whole, the language menu reaches
// every version, and nothing is wider than the window. Run `bun run build` first; the test reads dist/ as a static host serves it, and is
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

const SCHEMES = ["dark", "light"] as const;

const SECTIONS = ["#hero-title", "#new-title", "#how-title", "#features-title", "#screens-title", "#compare-title", "#start-title", "#download-title", "#repositories-title", "#closing-title"];

// The comparison's capabilities and the kinds of tool BMO is set beside, as src/lib/comparison.ts holds them.
const CAPABILITIES = 8;
const KINDS = 5;

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

async function opened(width: (typeof WIDTHS)[number], path: string, scheme: (typeof SCHEMES)[number] = "dark"): Promise<Page> {
  const context = await browser.newContext({ viewport: width.viewport, isMobile: width.mobile, hasTouch: width.mobile, reducedMotion: "reduce", colorScheme: scheme });
  const page = await context.newPage();

  await page.goto(`${site.origin}${path}`, { waitUntil: "load" });

  return page;
}

// The runbook a coding agent is handed reads at /install.md as Markdown, opening with its title, whether the build
// read the index's runbook or wrote the pointer to it; every page's get-started section names that address.
test("/install.md answers the install runbook as Markdown", async () => {
  if (!existsSync(join(DIST, "install.md"))) throw new Error("dist/ holds no install.md: run `bun run build` first");

  const text = await Bun.file(join(DIST, "install.md")).text();

  expect(text.startsWith("# ")).toBe(true);
  expect(text).toMatch(/install\.md/i);
});

describe.skipIf(!ready)("the built pages", () => {
  for (const width of WIDTHS) {
    for (const entry of PAGES) {
      for (const scheme of SCHEMES) test(`${entry.path} at the ${width.name}'s width in the ${scheme} scheme`, async () => {
        const page = await opened(width, entry.path, scheme);

        expect(await page.locator("html").getAttribute("lang")).toBe(entry.lang);

        for (const selector of SECTIONS) {
          const heading = page.locator(selector);

          await heading.scrollIntoViewIfNeeded();
          expect(await heading.isVisible()).toBe(true);
          expect(((await heading.textContent()) ?? "").trim().length).toBeGreaterThan(0);
        }

        expect(await page.locator("#features .feature").count()).toBe(9);
        // What the release adds, every item with its words, and the two desktop apps, each with its words.
        expect(await page.locator("#new .feature").count()).toBe(10);
        for (const text of await page.locator("#new .feature p").allTextContents()) expect(text.trim().length).toBeGreaterThan(20);
        expect(await page.locator("#download .desktop-app").count()).toBe(2);
        // The release's version line where a release is published, the words saying none is yet where none is.
        expect(await page.locator("#download .release-line, #download .release-missing").count()).toBe(1);
        for (const text of await page.locator("#download .desktop-app p").allTextContents()) expect(text.trim().length).toBeGreaterThan(20);
        expect(await page.locator("#start pre").textContent()).toContain("https://bmo.ahas.io/install.md");
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
          // Every file the picture may show is a capture in the page's capture language, and the one it shows is the
          // capture of the scheme the page stands in.
          for (const file of picture.sources) expect(file).toMatch(new RegExp(`-${entry.capture}-(dark|light)\\.`));
          expect(picture.file).toMatch(new RegExp(`-${entry.capture}-${scheme}\\.`));
        }

        // The page stands in the scheme asked for.
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toContain(scheme);

        // The comparison holds a row for every capability, BMO's answer and a mark for every kind in each, and every
        // footnote a mark points to stands under it.
        const compare = page.locator("table.compare");

        await compare.scrollIntoViewIfNeeded();
        expect(await compare.locator("tbody tr").count()).toBe(CAPABILITIES);
        expect(await compare.locator("tbody td.compare-bmo").count()).toBe(CAPABILITIES);
        expect(await compare.locator("tbody td[data-mark]").count()).toBe(CAPABILITIES * KINDS);
        for (const href of await compare.locator("a.note-ref").evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
          expect(((await page.locator(href).textContent()) ?? "").trim().length).toBeGreaterThan(10);
        }
        if (width.mobile) {
          // Stacked at a phone's width, each footnote mark is a target a finger reaches.
          for (const box of await compare.locator("a.note-ref").evaluateAll((links) => links.map((link) => link.getBoundingClientRect().toJSON()))) {
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
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
