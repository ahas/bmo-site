import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "playwright-core";

import { REPOSITORY_GROUPS } from "../src/lib/repositories";
import { DIST, serveDist } from "./serve";

import type { Browser } from "playwright-core";

// The three reading sections — the guidebook, the API reference and the release notes — as built into dist/: every
// page stands in all four languages, the API reference has a page for every public unit whose OpenAPI document the
// snapshot holds and lists each of them on its front page with every operation the document declares, the guidebook
// holds the same chapters in every language, the release notes hold every release in every language with the same
// shape, and no page names a repository that is not public or a host of the site's domain other than the site's own.
// The browser part opens one page of each section at a desktop's and a phone's width in both colour schemes and holds
// it to its heading, to its language menu leading to the same page in the other languages, and to no horizontal
// overflow; it is skipped where the browser build Playwright pins is not on the machine. Run `bun run build` first.

const ROOT = new URL("../", import.meta.url).pathname;
const LOCALES = [
  { code: "en", prefix: "/", lang: "en" },
  { code: "ko", prefix: "/ko/", lang: "ko" },
  { code: "ja", prefix: "/ja/", lang: "ja" },
  { code: "zh", prefix: "/zh/", lang: "zh-Hans" },
] as const;

const PUBLIC = new Set(REPOSITORY_GROUPS.flatMap((group) => group.items.filter((item) => !item.retired).map((item) => item.name)));
const SNAPSHOT = JSON.parse(readFileSync(join(ROOT, "src/data/openapi/snapshot.json"), "utf8")) as { units: { name: string; operations: number }[] };
// Whether the release's tag stands, which marks it released on the built page.
const tagged = (version: string): boolean =>
  Bun.spawnSync(["git", "rev-parse", "--verify", "--quiet", `refs/tags/v${version}`], { cwd: ROOT }).success;
const RELEASES = JSON.parse(readFileSync(join(ROOT, "src/data/releases.json"), "utf8")) as {
  releases: { version: string; notes: Record<string, { summary: string; sections: { title: string; items: string[] }[] }> }[];
};

function built(path: string): string {
  const file = join(DIST, path, path.endsWith(".json") ? "" : "index.html");

  if (!existsSync(file)) throw new Error(`dist/ holds no ${path}: run \`bun run build\` first`);

  return readFileSync(file, "utf8");
}

/** A page's visible text and the addresses its links lead to, read by Bun's own HTML rewriter. */
async function reading(html: string): Promise<{ text: string; links: string[] }> {
  const pieces: string[] = [];
  const links: string[] = [];
  let hidden = 0;

  await new HTMLRewriter()
    .on("script, style", {
      element(element) {
        hidden++;
        element.onEndTag(() => {
          hidden--;
        });
      },
    })
    .on("a[href]", {
      element(element) {
        links.push(element.getAttribute("href")!);
      },
    })
    .onDocument({
      text(chunk) {
        if (hidden === 0) pieces.push(chunk.text);
      },
    })
    .transform(new Response(html))
    .text();

  return { text: pieces.join(""), links };
}

function htmlFiles(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);

    return statSync(path).isDirectory() ? htmlFiles(path) : name.endsWith(".html") ? [path] : [];
  });
}

const chapterNames = (code: string) =>
  readdirSync(join(ROOT, "src/content/guide", code))
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();

describe("the API reference", () => {
  test("the snapshot holds public units alone, one file each", () => {
    const files = readdirSync(join(ROOT, "src/data/openapi"))
      .filter((name) => name !== "snapshot.json")
      .map((name) => name.replace(/\.json$/, ""))
      .sort();

    expect(files).toEqual(SNAPSHOT.units.map((unit) => unit.name).sort());
    for (const name of files) expect(PUBLIC.has(name)).toBe(true);
    expect(files.length).toBeGreaterThan(20);
  });

  for (const locale of LOCALES) {
    test(`${locale.prefix}api/ lists every unit, and every unit's page holds each of its operations`, () => {
      const front = built(`${locale.prefix}api/`);

      for (const unit of SNAPSHOT.units) {
        expect(front).toContain(`href="${locale.prefix}api/${unit.name}/"`);

        const page = built(`${locale.prefix}api/${unit.name}/`);

        expect(page).toContain(`<html lang="${locale.lang}"`);
        expect(page.match(/<article class="api-op"/g)?.length ?? 0).toBe(unit.operations);
      }
    });
  }

  test("the search list holds every operation of every unit", () => {
    const endpoints = JSON.parse(built("/api/search.json")) as { unit: string; method: string; path: string; anchor: string }[];

    for (const unit of SNAPSHOT.units) expect(endpoints.filter((one) => one.unit === unit.name).length).toBe(unit.operations);

    const page = built(`/api/${endpoints[0]!.unit}/`);

    expect(page).toContain(`id="${endpoints[0]!.anchor}"`);
  });
});

describe("the guidebook", () => {
  test("every language holds the same chapters as the Korean source", () => {
    const source = chapterNames("ko");

    expect(source.length).toBeGreaterThanOrEqual(10);
    for (const locale of LOCALES) expect(chapterNames(locale.code)).toEqual(source);
  });

  for (const locale of LOCALES) {
    test(`${locale.prefix}guide/ leads to every chapter, each built in its language`, async () => {
      const front = built(`${locale.prefix}guide/`);

      for (const chapter of chapterNames("ko")) {
        expect(front).toContain(`href="${locale.prefix}guide/${chapter}/"`);

        const page = built(`${locale.prefix}guide/${chapter}/`);

        expect(page).toContain(`<html lang="${locale.lang}"`);
        expect((await reading(page)).text.length).toBeGreaterThan(1500);
      }
    });
  }
});

describe("the release notes", () => {
  test("every release holds its notes in every language, in the same shape", () => {
    expect(RELEASES.releases[0]!.version).toBe("1.0.0");

    for (const release of RELEASES.releases) {
      expect(release.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(Object.keys(release).sort()).toEqual(["notes", "version"]);

      const shape = (code: string) => release.notes[code]!.sections.map((section) => section.items.length);

      for (const locale of LOCALES) {
        expect(release.notes[locale.code]!.summary.length).toBeGreaterThan(20);
        expect(shape(locale.code)).toEqual(shape("ko"));
      }
    }
  });

  for (const locale of LOCALES) {
    test(`${locale.prefix}releases/ shows every release, one not yet released marked as such`, () => {
      const page = built(`${locale.prefix}releases/`);

      for (const release of RELEASES.releases) {
        expect(page).toContain(`id="v${release.version.replace(/\./g, "-")}"`);
        if (!tagged(release.version)) expect(page).toMatch(new RegExp(`id="v${release.version.replace(/\./g, "-")}"[^]*?release-upcoming`));
      }
    });
  }
});

test("no built page names a repository that is not public, nor a host of the domain other than the site", async () => {
  for (const file of htmlFiles(DIST)) {
    const html = readFileSync(file, "utf8");
    const { text, links } = await reading(html);

    for (const link of links) {
      const repository = /^https:\/\/github\.com\/ahas\/([^/#?]+)/.exec(link)?.[1];

      if (repository) expect(PUBLIC.has(repository)).toBe(true);
    }
    for (const name of text.match(/\bbmo-[a-z][a-z0-9]*(?:-[a-z0-9]+)*/g) ?? []) {
      if (!PUBLIC.has(name)) throw new Error(`${file.slice(DIST.length)} names ${name}`);
    }
    for (const host of html.match(/[a-z0-9.-]+\.ahas\.io/g) ?? []) expect(host).toBe("bmo.ahas.io");
  }
});

const ready = (() => {
  try {
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
})();

const WIDTHS = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, mobile: false },
  { name: "phone", viewport: { width: 390, height: 844 }, mobile: true },
];

describe.skipIf(!ready)("the reading pages in a browser", () => {
  let browser: Browser;
  let site: ReturnType<typeof serveDist>;
  // The apps chapter shows screenshots.
  const pages = ["guide/", "guide/apps/", "api/", `api/${SNAPSHOT.units[0]!.name}/`, "releases/"];

  beforeAll(async () => {
    site = serveDist();
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser?.close();
    site?.stop();
  });

  for (const width of WIDTHS) {
    for (const scheme of ["dark", "light"] as const) {
      for (const locale of LOCALES) {
        test(`${locale.prefix} reading pages at the ${width.name}'s width in the ${scheme} scheme`, async () => {
          const context = await browser.newContext({ viewport: width.viewport, isMobile: width.mobile, hasTouch: width.mobile, reducedMotion: "reduce", colorScheme: scheme });
          const page = await context.newPage();

          for (const path of pages) {
            await page.goto(`${site.origin}${locale.prefix}${path}`, { waitUntil: "load" });

            expect(await page.locator("html").getAttribute("lang")).toBe(locale.lang);
            expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toContain(scheme);

            const heading = page.locator("main h1");

            expect(await heading.isVisible()).toBe(true);
            expect(((await heading.textContent()) ?? "").trim().length).toBeGreaterThan(0);

            // The language menu leads to this same page in every language.
            expect(await page.locator(".lang-list a").evaluateAll((all) => all.map((link) => link.getAttribute("href")))).toEqual(LOCALES.map((one) => `${one.prefix}${path}`));

            // Nothing reaches past the window's right edge, at the top or after scrolling to the end.
            for (const at of ["top", "end"]) {
              if (at === "end") await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
              expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
            }

            // Every picture has its words and loads.
            await page.evaluate(async () => {
              for (const image of Array.from(document.images)) image.loading = "eager";
              await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => undefined)));
            });
            const pictures = await page.locator("main img").evaluateAll((images) =>
              (images as HTMLImageElement[]).map((image) => ({ alt: image.alt, loaded: image.complete && image.naturalWidth > 0, file: (image.currentSrc || image.src).split("/").pop() ?? "" }))
            );

            if (path === "guide/apps/") expect(pictures.length).toBeGreaterThan(0);
            for (const picture of pictures) {
              expect(picture.alt.length).toBeGreaterThan(10);
              expect(picture.loaded).toBe(true);
              // A capture in the page's own language, in the scheme the page stands in.
              expect(picture.file).toMatch(new RegExp(`-${locale.code}-${scheme}\\.`));
            }

            // The contents list stands beside a page on a wide screen and folds above it on a phone; either way each
            // entry is reached by a press at least 44 pixels high.
            const contents = page.locator(".docs-toc");

            if ((await contents.count()) > 0) {
              expect(await contents.evaluate((toc) => (toc as HTMLDetailsElement).open)).toBe(!width.mobile);
              if (width.mobile) await contents.locator("summary").click();
              for (const box of await contents.locator("a").evaluateAll((links) => links.slice(0, 8).map((link) => link.getBoundingClientRect().toJSON()))) {
                expect(box.height).toBeGreaterThanOrEqual(44);
              }
            }
          }

          await context.close();
        }, 120_000);
      }
    }
  }

  test("the API search finds an endpoint across units and leads to it", async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();

    await page.goto(`${site.origin}/ko/api/`, { waitUntil: "load" });
    await page.locator("#api-search-input").fill("get health");

    const results = page.locator(".api-results a");

    await results.first().waitFor();
    expect(await results.count()).toBeGreaterThan(5);

    const units = new Set(await page.locator(".api-result-unit").allTextContents());

    expect(units.size).toBeGreaterThan(5);

    const target = (await results.first().getAttribute("href"))!;

    expect(target).toMatch(/^\/ko\/api\/[a-z-]+\/#op-/);
    await results.first().click();
    await page.waitForURL(`**${target}`);
    expect(await page.locator(target.slice(target.indexOf("#"))).isVisible()).toBe(true);

    await context.close();
  }, 60_000);
});
