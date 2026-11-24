// More of the console's screens on the console bmo-web stands up for its browser tests (its
// tests/support/browser-console.ts), each in the language given and in both colour schemes: the agency's roles as its
// stand-in serves them, the GPU cards of the monitor's services tab answered with a demo cluster, and a running TODO
// item's job log answered with a demo run. The cluster's events and the worker's log are what the units write, in
// English in every language. Usage: `bun scripts/shots/console-screens-shot.ts <en|ko|ja|zh> [agents|cards|job ...]`,
// every screen where none is named.
import { chromium } from "playwright-core";

import { OUT, ORIGIN, demoContext, shown, signedIn, swapTexts } from "./console";
import { NOW, runningItemOf } from "./demo";
import { THEMES, localeOf } from "./locale";

import type { BrowserContext, Page } from "playwright-core";
import type { Locale } from "./locale";

const GiB = 1024;

// --- The GPU cards: two nodes of a demo cluster and the engines placed on their cards ---

const unit = (name: string, service: string, vramGiB: number, kind: "resident" | "on-demand" | "fill", state: "resident" | "ram" = "resident") => ({
  name, service, part: "", vramMiB: vramGiB * GiB, state, ramMiB: state === "ram" ? vramGiB * GiB : 0, since: NOW - 7200, evictable: kind !== "resident",
  reason: null, loadMs: 2400, unloadMs: 600, kind, detail: null,
});
const card = (index: number, name: string, totalGiB: number, units: ReturnType<typeof unit>[], turn: { service: string } | null = null) => {
  const used = units.filter((one) => one.state === "resident").reduce((sum, one) => sum + one.vramMiB, 0);

  return {
    index, name, totalMiB: totalGiB * GiB, usedMiB: used, freeMiB: totalGiB * GiB - used, units,
    turn: turn ? { service: turn.service, ticket: "t-1", waitedS: 2, inUse: true } : null,
    queue: [], claim: { by: null, since: null }, ram: { dumpsMiB: 0, availableMiB: 48 * GiB, maxMiB: 64 * GiB, floorMiB: 8 * GiB, dump: null },
    stage: { waiting: false, waitingS: 0 }, store: null, processes: [],
  };
};
const node = (name: string, cards: ReturnType<typeof card>[]) => ({
  name, role: "gpu", desktop: false, link: { state: "connected", since: NOW - 86400, readAt: NOW - 2, lastReadMs: 14, error: null }, version: "0.1.0",
  rules: { loadedAt: NOW - 3600, error: null }, occupants: [...new Set(cards.flatMap((one) => one.units.map((u) => u.service)))], cards,
});
const CARDS = {
  master: { version: "0.1.0", startedAt: NOW - 86400 * 3, rulesFile: "rules.toml", rulesLoadedAt: NOW - 3600, rulesError: null, readEveryS: 5 },
  groups: [{ name: "gpu", pool: true, nodes: ["gpu-node-1", "gpu-node-2"], totalMiB: 72 * GiB, freeMiB: 21 * GiB }],
  nodes: [
    node("gpu-node-1", [card(0, "NVIDIA GeForce RTX 4090", 24, [unit("chat-model", "llm", 18, "resident"), unit("embedding", "brain", 2, "resident")], { service: "llm" })]),
    node("gpu-node-2", [
      card(0, "NVIDIA GeForce RTX 3090", 24, [unit("voice", "voice", 6, "resident"), unit("vision", "eye", 9, "on-demand")], { service: "voice" }),
      card(1, "NVIDIA GeForce RTX 3090", 24, [unit("speech-to-text", "voice", 4, "on-demand"), unit("research-model", "research", 14, "fill", "ram")]),
    ]),
  ],
  declared: [],
  events: [
    { at: NOW - 40, node: "gpu-node-2", text: "vision loaded on card 0 for eye" },
    { at: NOW - 300, node: "gpu-node-2", text: "research-model moved to host memory for speech-to-text" },
    { at: NOW - 900, node: "gpu-node-1", text: "chat-model resident on card 0" },
  ],
  tiers: [
    { occupant: "llm", tier: 0, nodes: ["gpu-node-1"] },
    { occupant: "voice", tier: 1, nodes: ["gpu-node-2"] },
    { occupant: "eye", tier: 1, nodes: ["gpu-node-2"] },
    { occupant: "research", tier: 2, nodes: ["gpu-node-2"] },
  ],
  services: [
    { service: "llm", tier: 0, priority: 1, nodes: ["gpu-node-1"], cardMiB: 18 * GiB, many: false, alone: false },
    { service: "voice", tier: 1, priority: 2, nodes: ["gpu-node-2"], cardMiB: 10 * GiB, many: false, alone: false },
    { service: "eye", tier: 1, priority: 3, nodes: ["gpu-node-2"], cardMiB: 9 * GiB, many: false, alone: false },
    { service: "research", tier: 2, priority: 4, nodes: ["gpu-node-2"], cardMiB: 14 * GiB, many: false, alone: false },
  ],
};

// --- A job's run: the item a worker runs, and its log ---

const SEAT = "builder-2";
const JOB = 9284;
const [language, ...asked] = process.argv.slice(2);
const locale = localeOf(language);
const ITEM = runningItemOf(locale);
const RUN = { id: JOB, kind: "worker", agent: SEAT, chatId: null, messageId: null, startedAt: NOW - 900, unit: `job-${JOB}`, capSeconds: null, depth: null, model: null, startedBy: null, todoId: ITEM.id, progress: null, stop: { kind: "item", id: String(ITEM.id) } };
let lineId = 100;
const line = (kind: "text" | "tool" | "tool-result", text: string, ago: number, name: string | null = null, ref: string | null = null) => ({
  id: ++lineId, agent: SEAT, run: `job-${JOB}`, chatId: null, at: NOW - ago, kind, name, tool: name ? { name, icon: null } : null, parent: null, ref,
  state: kind === "tool-result" ? "succeeded" : null, truncated: false, text, patches: [], patchesMore: 0, clock: null,
});
const call = (name: string, input: Record<string, string>, result: string, ago: number) => {
  const ref = `call-${lineId + 1}`;

  return [line("tool", JSON.stringify(input), ago, name, ref), line("tool-result", result, ago - 2, name, ref)];
};
const LOG = [
  line("text", "Reading the note editor's paste handling first.", 840),
  ...call("Bash", { command: "rg -n \"onPaste\" client/app/editor", description: "Find the paste handler" }, "client/app/editor/paste.ts:12:export function onPaste(event: ClipboardEvent) {\nclient/app/editor/blocks.ts:88:  editor.on(\"paste\", onPaste);", 820),
  ...call("Read", { file_path: "client/app/editor/paste.ts" }, "12 export function onPaste(event: ClipboardEvent) {\n13   const text = event.clipboardData?.getData(\"text/plain\") ?? \"\";\n14   const paragraphs = text.split(\"\\n\");\n15   insertParagraphs(paragraphs.filter((one) => one.trim() !== \"\"));", 800),
  line("text", "The handler splits a plain-text paste into one paragraph per line and drops the empty ones, so a pasted block loses its line breaks. It should keep them inside the block.", 760),
  ...call("Edit", { file_path: "client/app/editor/paste.ts", description: "Keep a pasted block's line breaks" }, "The file client/app/editor/paste.ts has been updated.", 700),
  ...call("Bash", { command: "bun test tests/browser/paste-keeps-lines.test.ts", description: "Run the new browser test" }, "paste-keeps-lines.test.ts:\n(pass) a pasted block keeps its line breaks [1840ms]\n\n 1 pass\n 0 fail", 520),
  ...call("Bash", { command: "bmo check", description: "Run the checks the change reaches" }, "quick checks      ok\ntypecheck         ok\nlint              ok\ntouched tests     ok (14 tests)", 300),
  line("text", "Every check passes. Closing the item: the commit goes onto main and waits for the next batch deployment.", 60),
];

// --- Driving ---

async function settle(page: Page, text: string, locale: Locale): Promise<void> {
  await shown(page, text);
  await swapTexts(page, locale);
  await page.waitForTimeout(500);
}

const SCREENS: Record<string, (context: BrowserContext) => Promise<Page>> = {
  async agents(context) {
    const page = await context.newPage();

    await page.goto(`${ORIGIN}/agents?tab=roles`);
    await settle(page, "voyager", locale);

    return page;
  },
  async cards(context) {
    await context.route(/\/api\/cards\/state$/, (route) => route.fulfill({ json: CARDS }));
    await context.route(/\/api\/cards\/events/, (route) => route.fulfill({ contentType: "text/event-stream", body: "retry: 86400000\n\n" }));

    const page = await context.newPage();

    await page.goto(`${ORIGIN}/monitor?tab=services`);
    await settle(page, "gpu-node-2", locale);

    return page;
  },
  async job(context) {
    await context.route(/\/api\/status$/, async (route) => {
      const status = (await (await route.fetch()).json()) as Record<string, unknown>;
      await route.fulfill({ json: { ...status, live: [RUN] } });
    });
    await context.route(/\/api\/todos(\?|$)/, async (route) => {
      if (route.request().method() !== "GET") return route.continue();
      const board = (await (await route.fetch()).json()) as any;
      await route.fulfill({ json: { ...board, queue: [ITEM], done: [], standing: { ...board.standing, queue: 1, running: 1 } } });
    });
    await context.route(new RegExp(`/api/todos/${ITEM.id}$`), (route) => route.fulfill({ json: ITEM }));
    // The item's approval record, which the stand-in does not hold: an item approved as it was asked.
    await context.route(new RegExp(`/api/todos/${ITEM.id}/approvals$`), (route) => route.fulfill({ json: [] }));
    await context.route(new RegExp(`/api/agents/${SEAT}/log`), (route) => {
      const after = new URL(route.request().url()).searchParams.get("after");

      return route.fulfill({ json: { lines: after ? [] : LOG, hasMore: false, hasOlder: false } });
    });

    const page = await context.newPage();

    await page.goto(`${ORIGIN}/?todo=${ITEM.id}`);
    await page.locator("[data-item-state-log]").click({ timeout: 60_000 });
    await settle(page, "Every check passes.", locale);

    return page;
  },
};

const session = await signedIn();
const browser = await chromium.launch();

try {
  for (const name of asked.length > 0 ? asked : Object.keys(SCREENS)) {
    const screen = SCREENS[name];

    if (!screen) throw new Error(`no console screen named ${name}`);

    for (const theme of THEMES) {
      const context = await demoContext(browser, session, theme, locale);
      const page = await screen(context);

      await page.screenshot({ path: `${OUT}${name}.${locale}.${theme}.png` });
      console.log("saved", `${name}.${locale}.${theme}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
