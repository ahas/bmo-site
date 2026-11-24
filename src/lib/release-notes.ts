import data from "../data/releases.json";

import type { Locale } from "../i18n";

// The set's release notes, read from src/data/releases.json: one entry a stable release or patch, the newest first. Each
// release carries its one version (every unit of the set shares it), whether it is released or not yet, its date once
// released, and its notes in every language the site is read in — a summary and sections of items, plain text. A new
// release's entry stands at the head of the list; nothing else on the site changes for it.

export interface ReleaseNotes {
  summary: string;
  sections: { title: string; items: string[] }[];
}

export interface SetRelease {
  version: string;
  status: "upcoming" | "released";
  date: string | null;
  notes: Record<Locale, ReleaseNotes>;
}

export const RELEASES = (data as { releases: SetRelease[] }).releases;

/** The anchor of a release on the release notes page. */
export function releaseAnchor(version: string): string {
  return `v${version.replace(/[^0-9a-z]+/gi, "-")}`;
}
