import type { Locale } from "../i18n";

// The public repositories the site lists, grouped as a reader meets them. Each carries its role in both
// languages; a repository that is not public is never listed here.

export interface Repository {
  name: string;
  role: Record<Locale, string>;
  retired?: boolean;
}

export interface RepositoryGroup {
  title: Record<Locale, string>;
  items: Repository[];
}

const r = (name: string, en: string, ko: string, retired = false): Repository => ({ name, role: { en, ko }, retired });

export const REPOSITORY_GROUPS: RepositoryGroup[] = [
  {
    title: { en: "The turn", ko: "대화의 흐름" },
    items: [
      r("bmo", "The structure every unit holds to, and the index of units", "모든 유닛이 따르는 구조와 유닛 목록"),
      r("bmo-receiver", "Rooms, rules, windows, the turn and the wake", "방, 규칙, 대화 창, 턴과 깨우기"),
      r("bmo-gate", "Sanitises a turn, picks its reference, checks the answer", "턴 정화, 참고 자료 선택, 답변 검사"),
      r("bmo-agency", "Agent sessions supplied, placed, carried and ended", "에이전트 세션의 공급, 배치, 진행, 종료"),
      r("bmo-brain", "Long-term memory as a service", "서비스로서의 장기 기억"),
      r("bmo-pocket", "The tool host, the toolbook and the tool SDK", "도구 호스트, 도구 목록, 도구 SDK"),
      r("bmo-cli", "The `bmo` entry command", "진입 명령 `bmo`"),
    ],
  },
  {
    title: { en: "Rooms and presence", ko: "방과 존재감" },
    items: [
      r("bmo-web", "The console: accounts, language packs and screens", "콘솔: 계정, 언어 팩, 화면"),
      r("bmo-telegram", "The Telegram chat provider", "Telegram 채팅 프로바이더"),
      r("bmo-discord", "The Discord chat provider", "Discord 채팅 프로바이더"),
      r("bmo-voice", "Trained voices and speech synthesis", "학습된 목소리와 음성 합성"),
      r("bmo-face", "The face on the case's screen and its editor", "케이스 화면의 얼굴과 편집기"),
      r("bmo-word-chain", "The word-chain game a room plays with its agent", "방에서 에이전트와 하는 끝말잇기"),
      r("bmo-tui", "The terminal screen an agent session stands in", "에이전트 세션의 터미널 화면"),
      r("bmo-persona", "BMO's persona: its voice, manner and lore", "BMO의 페르소나: 말투, 성격, 이야기"),
      r("bmo-script", "The script studio for BMO's spoken lines", "BMO 대사를 다듬는 대사 작업실"),
    ],
  },
  {
    title: { en: "Work", ko: "업무" },
    items: [
      r("bmo-job", "Items, queues, leases and questions", "항목, 대기열, 임대, 질문"),
      r("bmo-testbed", "The build queue, checks, suite and deployment", "빌드 대기열, 검사, 테스트, 배포"),
      r("bmo-review", "Code review over registered checkouts", "등록된 체크아웃의 코드 리뷰"),
      r("bmo-research", "Research runs filed as documents", "문서로 남는 리서치"),
      r("bmo-skills", "The skills every worker is handed", "모든 워커가 받는 스킬 모음"),
      r("bmo-voc", "Bug reports and suggestions from users", "사용자의 버그 신고와 제안"),
      r("bmo-cache-siren", "A live watch of prompt-cache hits", "프롬프트 캐시 적중 실시간 감시"),
      r("bmo-cache-warmer", "Keeps prompt caches warm", "프롬프트 캐시 유지"),
    ],
  },
  {
    title: { en: "Your desk", ko: "책상" },
    items: [
      r("bmo-artifact", "Documents kept, searched and shared", "문서 보관, 검색, 공유"),
      r("bmo-note", "Editable notes on the BlockSuite editor", "BlockSuite 편집기 기반 노트"),
      r("bmo-calendar", "Calendars, events, alarms and bookings", "캘린더, 일정, 알림, 예약"),
      r("bmo-drive", "Files across drives, storage and nodes", "드라이브, 스토리지, 노드의 파일"),
      r("bmo-mail", "Mail over your own mailboxes", "내 메일함 위의 메일"),
      r("bmo-remote", "Terminals and the remote desktop", "터미널과 원격 데스크톱"),
      r("bmo-theater", "A video store with playlists and subtitles", "재생 목록과 자막이 있는 영상 보관함"),
    ],
  },
  {
    title: { en: "Machines and models", ko: "머신과 모델" },
    items: [
      r("jake", "The agent proxy and desktop app that join a PC to the hub", "PC를 허브에 연결하는 에이전트 프록시와 데스크톱 앱"),
      r("bmo-node", "The list of machines and the hardware monitor", "머신 목록과 하드웨어 모니터"),
      r("bmo-arbiter", "Shares GPU cards among engines", "엔진 사이의 GPU 카드 중재"),
      r("bmo-explorer", "Web search, pages, previews and pictures", "웹 검색, 페이지, 미리보기, 그림"),
      r("bmo-eye", "Vision: one request shape over three modes", "비전: 세 가지 모드의 하나의 요청"),
      r("bmo-paint", "Images drawn on a local image engine", "로컬 이미지 엔진으로 그리기"),
      r("bmo-song", "Songs made in a named voice", "지정한 목소리로 만드는 노래"),
    ],
  },
  {
    title: { en: "Libraries", ko: "라이브러리" },
    items: [
      r("bmo-chat", "The chat protocol between providers and the receiver", "프로바이더와 리시버 사이의 채팅 프로토콜"),
      r("bmo-text", "Markdown and text as rooms and the console read them", "방과 콘솔이 읽는 마크다운과 텍스트"),
      r("bmo-ui", "The console's Nuxt layer: tokens and components", "콘솔의 Nuxt 레이어: 토큰과 컴포넌트"),
      r("bmo-site", "This website", "이 웹사이트"),
      r("bmo-graph", "The code dependency graph", "코드 의존성 그래프", true),
    ],
  },
];
