// The brain's screen on bmo-brain's own browser host (its tests/browser/host, stood up as its tests/browser/screen.test.ts
// stands it), answered with a demo brain: an agent's memories about a fictional person, the person's sheet over them
// and one memory open. The brain's screen speaks Korean alone, so it is captured in Korean only.
// Usage: `bun scripts/shots/brain-shot.ts`.
import { spawn } from "node:child_process";

import { chromium } from "playwright-core";

import { THEMES } from "./locale";

import type { Route } from "playwright-core";

const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const CLIENT = new URL("../../../brain/client/", import.meta.url).pathname;
const HOST = `${CLIENT}tests/browser/host`;
const RELAY = "/relay/brain";
const NOW = Date.UTC(2026, 10, 23, 9), DAY = 24 * 3600_000;

const LAYERS = [
  { id: 1, name: "core", description: "매 턴 함께 읽는 기억", position: 1 },
  { id: 2, name: "people", description: "사람에 대해 아는 것", position: 2 },
  { id: 3, name: "work", description: "일하는 방식과 교훈", position: 3 },
];
const SUBJECTS = [
  { id: 1, type: "person", key: "alex", name: "Alex", description: "BMO의 주인" },
  { id: 2, type: "person", key: "jamie", name: "Jamie", description: "스터디 모임 멤버" },
  { id: 3, type: "room", key: "study", name: "스터디 모임", description: "" },
];
const ALEX = { id: 1, type: "person", key: "alex" };
const JAMIE = { id: 2, type: "person", key: "jamie" };
const STUDY = { id: 3, type: "room", key: "study" };

type Demo = { id: number; type: string; text: string; layer: number | null; subjects: (typeof ALEX)[]; days: number; importance: number; uses: number; recall?: string };
const ROWS: Demo[] = [
  { id: 41, type: "name", text: "Alex를 '알렉스'라고도 부른다.", layer: 2, subjects: [ALEX], days: 120, importance: 8, uses: 210 },
  { id: 42, type: "fact", text: "Alex는 아침 7시에 달리기를 하고, 그 시간에는 알림을 보내지 않는 걸 좋아한다.", layer: 2, subjects: [ALEX], days: 40, importance: 7, uses: 38 },
  { id: 43, type: "fact", text: "Alex는 커피 대신 보리차를 마신다.", layer: 2, subjects: [ALEX], days: 33, importance: 3, uses: 4 },
  { id: 44, type: "promise", text: "치과 가기 30분 전에 Alex에게 한 번 더 알려 주기로 했다.", layer: 2, subjects: [ALEX], days: 0.2, importance: 8, uses: 1 },
  { id: 45, type: "fact", text: "Alex는 긴 문서보다 세 줄 요약과 들으면서 볼 수 있는 음성 브리핑을 먼저 원한다.", layer: 2, subjects: [ALEX], days: 12, importance: 9, uses: 64 },
  { id: 46, type: "situation", text: "버그를 고쳐 달라는 말을 들으면 바로 TODO로 올리고 번호를 알려 준다.", layer: 3, subjects: [ALEX], days: 25, importance: 8, uses: 52, recall: "코드 수정 요청을 받았을 때" },
  { id: 47, type: "rule", text: "스터디 모임 방에서는 존댓말로 답한다.", layer: 1, subjects: [STUDY], days: 60, importance: 7, uses: 91 },
  { id: 48, type: "fact", text: "Jamie는 스터디 모임에서 논문 발표 순서를 정한다.", layer: 2, subjects: [JAMIE, STUDY], days: 18, importance: 5, uses: 9 },
  { id: 49, type: "followup", text: "임베딩 모델 논문 리서치가 끝나면 Alex에게 문서 링크를 보낸다.", layer: 3, subjects: [ALEX], days: 0.1, importance: 6, uses: 0 },
  { id: 50, type: "check", text: "배포 전에 테스트베드의 빠른 검사가 통과했는지 확인한다.", layer: 3, subjects: [], days: 50, importance: 7, uses: 120, recall: "배포를 앞두고 있을 때" },
  { id: 51, type: "knowledge", text: "노트의 붙여넣기 줄바꿈 버그는 문단을 줄 단위로 나누던 코드가 원인이었다.", layer: 3, subjects: [], days: 0.05, importance: 4, uses: 0 },
];
const OPEN = 45;

const memoryOf = (row: Demo) => ({
  id: row.id, brainId: 1, key: null, type: row.type, text: row.text, layerId: row.layer, position: row.id, subjects: row.subjects, status: "active",
  lineageId: row.id, supersededBy: null, supersedes: [], supersededAt: null, validFrom: NOW - row.days * DAY, validTo: null,
  recallCondition: row.recall ?? null, releaseCondition: null, importance: row.importance, useCount: row.uses, lastUsedAt: row.uses > 0 ? NOW - 3600_000 : null,
  lastConfirmedAt: null, consolidatedAt: null, actorName: "bmo", reason: null, labels: {}, locked: false, internalOnly: false, createdAt: NOW - row.days * DAY,
});
// The sheet as the brain renders it: the person's names, then their facts, one line each.
const SHEET = [
  "- [#41 name] Alex를 '알렉스'라고도 부른다.",
  "- [#45 since 2026-11-11] Alex는 긴 문서보다 세 줄 요약과 들으면서 볼 수 있는 음성 브리핑을 먼저 원한다.",
  "- [#42 since 2026-10-14] Alex는 아침 7시에 달리기를 하고, 그 시간에는 알림을 보내지 않는 걸 좋아한다.",
  "- [#43 since 2026-10-21] Alex는 커피 대신 보리차를 마신다.",
].join("\n");
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
    const context = await browser.newContext({ ...options, locale: "ko-KR", timezoneId: "Asia/Seoul", colorScheme: theme, reducedMotion: "reduce" });

    await context.addCookies([{ name: "nuxt-color-mode", value: theme, url: origin }]);

    const page = await context.newPage();

    await page.route((url) => url.pathname.startsWith(`${RELAY}/`), answer);
    // The first load compiles the screen and may reload once its dependencies are bundled.
    await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 180_000 });
    await page.waitForTimeout(8000);
    await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 180_000 });
    await page.waitForTimeout(5000);
    // The person's sheet, folded as the screen opens, is unfolded over the memories.
    await page.getByText("인물 요약 — Alex").click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}${name}.ko.${theme}.png` });
    console.log("saved", `${name}.ko.${theme}`);
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
