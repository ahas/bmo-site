[English](README.md) | **한국어** | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

# bmo-site

BMO 프로젝트의 웹사이트로, https://bmo.ahas.io 에서 서비스합니다. 영어(`/`), 한국어(`/ko/`), 일본어(`/ja/`), 중국어 간체(`/zh/`)의 랜딩 페이지 하나로, 제품 소개, 콘솔 화면, 비슷한 도구들과의 비교, 이번 릴리스에 더해진 것, 두 데스크톱 앱의 다운로드, 공개 저장소 목록을 담습니다. 페이지는 어두운 테마로 서고, 읽는 사람의 시스템이 밝은 테마를 원하면 밝게 섭니다. [Astro](https://astro.build)로 만든 정적 사이트라서 서버에서 실행되는 것은 없고, 브라우저로 보내는 프레임워크도 스크립트도 없습니다.

## 빌드와 미리보기

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

다운로드 섹션은 두 데스크톱 앱을 내놓습니다. 이미 돌리는 BMO 서버를 여는 원격 제어기와, BMO 자체를 내 PC에 설치해 돌리는 All-in-One입니다. 둘 다 빌드할 때 jake의 최신 GitHub 릴리스에 있는 `release.json`, 곧 `src/lib/release.ts`가 지정한 주소에서 읽습니다. 원격 제어기의 파일은 `files`, All-in-One의 파일은 `allInOne.files`, 나이틀리 빌드가 게시돼 있으면 그 파일은 `nightly` 아래에 있습니다. 원격 제어기는 처음 실행할 때 각자의 BMO 서버 주소를 묻기 때문에, 같은 설치 파일을 모든 배포에서 씁니다. 릴리스가 게시되기 전에는 주소가 404로 응답하고, 다운로드 섹션은 아직 내려받을 수 있는 릴리스가 없다고 알리며 릴리스 문서로 연결합니다. 사이트는 testbed가 배포합니다(아래 「배포」).

시작하기 섹션은 사람이 자기 코딩 에이전트에게 건넬 한 줄을 보여 주고, 에이전트는 인덱스의 런북대로 BMO를 설치합니다. `/install.md`는 그 런북, 곧 인덱스의 `INSTALL.md`를 빌드할 때 인덱스의 main 브랜치에서 `src/lib/runbook.ts`가 지정한 주소로 읽어 내보냅니다. 빌드가 오프라인이거나 인덱스를 읽지 못하면 런북을 가리키는 짧은 안내를 대신 내보냅니다. 이 섹션의 언어별 문구는 `src/i18n/start.ts`에 있습니다.

## 검사

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run check`는 `scripts/shots/`의 캡처 스크립트를 빼고 검사합니다. 이 스크립트들은 옆에 체크아웃된 유닛들의 브라우저 하니스를 가져오므로(「스크린샷」) 그 워크스페이스에서만 타입 검사가 됩니다. 검사가 실제로 읽는 파일들이 모두 이 저장소 안의 모듈만 가져오는지도 테스트가 확인합니다.

`bun run test`는 빌드된 `dist/`를 정적 호스트처럼 띄우고, 네 페이지를 Chromium에서 1440, 1024, 390픽셀 너비로, 어두운 테마와 밝은 테마에서 엽니다. 핵심 섹션이 제목과 함께 모두 있는지, 그림이 모두 로드되고 대체 텍스트를 갖는지, 그림이 그 페이지 언어와 테마로 찍은 것인지, 비교 표에 기능마다 행과 표시, 각주가 모두 있는지, 언어 메뉴가 모든 버전에 닿는지, 창 오른쪽 끝을 넘는 요소가 없는지, 없는 주소가 404 페이지로 답하는지를 확인합니다. `playwright-core`가 고정한 Chromium 빌드가 필요하며, 없으면 건너뜁니다.

## 배포

testbed가 다른 모든 유닛처럼 `testbed.toml`에 따라 사이트를 배포하므로, main에 올라간 커밋은 이 저장소의 일괄 배포와 함께 라이브가 됩니다. 게이트는 `bun run check`를 돌리고 `dist/`를 빌드한 뒤 그 결과로 테스트를 돌립니다. 이어 빌드 단계가 커밋을 릴리스 안에 빌드하고, 배포 트리를 넘기기 전에 릴리스의 `dist/`를 `rsync -a --delete`로 도메인을 서비스하는 호스트에 통째로 복사합니다. 어느 호스트의 어느 폴더인지는 이 저장소가 아니라 머신 설정, 곧 사이트 데이터 루트 아래 `env/publish-target`의 rsync 대상 하나에 있습니다. 릴리스가 라이브가 되면 `scripts/deploy/served.ts`가 사이트 주소가 내주는 첫 페이지를 릴리스 자신의 `dist/index.html`과 맞춰 봅니다. 배포 기록인 배포 루트 아래 `deployed.json`이 호스트가 내주는 커밋을 가리킵니다.

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
| `scripts/deploy/` | 사이트 주소가 릴리스의 빌드를 내주는지 보는 배포 검사 |
| `testbed.toml` | testbed가 사이트를 검사·테스트·빌드·배포하는 방법 |
| `tests/` | 빌드된 페이지의 브라우저 테스트 |

## 스크린샷

페이지의 모든 그림은 그 페이지의 언어로, 두 테마 모두로 찍습니다. `/ko/`에는 한국어 캡처를, `/`, `/ja/`, `/zh/`에는 영어 캡처를 씁니다. 플랫폼 화면이 영어와 한국어를 쓰기 때문입니다. 페이지가 어두우면 어두운 캡처를, 밝으면 밝은 캡처를 보여 주며, 이는 읽는 사람의 시스템 설정(`prefers-color-scheme`)이 정하고 스타일시트도 같은 설정을 따릅니다. 원본 파일 이름은 언어와 테마로 끝나며(`<name>-<en|ko>-<dark|light>.webp`), 각 언어가 어떤 그림을 보여 주는지는 `src/lib/shots.ts`가, 한 그림의 두 테마를 내놓는 일은 `src/components/Shot.astro`가 맡습니다. 콘솔의 조직 화면과 앱 화면은 두 언어로 찍고, 그 밖의 콘솔 화면과 브레인 화면은 한국어로만 찍으므로 `/ko/`에만 나옵니다.

스크린샷에는 데모 데이터만 있습니다. 각 화면을 가진 유닛의 브라우저 테스트 환경에서, 그 환경의 응답 대신 데모 응답을 넣어 두 테마로 찍습니다.

- `scripts/shots/console-shot.ts <name> <path> [width] [height]`: 콘솔 대화방과 TODO 패널. `bmo-web`이 브라우저 테스트용으로 띄우는 콘솔(`client/tests/support/browser-console.ts`, 주소는 `BMO_CONSOLE_TEST_URL`)에서 찍습니다. `room /rooms/42`, 그리고 `SKIP=2`로 `room-phone /rooms/42 390 844`.
- `scripts/shots/console-screens-shot.ts [agents|cards|job]`: 같은 콘솔의 에이전시 역할, 모니터 서비스 탭의 GPU 카드, 실행 중인 TODO 항목의 작업 로그.
- `scripts/shots/console-apps-shot.ts <en|ko> [org|catalogue|personal-apps|language]`: 같은 콘솔에서 데모 회사로, 한 팀의 조직 화면 에이전트 탭, 앱 카탈로그, 내 개인 앱, 화면 설정의 언어 메뉴.
- `scripts/shots/brain-shot.ts`: `bmo-brain` 브라우저 호스트의 한 사람에 대한 기억과 요약.
- `scripts/shots/calendar-shot.ts <en|ko>`: `bmo-calendar` 테스트 페이지의 주간 캘린더.
- `scripts/shots/artifact-shot.ts <en|ko>`: `bmo-artifact` 브라우저 호스트의 아카이브 문서.
- `scripts/shots/note-shot.ts`: `bmo-note` 브라우저 스택의 노트, 두 언어 모두. 노트는 폴더에 정리되고 북마크돼 있습니다.
- `scripts/shots/drive-shot.ts <en|ko>`: `bmo-drive` 브라우저 호스트의 파일 화면.
- `scripts/shots/theater-shot.ts <en|ko>`: `bmo-theater`가 생성하는 브라우저 호스트의 영상 보관함. 포스터는 추상 그림으로 그립니다.
- `scripts/shots/webp.ts`: `shots-out/`의 캡처를 `src/assets/shots/` 아래 원본으로 바꿉니다.

캡처 스크립트는 `bmo` 폴더가 배치하는 대로 각 유닛이 이 저장소 옆에 체크아웃돼 있다고 가정합니다. 새 그림은 커밋하기 전에 개인정보가 없는지 눈으로 확인합니다.

## 비교

"BMO가 특별한 이유" 섹션은 BMO를 다섯 분류의 도구 옆에 놓고, 분류마다 이름을 밝힌 두 도구로 판단합니다. `src/lib/comparison.ts`에 표시와 함께, 행마다 다른 도구의 표시가 근거로 삼은 공식 페이지가 적혀 있습니다. 표시는 그 페이지들이 설명하는 것만 말하며, 페이지에도 그렇게 밝힙니다. 행, 분류, 각주의 문구는 `src/i18n/`의 `compare` 아래에 있습니다.

## 라이선스

MIT. `LICENSE`를 보세요.
