// The calendar's week on bmo-calendar's own harness page (its tests/browser/harness.ts), answered with demo
// calendars and events in the locale given, the page's words switched to that locale.
// Usage: `bun scripts/shots/calendar-shot.ts <en|ko>`.
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

import { chromium } from "playwright-core";

import { buildHarness } from "../../../calendar/client/tests/browser/harness.ts";
import { REMOUNT_ROUTE, SWITCH_LOCALE, THEMES, commonWords, localeOf } from "./locale";

const locale = localeOf(process.argv[2]);
const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const ORIGIN = "http://page.test";
const RELAY = "/relay/calendar";
// The harness page, its root carrying the colour scheme as a console's root does: the class `dark` in the dark one.
const PAGE = (theme: string) => `<!doctype html><html lang="${locale}" class="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="/screens-harness.js" defer></script></head><body><div id="page"></div></body></html>`;
const TYPES: Record<string, string> = { ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" };
const BUNDLE_WORDS = JSON.parse(readFileSync(new URL(`../../../calendar/client/i18n/${locale}.json`, import.meta.url), "utf8")) as Record<string, unknown>;

const W = {
  en: { personal: "Personal", study: "Study", team: "Team", company: "Demo Lab", run: "Morning run", dentist: "Dentist", group: "Study group", paper: "Paper reading", groceries: "Groceries", review: "Design review", sync: "Weekly sync", planning: "Release planning", oneOnOne: "1:1", demo: "Demo day", retro: "Retro" },
  ko: { personal: "개인", study: "공부", team: "팀", company: "데모 랩", run: "아침 달리기", dentist: "치과", group: "스터디 모임", paper: "논문 읽기", groceries: "장보기", review: "디자인 리뷰", sync: "주간 회의", planning: "릴리스 계획", oneOnOne: "1:1 면담", demo: "데모 데이", retro: "회고" },
}[locale];

const cal = (realm: string, company: string | null, id: string, name: string, color: string) => ({ id, realm, company, name, color, writers: realm === "mine" ? null : "creator", tell: realm === "mine" ? null : "creator", hidden: false, creator: "1", createdAt: 1 });
let n = 0;
const ev = (realm: string, company: string | null, calendarId: string, title: string, day: string, from: string, to: string) => ({
  id: `e${++n}`, realm, company, calendarId, title, description: "", start: `${day}T${from}:00`, end: `${day}T${to}:00`, allDay: false, alarm: "none", repeat: "none",
  creator: "1", createdAt: 1, changedAt: 1, told: null, occurrence: null,
});
const D = (d: number) => `2026-11-${String(d).padStart(2, "0")}`;
const MINE = {
  calendars: [cal("mine", null, "personal", W.personal, "primary"), cal("mine", null, "study", W.study, "warning")],
  events: [
    ev("mine", null, "personal", W.run, D(23), "07:00", "08:00"),
    ev("mine", null, "personal", W.dentist, D(23), "14:00", "15:00"),
    ev("mine", null, "study", W.group, D(23), "19:30", "21:00"),
    ev("mine", null, "personal", W.run, D(25), "07:00", "08:00"),
    ev("mine", null, "study", W.paper, D(26), "20:00", "21:30"),
    ev("mine", null, "personal", W.run, D(27), "07:00", "08:00"),
    ev("mine", null, "personal", W.groceries, D(28), "11:00", "12:00"),
    ev("mine", null, "study", W.group, D(28), "15:00", "17:00"),
  ],
};
const ORG = {
  calendars: [cal("organization", "10", "team", W.team, "info")],
  events: [
    ev("organization", "10", "team", W.review, D(23), "10:00", "11:30"),
    ev("organization", "10", "team", W.sync, D(24), "09:30", "10:30"),
    ev("organization", "10", "team", W.planning, D(24), "13:00", "14:30"),
    ev("organization", "10", "team", W.oneOnOne, D(25), "11:00", "11:30"),
    ev("organization", "10", "team", W.demo, D(26), "15:00", "17:00"),
    ev("organization", "10", "team", W.retro, D(27), "16:00", "17:00"),
  ],
  resources: [],
};
const COMPANIES = [{ id: "10", name: W.company, own: true, writes: true, manages: true }];
const items = (list: unknown[]) => ({ items: list, more: false });

function answer(path: string, query: URLSearchParams): unknown {
  if (path === "/organization/companies") return items(COMPANIES);

  const [realm, kind] = path.split("/").filter(Boolean);
  const held: Record<string, any[]> = realm === "mine" ? MINE : ORG;

  if (kind === "events") return items(held.events!.filter((row) => row.start < query.get("end")! && row.end > query.get("start")!));

  return items(held[kind!] ?? []);
}

const words = { ...BUNDLE_WORDS, common: await commonWords(locale) };
const built = buildHarness();
const browser = await chromium.launch();

try {
  for (const theme of THEMES) for (const [name, options] of [
    ["calendar", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }],
    ["calendar-phone", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ] as const) {
    const context = await browser.newContext({ ...options, locale: locale === "ko" ? "ko-KR" : "en-US", timezoneId: "UTC", colorScheme: theme, reducedMotion: "reduce" });

    await context.addCookies([{ name: "nuxt-color-mode", value: theme, url: ORIGIN }]);
    const page = await context.newPage();
    const files = new Set(readdirSync(built.folder));

    await page.route((url) => url.origin === ORIGIN, async (route) => {
      const url = new URL(route.request().url());
      const path = url.pathname;

      if (path === `${RELAY}/events`) return route.fulfill({ contentType: "text/event-stream", body: "retry: 86400000\n\n" });
      if (path.startsWith(`${RELAY}/`)) {
        if (route.request().method() !== "GET") return route.fulfill({ status: 403, body: "{}" });

        return route.fulfill({ contentType: "application/json", body: JSON.stringify(answer(path.slice(RELAY.length), url.searchParams)) });
      }

      const file = path.slice(1);

      if (files.has(file)) return route.fulfill({ contentType: TYPES[extname(file)] ?? "application/octet-stream", body: readFileSync(join(built.folder, file)) });
      if (path.startsWith("/calendar")) return route.fulfill({ contentType: "text/html; charset=utf-8", body: PAGE(theme) });

      return route.fulfill({ status: 404, body: "" });
    });
    await page.goto(`${ORIGIN}/calendar/week/${D(25)}`);
    await page.locator("[data-console-frame]").waitFor();
    if (!(await page.evaluate(SWITCH_LOCALE, { selector: "#page", locale, words }))) throw new Error("the page's vue-i18n was not found");
    if (!(await page.evaluate(REMOUNT_ROUTE, { selector: "#page", away: "/calendar/bookings" }))) throw new Error("the page's router was not found");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}${name}.${locale}.${theme}.png` });
    console.log("saved", `${name}.${locale}.${theme}`);
    await context.close();
  }
} finally {
  await browser.close();
  built.remove();
}
