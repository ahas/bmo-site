import { existsSync, mkdirSync } from "node:fs";

import sharp from "sharp";

// Turns the captures in shots-out/ into the WebP sources under src/assets/shots/ the pages are built from. A
// capture's language is the last part of its name, `<capture>.<locale>.png`, and stays the last part of the
// source's, `<source>-<locale>.webp`, which the browser test reads to hold each page to its own language's
// screens. The console's own room is captured in Korean alone, the one language its screens speak.
const from = new URL("../../shots-out/", import.meta.url).pathname;
const to = new URL("../../src/assets/shots/", import.meta.url).pathname;
const NAMES: [string, string][] = [
  ["room.ko", "console-room-ko"],
  ["room-phone.ko", "console-room-phone-ko"],
  ...(["en", "ko"] as const).flatMap((locale): [string, string][] => [
    [`calendar.${locale}`, `calendar-week-${locale}`],
    [`calendar-phone.${locale}`, `calendar-phone-${locale}`],
    [`archive-doc.${locale}`, `archive-document-${locale}`],
    [`note.${locale}`, `note-${locale}`],
    [`note-phone.${locale}`, `note-phone-${locale}`],
  ]),
];

mkdirSync(to, { recursive: true });
for (const [png, webp] of NAMES) {
  if (!existsSync(`${from}${png}.png`)) {
    console.log("no capture", png);
    continue;
  }

  const written = await sharp(`${from}${png}.png`).webp({ quality: 92 }).toFile(`${to}${webp}.webp`);

  console.log(webp, written.width, written.height, written.size);
}
