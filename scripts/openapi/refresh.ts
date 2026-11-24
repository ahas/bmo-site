// Refreshes the API reference's snapshot: every public unit's OpenAPI document, read from its repository's main
// branch and written under src/data/openapi/ as one bundled file, which the site renders at build time.
//
// The public units are the ones src/lib/repositories.ts lists; nothing else is read or written. A unit's checkout is
// found beside the others in a workspace laid out as the index repository describes (base/, services/, resources/,
// tools/), by its origin's repository name, and its document is read from `origin/main` after a fetch, never from the
// working tree. A reference into another unit's document (a provider's document naming the chat protocol's schemas)
// is read the same way, from that unit's own main branch, and folded into the bundle, so each snapshot stands alone.
//
//   bun scripts/openapi/refresh.ts [--root <workspace>]
//
// The workspace defaults to the folder two levels above this site's checkout. A unit without a document on its main
// branch gets no snapshot, and a snapshot whose unit no longer has one is removed.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import SwaggerParser from "@apidevtools/swagger-parser";

import { REPOSITORY_GROUPS } from "../../src/lib/repositories";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = join(SITE, "src/data/openapi");
const DOCUMENT = "docs/openapi.json";
const BRANCH = "origin/main";
const LAYOUT = ["base", "services", "resources", "tools"];

function argument(name: string): string | undefined {
  const at = process.argv.indexOf(name);

  return at >= 0 ? process.argv[at + 1] : undefined;
}

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
}

/** The repository name a checkout's origin points at, or null where it has none. */
function originName(checkout: string): string | null {
  try {
    return basename(git(checkout, "remote", "get-url", "origin").trim()).replace(/\.git$/, "");
  } catch {
    return null;
  }
}

/** Every checkout in the workspace by its origin's repository name, the folder named for the unit first. */
function checkouts(root: string): Map<string, string> {
  const found = new Map<string, string>();
  const folders = [root, ...LAYOUT.flatMap((group) => (existsSync(join(root, group)) ? readdirSync(join(root, group)).map((name) => join(root, group, name)) : []))];

  for (const folder of folders) {
    if (!existsSync(join(folder, ".git")) || !statSync(folder).isDirectory()) continue;

    const name = originName(folder);

    if (name === null) continue;
    const preferred = basename(folder) === name.replace(/^bmo-/, "");

    if (!found.has(name) || preferred) found.set(name, folder);
  }

  return found;
}

/** A file as it stands on its repository's main branch, read through the checkout that holds it. */
function onMain(path: string): string {
  const top = git(dirname(path), "rev-parse", "--show-toplevel").trim();

  return git(top, "show", `${BRANCH}:${relative(top, path)}`);
}

const root = resolve(argument("--root") ?? join(SITE, "../.."));
const found = checkouts(root);
const publicNames = REPOSITORY_GROUPS.flatMap((group) => group.items.filter((item) => !item.retired).map((item) => item.name));
const written: { name: string; commit: string; operations: number }[] = [];
const fetched = new Set<string>();

mkdirSync(OUT, { recursive: true });

for (const name of publicNames) {
  const checkout = found.get(name);

  if (!checkout) {
    console.warn(`${name}: no checkout under ${root}`);
    continue;
  }
  if (!fetched.has(checkout)) {
    git(checkout, "fetch", "--quiet", "origin", "main");
    fetched.add(checkout);
  }

  try {
    git(checkout, "cat-file", "-e", `${BRANCH}:${DOCUMENT}`);
  } catch {
    continue;
  }

  // Every file the document reaches is read from the main branch of the repository holding it.
  const bundled = await SwaggerParser.bundle(join(checkout, DOCUMENT), {
    resolve: {
      file: false,
      http: false,
      main: { order: 1, canRead: true, read: (file: { url: string }) => onMain(file.url.startsWith("file:") ? fileURLToPath(file.url) : file.url) },
    },
  } as SwaggerParser.Options);

  await SwaggerParser.validate(structuredClone(bundled)).catch((error: Error) => console.warn(`${name}: ${error.message.split("\n")[0]}`));

  const operations = Object.values((bundled as { paths?: Record<string, object> }).paths ?? {}).reduce(
    (count, item) => count + Object.keys(item).filter((key) => ["get", "put", "post", "delete", "options", "head", "patch", "trace"].includes(key)).length,
    0
  );

  writeFileSync(join(OUT, `${name}.json`), `${JSON.stringify(bundled)}\n`);
  written.push({ name, commit: git(checkout, "rev-parse", BRANCH).trim(), operations });
  console.log(`${name}: ${operations} operations`);
}

for (const file of readdirSync(OUT)) {
  if (file.endsWith(".json") && file !== "snapshot.json" && !written.some((unit) => `${unit.name}.json` === file)) rmSync(join(OUT, file));
}

writeFileSync(join(OUT, "snapshot.json"), `${JSON.stringify({ units: written }, null, 2)}\n`);
console.log(`${written.length} units written to ${relative(SITE, OUT)}`);
