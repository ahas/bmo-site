// Calendar screen on the calendar repo's own harness page, answered with demo data.
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";
import { buildHarness } from "../../../calendar/client/tests/browser/harness.ts";

const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const ORIGIN = "http://page.test";
const RELAY = "/relay/calendar";
const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="/screens-harness.js" defer></script></head><body><div id="page"></div></body></html>`;
const TYPES: Record<string, string> = { ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" };

const cal = (realm: string, company: string | null, id: string, name: string, color: string) => ({ id, realm, company, name, color, writers: realm === "mine" ? null : "creator", tell: realm === "mine" ? null : "creator", hidden: false, creator: "1", createdAt: 1 });
let n = 0;
const ev = (realm: string, company: string | null, calendarId: string, title: string, day: string, from: string, to: string) => ({
  id: `e${++n}`, realm, company, calendarId, title, description: "", start: `${day}T${from}:00`, end: `${day}T${to}:00`, allDay: false, alarm: "none", repeat: "none",
  creator: "1", createdAt: 1, changedAt: 1, told: null, occurrence: null
});
const D = (d: number) => `2026-11-${String(d).padStart(2, "0")}`;
const MINE = {
  calendars: [cal("mine", null, "personal", "Personal", "primary"), cal("mine", null, "study", "Study", "warning")],
  events: [
    ev("mine", null, "personal", "Morning run", D(23), "07:00", "08:00"),
    ev("mine", null, "personal", "Dentist", D(23), "14:00", "15:00"),
    ev("mine", null, "study", "Study group", D(23), "19:30", "21:00"),
    ev("mine", null, "personal", "Morning run", D(25), "07:00", "08:00"),
    ev("mine", null, "study", "Paper reading", D(26), "20:00", "21:30"),
    ev("mine", null, "personal", "Morning run", D(27), "07:00", "08:00"),
    ev("mine", null, "personal", "Groceries", D(28), "11:00", "12:00"),
    ev("mine", null, "study", "Study group", D(28), "15:00", "17:00"),
  ]
};
const ORG = {
  calendars: [cal("organization", "10", "team", "Team", "info")],
  events: [
    ev("organization", "10", "team", "Design review", D(23), "10:00", "11:30"),
    ev("organization", "10", "team", "Weekly sync", D(24), "09:30", "10:30"),
    ev("organization", "10", "team", "Release planning", D(24), "13:00", "14:30"),
    ev("organization", "10", "team", "1:1", D(25), "11:00", "11:30"),
    ev("organization", "10", "team", "Demo day", D(26), "15:00", "17:00"),
    ev("organization", "10", "team", "Retro", D(27), "16:00", "17:00"),
  ],
  resources: []
};
const COMPANIES = [{ id: "10", name: "Demo Lab", own: true, writes: true, manages: true }];
const items = (list: unknown[]) => ({ items: list, more: false });
function answer(path: string, q: URLSearchParams) {
  if (path === "/organization/companies") return items(COMPANIES);
  const [realm, kind] = path.split("/").filter(Boolean);
  const held: any = realm === "mine" ? MINE : ORG;
  if (kind === "events") return items(held.events.filter((r: any) => r.start < q.get("end")! && r.end > q.get("start")!));
  return items(held[kind!] ?? []);
}

const built = buildHarness();
const browser = await chromium.launch();
for (const [name, ctx] of [
  ["calendar", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }],
  ["calendar-phone", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
] as const) {
  const context = await browser.newContext({ ...ctx, colorScheme: "dark", reducedMotion: "reduce" });
  await context.addInitScript(() => { const m = () => document.documentElement.classList.add("dark"); m(); document.addEventListener("DOMContentLoaded", m); });
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
    if (path.startsWith("/calendar")) return route.fulfill({ contentType: "text/html; charset=utf-8", body: PAGE });
    return route.fulfill({ status: 404, body: "" });
  });
  await page.goto(`${ORIGIN}/calendar/week/${D(25)}`);
  await page.locator("[data-console-frame]").waitFor();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log("saved", name);
  await context.close();
}
await browser.close();
built.remove();
