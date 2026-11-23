// The install runbook a person's coding agent reads, served at /install.md. Its one source is the index
// repository's INSTALL.md, read once at build time from the index's main branch, so the site keeps no copy of it.
// Where the build is offline or the index cannot be read, the page names where the runbook stands instead, so an
// agent handed the address still finds it.

import { UMBRELLA_URL } from "./site";

export const RUNBOOK_URL = "https://raw.githubusercontent.com/ahas/bmo/main/INSTALL.md";
export const RUNBOOK_PAGE_URL = `${UMBRELLA_URL}/blob/main/INSTALL.md`;

/** How long the build waits for the runbook read before it goes on with the pointer. */
const READ_TIMEOUT_MS = 15_000;

/** What /install.md serves where the runbook could not be read at build time. */
export const RUNBOOK_POINTER = `# Install BMO

This address serves BMO's install runbook, written for a coding agent to carry out. The copy behind it could not be
read when this site was built. Read the runbook where it stands:

${RUNBOOK_PAGE_URL}

The raw file, for an agent that reads Markdown:

${RUNBOOK_URL}
`;

let cached: Promise<string> | null = null;

/** The runbook's Markdown, or the pointer where the build is offline or the index does not answer it. */
export function runbook(): Promise<string> {
  if (process.env.BMO_SITE_OFFLINE === "1") return Promise.resolve(RUNBOOK_POINTER);

  cached ??= fetch(RUNBOOK_URL, { signal: AbortSignal.timeout(READ_TIMEOUT_MS) })
    .then(async (answer) => (answer.ok ? await answer.text() : null))
    .then((text) => (text !== null && text.startsWith("# ") ? text : RUNBOOK_POINTER))
    .catch(() => RUNBOOK_POINTER);

  return cached;
}
