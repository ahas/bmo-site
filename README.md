**English** | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

# bmo-site

The BMO project's website, served at https://bmo.ahas.io: one landing page in English at `/`, Korean at `/ko/`,
Japanese at `/ja/` and Simplified Chinese at `/zh/`, with the product's story, the console's screens, how BMO compares with the kinds of tool it is weighed against, the
desktop app's downloads and the list of public repositories. The pages stand dark, and light where the reader's
system asks for light. It is a static site built with [Astro](https://astro.build); nothing runs on a server and the pages
ship no framework to the browser, only one small inline script that points the download button at the visitor's
system.

## Build and preview

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

The download section lists the desktop app's public release, read at build time from the `release.json` of jake's latest GitHub release, the address `src/lib/release.ts` names. The public build asks for the person's own BMO server's address on its first run and opens that server's console, so the same installers serve every deployment. Until that release is published the address answers 404, and the section says no public build is published and links to the release documentation. Deploying is copying `dist/` to the host that serves the domain.

## Checks

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test` serves the built `dist/` as a static host does and opens all four pages in Chromium at 1440, 1024
and 390 pixels wide, in the dark colour scheme and the light one: every key section stands with its heading, every
picture loads, carries alternative text and is a capture in the page's own capture language and colour scheme, the
comparison holds a row for every capability with every mark and footnote, the language menu reaches every version, nothing reaches past the window's right edge, and an unknown address
answers with the not-found page. It needs the Chromium build `playwright-core` pins, and skips where it is missing.

## Layout

| Path | Holds |
|---|---|
| `src/pages/` | The English page, the Korean page under `ko/`, the not-found page and the sitemap |
| `src/components/Home.astro` | Every section of the landing page, in the words of one language |
| `src/layouts/Layout.astro` | The document head, the navigation and the footer |
| `src/i18n/` | The words of the site, `en.ts`, `ko.ts`, `ja.ts` and `zh.ts` in one shape |
| `src/lib/` | The addresses, the release read and the list of public repositories |
| `src/assets/shots/` | The screenshots the pages show, as WebP sources the build turns into AVIF and WebP sizes |
| `src/styles/global.css` | The one stylesheet |
| `scripts/shots/` | The capture scripts the screenshots were taken with |
| `tests/` | The browser test of the built pages |

## Screenshots

Every picture on a page is captured in that page's language and in both colour schemes: Korean captures on `/ko/`,
English captures on `/`, `/ja/` and `/zh/`, since the platform's screens speak English and Korean, and the dark
capture where the page stands dark, the light one where it stands light, as the reader's system decides
(`prefers-color-scheme`, which the stylesheet follows as well). A source's file name ends in its language and its
scheme, `<name>-<en|ko>-<dark|light>.webp`; `src/lib/shots.ts` names which pictures each language shows and
`src/components/Shot.astro` offers both schemes of one. The console's own screens, and the brain's, speak Korean
alone, so they are shown on `/ko/` only.

Every screen is captured at one size: a desktop screen at 1440 by 900 CSS pixels and a phone at 390 by 844,
both at twice the pixels; a test holds every source to it.

The screenshots show demo data only. They are taken from the browser-test harnesses of the units whose screens
they show, with demo answers in place of the harnesses' own, each in both schemes:

- `scripts/shots/console-shot.ts <name> <path> [width] [height]`: the console room and its TODO panel, against the
  console `bmo-web` stands up for its browser tests (`client/tests/support/browser-console.ts`, address in
  `BMO_CONSOLE_TEST_URL`); `room /rooms/42` and, with `SKIP=2`, `room-phone /rooms/42 390 844`.
- `scripts/shots/console-screens-shot.ts [agents|cards|job]`: on the same console, the agency's roles, the GPU cards
  of the monitor's services tab and a running TODO item's job log.
- `scripts/shots/brain-shot.ts`: a person's memories and sheet on `bmo-brain`'s browser host.
- `scripts/shots/calendar-shot.ts <en|ko>`: the calendar's week, on `bmo-calendar`'s harness page.
- `scripts/shots/artifact-shot.ts <en|ko>`: an archive document, on `bmo-artifact`'s browser host.
- `scripts/shots/note-shot.ts`: a note in both languages, on `bmo-note`'s browser stack.
- `scripts/shots/drive-shot.ts <en|ko>`: the Files screen, on `bmo-drive`'s browser host.
- `scripts/shots/theater-shot.ts <en|ko>`: the theater's library, on `bmo-theater`'s generated browser host, with
  posters drawn as abstract art.
- `scripts/shots/webp.ts`: turns the captures in `shots-out/` into the sources under `src/assets/shots/`.

They expect the units checked out beside this one, as the `bmo` folder places them. Every new image is checked by
eye for personal data before it is committed.

## The comparison

The section "What sets BMO apart" sets BMO beside five kinds of tool, each judged by two named examples.
`src/lib/comparison.ts` holds the marks and, beside each row, the official page every mark of another tool rests
on; a mark says only what those pages describe, and the page says so. The words of the rows, the kinds and the
footnotes are in `src/i18n/`, under `compare`.

## License

MIT; see `LICENSE`.
