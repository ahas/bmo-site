import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

import { SLOTS, slotScreens } from "../src/lib/slots";

// Every screenshot is captured at one size, so the gallery's pictures stand alike: a desktop screen at 1440 by 900
// CSS pixels and a phone at 390 by 844, both at twice the pixels (scripts/shots/, README 「Screenshots」).
const SHOTS = new URL("../src/assets/shots/", import.meta.url).pathname;
const DESKTOP = { width: 2880, height: 1800 };
const PHONE = { width: 780, height: 1688 };

describe("the screenshots", () => {
  const files = readdirSync(SHOTS).filter((name) => name.endsWith(".webp"));

  test("are there", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const name of files) {
    test(`${name} is captured at its kind's one size`, async () => {
      const { width, height } = await sharp(join(SHOTS, name)).metadata();
      const expected = name.includes("-phone-") ? PHONE : DESKTOP;

      expect({ width, height }).toEqual(expected);
    });
  }
});

// Every place a page shows a screenshot shows the same screen in every language, each captured in that language: a
// slot names one screen for all four, and that screen's capture stands in each language and scheme. The guidebook's
// chapters name the same screens in every language, each captured the same way.
const LANGUAGES = ["en", "ko", "ja", "zh"] as const;
const SCHEMES = ["dark", "light"] as const;
const GUIDE = new URL("../src/content/guide/", import.meta.url).pathname;

function captured(screen: string): string[] {
  return LANGUAGES.flatMap((language) => SCHEMES.map((scheme) => `${screen}-${language}-${scheme}.webp`)).filter((name) => !existsSync(join(SHOTS, name)));
}

/** The screens a chapter's front matter names, in its order, read by Bun's own YAML reader. */
function chapterScreens(language: string, chapter: string): string[] {
  const front = readFileSync(join(GUIDE, language, chapter), "utf8").split(/^---$/m)[1]!;
  const data = Bun.YAML.parse(front) as { shots?: { name: string }[] };

  return (data.shots ?? []).map((one) => one.name);
}

describe("the screenshot slots", () => {
  for (const [group, slots] of Object.entries(SLOTS)) {
    for (const [slot, screen] of Object.entries(slots)) {
      test(`${group}.${slot} names one screen, captured in every language and scheme`, () => {
        expect(typeof screen).toBe("string");
        expect(captured(screen)).toEqual([]);
      });
    }
  }

  test("every chapter of the guidebook names the same screens in every language, each captured in all of them", () => {
    for (const chapter of readdirSync(join(GUIDE, "ko"))) {
      const screens = chapterScreens("ko", chapter);

      for (const language of LANGUAGES) expect(chapterScreens(language, chapter)).toEqual(screens);
      for (const screen of screens) expect(captured(screen)).toEqual([]);
    }
  });

  test("no capture stands for a screen no slot or chapter shows, nor in a language the site is not read in", () => {
    const shown = new Set([...slotScreens(), ...readdirSync(join(GUIDE, "ko")).flatMap((chapter) => chapterScreens("ko", chapter))]);

    for (const name of readdirSync(SHOTS).filter((one) => one.endsWith(".webp"))) {
      const [, screen, language] = /^(.+)-(en|ko|ja|zh)-(dark|light)\.webp$/.exec(name) ?? [];

      expect(language).toBeDefined();
      expect(shown.has(screen!)).toBe(true);
    }
  });
});
