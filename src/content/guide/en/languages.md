---
title: "Languages"
description: "The console's four languages and language packs, the language BMO answers each person in, and auto-translate."
order: 8
shots:
  - name: language
    alt: "The theme section of settings: the language list open on 한국어, English, 日本語 and 简体中文, with display mode, auto-translate and the theme preview below"
---

## The console's four languages

The console can be shown in four languages.

| Language | Name shown in the list |
|---|---|
| Korean | 한국어 |
| English | English |
| Japanese | 日本語 |
| Simplified Chinese | 简体中文 |

Each language is written in its own script, so you can find yours whatever language the console is showing right now.

### Changing the language

Pick a "Language" under "Theme" in "Settings". As its description says, it is "The language of the screens and notices"; your choice is saved to your account and applies on every device you open with that account. The whole console changes as soon as you pick, including screens brought in by other services, such as notes or the calendar.

Accounts that have never picked a language, and the screens before signing in, follow the language your browser asks for. If the browser asks for none of the four, the console is shown in English.

## Language packs

Every piece of text people read lives in **language packs**, not in the code. The code is written in English, and text shown on screen is fetched only by its key in a language pack.

- **Korean is the source.** New text is written in Korean first, and the English, Japanese and Chinese packs translate it key by key, in the same order. A test checks that the four packs stay in step.
- **A missing translation shows in Korean.** When new Korean text arrives before its translation, Korean is shown in that spot.
- **There are screen packs and server packs.** Screen packs hold the text the console shows; server packs hold what the server says, such as notice sentences sent to rooms. The server speaks in the language of whoever made the request, and notices sent without a particular request are in Korean.
- **Each service's screens bring their own pack.** Screens such as notes, artifacts and the brain carry their text in their own pack, and the console merges them.
- **One term, one word.** Each concept in the console is written with one fixed word per language. The Korean words are set by `WORDING.md` in the bmo-web repository.

The language packs and the wording guide are in the [bmo-web](https://github.com/ahas/bmo-web) repository.

## The language BMO answers in

The language BMO answers in is decided **per person**. Nothing sets the language turn by turn; BMO judges from what it knows about the person: what its brain holds about them, the language they usually use, and the conversation so far.

- Even if a message mixes in commands, paths or code in another language, the answer's language doesn't change. What counts is the speaker, not what they quote.
- During the install, the agent asks the owner's language, and BMO answers the owner in that language.
- There is no step that checks and fixes the answer's language before sending. It goes out as BMO wrote it.

## What stays in English

What people don't read is in English.

- The internal instructions and system text BMO gives to agents
- The brain's memories (written in English whatever language was spoken in the room)
- The repositories' documents and commits

If you teach a memory in Korean on the brain screen, it is shown translated into English before it is saved, for you to confirm.

## Auto-translate and showing the original

There are a few ways to read text written in another language in your own.

- **"Auto-translate":** a switch for this browser, under "Theme" in "Settings". It translates reports and work orders written in another language as you open them, and "Show original" takes you back at any time.
- **An artifact's "Translation":** when you open a document written in a language other than yours, "Translation" appears at the top of it.
- **The brain's "Translate":** read memories stored in English in your own language. Click a line above the translated text to go back to the English original.
- **The notes "Agent":** translates the selected text into Korean, English or Japanese.

If the translator is busy or fails, the original is shown as it is, with a line saying so.

## Good to know

- The screen language and BMO's answer language are separate. You can view the console in English while talking with BMO in Korean.
- Choosing Japanese or Chinese also applies fonts and line breaking suited to that language.
