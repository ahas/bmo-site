// An archive document on bmo-artifact's own browser host (its tests/browser/screen.ts), answered with a demo
// document in the locale given, the page's words switched to that locale's pack: the bundle's own, which the host
// holds in Korean and English alone, and the console's `common` words.
// Usage: `bun scripts/shots/artifact-shot.ts <en|ko|ja|zh>`.
import { readFileSync } from "node:fs";

import { standScreen } from "../../../artifact/client/tests/browser/screen.ts";
import type { Route } from "playwright-core";

import { REMOUNT_ROUTE, SWITCH_LOCALE, THEMES, browserLocale, commonWords, localeOf, packName } from "./locale";

import type { Locale } from "./locale";

const locale = localeOf(process.argv[2]);
const pack = packName(locale);
const BUNDLE_WORDS = JSON.parse(readFileSync(new URL(`../../../artifact/client/i18n/${pack}.json`, import.meta.url), "utf8")) as Record<string, unknown>;

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
/** The demo research document, number 31, in each language: its title, its description and its Markdown. */
interface Research {
  title: string;
  description: string;
  content: string;
}

const RESEARCH: Record<Locale, Research> = {
  en: {
    title: "Small embedding models compared",
    description: "Three sub-1B embedding models measured on a week of real recall misses.",
    content: `# Small embedding models compared

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
`,
  },
  ko: {
    title: "작은 임베딩 모델 비교",
    description: "10억 파라미터 이하 임베딩 모델 세 개를 한 주 동안의 실제 사례로 측정했습니다.",
    content: `# 작은 임베딩 모델 비교

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
`,
  },
  ja: {
    title: "小型埋め込みモデルの比較",
    description: "10億パラメータ未満の埋め込みモデル3つを、1週間分の実際の想起ミスで測定しました。",
    content: `# 小型埋め込みモデルの比較

> 10億パラメータ未満の埋め込みモデル3つを、1週間分の想起ミスで測定しました。

## 概要

| モデル | サイズ | Recall@10 | レイテンシ (p50) |
|---|---:|---:|---:|
| モデル A | 0.6B | **0.82** | 18 ms |
| モデル B | 0.35B | 0.77 | 9 ms |
| モデル C | 0.6B | 0.80 | 21 ms |

見つけられなかった記憶を最も多く拾えたのはモデル A で、モデル B はわずかに劣る代わりに最も高速です。3つとも、チャットエンジンと並んで一般向けのグラフィックカード1枚で動きます。

## 方法

1. 1週間分の想起ミスを、本来見つかるべきだった記憶と一緒に集めました。
2. 各モデルで記憶と質問をそれぞれ1回ずつ埋め込みました。
3. 正しい記憶が上位10件に入れば、解決したものとして数えました。

## 推奨

想起の精度を重視して **モデル A** から始め、カードが混んでいるときはモデル B を代わりに使います。
`,
  },
  zh: {
    title: "小型嵌入模型对比",
    description: "用一周的真实召回失误，测量了三个 10 亿参数以下的嵌入模型。",
    content: `# 小型嵌入模型对比

> 用一周内没能召回的记忆案例，测量了三个 10 亿参数以下的嵌入模型。

## 摘要

| 模型 | 规模 | Recall@10 | 延迟 (p50) |
|---|---:|---:|---:|
| 模型 A | 0.6B | **0.82** | 18 ms |
| 模型 B | 0.35B | 0.77 | 9 ms |
| 模型 C | 0.6B | 0.80 | 21 ms |

模型 A 找回的遗漏最多，模型 B 稍逊一些，但速度最快。三个模型都能在一张消费级显卡上与聊天引擎并行运行。

## 方法

1. 收集一周内的每一次召回失误，以及本应找到的那条记忆。
2. 用每个模型对记忆和问题各做一次嵌入。
3. 正确的记忆进入前十名，即算作已解决。

## 建议

以召回为先，从 **模型 A** 开始；显卡繁忙时改用模型 B 作为备选。
`,
  },
};

const SHOWN = RESEARCH[locale];
const doc = (x: (typeof DOCS)[number]) => ({ id: x.id, kind: x.kind, title: x.id === 31 ? SHOWN.title : x.title, scope: null, actorName: "bmo", owner: null, labels: x.category ? { category: x.category } : {}, description: x.id === 31 ? SHOWN.description : x.d, attachmentCount: 0, hasPicture: false, createdAt: NOW - x.hours * HOUR, changedAt: NOW - x.hours * HOUR });
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
    if (rest === "/content") return route.fulfill({ contentType: "text/markdown", body: x.id === 31 ? SHOWN.content : `# ${x.title}\n\n${x.d}` });
    if (rest === "/attachments" || rest === "/references") return json(route, { items: [], more: false });
    if (rest === "") return json(route, doc(x));
  }
  return json(route, { code: "not-found" }, 404);
}

const words = { ...BUNDLE_WORDS, common: await commonWords(locale) };
const screen = await standScreen();
try {
  for (const theme of THEMES) for (const [name, path, options] of [
    ["archive-doc", "/artifact/31", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }],
  ] as const) {
    const context = await screen.browser.newContext({ ...options, locale: browserLocale(locale), colorScheme: theme, reducedMotion: "reduce" });
    await context.addCookies([{ name: "nuxt-color-mode", value: theme, url: screen.origin }]);
    const page = await context.newPage();
    await page.route((u) => u.pathname.startsWith(`${RELAY}/`), answer);
    await page.goto(`${screen.origin}${path}`, { waitUntil: "load", timeout: 180_000 });
    // The dev server may still be building the page on a busy machine: the words are switched once its app stands.
    await page.waitForFunction(SWITCH_LOCALE, { selector: "#__nuxt", locale: pack, words }, { timeout: 180_000 });
    if (!(await page.evaluate(REMOUNT_ROUTE, { selector: "#__nuxt", away: "/artifact" }))) throw new Error("the page's router was not found");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}${name}.${locale}.${theme}.png` });
    console.log("saved", `${name}.${locale}.${theme}`);
    await context.close();
  }
} finally {
  await screen.close();
}
