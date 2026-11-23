// An archive document on bmo-artifact's own browser host (its tests/browser/screen.ts), answered with a demo
// document in the locale given, the page's words switched to that locale.
// Usage: `bun scripts/shots/artifact-shot.ts <en|ko>`.
import { standScreen } from "../../../artifact/client/tests/browser/screen.ts";
import type { Route } from "playwright-core";

import { REMOUNT_ROUTE, SWITCH_LOCALE, commonWords, localeOf } from "./locale";

const locale = localeOf(process.argv[2]);

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
  { id: 31, kind: "search", title: "Small embedding models compared", hours: 1, d: "Three sub-1B embedding models measured on a week of real recall misses." },
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
const CONTENT_KO = `# 작은 임베딩 모델 비교

> 10억 파라미터 이하의 임베딩 모델 세 개를, 한 주 동안 놓친 기억 찾기 사례로 측정했습니다.

## 요약

| 모델 | 크기 | Recall@10 | 지연 (p50) |
|---|---:|---:|---:|
| 모델 A | 0.6B | **0.82** | 18 ms |
| 모델 B | 0.35B | 0.77 | 9 ms |
| 모델 C | 0.6B | 0.80 | 21 ms |

모델 A가 놓친 기억을 가장 많이 찾았고, 모델 B는 조금 덜 찾는 대신 가장 빠릅니다. 세 모델 모두 채팅 엔진 옆에서 일반 그래픽 카드 한 장으로 돌아갑니다.

## 방법

1. 한 주 동안 놓친 기억 찾기 사례를, 찾았어야 할 기억과 함께 모았습니다.
2. 각 모델로 기억과 질문을 한 번씩 임베딩했습니다.
3. 정답 기억이 상위 10개 안에 들면 해결된 것으로 셌습니다.

## 권장

찾기 성능은 **모델 A**로 시작하고, 카드가 바쁠 때는 모델 B를 대신 씁니다.
`;
const TITLE_KO = "작은 임베딩 모델 비교";
const DESCRIPTION_KO = "10억 파라미터 이하 임베딩 모델 세 개를 한 주 동안의 실제 사례로 측정했습니다.";
const doc = (x: (typeof DOCS)[number]) => ({ id: x.id, kind: x.kind, title: locale === "ko" && x.id === 31 ? TITLE_KO : x.title, scope: null, actorName: "bmo", owner: null, labels: x.category ? { category: x.category } : {}, description: locale === "ko" && x.id === 31 ? DESCRIPTION_KO : x.d, attachmentCount: 0, hasPicture: false, createdAt: NOW - x.hours * HOUR, changedAt: NOW - x.hours * HOUR });
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
    if (rest === "/content") return route.fulfill({ contentType: "text/markdown", body: x.id === 31 ? (locale === "ko" ? CONTENT_KO : CONTENT) : `# ${x.title}\n\n${x.d}` });
    if (rest === "/attachments" || rest === "/references") return json(route, { items: [], more: false });
    if (rest === "") return json(route, doc(x));
  }
  return json(route, { code: "not-found" }, 404);
}

const words = { common: await commonWords(locale) };
const screen = await standScreen();
try {
  for (const [name, path, options] of [
    ["archive-doc", "/artifact/31", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }],
    ["archive-doc-phone", "/artifact/31", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ] as const) {
    const context = await screen.browser.newContext({ ...options, locale: locale === "ko" ? "ko-KR" : "en-US", colorScheme: "dark", reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.route((u) => u.pathname.startsWith(`${RELAY}/`), answer);
    await page.goto(`${screen.origin}${path}`, { waitUntil: "load", timeout: 180_000 });
    await page.waitForTimeout(5000);
    if (!(await page.evaluate(SWITCH_LOCALE, { selector: "#__nuxt", locale, words }))) throw new Error("the page's vue-i18n was not found");
    if (!(await page.evaluate(REMOUNT_ROUTE, { selector: "#__nuxt", away: "/artifact" }))) throw new Error("the page's router was not found");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}${name}.${locale}.png` });
    console.log("saved", `${name}.${locale}`);
    await context.close();
  }
} finally {
  await screen.close();
}
