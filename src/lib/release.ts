// The desktop app's public release, read once at build time from the `release.json` of jake's latest GitHub release
// (jake's docs/desktop.md, 「The read the console uses」). The public build asks each person for their own BMO server's
// address on its first run, so one release serves every deployment. Until a release is published the address
// answers 404 and the download section says no public build is published. The address sends no CORS header, so the
// page cannot read it in the browser.

export const RELEASE_URL = "https://github.com/ahas/jake/releases/latest/download/release.json";

/** How long the build waits for the release read before it goes on with none. */
const READ_TIMEOUT_MS = 15_000;

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

  cached ??= fetch(RELEASE_URL, { signal: AbortSignal.timeout(READ_TIMEOUT_MS) })
    .then(async (answer) => (answer.ok ? ((await answer.json()) as unknown) : null))
    .then((read) => (isRelease(read) ? read : null))
    .catch(() => null);

  return cached;
}

/** A byte count as megabytes with one decimal. */
export function megabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
