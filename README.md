**English** | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

# bmo-site

The BMO project's website, served at https://bmo.ahas.io: one landing page in English at `/`, Korean at `/ko/`,
Japanese at `/ja/` and Simplified Chinese at `/zh/`, with the product's story, the console's screens, the desktop app's downloads and the list of public
repositories. It is a static site built with [Astro](https://astro.build); nothing runs on a server and the pages
ship no framework to the browser, only one small inline script that points the download button at the visitor's
system.

## Build and preview

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

The build reads the desktop app's current release from `https://ai.example.org/bmo/jake/desktop/release.json` (jake's
`docs/desktop.md`, "The read the console uses") and writes its version and installers into the download section.
Where that address cannot be reached, or with `BMO_SITE_OFFLINE=1`, the section links to the release documentation
instead. Deploying is copying `dist/` to the host that serves the domain.

## Checks

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test` serves the built `dist/` as a static host does and opens all four pages in Chromium at 1440, 1024
and 390 pixels wide: every key section stands with its heading, every picture loads, carries alternative text and
is a capture in the page's own capture language, the language menu reaches every version, nothing reaches past the window's right edge, and an unknown address
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

Every picture on a page is captured in that page's language: Korean captures on `/ko/`, English captures on `/`,
`/ja/` and `/zh/`, since the platform's screens speak English and Korean. A source's file name ends in its
language, `<name>-en.webp` or `<name>-ko.webp`, and `src/lib/shots.ts` names which picture each language shows.
The console's own room speaks Korean alone, so it is shown on `/ko/` only.

The screenshots show demo data only. They are taken from the browser-test harnesses of the units whose screens
they show, with demo answers in place of the harnesses' own:

- `scripts/shots/console-shot.ts`: the console room and its TODO panel, against the console `bmo-web` stands up
  for its browser tests (`client/tests/support/browser-console.ts`, address in `BMO_CONSOLE_TEST_URL`).
- `scripts/shots/calendar-shot.ts <en|ko>`: the calendar's week, on `bmo-calendar`'s harness page.
- `scripts/shots/artifact-shot.ts <en|ko>`: an archive document, on `bmo-artifact`'s browser host.
- `scripts/shots/note-shot.ts`: a note in both languages, on `bmo-note`'s browser stack.
- `scripts/shots/webp.ts`: turns the captures in `shots-out/` into the sources under `src/assets/shots/`.

They expect the units checked out beside this one, as the `bmo` folder places them. Every new image is checked by
eye for personal data before it is committed.

## License

MIT; see `LICENSE`.
