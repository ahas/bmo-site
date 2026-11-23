import { mkdirSync } from "node:fs";

import sharp from "sharp";

// Turns the captured PNGs in shots-out/ into the WebP sources under src/assets/shots/ the pages are built from.
const from = new URL("../../shots-out/", import.meta.url).pathname;
const to = new URL("../../src/assets/shots/", import.meta.url).pathname;
const NAMES: [string, string][] = [
  ["room", "console-room"],
  ["room-phone", "console-room-phone"],
  ["calendar", "calendar-week"],
  ["archive-doc", "archive-document"],
];

mkdirSync(to, { recursive: true });
for (const [png, webp] of NAMES) {
  const written = await sharp(`${from}${png}.png`).webp({ quality: 92 }).toFile(`${to}${webp}.webp`);

  console.log(webp, written.width, written.height, written.size);
}
