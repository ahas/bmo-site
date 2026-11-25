// The desktop apps' public release, read once at build time from the `release.json` of jake's latest GitHub release
// (jake's docs/desktop.md, 「The read the console uses」): the remote controller's files under `files`, the All-in-One's
// under `allInOne.files`, both of the release's one version, and the builds ahead of it, where one is published: the
// newest alpha, beta or release candidate under `preview`, and the newest nightly under `nightly`. The remote controller asks each person for their own BMO server's address on its first run, so one
// release serves every deployment. Until a stable release is published that address answers 404 and the newest preview build's
// read stands in; where neither stands, the download section says no release is available yet. The address sends no CORS header, so the page cannot read it in the browser.

export const RELEASE_URL = "https://github.com/ahas/jake/releases/latest/download/release.json";

/** The preview channel's read, which stands for the release until the first stable one is published. */
export const PREVIEW_URL = "https://github.com/ahas/jake/releases/download/desktop-preview/release.json";

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

/** The channels whose builds stand ahead of the release, in the order the page lists them. */
export const PRERELEASE_CHANNELS = ["preview", "nightly"] as const;

export type PrereleaseChannel = (typeof PRERELEASE_CHANNELS)[number];

/** A build ahead of the release, a preview or a nightly: its own version, the remote controller's files and the All-in-One's. */
export interface Prerelease extends ReleaseApp {
  version: string;
  allInOne?: ReleaseApp;
}

export interface Release extends ReleaseApp {
  version: string;
  date: string;
  allInOne?: ReleaseApp;
  preview?: Prerelease;
  nightly?: Prerelease;
}

function hasFiles(value: unknown): value is ReleaseApp {
  return Array.isArray((value as Partial<ReleaseApp> | null)?.files);
}

function isPrerelease(value: unknown): value is Prerelease {
  const read = value as Partial<Prerelease> | null;

  return typeof read?.version === "string" && (read.allInOne === undefined || hasFiles(read.allInOne)) && hasFiles(read);
}

function isRelease(value: unknown): value is Release {
  const read = value as Partial<Release> | null;

  return (
    typeof read?.version === "string" &&
    typeof read.date === "string" &&
    Array.isArray(read.files) &&
    (read.allInOne === undefined || hasFiles(read.allInOne)) &&
    PRERELEASE_CHANNELS.every((channel) => read[channel] === undefined || isPrerelease(read[channel]))
  );
}

let cached: Promise<Release | null> | null = null;

/** The current release, or null where the build is offline or no release is published yet. */
export function currentRelease(): Promise<Release | null> {
  if (process.env.BMO_SITE_OFFLINE === "1") return Promise.resolve(null);

  const read = (url: string): Promise<Release | null> =>
    fetch(url, { signal: AbortSignal.timeout(READ_TIMEOUT_MS) })
      .then(async (answer) => (answer.ok ? ((await answer.json()) as unknown) : null))
      .then((value) => (isRelease(value) ? value : null))
      .catch(() => null);

  // Before the first stable release the newest preview build stands in for it, its version naming it a beta.
  cached ??= read(RELEASE_URL).then((stable) => stable ?? read(PREVIEW_URL));

  return cached;
}

/** A byte count as megabytes with one decimal. */
export function megabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
