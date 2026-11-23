# Conventions of bmo-site

- **A static site.** Astro builds every page into `dist/`; no server code, no client framework. Script in the page
  stays inline, small and optional: the page reads fully without it.
- **Four languages, one shape.** Every word a page shows lives in `src/i18n/` (`en.ts`, `ko.ts`, `ja.ts`, `zh.ts`),
  which keep the same keys; a section takes its words from there, never inline. English is at `/`, Korean at
  `/ko/`, Japanese at `/ja/`, Simplified Chinese at `/zh/`. Product names stay as they are in every language.
- **Pictures in the page's language.** `/ko/` shows Korean captures only; `/`, `/ja/` and `/zh/` show English
  captures only. A source's name ends in `-en` or `-ko`, and the browser test holds every page to it.
- **Public repositories only.** `src/lib/repositories.ts` lists what the site links to; a repository that is not
  public is never named or linked anywhere on the site.
- **Demo data only in pictures.** Screenshots come from the units' browser-test harnesses with demo answers
  (`scripts/shots/`), are checked by eye for people, rooms, messages, company names and personal data, and are
  committed as WebP under `src/assets/shots/`; the build makes the AVIF and WebP sizes.
- **Describe only what the public repositories contain.** No claim the code does not back.
- **Dark first, accessible.** Colours are the tokens at the top of `src/styles/global.css`; text keeps at least
  4.5:1 contrast, every picture has alternative text, every control is reachable by keyboard and at least 44px
  high on a phone.
- **Checks:** `bun run check`, then `bun run build && bun run test`, which opens the four built pages at 1440, 1024
  and 390 pixels and fails on a missing section, a picture without words or in another language, or a horizontal
  overflow.
- **English in code, comments and commits.** Other languages stand only in `src/i18n/`, the role words of
  `src/lib/repositories.ts` and the shots' demo data.
