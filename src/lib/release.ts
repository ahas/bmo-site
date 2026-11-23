// The desktop app's current release, read once at build time from the address its release folder publishes
// (jake's docs/desktop.md, "The read the console uses"). The address sends no CORS header, so the page cannot
// read it in the browser; a build that cannot reach it renders the download section with a link to the
// release documentation instead of installers.

export const RELEASE_URL = "https://ai.example.org/bmo/jake/desktop/release.json";

export interface ReleaseFile {
  platform: string;
  arch: string;
  format: string;
  file: string;
  size: number;
  sha256: string;
  url: string;
}

export interface Release {
  version: string;
  date: string;
  files: ReleaseFile[];
}

function isRelease(value: unknown): value is Release {
  const read = value as Partial<Release> | null;

  return typeof read?.version === "string" && typeof read.date === "string" && Array.isArray(read.files);
}

let cached: Promise<Release | null> | null = null;

/** The current release, or null where the build is offline or no release is published yet. */
export function currentRelease(): Promise<Release | null> {
  if (process.env.BMO_SITE_OFFLINE === "1") return Promise.resolve(null);

  cached ??= fetch(RELEASE_URL)
    .then(async (answer) => (answer.ok ? ((await answer.json()) as unknown) : null))
    .then((read) => (isRelease(read) ? read : null))
    .catch(() => null);

  return cached;
}

/** A byte count as megabytes with one decimal. */
export function megabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
