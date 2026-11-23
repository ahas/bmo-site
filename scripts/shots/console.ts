// The console bmo-web stands up for its browser tests (its tests/support/browser-console.ts, address in
// BMO_CONSOLE_TEST_URL), signed in as one of its fixture accounts and answered with demo.ts in place of the stand-ins'
// rooms, TODO board and avatar, in the colour scheme given. Shared by the console's capture scripts.
import type { Browser, BrowserContext, Page } from "playwright-core";

import { DONE, DONE_EN, MESSAGES, QUEUE, QUEUE_EN, ROOM_TITLES, ROOM_TITLES_EN, TEXT_SWAPS, TEXT_SWAPS_EN } from "./demo";

import type { Locale, Theme } from "./locale";

export const ORIGIN = (() => {
  const origin = process.env.BMO_CONSOLE_TEST_URL;

  if (!origin) throw new Error("set BMO_CONSOLE_TEST_URL to the console bmo-web stands up for its browser tests");

  return origin;
})();

export const OUT = new URL("../../shots-out/", import.meta.url).pathname;

/** The session cookie of the fixture account the captures sign in with. */
export async function signedIn(): Promise<{ name: string; value: string }> {
  const login = await fetch(`${ORIGIN}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "agent-topbar", password: "fixture-password-1558" }) });
  const cookie = login.headers.get("set-cookie")!.split(";")[0]!;
  const at = cookie.indexOf("=");

  return { name: cookie.slice(0, at), value: cookie.slice(at + 1) };
}

/**
 * A context signed in at the size given, in the scheme and the language given, with the demo rooms, board and avatar
 * answered. The console speaks the browser's language where the account names none, so the language is the
 * browser's.
 */
export async function demoContext(browser: Browser, session: { name: string; value: string }, theme: Theme, width = 1440, height = 900, locale: Locale = "ko"): Promise<BrowserContext> {
  const phone = width < 600;
  const context = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: 2, isMobile: phone, hasTouch: phone, serviceWorkers: "block", reducedMotion: "reduce", colorScheme: theme,
    locale: locale === "ko" ? "ko-KR" : "en-US",
  });

  await context.addCookies([{ ...session, url: ORIGIN }, { name: "nuxt-color-mode", value: theme, url: ORIGIN }]);
  await context.route(/\/api\/rooms(\?|$)/, async (route) => {
    if (route.request().method() !== "GET") return route.continue();
    const rooms = (await (await route.fetch()).json()) as any[];
    const titles = locale === "ko" ? ROOM_TITLES : ROOM_TITLES_EN;
    const out = rooms.filter((r) => titles[String(r.chatId)]).map((r) => ({ ...r, title: titles[String(r.chatId)], unread: r.chatId === 42 ? 0 : r.unread }));
    await route.fulfill({ json: out });
  });
  await context.route(/\/api\/rooms\/42\/messages/, (route) => route.fulfill({ json: { messages: MESSAGES.slice(Number(process.env.SKIP ?? 0)), judgements: [], hasMore: false } }));
  await context.route(/\/api\/todos(\?|$)/, async (route) => {
    if (route.request().method() !== "GET") return route.continue();
    const board = (await (await route.fetch()).json()) as any;
    const [queue, done] = locale === "ko" ? [QUEUE, DONE] : [QUEUE_EN, DONE_EN];
    await route.fulfill({ json: { ...board, queue, done, doneTotal: 128, standing: { ...board.standing, queue: queue.length, running: 1 } } });
  });

  const icon = await Bun.file(new URL("../../public/icon.svg", import.meta.url)).text();

  await context.route(/\/api\/avatars(\?|$)/, async (route) => {
    const list = (await (await route.fetch()).json()) as any[];
    await route.fulfill({ json: [...list.filter((a) => !(a.kind === "person" && a.id === 501)), { kind: "person", id: 501, url: "/console/api/avatars/person/501?v=demo" }] });
  });
  await context.route(/\/api\/avatars\/person\/501/, (route) => route.fulfill({ body: icon, contentType: "image/svg+xml" }));

  return context;
}

/** The visible labels the console's stand-ins render themselves, swapped in the page for demo names in the language given. */
export async function swapTexts(page: Page, swaps: [string, string][] = [], locale: Locale = "ko"): Promise<void> {
  await page.evaluate((all) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      let t = n.nodeValue ?? "";
      for (const [a, b] of all) t = t.split(a).join(b);
      if (t !== n.nodeValue) n.nodeValue = t;
    }
    for (const el of document.querySelectorAll("[placeholder]")) {
      const p = el.getAttribute("placeholder")!;
      if (p.includes("실패")) el.setAttribute("placeholder", "BMO에게 말하기");
    }
  }, [...swaps, ...(locale === "ko" ? TEXT_SWAPS : TEXT_SWAPS_EN)]);
}
