// The theater's library on bmo-theater's own browser host (its tests/browser/host, generated and served as its
// tests/browser/screens.test.ts does), answered with a demo library in the locale given: fictional shows, films and
// clips whose posters are drawn here as abstract art, the viewer part way through some of them. Both colour schemes.
// Usage: `bun scripts/shots/theater-shot.ts <en|ko>`.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "playwright-core";
import sharp from "sharp";

import { progressOf } from "../../../theater/client/tests/browser/fixtures.ts";
import { SWITCH_LOCALE, THEMES, commonWords, localeOf } from "./locale";

import type { Episode, Playlist, Position, Title, TitleKind } from "../../../theater/client/shared/types";
import type { Route } from "playwright-core";

const locale = localeOf(process.argv[2]);
const OUT = new URL("../../shots-out/", import.meta.url).pathname;
const CLIENT = new URL("../../../theater/client/", import.meta.url).pathname;
const HOST = join(CLIENT, "tests/browser/host");
const CACHE = join(CLIENT, "node_modules/.cache/theater-host");
const GENERATED = join(CACHE, ".output/public");
const MINUTE = 60_000, DAY = 24 * 60 * MINUTE;
const NOW = Date.now();

// --- The demo library ---

const NAMES = {
  en: { lighthouse: "The Lighthouse Keeper", aurora: "Northern Lights", ocean: "Ocean Diaries", kitchen: "Kitchen Lab", city: "City Walks", desert: "Desert Roads", garden: "The Night Garden", tide: "Tide Pools", weekend: "Weekend", episode: "Episode", part: "Part" },
  ko: { lighthouse: "등대지기", aurora: "북극광", ocean: "바다 일기", kitchen: "키친 랩", city: "도시 산책", desert: "사막의 길", garden: "밤의 정원", tide: "조수 웅덩이", weekend: "주말", episode: "에피소드", part: "파트" },
}[locale];
// Each title's poster: two colours of a gradient and a shape drawn over it.
const ART: Record<number, [string, string, "sun" | "waves" | "hills" | "rings" | "stars"]> = {
  1: ["#0f2027", "#2c5364", "sun"],
  2: ["#141e30", "#1d976c", "stars"],
  3: ["#00467f", "#a5cc82", "waves"],
  4: ["#cb356b", "#bd3f32", "rings"],
  5: ["#3a6073", "#16222a", "hills"],
  6: ["#e65c00", "#f9d423", "hills"],
  7: ["#232526", "#5b247a", "stars"],
  8: ["#1a2980", "#26d0ce", "waves"],
};

function posterSvg(id: number): string {
  const [from, to, shape] = ART[id]!;
  const shapes = {
    sun: `<circle cx="470" cy="150" r="70" fill="#ffd27a" opacity="0.85"/><rect x="300" y="120" width="26" height="200" fill="#f4f1ea" opacity="0.9"/><polygon points="290,120 336,120 313,90" fill="#e8553e"/>`,
    stars: Array.from({ length: 40 }, (_, at) => `<circle cx="${(at * 97) % 640}" cy="${(at * 53) % 220}" r="${1 + (at % 3)}" fill="#fff" opacity="0.8"/>`).join("") + `<path d="M0 200 Q160 120 320 190 T640 170" stroke="#7CFFCB" stroke-width="28" fill="none" opacity="0.45"/>`,
    waves: [0, 1, 2, 3].map((at) => `<path d="M0 ${200 + at * 40} Q80 ${170 + at * 40} 160 ${200 + at * 40} T320 ${200 + at * 40} T480 ${200 + at * 40} T640 ${200 + at * 40}" stroke="#ffffff" stroke-width="6" fill="none" opacity="${0.5 - at * 0.1}"/>`).join(""),
    rings: [60, 100, 140].map((r) => `<circle cx="320" cy="180" r="${r}" stroke="#fff4e0" stroke-width="10" fill="none" opacity="0.5"/>`).join(""),
    hills: `<path d="M0 300 Q160 180 320 260 T640 220 V360 H0Z" fill="#000" opacity="0.25"/><path d="M0 330 Q200 250 400 300 T640 290 V360 H0Z" fill="#000" opacity="0.35"/><circle cx="520" cy="110" r="40" fill="#fff6d5" opacity="0.8"/>`,
  }[shape];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/>${shapes}</svg>`;
}

const POSTERS = new Map<number, Buffer>();

for (const id of Object.keys(ART).map(Number)) POSTERS.set(id, await sharp(Buffer.from(posterSvg(id))).jpeg({ quality: 88 }).toBuffer());

const title = (id: number, name: string, kind: TitleKind, daysAgo: number, count: number): Title => ({
  id, realm: "mine", name, kind, description: "", labels: {}, libraryId: kind === "clip" ? null : 1, episodeCount: count, hasPoster: true, posterWidth: 640,
  posterHeight: 360, creator: "viewer", createdAt: NOW - daysAgo * DAY, changedAt: NOW - daysAgo * DAY, addedAt: NOW - daysAgo * DAY,
});
let next = 5001;
const episodes: Episode[] = [];
const episode = (titleId: number, season: number | null, number: number | null, name: string, minutes: number, daysAgo: number): Episode => {
  const one: Episode = {
    id: next++, titleId, realm: "mine", kind: season === null && number === null ? "clip" : "episode", season, number, name, label: "", fileName: `${name}.mp4`,
    mediaType: "video/mp4", byteCount: minutes * 9_000_000, durationMs: minutes * MINUTE, width: 1920, height: 1080, videoCodec: "h264", audioCodec: "aac",
    available: true, hasPoster: true, posterWidth: 640, posterHeight: 360, subtitleCount: 1, burnedFrom: null, position: null, granted: false, creator: "viewer",
    createdAt: NOW - daysAgo * DAY, changedAt: NOW - daysAgo * DAY,
  } as Episode;

  episodes.push(one);

  return one;
};
const TITLES: Title[] = [
  title(1, NAMES.lighthouse, "film", 30, 1),
  title(2, NAMES.aurora, "show", 12, 8),
  title(3, NAMES.ocean, "show", 6, 6),
  title(4, NAMES.kitchen, "show", 3, 10),
  title(5, NAMES.city, "clip", 1, 1),
  title(6, NAMES.desert, "film", 45, 1),
  title(7, NAMES.garden, "film", 20, 1),
  title(8, NAMES.tide, "clip", 2, 1),
];

episode(1, null, null, NAMES.lighthouse, 104, 30);
for (let number = 1; number <= 8; number++) episode(2, 1, number, `${NAMES.episode} ${number}`, 48, 12);
for (let number = 1; number <= 6; number++) episode(3, 1, number, `${NAMES.part} ${number}`, 32, 6);
for (let number = 1; number <= 10; number++) episode(4, 1, number, `${NAMES.episode} ${number}`, 22, 3);
episode(5, null, null, NAMES.city, 14, 1);
episode(6, null, null, NAMES.desert, 118, 45);
episode(7, null, null, NAMES.garden, 96, 20);
episode(8, null, null, NAMES.tide, 9, 2);

const positions = new Map<number, Position>();
const put = (one: Episode, seconds: number, done: boolean, ago: number) => positions.set(one.id, { episodeId: one.id, seconds, done, updatedAt: NOW - ago, setAside: false });
const of = (titleId: number, number: number | null = null) => episodes.find((one) => one.titleId === titleId && one.number === number)!;

for (let number = 1; number <= 3; number++) put(of(2, number), 2880, true, (5 - number) * DAY);
put(of(2, 4), 1300, false, 20 * MINUTE);
put(of(1), 3900, false, 2 * DAY);
put(of(3, 1), 1920, true, 3 * DAY);
put(of(5), 300, false, 5 * 60 * MINUTE);
for (const one of episodes) one.position = positions.get(one.id) ?? null;

const PLAYLISTS: Playlist[] = [
  { id: 1, realm: "mine", name: NAMES.weekend, episodeIds: [of(1).id, of(7).id, of(8).id], durationMs: (104 + 96 + 9) * MINUTE, creator: "viewer", createdAt: NOW - 3 * DAY, changedAt: NOW - 3 * DAY },
];

// --- The relay, answered as screens.test.ts answers it ---

async function answer(route: Route): Promise<void> {
  const url = new URL(route.request().url());
  const path = url.pathname.slice("/relay/theater".length);
  const method = route.request().method();
  const mine = url.searchParams.get("realm") !== "organization";
  const parts = path.split("/").filter(Boolean);
  const id = Number(parts[1]);
  const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  const page = <T>(items: T[]) => ({ items: mine ? items : [], more: false });
  const lastWatched = (titleId: number) => Math.max(0, ...episodes.filter((one) => one.titleId === titleId && positions.has(one.id)).map((one) => positions.get(one.id)!.updatedAt));

  if (path === "/events") return route.fulfill({ status: 200, contentType: "text/event-stream", body: ": open\n\n" });
  if (path === "/titles") {
    const order = url.searchParams.get("order") ?? "id";
    const sorted = [...TITLES].sort((a, b) => (order === "watched" ? lastWatched(b.id) - lastWatched(a.id) : order === "added" ? b.addedAt - a.addedAt : order === "name" ? a.name.localeCompare(b.name) : a.id - b.id));

    return json(page(sorted));
  }
  if (path === "/playlists") return json(page(PLAYLISTS));
  if (path === "/watching") return json(page(episodes.filter((one) => positions.get(one.id)?.seconds && !positions.get(one.id)!.done).sort((a, b) => positions.get(b.id)!.updatedAt - positions.get(a.id)!.updatedAt)));
  if (path === "/next-up") {
    const offered = TITLES.filter((one) => one.kind === "show").flatMap((show) => {
      const progress = progressOf(show.kind, episodes.filter((one) => one.titleId === show.id), positions);
      const upNext = episodes.find((one) => one.id === progress.upNext);

      return upNext && !positions.has(upNext.id) ? [upNext] : [];
    });

    return json(page(offered));
  }
  if (parts[2] === "poster") {
    const titleId = parts[0] === "titles" ? id : episodes.find((one) => one.id === id)?.titleId;

    return route.fulfill({ status: 200, contentType: "image/jpeg", body: POSTERS.get(titleId ?? 1)! });
  }
  if (parts[0] === "titles" && parts.length === 2) return json(TITLES.find((one) => one.id === id));
  if (parts[0] === "titles" && parts[2] === "episodes") return json(page(episodes.filter((one) => one.titleId === id)));
  if (parts[0] === "titles" && parts[2] === "progress") {
    const found = TITLES.find((one) => one.id === id)!;

    return json(progressOf(found.kind, episodes.filter((one) => one.titleId === id), positions));
  }
  if (parts[0] === "playlists" && parts[2] === "progress") {
    const playlist = PLAYLISTS.find((one) => one.id === id)!;

    return json(progressOf("clip", playlist.episodeIds.map((episodeId) => episodes.find((one) => one.id === episodeId)!), positions));
  }
  if (parts[0] === "playlists" && parts.length === 2) return json(PLAYLISTS.find((one) => one.id === id));
  if (method !== "GET") return route.fulfill({ status: 204 });

  return json({ code: "no-route", error: "No route." }, 404);
}

// --- The host, generated with no `common` words of its own, and served from its files; the locale's are merged in the
// page ---

mkdirSync(CACHE, { recursive: true });
writeFileSync(join(CACHE, "common.json"), "{}");

const generated = Bun.spawnSync(["bun", "--bun", "x", "nuxi", "generate", HOST], { cwd: CLIENT, env: { ...process.env, NUXT_TELEMETRY_DISABLED: "1" } });

if (generated.exitCode !== 0) throw new Error(`the host's generation failed: ${generated.stderr.toString()}`);
// Nuxt links its generated files into the host's folder as dist; the link alone goes.
rmSync(join(HOST, "dist"), { force: true });

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(request) {
    const file = Bun.file(join(GENERATED, decodeURIComponent(new URL(request.url).pathname)));

    return new Response((await file.exists()) ? file : Bun.file(join(GENERATED, "200.html")));
  },
});
const origin = server.url.origin;
const words = { common: await commonWords(locale) };
const browser = await chromium.launch();

try {
  for (const theme of THEMES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: locale === "ko" ? "ko-KR" : "en-US", colorScheme: theme, reducedMotion: "reduce" });

    await context.addCookies([{ name: "nuxt-color-mode", value: theme, url: origin }]);
    await context.route("**/relay/theater/**", answer);

    const page = await context.newPage();

    await page.goto(`${origin}/theater`, { waitUntil: "load" });
    await page.locator("[data-card-row]").first().waitFor({ timeout: 60_000 });
    // The words are merged with the locale moved away and back, so the screens already drawn read them again.
    if (!(await page.evaluate(SWITCH_LOCALE, { selector: "#__nuxt", locale: locale === "ko" ? "en" : "ko", words: {} }))) throw new Error("the page's vue-i18n was not found");
    await page.evaluate(SWITCH_LOCALE, { selector: "#__nuxt", locale, words });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}theater.${locale}.${theme}.png` });
    console.log("saved", `theater.${locale}.${theme}`);
    await context.close();
  }
} finally {
  await browser.close();
  await server.stop(true);
}
