// Holds what the site's address serves to the build in dist/: the home page there must answer 200 with the bytes
// dist/index.html holds, so a deployment that published one build is shown to serve it.
//
//   bun scripts/deploy/served.ts
//
// The address is the `site` the Astro configuration names. It ends 0 where the two match, and 1 naming what
// differed otherwise.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import config from "../../astro.config.mjs";

const root = join(import.meta.dir, "..", "..");
const address = new URL("/", config.site);
const built = readFileSync(join(root, "dist", "index.html"));
const answer = await fetch(address, { headers: { "cache-control": "no-cache" } });
const served = new Uint8Array(await answer.arrayBuffer());

if (answer.status !== 200) {
  console.error(`${address} answered ${answer.status}`);
  process.exit(1);
}

if (Buffer.compare(Buffer.from(served), built) !== 0) {
  console.error(`${address} serves another build than dist/index.html: ${served.length} bytes against ${built.length}`);
  process.exit(1);
}

console.log(`${address} serves this build's home page`);
