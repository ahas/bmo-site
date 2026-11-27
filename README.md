**English** | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

# bmo-site

The BMO project's website, served at https://bmo.ahas.io: one landing page in English at `/`, Korean at `/ko/`,
Japanese at `/ja/` and Simplified Chinese at `/zh/`, with the product's story, the console's screens, how BMO compares with the kinds of tool it is weighed against, the
what the release adds, the two desktop apps' downloads and the list of public repositories. The pages stand dark, and light where the reader's
system asks for light. It is a static site built with [Astro](https://astro.build); nothing runs on a server and the pages
ship no framework and no script to the browser.

## Build and preview

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

The download section offers the two desktop apps, the Remote Controller, which opens a BMO server the person already runs, and the All-in-One, which installs and runs BMO itself on their PC. Both are read at build time from the `release.json` of jake's latest GitHub release, the address `src/lib/release.ts` names: the Remote Controller's files under `files`, the All-in-One's under `allInOne.files`, and the builds ahead of the release, where one is published, under `preview`, the newest alpha, beta or release candidate, and `nightly`, the newest nightly, each listed under the release's files with its own version. The Remote Controller asks for the person's own BMO server's address on its first run, so the same installers serve every deployment. Until a release is published the address answers 404, and the section says no release is available yet and links to the release documentation. The testbed deploys the site (「Deploying」 below).

The what's-new section states in plain words what the release adds, each item backed by the public repositories, with the new screens beside it; its words stand in `src/i18n/` under `whatsNew`.

The get-started section hands a person the one line they give their coding agent, which installs BMO by the index's runbook, never by hand, and says where else the agent installs it: a machine without systemd, under the testbed's supervisor, and the All-in-One desktop app. `/install.md` serves that runbook, the index's `INSTALL.md`, read at build time from the index's main branch, the address `src/lib/runbook.ts` names; where the build is offline or the index cannot be read, it serves a short pointer to the runbook instead. The section's words in each language stand in `src/i18n/start.ts`.

## Checks

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run check` leaves out the capture scripts under `scripts/shots/`, which import the browser harnesses of the
units checked out beside this one (「Screenshots」) and so type-check only in that workspace. A test holds every file
the check does read to imports inside this repository.

`bun run test` serves the built `dist/` as a static host does and opens all four pages in Chromium at 1440, 1024
and 390 pixels wide, in the dark colour scheme and the light one: every key section stands with its heading, every
picture loads, carries alternative text and is a capture in the page's own capture language and colour scheme, the
comparison holds a row for every capability with every mark and footnote, the language menu reaches every version, nothing reaches past the window's right edge, and an unknown address
answers with the not-found page. It needs the Chromium build `playwright-core` pins, and skips where it is missing.

## Deploying

The testbed deploys the site by `testbed.toml`, like every other unit, so a commit on main goes live with its
repository's batch deployment. The gate runs `bun run check`, builds `dist/` and runs the tests against it, and the testbed's
setup builds `dist/` as well in every fresh tree the suite runs in, so the nightly suite finds it; the build
step then builds the commit into the release, and the release's `dist/` is copied whole onto the host that serves the
domain with `rsync -a --delete`, before the deploy tree is flipped. Which host and which folder stand in the
machine's settings, one rsync destination in `env/publish-target` under the site's data root, never in this
repository. Once the release is live, `scripts/deploy/served.ts` holds the home page the site's address serves to
the release's own `dist/index.html`. The deployment record, `deployed.json` under the deploy root, names the commit
the host serves.

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
| `scripts/deploy/` | The deployment's check that the site's address serves the release's build |
| `testbed.toml` | How the testbed checks, tests, builds and deploys the site |
| `tests/` | The browser test of the built pages |

## Screenshots

Every place a page shows a picture shows the same screen in every language, captured in that page's language and in
both colour schemes: the dark capture where the page stands dark, the light one where it stands light, as the
reader's system decides (`prefers-color-scheme`, which the stylesheet follows as well). A source's file name ends in
its language and its scheme, `<screen>-<en|ko|ja|zh>-<dark|light>.webp`; `src/lib/slots.ts` names the one screen
each place shows, a guidebook chapter names its own in its front matter, and `src/components/Shot.astro` offers both
schemes of one. A test holds every slot and chapter to a capture in every language and scheme; a language with no
capture of a screen yet is captured, never shown another screen in its place.

Every screen is captured at one size: a desktop screen at 1440 by 900 CSS pixels and a phone at 390 by 844,
both at twice the pixels; a test holds every source to it.

The screenshots show demo data only. They are taken from the browser-test harnesses of the units whose screens
they show, with demo answers in place of the harnesses' own, each in the language given (`en`, `ko`, `ja` or `zh`)
and in both schemes:

- `scripts/shots/console-shot.ts <language> <name> <path> [width] [height]`: the console room and its TODO panel,
  against the console `bmo-web` stands up for its browser tests (`client/tests/support/browser-console.ts`, address
  in `BMO_CONSOLE_TEST_URL`); `room /rooms/42` and, with `SKIP=3`, `room-phone /rooms/42 390 844`.
- `scripts/shots/console-screens-shot.ts <language> [agents|cards|job]`: on the same console, the agency's roles,
  the GPU cards of the monitor's services tab and a running TODO item's job log.
- `scripts/shots/console-apps-shot.ts <language> [org|catalogue|personal-apps|language]`: on the same console, with
  a demo company, the organisation screen's agents tab for a team, the app catalogue, the reader's personal apps and
  the language menu of the display settings.
- `scripts/shots/brain-shot.ts <language>`: a person's memories and sheet on `bmo-brain`'s browser host.
- `scripts/shots/calendar-shot.ts <language>`: the calendar's week and a phone's days, on `bmo-calendar`'s harness
  page.
- `scripts/shots/artifact-shot.ts <language>`: an archive document, on `bmo-artifact`'s browser host.
- `scripts/shots/note-shot.ts [language ...]`: a note, its notes filed in folders and bookmarked, on `bmo-note`'s
  browser stack, in every language where none is named.
- `scripts/shots/drive-shot.ts <language>`: the Files screen, on `bmo-drive`'s browser host.
- `scripts/shots/theater-shot.ts <language>`: the theater's library, on `bmo-theater`'s generated browser host, with
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
