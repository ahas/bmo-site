// A note open in the notes screen on bmo-note's own browser stack (its tests/browser/stack.ts: a throwaway note
// service and the bundle's dev host), with the same demo notes, folders and bookmarks in each language, each
// language's written as a reader of its own and read in that language.
// Usage: `bun scripts/shots/note-shot.ts [en|ko|ja|zh ...]`, every language where none is named.
import { chromium } from "playwright-core";

import { seeded } from "../../../note/client/tests/browser/fixture.ts";
import { stoodUp } from "../../../note/client/tests/browser/stack.ts";

import { LOCALES, THEMES, browserLocale, localeOf, packName } from "./locale";

import type { Locale, Theme } from "./locale";

import type { FixtureNote } from "../../../note/client/tests/browser/fixture.ts";
import type { Browser, Page } from "playwright-core";

const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const WAIT_MS = 300_000;

/** One language's demo: the notes' titles and lines, and the folders' names. The note open in the shot is the first. */
interface Demo {
  launch: [string, string];
  weekly: [string, string];
  reading: [string, string];
  trip: [string, string];
  idea: [string, string];
  folders: { projects: string; appLaunch: string; personal: string };
}

const DEMOS: Record<Locale, Demo> = {
  en: {
    launch: ["Mobile app launch checklist", "Submit the store review and check the push notification copy\nPrepare the help center article and the release notes\nName who watches the dashboards on launch day\nPlan a rollback if the crash rate climbs"],
    weekly: ["Weekly sync · third week of November", "Present: planning, engineering, design\nDecided: the app ships in the first week of December\nBefore the next sync, share the first draft of the marketing budget"],
    reading: ["Reading list: onboarding for new teammates", "What a new teammate reads in the first week\nThe development setup guide and the code review principles"],
    trip: ["Conference trip: schedule and hotel", "Morning train at 7, two nights near the venue\nPartner meeting on the second day at 2 pm"],
    idea: ["Ideas", "Show the most recently opened notes first in search"],
    folders: { projects: "Projects", appLaunch: "Mobile app launch", personal: "Personal" },
  },
  ko: {
    launch: ["모바일 앱 출시 체크리스트", "스토어 심사 제출, 푸시 알림 문구 검토\n고객센터 안내문과 릴리스 노트 준비\n출시 당일 대시보드를 지켜볼 담당자 지정\n크래시 비율이 오르면 롤백할 계획 세우기"],
    weekly: ["주간 회의록 · 11월 셋째 주", "참석: 기획팀, 개발팀, 디자인팀\n결정 사항: 모바일 앱 출시 일정을 12월 첫째 주로 확정\n다음 회의 전까지 마케팅 예산안 초안을 공유하기로 함"],
    reading: ["읽을거리: 팀 온보딩 자료 정리", "신규 입사자가 첫 주에 읽어야 할 문서 목록\n개발 환경 설정 가이드와 코드 리뷰 원칙"],
    trip: ["학회 출장 일정과 숙소 정리", "오전 7시 기차로 출발, 행사장 근처 숙소 2박\n거래처 미팅은 둘째 날 오후 2시"],
    idea: ["아이디어 메모", "검색 결과에 최근 연 노트를 먼저 보여 주면 좋겠다"],
    folders: { projects: "프로젝트", appLaunch: "모바일 앱 출시", personal: "개인" },
  },
  ja: {
    launch: ["モバイルアプリのリリースチェックリスト", "ストア審査を申請し、プッシュ通知の文言を確認する\nヘルプセンターの記事とリリースノートを用意する\nリリース当日にダッシュボードを見守る担当者を決める\nクラッシュ率が上がったときのロールバック手順を決めておく"],
    weekly: ["週次ミーティング · 11月第3週", "出席: 企画、開発、デザイン\n決定事項: アプリは12月第1週にリリース\n次回のミーティングまでにマーケティング予算の初稿を共有する"],
    reading: ["読書リスト: 新メンバーのオンボーディング", "新メンバーが最初の週に読む資料\n開発環境のセットアップガイドとコードレビューの原則"],
    trip: ["カンファレンス出張: 日程とホテル", "朝7時の電車で出発、会場の近くに2泊\n2日目の14時からパートナーと打ち合わせ"],
    idea: ["アイデア", "検索結果で最近開いたノートを先に表示する"],
    folders: { projects: "プロジェクト", appLaunch: "モバイルアプリのリリース", personal: "プライベート" },
  },
  zh: {
    launch: ["移动应用上线检查清单", "提交应用商店审核，检查推送通知文案\n准备帮助中心文章和版本说明\n指定上线当天盯看板的负责人\n制定崩溃率上升时的回滚方案"],
    weekly: ["周会纪要 · 11月第三周", "参会：产品、研发、设计\n决定：应用于12月第一周上线\n下次周会前分享市场预算初稿"],
    reading: ["阅读清单：新同事入职资料", "新同事第一周要读的文档\n开发环境配置指南和代码评审原则"],
    trip: ["会议出差：行程与酒店", "早上7点坐火车出发，在会场附近住两晚\n第二天下午2点与合作伙伴开会"],
    idea: ["想法", "在搜索结果中优先显示最近打开过的笔记"],
    folders: { projects: "项目", appLaunch: "移动应用上线", personal: "个人" },
  },
};

// The reader each language's notes are written and read as, so the languages' notes stand apart in the one service.
const READERS: Record<Locale, string> = { en: "1", ko: "3", ja: "4", zh: "5" };

/** One language's notes, each with an id of its language: the one open in the shot first, the one pinned second. */
function notesOf(locale: Locale): FixtureNote[] {
  const demo = DEMOS[locale];
  const note = (name: string, icon: string, [title, text]: [string, string]): FixtureNote => ({ id: `${locale}-${name}`, icon, title, text });

  return [
    note("launch", "\u{1f680}", demo.launch),
    note("weekly", "\u{1f4dd}", demo.weekly),
    note("reading", "\u{1f4da}", demo.reading),
    note("trip", "\u2708\ufe0f", demo.trip),
    note("idea", "", demo.idea),
  ];
}

// The folders each language's notes stand in, the notes each holds by id, and the notes bookmarked.
interface Folders {
  folders: { id: string; name: string; parent: string | null; notes: string[] }[];
  bookmarked: string[];
}

function foldersOf(locale: Locale): Folders {
  const { folders } = DEMOS[locale];
  const id = (name: string) => `${locale}-${name}`;

  return {
    folders: [
      { id: id("projects"), name: folders.projects, parent: null, notes: [] },
      { id: id("app-launch"), name: folders.appLaunch, parent: id("projects"), notes: [id("launch"), id("weekly")] },
      { id: id("personal"), name: folders.personal, parent: null, notes: [id("trip")] },
    ],
    bookmarked: [id("launch"), id("reading")],
  };
}

const asked = process.argv.slice(2).map(localeOf);
const locales: readonly Locale[] = asked.length > 0 ? asked : LOCALES;

/** Makes the folders through the relay, moves their notes into them and bookmarks the notes named. */
async function placed(page: Page, folders: Folders): Promise<void> {
  await page.evaluate(async (folders) => {
    const call = async (method: string, path: string, body: unknown): Promise<void> => {
      const answer = await fetch(`/proxy/note${path}`, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

      if (!answer.ok) throw new Error(`${method} ${path}: ${answer.status} ${await answer.text()}`);
    };

    for (const folder of folders.folders) {
      await call("POST", "/folders", { id: folder.id, name: folder.name, ...(folder.parent === null ? {} : { parent: folder.parent }) });
      for (const note of folder.notes) await call("PUT", `/notes/${note}/folder`, { folder: folder.id });
    }
    for (const note of folders.bookmarked) await call("POST", "/bookmarks", { kind: "note", noteId: note });
  }, folders);
}

async function opened(browser: Browser, host: string, locale: Locale, path: string, theme: Theme = "dark"): Promise<Page> {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
    locale: browserLocale(locale),
    reducedMotion: "reduce",
  });

  context.setDefaultTimeout(WAIT_MS);
  await context.addCookies([
    { name: "nuxt-color-mode", value: theme, url: host },
    { name: "bmo-dev-locale", value: packName(locale), url: host },
    { name: "bmo-dev-reader", value: READERS[locale], url: host },
  ]);

  const page = await context.newPage();

  await page.goto(`${host}${path}`);
  await page.locator("[data-note-bar]").first().waitFor();

  return page;
}

/**
 * Waits until the open note's editor shows its title and the list holds the folders, reloading
 * where the dev host's first builds of the editor's sources left the screen broken; then opens the folders the open
 * note stands in.
 */
async function standing(page: Page, locale: Locale, title: string): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await page.locator(".ProseMirror", { hasText: title }).first().waitFor({ state: "visible", timeout: 30_000 });
      await page.locator("[data-folder]").first().waitFor({ state: "visible", timeout: 30_000 });
      await page.waitForTimeout(2_000);
      if ((await page.getByText("TypeError").count()) > 0) throw new Error("the screen failed");
      for (const id of [`${locale}-projects`, `${locale}-app-launch`]) {
        const row = page.locator(`[data-folder="${id}"] button[aria-expanded="false"]`).first();

        if ((await row.count()) > 0) await row.click();
        await page.waitForTimeout(800);
      }
      // The pointer is taken off the list, so no row's hover title stands over the shot.
      await page.mouse.move(1200, 850);
      await page.waitForTimeout(800);

      return;
    } catch {
      await page.reload();
    }
  }

  throw new Error("the notes screen never stood whole");
}

const stack = await stoodUp();
const browser = await chromium.launch();

try {
  // The dev host builds the editor's sources on the first asks, reloading the page as it does.
  for (let pass = 0; pass < 2; pass += 1) {
    const page = await opened(browser, stack.host, "en", "/note");

    await page.locator("[data-navigator-list]").waitFor();
    await page.waitForTimeout(3_000);
    await page.context().close();
  }

  for (const locale of locales) {
    const notes = notesOf(locale);
    const page = await opened(browser, stack.host, locale, "/note");

    await page.locator("[data-navigator-list]").waitFor();
    await seeded(page, [...notes].reverse());
    await page.evaluate(async (id) => {
      await fetch(`/proxy/note/notes/${id}/pin`, { method: "PUT" });
    }, notes[1]!.id);
    await placed(page, foldersOf(locale));
    await page.context().close();

    for (const theme of THEMES) {
      const shot = await opened(browser, stack.host, locale, `/note/${notes[0]!.id}`, theme);

      await standing(shot, locale, notes[0]!.title);
      await shot.evaluate(() => document.fonts.ready);
      await shot.waitForTimeout(4_000);
      // The dev host's own banner names the host in English and is no part of the screen; it is taken away.
      await shot.evaluate(() => {
        const banner = Array.from(document.querySelectorAll("body *")).find((element) => {
          const box = element.getBoundingClientRect();

          return box.top < 2 && box.height < 60 && box.width > 300 && (element.textContent ?? "").includes("dev host");
        }) as HTMLElement | undefined;

        if (banner) banner.style.display = "none";
      });
      await shot.waitForTimeout(500);
      await shot.screenshot({ path: `${OUT}note.${locale}.${theme}.png` });
      console.log("saved", `note.${locale}.${theme}`);
      await shot.context().close();
    }
  }
} finally {
  await browser.close();
  await stack.down();
}
