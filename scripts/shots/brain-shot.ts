// The brain's screen on bmo-brain's own browser host (its tests/browser/host, stood up as its tests/browser/screen.test.ts
// stands it), answered with a demo brain in the locale given: an agent's memories about a fictional person, the person's
// sheet over them and one memory open, the page's words switched to that locale. Both colour schemes.
// Usage: `bun scripts/shots/brain-shot.ts <en|ko|ja|zh>`.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

import { chromium } from "playwright-core";

import { SWITCH_LOCALE, THEMES, browserLocale, commonWords, localeOf, packName } from "./locale";

import type { Locale } from "./locale";
import type { Route } from "playwright-core";

const locale = localeOf(process.argv[2]);
const OUT = new URL("../../shots-out/", import.meta.url).pathname;
// The console wraps a screen in a fixed full-screen dashboard group, and the screen fills its height. A host stood
// on its own has no such group, so the screen stops at its content's height and the capture carries an empty lower
// half; the host is stood at the window's height before the capture.
const FULL_HEIGHT = "html, body { margin: 0; } [id^='dashboard-panel'] { height: 100vh; min-height: 0; }";
const CLIENT = new URL("../../../brain/client/", import.meta.url).pathname;
const HOST = `${CLIENT}tests/browser/host`;
const RELAY = "/relay/brain";
const NOW = Date.UTC(2026, 10, 23, 9), DAY = 24 * 3600_000;
const PACK = JSON.parse(readFileSync(`${CLIENT}i18n/locales/${packName(locale)}.json`, "utf8")) as { brain: { label: { sheet_of: string } } };

// --- The demo brain, its words in each locale ---

type Words = {
  layers: Record<"core" | "people" | "work", string>;
  alex: string;
  jamie: string;
  study: string;
  memories: Record<41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51, string>;
  recalls: Record<46 | 50, string>;
};

const WORDS: Record<Locale, Words> = {
  en: {
    layers: { core: "Read along with every turn", people: "What is known about people", work: "Ways of working and lessons" },
    alex: "BMO's owner",
    jamie: "Study group member",
    study: "Study group",
    memories: {
      41: "Alex also goes by 'Al'.",
      42: "Alex goes running at 7 every morning and prefers no notifications during that time.",
      43: "Alex drinks barley tea instead of coffee.",
      44: "Promised to remind Alex once more 30 minutes before the dentist appointment.",
      45: "Alex wants a three-line summary and a voice briefing to listen to before any long document.",
      46: "When asked to fix a bug, put it on the TODO list right away and tell the number.",
      47: "Answer formally in the study group room.",
      48: "Jamie sets the order of paper presentations in the study group.",
      49: "Send Alex the document link once the embedding model paper research is done.",
      50: "Before a deploy, check that the testbed's quick checks passed.",
      51: "The line-break bug when pasting into notes came from code that split paragraphs into lines.",
    },
    recalls: { 46: "When asked to change code", 50: "When a deploy is coming up" },
  },
  ko: {
    layers: { core: "매 턴 함께 읽는 기억", people: "사람에 대해 아는 것", work: "일하는 방식과 교훈" },
    alex: "BMO의 주인",
    jamie: "스터디 모임 멤버",
    study: "스터디 모임",
    memories: {
      41: "Alex를 '알렉스'라고도 부른다.",
      42: "Alex는 아침 7시에 달리기를 하고, 그 시간에는 알림을 보내지 않는 걸 좋아한다.",
      43: "Alex는 커피 대신 보리차를 마신다.",
      44: "치과 가기 30분 전에 Alex에게 한 번 더 알려 주기로 했다.",
      45: "Alex는 긴 문서보다 세 줄 요약과 들으면서 볼 수 있는 음성 브리핑을 먼저 원한다.",
      46: "버그를 고쳐 달라는 말을 들으면 바로 TODO로 올리고 번호를 알려 준다.",
      47: "스터디 모임 방에서는 존댓말로 답한다.",
      48: "Jamie는 스터디 모임에서 논문 발표 순서를 정한다.",
      49: "임베딩 모델 논문 리서치가 끝나면 Alex에게 문서 링크를 보낸다.",
      50: "배포 전에 테스트베드의 빠른 검사가 통과했는지 확인한다.",
      51: "노트의 붙여넣기 줄바꿈 버그는 문단을 줄 단위로 나누던 코드가 원인이었다.",
    },
    recalls: { 46: "코드 수정 요청을 받았을 때", 50: "배포를 앞두고 있을 때" },
  },
  ja: {
    layers: { core: "毎ターン一緒に読む記憶", people: "人について知っていること", work: "仕事の進め方と教訓" },
    alex: "BMOの持ち主",
    jamie: "勉強会のメンバー",
    study: "勉強会",
    memories: {
      41: "Alexは「アレックス」とも呼ばれる。",
      42: "Alexは毎朝7時にランニングをするので、その時間には通知を送らないでほしい。",
      43: "Alexはコーヒーの代わりに麦茶を飲む。",
      44: "歯医者に行く30分前に、Alexにもう一度知らせると約束した。",
      45: "Alexは長い文書より、3行の要約と聞きながら見られる音声ブリーフィングを先に求める。",
      46: "バグを直してほしいと言われたら、すぐTODOに登録して番号を伝える。",
      47: "勉強会のルームでは敬語で答える。",
      48: "Jamieは勉強会で論文発表の順番を決める。",
      49: "埋め込みモデルの論文リサーチが終わったら、Alexに文書のリンクを送る。",
      50: "デプロイの前に、テストベッドのクイックチェックが通ったか確認する。",
      51: "ノートに貼り付けると改行が崩れるバグは、段落を行ごとに分けていたコードが原因だった。",
    },
    recalls: { 46: "コードの修正を頼まれたとき", 50: "デプロイを控えているとき" },
  },
  zh: {
    layers: { core: "每一轮都会一起读的记忆", people: "关于人的了解", work: "工作方式与经验" },
    alex: "BMO 的主人",
    jamie: "学习小组成员",
    study: "学习小组",
    memories: {
      41: "Alex 也被叫作“亚历克斯”。",
      42: "Alex 每天早上 7 点跑步，希望那段时间不要收到通知。",
      43: "Alex 不喝咖啡，喝大麦茶。",
      44: "答应在 Alex 去看牙医前 30 分钟再提醒一次。",
      45: "比起长文档，Alex 更想先看到三行摘要和可以边听边看的语音简报。",
      46: "听到要修复 bug 时，立刻记入 TODO 并告知编号。",
      47: "在学习小组的房间里用正式、礼貌的语气回答。",
      48: "Jamie 负责安排学习小组的论文报告顺序。",
      49: "嵌入模型的论文调研完成后，把文档链接发给 Alex。",
      50: "部署前确认测试台的快速检查已经通过。",
      51: "笔记粘贴时换行错乱的 bug，原因是把段落按行拆分的代码。",
    },
    recalls: { 46: "收到修改代码的请求时", 50: "即将部署时" },
  },
};
const W = WORDS[locale];

const LAYERS = [
  { id: 1, name: "core", description: W.layers.core, position: 1 },
  { id: 2, name: "people", description: W.layers.people, position: 2 },
  { id: 3, name: "work", description: W.layers.work, position: 3 },
];
const SUBJECTS = [
  { id: 1, type: "person", key: "alex", name: "Alex", description: W.alex },
  { id: 2, type: "person", key: "jamie", name: "Jamie", description: W.jamie },
  { id: 3, type: "room", key: "study", name: W.study, description: "" },
];
const ALEX = { id: 1, type: "person", key: "alex" };
const JAMIE = { id: 2, type: "person", key: "jamie" };
const STUDY = { id: 3, type: "room", key: "study" };

type Demo = { id: keyof Words["memories"]; type: string; layer: number | null; subjects: (typeof ALEX)[]; days: number; importance: number; uses: number; recall?: keyof Words["recalls"] };
const ROWS: Demo[] = [
  { id: 41, type: "name", layer: 2, subjects: [ALEX], days: 120, importance: 8, uses: 210 },
  { id: 42, type: "fact", layer: 2, subjects: [ALEX], days: 40, importance: 7, uses: 38 },
  { id: 43, type: "fact", layer: 2, subjects: [ALEX], days: 33, importance: 3, uses: 4 },
  { id: 44, type: "promise", layer: 2, subjects: [ALEX], days: 0.2, importance: 8, uses: 1 },
  { id: 45, type: "fact", layer: 2, subjects: [ALEX], days: 12, importance: 9, uses: 64 },
  { id: 46, type: "situation", layer: 3, subjects: [ALEX], days: 25, importance: 8, uses: 52, recall: 46 },
  { id: 47, type: "rule", layer: 1, subjects: [STUDY], days: 60, importance: 7, uses: 91 },
  { id: 48, type: "fact", layer: 2, subjects: [JAMIE, STUDY], days: 18, importance: 5, uses: 9 },
  { id: 49, type: "followup", layer: 3, subjects: [ALEX], days: 0.1, importance: 6, uses: 0 },
  { id: 50, type: "check", layer: 3, subjects: [], days: 50, importance: 7, uses: 120, recall: 50 },
  { id: 51, type: "knowledge", layer: 3, subjects: [], days: 0.05, importance: 4, uses: 0 },
];
const OPEN = 45;

const memoryOf = (row: Demo) => ({
  id: row.id, brainId: 1, key: null, type: row.type, text: W.memories[row.id], layerId: row.layer, position: row.id, subjects: row.subjects, status: "active",
  lineageId: row.id, supersededBy: null, supersedes: [], supersededAt: null, validFrom: NOW - row.days * DAY, validTo: null,
  recallCondition: row.recall === undefined ? null : W.recalls[row.recall], releaseCondition: null, importance: row.importance, useCount: row.uses, lastUsedAt: row.uses > 0 ? NOW - 3600_000 : null,
  lastConfirmedAt: null, consolidatedAt: null, actorName: "bmo", reason: null, labels: {}, locked: false, internalOnly: false, createdAt: NOW - row.days * DAY,
});
// The sheet as the brain renders it: the person's names, then their facts from the most important down, one line each.
const SHEET = [41, 45, 42, 43]
  .map((id) => ROWS.find((row) => row.id === id)!)
  .map((row) => `- [#${row.id} ${row.type === "name" ? "name" : `since ${new Date(NOW - row.days * DAY).toISOString().slice(0, 10)}`}] ${W.memories[row.id]}`)
  .join("\n");
const unanswered: string[] = [];

function listed(query: URLSearchParams) {
  const subject = query.get("subject") ?? query.get("subjectId");
  const layer = query.get("layerId");
  const types = query.get("type")?.split(",").filter((one) => one !== "" && !one.startsWith("-"));

  return ROWS.filter((row) => (subject ? row.subjects.some((one) => String(one.id) === subject) : true))
    .filter((row) => (layer ? String(row.layer) === layer : true))
    .filter((row) => (types && types.length > 0 && !types.includes("*") ? types.includes(row.type) : true))
    .sort((a, b) => a.days - b.days);
}

async function answer(route: Route): Promise<void> {
  const url = new URL(route.request().url());
  const path = url.pathname.slice(RELAY.length);
  const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  const page = (items: unknown[]) => json({ items, more: false });
  const one = /^\/brains\/1\/memories\/(\d+)$/.exec(path);
  const lineage = /^\/brains\/1\/lineages\/(\d+)$/.exec(path);

  if (path === "/events") return route.fulfill({ contentType: "text/event-stream", body: "retry: 3600000\n\n" });
  if (path === "/brains") return page([{ id: 1, kind: "agent", accountKey: "1", agentKey: "bmo", name: "BMO", createdAt: NOW - 400 * DAY }]);
  if (path === "/brains/1/layers") return page(LAYERS.map((layer) => ({ ...layer, brainId: 1, createdAt: NOW - 300 * DAY })));
  if (path === "/brains/1/subjects") return page(SUBJECTS.map((subject) => ({ ...subject, brainId: 1, createdAt: NOW - 200 * DAY })));
  if (path === "/brains/1/subjects/1") return json({ ...SUBJECTS[0], brainId: 1, createdAt: NOW - 200 * DAY });
  if (path === "/brains/1/subjects/1/sheet") return route.fulfill({ contentType: "text/plain", body: SHEET });
  if (path === "/brains/1/types") return json([...new Set(ROWS.map((row) => row.type))].map((type) => ({ type, reserved: false, count: ROWS.filter((row) => row.type === type).length })));
  if (path === "/brains/1/tallies") {
    const by = url.searchParams.get("by");
    const rows = listed(url.searchParams);
    const groupsOf = (row: Demo): string[] =>
      by === "layer" ? [String(row.layer)] : by === "subject" ? row.subjects.map((one) => String(one.id)) : by === "status" ? ["active"] : [row.type];
    const groups = [...new Set(rows.flatMap(groupsOf))];

    return json(groups.map((group) => {
      const held = rows.filter((row) => groupsOf(row).includes(group));

      return { group, count: held.length, importance: 5, useCount: held.reduce((sum, row) => sum + row.uses, 0), lastUsedAt: NOW - 3600_000, latestValidFrom: NOW };
    }));
  }
  if (path === "/brains/1/memories") return page(listed(url.searchParams).map(memoryOf));
  if (one) return json(memoryOf(ROWS.find((row) => row.id === Number(one[1]))!));
  if (lineage) return json([memoryOf(ROWS.find((row) => row.id === Number(lineage[1]))!)]);

  unanswered.push(`${route.request().method()} ${path}`);

  return json({ code: "not-found" }, 404);
}

function freePort(): number {
  const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response() });
  const port = server.port!;

  void server.stop(true);

  return port;
}

const port = freePort();
const origin = `http://127.0.0.1:${port}`;
// The host as the brain's own browser test starts it: Bun running Nuxt's dev server in a process group of its own.
const nuxi = [process.execPath, "--bun", `${CLIENT}node_modules/.bin/nuxi`, "dev", HOST];
const host = spawn("sh", ["-c", '"$@" & read -r _; kill 0', "sh", ...nuxi, "--host", "127.0.0.1", "--port", String(port)], {
  cwd: CLIENT,
  detached: true,
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, NUXT_TELEMETRY_DISABLED: "1", NUXT_IGNORE_LOCK: "1" },
});

host.stdout?.resume();
host.stderr?.resume();

// The screen's own words in the locale and the console's `common` words it borrows, merged into the page.
const words = { ...PACK, common: await commonWords(locale) };
const browser = await chromium.launch();

try {
  for (let waited = 0; ; waited += 500) {
    if (waited > 180_000) throw new Error("the brain's host did not answer");
    if (await fetch(`${origin}/brain/1`).then((answer) => answer.ok, () => false)) break;
    await Bun.sleep(500);
  }

  for (const theme of THEMES) for (const [name, path, options] of [
    ["brain", `/brain/1?subject=1&memory=${OPEN}`, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }],
  ] as const) {
    const context = await browser.newContext({ ...options, locale: browserLocale(locale), timezoneId: "Asia/Seoul", colorScheme: theme, reducedMotion: "reduce" });

    // The colour scheme, and the locale the screen opens in, as a reader who chose them before.
    await context.addCookies([
      { name: "nuxt-color-mode", value: theme, url: origin },
      { name: "i18n_redirected", value: packName(locale), url: origin },
    ]);

    const page = await context.newPage();

    await page.route((url) => url.pathname.startsWith(`${RELAY}/`), answer);
    // The first load compiles the screen and may reload once its dependencies are bundled.
    await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 180_000 });
    await page.waitForTimeout(8000);
    // The dev server may still reload the page as it bundles more; the page is loaded again until its app answers.
    for (let tries = 1; ; tries++) {
      await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 180_000 });
      await page.waitForTimeout(5000);
      if (await page.evaluate(SWITCH_LOCALE, { selector: "#__nuxt", locale: packName(locale), words })) break;
      if (tries === 4) throw new Error("the page's vue-i18n was not found");
    }
    await page.waitForTimeout(1000);
    // The person's sheet, folded as the screen opens, is unfolded over the memories.
    await page.getByText(PACK.brain.label.sheet_of.replace("{name}", "Alex")).click();
    await page.waitForTimeout(1500);
    // The screen fills the window, as it does in the console's dashboard group, and the capture is the window.
    await page.addStyleTag({ content: FULL_HEIGHT });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}${name}.${locale}.${theme}.png` });
    console.log("saved", `${name}.${locale}.${theme}`);
    await context.close();
  }
} finally {
  await browser.close();
  host.stdin?.end();
  if (host.pid !== undefined) {
    try {
      process.kill(-host.pid, "SIGTERM");
    } catch {
      // Already gone.
    }
  }
  if (unanswered.length > 0) console.log("unanswered", [...new Set(unanswered)].join(", "));
}
