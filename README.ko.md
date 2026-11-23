[English](README.md) | **한국어** | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

# bmo-site

BMO 프로젝트의 웹사이트로, https://bmo.ahas.io 에서 서비스합니다. 영어(`/`), 한국어(`/ko/`), 일본어(`/ja/`), 중국어 간체(`/zh/`)의 랜딩 페이지 하나로, 제품 소개, 콘솔 화면, 데스크톱 앱 다운로드, 공개 저장소 목록을 담습니다. [Astro](https://astro.build)로 만든 정적 사이트라서 서버에서 실행되는 것은 없고, 브라우저로 보내는 프레임워크도 없습니다. 방문자의 운영체제에 맞춰 다운로드 버튼을 바꾸는 작은 인라인 스크립트 하나만 있습니다.

## 빌드와 미리보기

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

빌드는 데스크톱 앱의 현재 릴리스를 `https://ai.example.org/bmo/jake/desktop/release.json`에서 읽어(jake의 `docs/desktop.md`, "The read the console uses") 다운로드 섹션에 버전과 설치 파일을 넣습니다. 이 주소에 닿지 못하거나 `BMO_SITE_OFFLINE=1`이면 릴리스 문서로 연결합니다. 배포는 `dist/`를 도메인을 서비스하는 호스트로 복사하는 것입니다.

## 검사

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test`는 빌드된 `dist/`를 정적 호스트처럼 띄우고, 네 페이지를 Chromium에서 1440, 1024, 390픽셀 너비로 엽니다. 핵심 섹션이 제목과 함께 모두 있는지, 그림이 모두 로드되고 대체 텍스트를 갖는지, 그림이 그 페이지 언어로 찍은 것인지, 언어 메뉴가 모든 버전에 닿는지, 창 오른쪽 끝을 넘는 요소가 없는지, 없는 주소가 404 페이지로 답하는지를 확인합니다. `playwright-core`가 고정한 Chromium 빌드가 필요하며, 없으면 건너뜁니다.

## 구성

| 경로 | 담는 것 |
|---|---|
| `src/pages/` | 영어 페이지, `ko/` 아래의 한국어 페이지, 404 페이지, 사이트맵 |
| `src/components/Home.astro` | 랜딩 페이지의 모든 섹션을 한 언어의 문장으로 |
| `src/layouts/Layout.astro` | 문서 머리, 내비게이션, 푸터 |
| `src/i18n/` | 사이트 문구. `en.ts`, `ko.ts`, `ja.ts`, `zh.ts`가 같은 모양 |
| `src/lib/` | 주소, 릴리스 읽기, 공개 저장소 목록 |
| `src/assets/shots/` | 페이지에 쓰는 스크린샷. WebP 원본을 빌드가 AVIF·WebP 여러 크기로 만듦 |
| `src/styles/global.css` | 스타일시트 하나 |
| `scripts/shots/` | 스크린샷을 찍은 캡처 스크립트 |
| `tests/` | 빌드된 페이지의 브라우저 테스트 |

## 스크린샷

페이지의 모든 그림은 그 페이지의 언어로 찍습니다. `/ko/`에는 한국어 캡처를, `/`, `/ja/`, `/zh/`에는 영어 캡처를 씁니다. 플랫폼 화면이 영어와 한국어를 쓰기 때문입니다. 원본 파일 이름은 언어로 끝나며(`<name>-en.webp`, `<name>-ko.webp`), 각 언어가 어떤 그림을 보여 주는지는 `src/lib/shots.ts`가 정합니다. 콘솔의 대화방은 한국어만 쓰므로 `/ko/`에만 나옵니다.

스크린샷에는 데모 데이터만 있습니다. 각 화면을 가진 유닛의 브라우저 테스트 환경에서, 그 환경의 응답 대신 데모 응답을 넣어 찍습니다.

- `scripts/shots/console-shot.ts`: 콘솔 대화방과 TODO 패널. `bmo-web`이 브라우저 테스트용으로 띄우는 콘솔(`client/tests/support/browser-console.ts`, 주소는 `BMO_CONSOLE_TEST_URL`)에서 찍습니다.
- `scripts/shots/calendar-shot.ts <en|ko>`: `bmo-calendar` 테스트 페이지의 주간 캘린더.
- `scripts/shots/artifact-shot.ts <en|ko>`: `bmo-artifact` 브라우저 호스트의 아카이브 문서.
- `scripts/shots/note-shot.ts`: `bmo-note` 브라우저 스택의 노트, 두 언어 모두.
- `scripts/shots/webp.ts`: `shots-out/`의 캡처를 `src/assets/shots/` 아래 원본으로 바꿉니다.

캡처 스크립트는 `bmo` 폴더가 배치하는 대로 각 유닛이 이 저장소 옆에 체크아웃돼 있다고 가정합니다. 새 그림은 커밋하기 전에 개인정보가 없는지 눈으로 확인합니다.

## 라이선스

MIT. `LICENSE`를 보세요.
