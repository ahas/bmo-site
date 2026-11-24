// The console's organisation and app screens on the console bmo-web stands up for its browser tests (its
// tests/support/browser-console.ts), in the language given and in both colour schemes, each answered with a demo
// company: the organisation screen's agents tab for a team three links down the delegation chain, the company's app
// catalogue, the reader's own personal apps in the settings, and the language picker of the display settings. Usage:
// `bun scripts/shots/console-apps-shot.ts <en|ko|ja|zh> [org|catalogue|personal-apps|language ...]`, every screen where
// none is named.
import { chromium } from "playwright-core";

import { OUT, ORIGIN, demoContext, shown, signedIn, swapTexts } from "./console";
import { NOW, ROOM_TITLES } from "./demo";
import { THEMES, localeOf, packName } from "./locale";

import type { BrowserContext, Page } from "playwright-core";
import type { Locale } from "./locale";

const DAY = 86_400;

// --- The words of the demo company, in each capture language ---

type App = readonly [title: string, description: string];

interface Words {
  company: string;
  units: readonly [string, string, string, string];
  instructions: string;
  above: readonly string[];
  roles: readonly [string, string, string, string, string, string];
  repositories: readonly [string, string];
  people: readonly string[];
  review: string;
  /** What ends a sentence in the language, after an app's description in the reader's own list. */
  stop: string;
  apps: Record<"weekly" | "rates" | "rooms" | "receipts" | "trip" | "sheet" | "review" | "issues", App>;
}

const WORDS: Record<Locale, Words> = {
  ko: {
    company: "한빛 스튜디오",
    units: ["제품개발본부", "앱개발팀", "디자인팀", "경영지원팀"],
    instructions: "코드 리뷰 의견은 한국어로 쓰고, 커밋 메시지와 브랜치 이름은 영어로 씁니다.",
    above: ["고객의 개인 정보는 회사 밖의 서비스로 보내지 않습니다.", "모든 변경은 테스트를 통과한 뒤에 배포합니다."],
    roles: ["워커", "탐색", "빌더", "스카우트", "프로듀서", "보이저"],
    repositories: ["한빛 모바일 앱", "한빛 API 서버"],
    people: ["Alex", "김하늘", "박서준", "이도윤", "최지우"],
    review: "읽는 파일과 보내는 주소가 설명과 맞습니다.",
    stop: ".",
    apps: {
      weekly: ["주간 보고 정리", "한 주의 TODO와 커밋을 모아 주간 보고 초안을 씁니다"],
      rates: ["환율 알림", "아침마다 환율을 확인해 정한 값을 넘으면 알려 줍니다"],
      rooms: ["회의실 빈 시간 찾기", "사내 예약 시스템에서 오늘 비어 있는 회의실을 찾아 줍니다"],
      receipts: ["영수증 정리", "드라이브에 올린 영수증 사진을 월별 지출 표로 정리합니다"],
      trip: ["출장 일정표", "출장 메일과 캘린더를 읽어 하루 단위 일정표를 만듭니다"],
      sheet: ["지출 시트 올리기", "정리한 지출 표를 팀 스프레드시트에 올립니다"],
      review: ["코드 리뷰 체크리스트", "리뷰할 때 확인할 항목과 의견을 쓰는 방식을 에이전트에게 알려 주는 스킬"],
      issues: ["이슈 트래커", "팀 이슈 트래커의 이슈를 찾고 읽는 MCP 서버"],
    },
  },
  en: {
    company: "Northwind Studio",
    units: ["Product", "App team", "Design", "Operations"],
    instructions: "Write review comments in plain English, and keep commit messages to one line of what changed.",
    above: ["Never send a customer's personal data to a service outside the company.", "Every change ships only after its tests pass."],
    roles: ["Worker", "Seeker", "Builder", "Scout", "Producer", "Voyager"],
    repositories: ["Northwind mobile app", "Northwind API server"],
    people: ["Alex", "Sam Lee", "Priya Shah", "Jonas Berg", "Mia Chen"],
    review: "The files it reads and the addresses it calls match its description.",
    stop: ".",
    apps: {
      weekly: ["Weekly report", "Drafts the weekly report from the week's TODO items and commits"],
      rates: ["Exchange rate alert", "Checks the exchange rate each morning and tells you when it passes your mark"],
      rooms: ["Free meeting rooms", "Finds the meeting rooms still free today in the office booking system"],
      receipts: ["Receipt sorter", "Sorts receipt photos from your drive into a monthly expense table"],
      trip: ["Trip planner", "Reads trip mails and your calendar into a day-by-day schedule"],
      sheet: ["Expense sheet upload", "Uploads the sorted expense table to the team's spreadsheet"],
      review: ["Code review checklist", "A skill telling an agent what to check in a review and how to write its comments"],
      issues: ["Issue tracker", "An MCP server that finds and reads issues in the team's tracker"],
    },
  },
  ja: {
    company: "こもれびスタジオ",
    units: ["製品開発本部", "アプリ開発チーム", "デザインチーム", "管理部"],
    instructions: "コードレビューのコメントは日本語で書き、コミットメッセージとブランチ名は英語で書きます。",
    above: ["お客様の個人情報は社外のサービスに送りません。", "すべての変更はテストに通ってからデプロイします。"],
    roles: ["ワーカー", "シーカー", "ビルダー", "スカウト", "プロデューサー", "ボイジャー"],
    repositories: ["こもれびモバイルアプリ", "こもれび API サーバー"],
    people: ["Alex", "佐藤 葵", "鈴木 蓮", "高橋 陽菜", "田中 湊"],
    review: "読むファイルと送信先のアドレスが説明と一致しています。",
    stop: "。",
    apps: {
      weekly: ["週報まとめ", "1週間の TODO とコミットを集めて週報の下書きを書きます"],
      rates: ["為替アラート", "毎朝為替レートを確認し、決めた値を超えたら知らせます"],
      rooms: ["空き会議室検索", "社内の予約システムから今日空いている会議室を探します"],
      receipts: ["レシート整理", "ドライブに上げたレシートの写真を月ごとの支出表にまとめます"],
      trip: ["出張スケジュール", "出張のメールとカレンダーを読んで1日ごとの日程表を作ります"],
      sheet: ["支出シートのアップロード", "まとめた支出表をチームのスプレッドシートに上げます"],
      review: ["コードレビューのチェックリスト", "レビューで確認する項目とコメントの書き方をエージェントに伝えるスキル"],
      issues: ["課題トラッカー", "チームの課題トラッカーの課題を探して読む MCP サーバー"],
    },
  },
  zh: {
    company: "青禾工作室",
    units: ["产品研发中心", "应用开发组", "设计组", "行政支持组"],
    instructions: "代码评审意见用中文写，提交信息和分支名用英文写。",
    above: ["客户的个人信息不发送到公司以外的服务。", "所有改动都要在测试通过后再部署。"],
    roles: ["工作器", "探索者", "构建者", "侦察员", "制作人", "远航者"],
    repositories: ["青禾移动应用", "青禾 API 服务器"],
    people: ["Alex", "王雨桐", "李浩然", "张思远", "陈可欣"],
    review: "读取的文件和访问的地址与说明一致。",
    stop: "。",
    apps: {
      weekly: ["周报整理", "汇总一周的 TODO 和提交，写出周报草稿"],
      rates: ["汇率提醒", "每天早上查看汇率，超过设定值时提醒你"],
      rooms: ["查找空闲会议室", "从公司预订系统中找出今天还空着的会议室"],
      receipts: ["收据整理", "把上传到云盘的收据照片整理成每月支出表"],
      trip: ["出差日程表", "读取出差邮件和日历，生成按天排列的日程表"],
      sheet: ["上传支出表", "把整理好的支出表上传到团队的电子表格"],
      review: ["代码评审清单", "告诉智能体评审时要检查什么、如何写意见的技能"],
      issues: ["问题跟踪器", "查找并读取团队问题跟踪器中问题的 MCP 服务器"],
    },
  },
};

// --- The organisation: a company, units under it and a team under the first ---

const TEAM = 4;
const chain = <Value>(own: Value | null, stands: Value, delegation: "allow" | "lock" | "inherit" = "inherit") => ({ own, stands, delegation, writable: true, lockedBy: null });

async function answerOrganization(context: BrowserContext, words: Words): Promise<void> {
  const company = { id: 1, name: words.company };
  const row = (id: number, name: string, parent: number | null, members: number) => ({
    id, name, ...(parent === null ? {} : { parent }), heads: [], members: Array.from({ length: members }, (_, index) => String(index + 1)), left: [], concurrent: [], acting: [],
  });
  const units = [row(1, company.name, null, 42), row(3, words.units[0], 1, 18), row(TEAM, words.units[1], 3, 7), row(5, words.units[2], 1, 6), row(6, words.units[3], 1, 5)];
  const team = {
    id: TEAM, name: words.units[1], parent: 3, company, path: [company, { id: 3, name: words.units[0] }, { id: TEAM, name: words.units[1] }], children: [], heads: ["1"],
    members: ["1", "2", "3", "4", "5", "6", "7"], left: [], roles: [], concurrent: [], acting: null,
  };
  const settings = {
    unit: TEAM,
    instructions: { own: words.instructions, above: words.above, delegation: "allow", writable: true, lockedBy: null },
    persona: chain(null, "own"),
    repositories: chain(true, true, "allow"),
  };
  const supply = {
    unit: TEAM,
    sources: [
      { source: "personal", stands: true, closedHere: false, delegation: "inherit", writable: true, lockedBy: null },
      { source: "organisation", stands: true, closedHere: false, delegation: "allow", writable: true, lockedBy: null },
      { source: "platform", stands: false, closedHere: true, delegation: "lock", writable: true, lockedBy: null },
    ],
    companyOpened: null,
    items: [{ id: "team-key-1", road: "claude-code", secret: "team-claude-account", enabled: true, refused: false }],
  };
  const keys = ["worker", "seeker", "builder", "scout", "producer", "voyager"];
  const road = { provider: "claude-code", model: "claude-sonnet-4-5", effort: null };
  const ownOf = (role: string, index: number) => (index >= 4 ? { off: true } : role === "worker" ? { agents: 2, roads: [road, null] } : role === "builder" ? { agents: 1, roads: [null] } : null);
  const composition = {
    unit: TEAM,
    roles: keys.map((role, index) => ({ role, label: words.roles[index], line: "claude", off: index >= 4, agents: role === "worker" ? 2 : role === "builder" ? 1 : null, own: ownOf(role, index) })),
    providers: [{ name: "claude-code", label: "Claude Code", lines: ["claude"] }],
    delegation: "allow", writable: true, lockedBy: null, locker: null,
  };
  // Who under the team may personalise their BMO: the team follows above, and its people each their own word.
  const permissions = {
    units: [{ id: TEAM, name: words.units[1], parent: 3, setting: "inherit", allowed: true }],
    people: words.people.slice(1).map((name, index) => ({ user: String(index + 2), name, unit: TEAM, setting: index === 2 ? "deny" : "inherit", allowed: index !== 2 })),
  };
  const repositories = [
    { name: "team-app", label: words.repositories[0], path: "~/repos/team-app" },
    { name: "team-api", label: words.repositories[1], path: "~/repos/team-api" },
  ];
  const listed = units.map((unit) => ({ id: unit.id, name: unit.name, parent: unit.parent ?? null, company, policy: true, plan: true, head: true }));

  await context.route(/\/api\/organization\/people\/companies$/, (route) => route.fulfill({ json: [company] }));
  await context.route(/\/api\/organization\/units(\?|$)/, (route) => (route.request().method() === "GET" ? route.fulfill({ json: units }) : route.continue()));
  await context.route(/\/api\/(supply|invites)\/units$/, (route) => route.fulfill({ json: listed }));
  await context.route(/\/api\/organization\/memory\/units$/, (route) => route.fulfill({ json: listed }));
  await context.route(/\/api\/organization\/units\/\d+$/, (route) => route.fulfill({ json: team }));
  await context.route(/\/api\/organization\/units\/\d+\/agent-settings$/, (route) => route.fulfill({ json: settings }));
  await context.route(/\/api\/organization\/units\/\d+\/supply/, (route) => route.fulfill({ json: supply }));
  await context.route(/\/api\/organization\/units\/\d+\/composition$/, (route) => route.fulfill({ json: composition }));
  await context.route(/\/api\/organization\/units\/\d+\/repositories$/, (route) => route.fulfill({ json: repositories }));
  await context.route(/\/api\/organization\/units\/\d+\/agent-permissions$/, (route) => route.fulfill({ json: permissions }));
}

// --- The company's app catalogue: personal apps its people shared ---

function catalogueOf(words: Words, language: string) {
  const review = { state: "written", report: words.review, at: NOW - 3 * DAY };
  const may = { install: true, update: false, uninstall: false, clone: true, withdraw: false, approve: false, promote: false, recall: [], turnOn: [], translate: false, text: false };
  const app = (id: string, [title, description]: readonly [string, string], maker: string, installs: number, over: Record<string, unknown> = {}) => {
    const permissions = (over.permissions as { network: string[]; secrets: string[] } | undefined) ?? { network: [], secrets: [] };

    return {
      id, key: `shared-1-${id}`, kind: "app", name: id.replace(/-/g, "_"), title, description, language, titles: { [language]: title }, descriptions: { [language]: description }, machine: [], server: null,
      maker, owner: maker, targets: [{ company: true }], version: "1.0.0",
      versions: [{ version: "1.0.0", sharedAt: NOW - 5 * DAY, sourceHash: "demo", permissions, review }], permissions, review,
      approval: { required: false, approved: true }, installs, withdrawn: null, promotion: null, installed: null, updateWaiting: false, permissionsGrown: false, may,
      ...over,
    };
  };

  return {
    company: words.company,
    ceiling: ["team", "heads", "company"],
    apps: [
      app("weekly-report", words.apps.weekly, "2", 23, { installed: { version: "1.0.0", how: "unit" } }),
      app("exchange-alert", words.apps.rates, "3", 8, { permissions: { network: ["rates.example.com"], secrets: [] }, updateWaiting: true, installed: { version: "0.9.0", how: "self" } }),
      app("meeting-rooms", words.apps.rooms, "4", 0, { permissions: { network: ["rooms.example.com"], secrets: ["ROOMS_TOKEN"] }, approval: { required: true, approved: false } }),
      app("receipt-table", words.apps.receipts, "1", 12, { installed: { version: "1.0.0", how: "self" } }),
      app("trip-plan", words.apps.trip, "5", 5),
      app("review-checklist", words.apps.review, "2", 17, { kind: "skill", installed: { version: "1.0.0", how: "self" } }),
      app("issue-tracker", words.apps.issues, "3", 9, {
        kind: "mcp", permissions: { network: ["issues.example.com"], secrets: ["ISSUES_TOKEN"] },
        server: { transport: "remote", url: "https://issues.example.com/mcp", auth: "bearer", header: null, secret: "ISSUES_TOKEN" },
      }),
    ],
    notices: [{ kind: "shared", app: "trip-plan", at: NOW - 3600 }],
    seenAt: NOW - 2 * DAY,
    reach: { network: true, secrets: true, held: ["ROOMS_TOKEN", "ISSUES_TOKEN"] },
    people: Object.fromEntries(words.people.map((name, index) => [String(index + 1), name])),
    units: { [String(TEAM)]: words.units[1] },
  };
}

// --- The reader's own personal apps, made by their BMO on their PC ---

function personalAppsOf(words: Words) {
  const app = (name: string, [title, description]: readonly [string, string], version: string, ago: number, permissions: { network: string[]; secrets: string[] }, kept: string[]) => ({
    name, kind: "app", version, putAt: (NOW - ago) * 1000, entries: [{ name: `my/${name}`, title, description: `${description}${words.stop}` }], permissions, kept,
  });

  return {
    items: [
      app("receipt_table", words.apps.receipts, "1.2.0", 2 * DAY, { network: [], secrets: [] }, ["1.1.0", "1.0.0"]),
      app("exchange_alert", words.apps.rates, "0.9.0", 6 * DAY, { network: ["rates.example.com"], secrets: [] }, ["0.8.0"]),
      app("expense_sheet", words.apps.sheet, "0.3.1", 9 * DAY, { network: ["sheets.example.com"], secrets: ["SHEETS_TOKEN"] }, []),
    ],
    reached: true,
    reach: { network: true, secrets: true, held: ["SHEETS_TOKEN"] },
  };
}

// --- Driving ---

async function settle(page: Page, text: string, locale: Locale): Promise<void> {
  await shown(page, text);
  await swapTexts(page, locale);
  await page.waitForTimeout(500);
}

const SCREENS: Record<string, (context: BrowserContext, locale: Locale) => Promise<Page>> = {
  async org(context, locale) {
    await answerOrganization(context, WORDS[locale]);

    const page = await context.newPage();

    await page.goto(`${ORIGIN}/organization?company=1&unit=${TEAM}&tab=agents`);
    await settle(page, WORDS[locale].instructions, locale);

    return page;
  },
  async catalogue(context, locale) {
    await context.route(/\/api\/account\/app-catalogue$/, (route) => route.fulfill({ json: catalogueOf(WORDS[locale], packName(locale)) }));

    const page = await context.newPage();

    await page.goto(`${ORIGIN}/app-catalogue`);
    await settle(page, WORDS[locale].apps.weekly[0], locale);

    return page;
  },
  async "personal-apps"(context, locale) {
    await context.route(/\/api\/account\/personal-apps$/, (route) => route.fulfill({ json: personalAppsOf(WORDS[locale]) }));

    const page = await context.newPage();

    await page.goto(`${ORIGIN}/?settings=personal-apps`);
    await settle(page, WORDS[locale].apps.receipts[0], locale);

    return page;
  },
  async language(context, locale) {
    const page = await context.newPage();

    await page.goto(`${ORIGIN}/?settings=theme`);
    await shown(page, ROOM_TITLES[locale]["43"]!, 6000);
    await page.locator("[data-language-choice]").first().click();
    await settle(page, "English", locale);

    return page;
  },
};

const [language, ...asked] = process.argv.slice(2);
const locale = localeOf(language);
const session = await signedIn();
const browser = await chromium.launch();

try {
  for (const name of asked.length > 0 ? asked : Object.keys(SCREENS)) {
    const screen = SCREENS[name];

    if (!screen) throw new Error(`no console screen named ${name}`);

    for (const theme of THEMES) {
      const context = await demoContext(browser, session, theme, locale);
      const page = await screen(context, locale);

      await page.screenshot({ path: `${OUT}${name}.${locale}.${theme}.png` });
      console.log("saved", `${name}.${locale}.${theme}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
