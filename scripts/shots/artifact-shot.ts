// The archive's screens on the artifact repo's own browser host, answered with demo documents.
import { standScreen } from "../../../artifact/client/tests/browser/screen.ts";
import type { Route } from "playwright-core";

const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const RELAY = "/relay/artifact";
const KINDS = [
  { name: "search", description: "", hosted: false, contentsDepth: 2, icon: "travel-explore" },
  { name: "record", description: "", hosted: false, contentsDepth: 2, icon: "description-outline" },
  { name: "learning", description: "", hosted: false, contentsDepth: 3, icon: "menu-book-outline" },
  { name: "import", description: "", hosted: false, contentsDepth: 3, icon: "public" },
  { name: "page", description: "", hosted: true, contentsDepth: 0, icon: "web" }
];
const NOW = Date.now(), HOUR = 3600_000;
const DOCS = [
  { id: 31, kind: "search", title: "Small embedding models compared", category: "investigation", hours: 1, d: "Three sub-1B embedding models measured on a week of real recall misses." },
  { id: 30, kind: "record", title: "Release 0.4 deploy summary", hours: 3, d: "What went live, what each check said and what is left for the next batch." },
  { id: 29, kind: "learning", title: "Prompt caching, from the ground up", hours: 6, d: "How a cached prefix is kept warm and why a miss costs what it costs." },
  { id: 28, kind: "search", title: "Local speech synthesis engines", category: "investigation", hours: 9, d: "Voice quality, speed and memory of four open engines on one card." },
  { id: 27, kind: "record", title: "Weekly sync notes", hours: 20, d: "Decisions, owners and dates from Monday's sync." },
  { id: 26, kind: "import", title: "Tauri updater guide", hours: 26, d: "A web page kept for reading later." },
  { id: 25, kind: "page", title: "Console user guide", category: "manual", hours: 30, d: "The console's screens explained one by one." },
  { id: 24, kind: "search", title: "Vector search in PostgreSQL", category: "investigation", hours: 40, d: "pgvector index types and their recall at our sizes." },
];
const CONTENT = `# Small embedding models compared

> Three embedding models under one billion parameters, measured on the recall misses of one week.

## Summary

| Model | Size | Recall@10 | Latency (p50) |
|---|---:|---:|---:|
| Model A | 0.6B | **0.82** | 18 ms |
| Model B | 0.35B | 0.77 | 9 ms |
| Model C | 0.6B | 0.80 | 21 ms |

Model A finds the most of what was missed, and Model B is the fastest at a small loss. All three run on one consumer card beside the chat engine.

## Method

1. Every recall miss of the week was collected with the memory that should have been found.
2. Each model embedded the memories and the questions once.
3. A miss counts as fixed when the right memory lands in the first ten.

## Recommendation

Start with **Model A** for recall, and keep Model B as the fallback when the card is busy.
`;
const doc = (x: (typeof DOCS)[number]) => ({ id: x.id, kind: x.kind, title: x.title, scope: null, actorName: "bmo", owner: null, labels: x.category ? { category: x.category } : {}, description: x.d, attachmentCount: 0, hasPicture: false, createdAt: NOW - x.hours * HOUR, changedAt: NOW - x.hours * HOUR });
const json = (r: Route, b: unknown, s = 200) => r.fulfill({ status: s, contentType: "application/json", body: JSON.stringify(b) });
async function answer(route: Route) {
  const url = new URL(route.request().url());
  const path = url.pathname.slice(RELAY.length);
  const q = url.searchParams;
  if (path === "/document-kinds") return json(route, { items: KINDS, more: false });
  if (path === "/documents") { const k = q.get("kind"); const f = DOCS.filter((x) => !k || x.kind === k); return json(route, { items: f.map(doc), more: false }); }
  if (path === "/document-reads") return json(route, { items: [DOCS[0]!, DOCS[1]!, DOCS[2]!].map((x, i) => ({ document: doc(x), reads: 5 - i })), more: false });
  if (path === "/shares" || path === "/label-values") return json(route, { items: [], more: false });
  const one = /^\/documents\/(\d+)(\/.*)?$/.exec(path);
  if (one) {
    const x = DOCS.find((d) => d.id === Number(one[1]));
    const rest = one[2] ?? "";
    if (!x) return json(route, { code: "not-found" }, 404);
    if (rest === "/reads") return route.fulfill({ status: 204 });
    if (rest === "/content") return route.fulfill({ contentType: "text/markdown", body: x.id === 31 ? CONTENT : `# ${x.title}\n\n${x.d}` });
    if (rest === "/attachments" || rest === "/references") return json(route, { items: [], more: false });
    if (rest === "") return json(route, doc(x));
  }
  return json(route, { code: "not-found" }, 404);
}

const screen = await standScreen();
try {
  for (const [name, path, vp] of [
    ["archive", "/artifact", { width: 1280, height: 800 }],
    ["archive-doc", "/artifact/31", { width: 1280, height: 800 }],
  ] as const) {
    const context = await screen.browser.newContext({ viewport: vp, deviceScaleFactor: 2, colorScheme: "dark", reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.route((u) => u.pathname.startsWith(`${RELAY}/`), answer);
    await page.goto(`${screen.origin}${path}`, { waitUntil: "load", timeout: 180_000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${OUT}${name}.png` });
    console.log("saved", name);
    await context.close();
  }
} finally {
  await screen.close();
}
