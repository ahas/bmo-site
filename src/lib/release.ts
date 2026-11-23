// The desktop apps' public release, read once at build time from the `release.json` of jake's latest GitHub release
// (jake's docs/desktop.md, 「The read the console uses」): the remote controller's files under `files`, the All-in-One's
// under `allInOne.files`, both of the release's one version, and the nightly build's, where one is published, under
// `nightly`. The remote controller asks each person for their own BMO server's address on its first run, so one
// release serves every deployment. Until a release is published the address answers 404 and the download section says
// no release is available yet. The address sends no CORS header, so the page cannot read it in the browser.

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

/** One app's files in a release. */
export interface ReleaseApp {
  files: ReleaseFile[];
}

/** A nightly build: its own version, the remote controller's files and the All-in-One's. */
export interface Nightly extends ReleaseApp {
  version: string;
  allInOne?: ReleaseApp;
}

export interface Release extends ReleaseApp {
  version: string;
  date: string;
  allInOne?: ReleaseApp;
  nightly?: Nightly;
}

function hasFiles(value: unknown): value is ReleaseApp {
  return Array.isArray((value as Partial<ReleaseApp> | null)?.files);
}

function isRelease(value: unknown): value is Release {
  const read = value as Partial<Release> | null;

  return (
    typeof read?.version === "string" &&
    typeof read.date === "string" &&
    Array.isArray(read.files) &&
    (read.allInOne === undefined || hasFiles(read.allInOne)) &&
    (read.nightly === undefined || (typeof read.nightly.version === "string" && hasFiles(read.nightly) && (read.nightly.allInOne === undefined || hasFiles(read.nightly.allInOne))))
  );
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
