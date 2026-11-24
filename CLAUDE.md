# Conventions of bmo-site

- **A static site.** Astro builds every page into `dist/`; no server code, no client framework. Script in the page
  stays inline, small and optional: the page reads fully without it.
- **Four languages, one shape.** Every word a page shows lives in `src/i18n/` (`en.ts`, `ko.ts`, `ja.ts`, `zh.ts`),
  which keep the same keys; a section takes its words from there, never inline. English is at `/`, Korean at
  `/ko/`, Japanese at `/ja/`, Simplified Chinese at `/zh/`. Product names stay as they are in every language.
- **The same screen in every language, captured in each.** Every place a picture stands names one screen for all
  four languages (`src/lib/slots.ts`, a guidebook chapter's front matter), and each page shows that screen captured
  in its own language: a screen not yet captured in a language is captured, never swapped for another. Every screen
  is captured dark and light, a source's name ends in `-<en|ko|ja|zh>-<dark|light>`, the page shows the capture of
  the scheme it stands in, and the tests hold every slot, chapter and page to it.
- **Three reading sections beside the home page.** The guidebook (`/guide/`), the API reference (`/api/`) and the
  release notes (`/releases/`) stand in all four languages under `src/pages/[...locale]/`, their surrounding words in
  `src/i18n/docs.ts`. The guidebook's chapters are Markdown, `src/content/guide/<language>/<chapter>.md`, Korean the
  source and every language holding the same chapters; a chapter names its screenshots in its front matter.
- **The API reference renders a snapshot.** `bun run openapi` reads every public unit's `docs/openapi.json` from its
  main branch through the unit's checkout in the workspace (references into another unit's document read the same
  way), bundles each with Swagger Parser and writes it under `src/data/openapi/` with `snapshot.json`; commit the
  refreshed snapshot. At build time Swagger Parser resolves each document and the pages render it statically, a page a
  unit; the search reads `/api/search.json`. Descriptions are the units' own English.
- **Release notes are data.** `src/data/releases.json` holds one entry a stable release or patch, newest first: its
  version (the whole set shares one), `upcoming` or `released`, its date once released, and its notes in all four
  languages with the same sections and items. A release adds its entry at the head, and may stand there as `upcoming`
  before it is released; the page needs no other change. Nightlies, alphas, betas and release candidates have no
  entry; the page's words state the versioning scheme and the desktop update channels.
- **Public repositories only.** `src/lib/repositories.ts` lists what the site links to; a repository that is not
  public is never named or linked anywhere on the site.
- **Demo data only in pictures.** Screenshots come from the units' browser-test harnesses with demo answers
  (`scripts/shots/`), are checked by eye for people, rooms, messages, company names and personal data, and are
  committed as WebP under `src/assets/shots/`; the build makes the AVIF and WebP sizes.
- **Describe only what the public repositories contain.** No claim the code does not back. A claim about another
  tool (`src/lib/comparison.ts`) rests on that tool's official page, named beside the data, and says only what the
  page describes.
- **Dark first, light on request, accessible.** The page stands dark, and light where the reader's system asks for
  it (`prefers-color-scheme`). Colours are the tokens at the top of `src/styles/global.css`, set again for the light
  scheme; text keeps at least 4.5:1 contrast in both, every picture has alternative text, every control is reachable
  by keyboard and at least 44px high on a phone.
- **Checks:** `bun run check`, then `bun run build && bun run test`, which opens the four built pages at 1440, 1024
  and 390 pixels in both colour schemes and fails on a missing section, a picture without words or in another
  language or scheme, a comparison row or footnote missing, or a horizontal overflow; and holds the reading sections
  to every language, every public unit with a snapshot, the same chapters and release shape in every language, no
  repository that is not public and no host of the domain but the site's own.
- **English in code, comments and commits.** Other languages stand only in `src/i18n/`, the role words of
  `src/lib/repositories.ts`, the guidebook's chapters, the release notes' data and the shots' demo data.
