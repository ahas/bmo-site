// The Files screen on bmo-drive's own browser host (its tests/support/screen.ts), answered with a demo drive in the
// locale given, the page's words switched to that locale. Usage: `bun scripts/shots/drive-shot.ts <en|ko>`.
import { readFileSync } from "node:fs";

import { standScreen } from "../../../drive/client/tests/support/screen.ts";
import type { Route } from "playwright-core";

import { REMOUNT_ROUTE, SWITCH_LOCALE, THEMES, commonWords, localeOf } from "./locale";

const locale = localeOf(process.argv[2]);
const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const BUNDLE_WORDS = JSON.parse(readFileSync(new URL(`../../../drive/client/i18n/${locale}.json`, import.meta.url), "utf8")) as Record<string, unknown>;
const NOW = Date.UTC(2026, 10, 23, 9);
const HOUR = 3600_000, DAY = 24 * HOUR, MB = 1024 * 1024;

const W = {
  en: { drive: "My drive", projects: "Projects", design: "Design", photos: "Photos", research: "Research", release: "Release notes 0.4.md", deck: "Demo day deck.pdf", budget: "Q4 budget.xlsx", logo: "Logo draft.png", video: "Product tour.mp4", contract: "Partner agreement.docx", voice: "Morning briefing.mp3", minutes: "Kickoff minutes.md", sketch: "Wireframes.fig", data: "Survey results.csv", archive: "Assets backup.zip" },
  ko: { drive: "내 드라이브", projects: "프로젝트", design: "디자인", photos: "사진", research: "리서치", release: "릴리스 노트 0.4.md", deck: "데모 데이 발표.pdf", budget: "4분기 예산.xlsx", logo: "로고 초안.png", video: "제품 소개 영상.mp4", contract: "파트너 계약서.docx", voice: "아침 브리핑.mp3", minutes: "킥오프 회의록.md", sketch: "와이어프레임.fig", data: "설문 결과.csv", archive: "에셋 백업.zip" },
}[locale];

type Kind = "folder" | "file";
const entry = (place: string, folder: string, name: string, kind: Kind, bytes: number | null, ago: number) => ({
  name, kind, path: folder === "" ? name : `${folder}/${name}`, placeName: place, byteCount: bytes, changedAt: NOW - ago, linkTarget: null,
});
const place = (name: string, kind: string, label: string, mount: string | null, nodeName: string | null, freeBytes: number | null) => ({
  name, kind, label, driveKey: null, freeBytes, mount, nodeName, reason: null, reasonCode: null,
});

const PLACES = [
  place("drive", "drive", W.drive, null, null, 412 * 1024 * MB),
  place("garage", "store", "Garage", null, null, null),
  place("node:gpu-node-1:/data", "node", "gpu-node-1 · /data", "/data", "gpu-node-1", null),
  place("node:gpu-node-2:/models", "node", "gpu-node-2 · /models", "/models", "gpu-node-2", null),
];
const FOLDER = W.projects;
const LISTINGS: Record<string, ReturnType<typeof entry>[]> = {
  "": [entry("drive", "", W.projects, "folder", null, 2 * HOUR), entry("drive", "", W.photos, "folder", null, 3 * DAY), entry("drive", "", W.research, "folder", null, 5 * DAY)],
  [FOLDER]: [
    entry("drive", FOLDER, W.design, "folder", null, 4 * HOUR),
    entry("drive", FOLDER, W.research, "folder", null, 2 * DAY),
    entry("drive", FOLDER, W.release, "file", 18_400, 40 * 60_000),
    entry("drive", FOLDER, W.deck, "file", 8.4 * MB, 3 * HOUR),
    entry("drive", FOLDER, W.budget, "file", 96_000, 26 * HOUR),
    entry("drive", FOLDER, W.logo, "file", 1.2 * MB, 2 * DAY),
    entry("drive", FOLDER, W.video, "file", 182 * MB, 3 * DAY),
    entry("drive", FOLDER, W.contract, "file", 240_000, 6 * DAY),
    entry("drive", FOLDER, W.voice, "file", 3.1 * MB, 7 * DAY),
    entry("drive", FOLDER, W.minutes, "file", 9_800, 8 * DAY),
    entry("drive", FOLDER, W.sketch, "file", 14 * MB, 9 * DAY),
    entry("drive", FOLDER, W.data, "file", 420_000, 11 * DAY),
    entry("drive", FOLDER, W.archive, "file", 640 * MB, 14 * DAY),
  ],
};
const NOTES = {
  en: "# Release 0.4\n\n## Calendar\n- Holidays in the week view\n\n## Drive\n- Share links with an end date\n\n## Notes\n- Paste keeps line breaks\n\n## Voice\n- Briefing speed control\n",
  ko: "# 릴리스 0.4\n\n## 캘린더\n- 주간 보기에 공휴일 표시\n\n## 드라이브\n- 만료일이 있는 공유 링크\n\n## 노트\n- 붙여넣어도 줄바꿈 유지\n\n## 음성\n- 브리핑 재생 속도 조절\n",
}[locale];
const OWNER = { administrator: false, ownerKey: "owner-a", quotaBytes: null, usedBytes: 38 * 1024 * MB };
const unanswered: string[] = [];

async function answer(route: Route): Promise<void> {
  const request = route.request();

  if (!["fetch", "xhr", "eventsource"].includes(request.resourceType())) return route.continue();

  const url = new URL(request.url());
  const path = url.pathname.slice("/drive".length);
  const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  const parts = path.split("/").filter((part) => part !== "").map(decodeURIComponent);

  if (path === "/events") return route.fulfill({ contentType: "text/event-stream", body: "retry: 86400000\n\n" });
  if (path === "/owner") return json(OWNER);
  if (path === "/places") return json({ items: PLACES, more: false });
  if (path === "/shared" || path === "/shares" || path === "/member-shares") return json({ items: [], more: false });
  if (parts[0] === "places" && parts[2] === "entries" && parts.length === 5 && parts[4] === "content") return route.fulfill({ contentType: "text/markdown", body: NOTES });
  if (parts[0] === "places" && parts[2] === "entries" && parts.length === 3) {
    const items = parts[1] === "drive" ? (LISTINGS[url.searchParams.get("path") ?? ""] ?? []) : [];

    return json({ items, more: false, totalCount: items.length });
  }

  unanswered.push(`${request.method()} ${path}`);

  return json({ code: "not-found", error: "Not in the demo." }, 404);
}

const words = { ...BUNDLE_WORDS, common: await commonWords(locale) };
const screen = await standScreen();

try {
  for (const theme of THEMES) for (const [name, options] of [
    ["drive", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }],
  ] as const) {
    const context = await screen.browser.newContext({ ...options, locale: locale === "ko" ? "ko-KR" : "en-US", timezoneId: "UTC", colorScheme: theme, reducedMotion: "reduce" });

    await context.addCookies([{ name: "nuxt-color-mode", value: theme, url: screen.origin }]);
    await context.route((url) => url.pathname.startsWith("/drive/"), answer);

    const page = await context.newPage();

    await page.goto(`${screen.origin}/files?place=drive&path=${encodeURIComponent(FOLDER)}`, { waitUntil: "load", timeout: 180_000 });
    await page.locator(`[data-entry="${W.release}"]`).first().waitFor({ timeout: 120_000 });
    if (!(await page.evaluate(SWITCH_LOCALE, { selector: "#__nuxt", locale, words }))) throw new Error("the page's vue-i18n was not found");
    if (!(await page.evaluate(REMOUNT_ROUTE, { selector: "#__nuxt", away: "/files?place=garage" }))) throw new Error("the page's router was not found");
    await page.locator(`[data-entry="${W.release}"]`).first().waitFor();
    await page.locator(`[data-entry="${W.release}"]`).first().click();
    await page.waitForTimeout(3000);
    // The panes end below the longest list; the window under them is cut away.
    await page.screenshot({ path: `${OUT}${name}.${locale}.${theme}.png`, clip: { x: 0, y: 0, width: 1280, height: 690 } });
    console.log("saved", `${name}.${locale}.${theme}`);
    await context.close();
  }
} finally {
  await screen.close();
  if (unanswered.length > 0) console.log("unanswered", [...new Set(unanswered)].join(", "));
}
