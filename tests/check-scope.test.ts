import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import ts from "typescript";

// `bun run check` reads the repository alone, the way the deployment's build tree holds it, so every file it reads
// must keep its imports inside the repository. The capture scripts under `scripts/shots/` are the one family that
// reads the units checked out beside the repository (README 「Screenshots」), and `tsconfig.json` leaves them out of
// the check. This holds the two together: a file left in the check reaches nothing outside the repository.

const ROOT = new URL("../", import.meta.url).pathname;
const GENERATED = [".astro", ".git", "dist", "node_modules", "shots-out"];
const TSCONFIG = JSON.parse(readFileSync(join(ROOT, "tsconfig.json"), "utf8")) as { exclude?: string[] };
const EXCLUDED = TSCONFIG.exclude ?? [];

/** Every TypeScript and Astro source the repository holds, the generated trees and the dependencies left out. */
function sources(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (GENERATED.includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) sources(path, found);
    else if (entry.name.endsWith(".ts") || entry.name.endsWith(".astro")) found.push(path);
  }
  return found;
}

/** Every module a source names by a literal, as its line and its words. */
function specifiers(file: string): { line: number; specifier: string }[] {
  const text = readFileSync(file, "utf8");
  const astro = file.endsWith(".astro");
  const frontmatter = astro ? /^---\r?\n([\s\S]*?)\r?\n---/.exec(text) : null;
  if (astro && !frontmatter) return [];
  const parsed = ts.createSourceFile(file, astro ? frontmatter![1] : text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const start = astro ? 1 : 0;
  const found: { line: number; specifier: string }[] = [];
  const keep = (literal: ts.StringLiteral) =>
    found.push({ line: parsed.getLineAndCharacterOfPosition(literal.getStart(parsed)).line + 1 + start, specifier: literal.text });
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) keep(node.moduleSpecifier);
    else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) keep(node.moduleSpecifier);
    else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) keep(node.argument.literal);
    else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [argument] = node.arguments;
      if (argument && ts.isStringLiteral(argument)) keep(argument);
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);
  return found;
}

/** Whether a relative module lands outside the repository. A package's name and an absolute path are not counted. */
function reachesOutside(file: string, specifier: string): boolean {
  if (!specifier.startsWith(".")) return false;
  const target = resolve(dirname(file), specifier);
  return target !== ROOT.slice(0, -1) && !target.startsWith(ROOT);
}

/** Whether `bun run check` reads the file, given the paths `tsconfig.json` excludes. */
function checked(file: string): boolean {
  const path = relative(ROOT, file);
  return !EXCLUDED.some((skip) => path === skip || path.startsWith(`${skip}/`));
}

describe("the type check's scope", () => {
  const reaching = sources(ROOT).flatMap((file) =>
    specifiers(file)
      .filter((one) => reachesOutside(file, one.specifier))
      .map((one) => ({ file, ...one })),
  );

  test("reads only files whose imports stay inside the repository", () => {
    const read = reaching.filter((one) => checked(one.file));

    expect(read.map((one) => `${relative(ROOT, one.file)}:${one.line} imports ${one.specifier}`)).toEqual([]);
  });

  test("leaves the capture scripts out, which read the units beside the repository", () => {
    expect(EXCLUDED).toContain("scripts/shots");
  });
});
