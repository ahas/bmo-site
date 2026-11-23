// The console room on the console bmo-web stands up for its browser tests (its tests/support/browser-console.ts),
// with the rooms, messages, TODO board and avatar answered from demo.ts and the server-rendered test names swapped for
// demo names in the page. Usage: `bun scripts/shots/console-shot.ts <name> <path> [width] [height]`, SKIP=<n> drops the
// first n messages.
import { chromium } from "playwright-core";
import { DONE, MESSAGES, QUEUE, ROOM_TITLES, TEXT_SWAPS } from "./demo";

const origin = process.env.BMO_CONSOLE_TEST_URL;
if (!origin) throw new Error("set BMO_CONSOLE_TEST_URL to the console bmo-web stands up for its browser tests");
const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const [shotName, path, w, h] = process.argv.slice(2);
const login = await fetch(`${origin}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "agent-topbar", password: "fixture-password-1558" }) });
const cookie = login.headers.get("set-cookie")!.split(";")[0]!;
const browser = await chromium.launch();
const width = Number(w ?? 1440), height = Number(h ?? 900);
const phone = width < 600;
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: phone, hasTouch: phone, serviceWorkers: "block", reducedMotion: "reduce", colorScheme: "dark" });
const at = cookie.indexOf("=");
await context.addCookies([{ name: cookie.slice(0, at), value: cookie.slice(at + 1), url: origin }]);

await context.route(/\/api\/rooms(\?|$)/, async (route) => {
  if (route.request().method() !== "GET") return route.continue();
  const rooms = (await (await route.fetch()).json()) as any[];
  const out = rooms.filter((r) => ROOM_TITLES[String(r.chatId)]).map((r) => ({ ...r, title: ROOM_TITLES[String(r.chatId)], unread: r.chatId === 42 ? 0 : r.unread }));
  await route.fulfill({ json: out });
});
await context.route(/\/api\/rooms\/42\/messages/, (route) => route.fulfill({ json: { messages: MESSAGES.slice(Number(process.env.SKIP ?? 0)), judgements: [], hasMore: false } }));
await context.route(/\/api\/todos\?/, async (route) => {
  const board = (await (await route.fetch()).json()) as any;
  await route.fulfill({ json: { ...board, queue: QUEUE, done: DONE, doneTotal: 128, standing: { ...board.standing, queue: QUEUE.length, running: 1 } } });
});

const ICON = await Bun.file(new URL("../../public/icon.svg", import.meta.url)).text();
await context.route(/\/api\/avatars(\?|$)/, async (route) => {
  const list = (await (await route.fetch()).json()) as any[];
  await route.fulfill({ json: [...list.filter((a) => !(a.kind === "person" && a.id === 501)), { kind: "person", id: 501, url: "/console/api/avatars/person/501?v=demo" }] });
});
await context.route(/\/api\/avatars\/person\/501/, (route) => route.fulfill({ body: ICON, contentType: "image/svg+xml" }));
const page = await context.newPage();
await page.goto(`${origin}${path}`);
await page.waitForTimeout(12000);
await page.evaluate((swaps) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    let t = n.nodeValue ?? "";
    for (const [a, b] of swaps) t = t.split(a).join(b);
    if (t !== n.nodeValue) n.nodeValue = t;
  }
  for (const el of document.querySelectorAll("[placeholder]")) {
    const p = el.getAttribute("placeholder")!;
    if (p.includes("실패")) el.setAttribute("placeholder", "BMO에게 말하기");
  }
}, TEXT_SWAPS);
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}${shotName}.png` });
console.log("saved", `${OUT}${shotName}.png`);
await browser.close();
