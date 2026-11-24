import { existsSync, mkdirSync } from "node:fs";

import sharp from "sharp";

import { LOCALES, THEMES } from "./locale";

// Turns the captures in shots-out/ into the WebP sources under src/assets/shots/ the pages are built from. A
// capture's language and colour scheme are the last parts of its name, `<capture>.<locale>.<scheme>.png`, and stay
// the last parts of the source's, `<source>-<locale>-<scheme>.webp`, which the browser test reads to hold each page
// to its own language's screens in its own scheme. Every screen is captured in every language the site is read in.
const from = new URL("../../shots-out/", import.meta.url).pathname;
const to = new URL("../../src/assets/shots/", import.meta.url).pathname;
// Each capture by the name of the source it becomes.
const NAMES: [string, string][] = [
  ["room", "console-room"],
  ["room-phone", "console-room-phone"],
  ["calendar", "calendar-week"],
  ["calendar-phone", "calendar-phone"],
  ["archive-doc", "archive-document"],
  ["note", "note"],
  ["brain", "brain"],
  ["agents", "agents"],
  ["job", "job"],
  ["cards", "cards"],
  ["drive", "drive"],
  ["theater", "theater"],
  ["org", "org"],
  ["catalogue", "catalogue"],
  ["personal-apps", "personal-apps"],
  ["language", "language"],
];

mkdirSync(to, { recursive: true });
for (const [png, webp] of NAMES) {
  for (const locale of LOCALES) {
    for (const theme of THEMES) {
      const source = `${from}${png}.${locale}.${theme}.png`;

      if (!existsSync(source)) continue;

      const written = await sharp(source).webp({ quality: 92 }).toFile(`${to}${webp}-${locale}-${theme}.webp`);

      console.log(`${webp}-${locale}-${theme}`, written.width, written.height, written.size);
    }
  }
}
