import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

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
