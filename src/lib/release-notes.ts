import { execFileSync } from "node:child_process";

import data from "../data/releases.json";

import type { Locale } from "../i18n";

// The set's release notes, read from src/data/releases.json: one entry a stable release or patch, the newest first. Each
// release carries its one version (every unit of the set shares it) and its notes in every language the site is read in
// — a summary and sections of items, plain text. Whether it is released, and its date, are read off the git tags when
// the site is built: a release is released once its tag `v<version>` stands, on the day the tag was made in the
// platform's time zone (bmo-chat's docs/conventions.md, 「Versions」). A new release's entry stands at the head of the
// list; nothing else on the site changes for it.

export interface ReleaseNotes {
  summary: string;
  sections: { title: string; items: string[] }[];
}

interface ListedRelease {
  version: string;
  notes: Record<Locale, ReleaseNotes>;
}

export interface SetRelease extends ListedRelease {
  status: "upcoming" | "released";
  date: string | null;
}

/** The day a release's tag was made, `YYYY-MM-DD` in the platform's time zone, Asia/Seoul; null where no tag stands. */
export function taggedOn(version: string): string | null {
  let made = "";

  try {
    made = execFileSync("git", ["for-each-ref", "--format=%(creatordate:unix)", `refs/tags/v${version}`], {
      cwd: new URL("../../", import.meta.url).pathname,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }

  if (made === "") return null;

  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date(Number(made) * 1000));
}

export const RELEASES: SetRelease[] = (data as { releases: ListedRelease[] }).releases.map((release) => {
  const date = taggedOn(release.version);

  return { ...release, status: date === null ? "upcoming" : "released", date };
});

/** The anchor of a release on the release notes page. */
export function releaseAnchor(version: string): string {
  return `v${version.replace(/[^0-9a-z]+/gi, "-")}`;
}
