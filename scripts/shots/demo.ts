// Demo data for product shots: fictional rooms, a fictional user "Alex", the agent BMO.
export const NOW = Math.floor(Date.now() / 1000);

export const ROOM_TITLES: Record<string, string> = {
  "42": "BMO",
  "43": "가족 단톡방",
  "-9000000000099": "주간 회의록",
  "44": "여행 계획",
  "45": "스터디 모임",
  "46": "사진첩",
  [String(-9_002_000_000_001)]: "사이드 프로젝트",
};

function msg(id: number, at: number, who: "me" | "bmo", text: string, extra: Record<string, unknown> = {}) {
  return {
    chatId: 42, messageId: String(1000 + id), senderId: who === "me" ? 1 : 501, senderName: who === "me" ? "Alex" : "BMO",
    sentAt: NOW - at, text, imagePath: null, replyToMessageId: null, answerSeconds: who === "bmo" ? 4 : null, round: null, album: null,
    agent: who === "bmo", notice: false, attachments: [], expressions: [], formats: [], replyQuote: null, transcript: null, voiceSeconds: null,
    voiceState: null, spend: null, actions: null, drafts: null, editedAt: null, deletedAt: null, pinnedAt: null, reactions: [], ...extra
  };
}

export const MESSAGES = [
  msg(1, 3600 * 3, "me", "비모, 오늘 일정 알려줘"),
  msg(2, 3600 * 3 - 20, "bmo", "오늘은 10:00 디자인 리뷰, 14:00 치과, 19:30 스터디 모임이야. 치과 가기 30분 전에 한 번 더 알려줄게."),
  msg(3, 3600 * 2, "me", "노트 앱에서 붙여넣기하면 줄바꿈이 사라지는 버그 있잖아. 고쳐줘"),
  msg(4, 3600 * 2 - 30, "bmo", "TODO로 올렸어. 워커가 노트 저장소에서 원인을 찾고, 테스트를 통과하면 배포까지 할게.\n\n**#1284 붙여넣기 줄바꿈 유지** — 대기열 1번"),
  msg(5, 1500, "bmo", "#1284 끝났어. 붙여넣을 때 문단을 줄 단위로 나누던 게 원인이었고, 브라우저 테스트를 하나 추가했어. 테스트베드 통과하고 배포 대기 중이야."),
  msg(6, 600, "me", "고마워. 그리고 지난주에 본 임베딩 모델 논문 정리해서 문서로 남겨줘"),
  msg(7, 560, "bmo", "리서치로 돌릴게. 끝나면 문서 링크랑 같이 들으면서 볼 수 있게 요약 음성도 붙여 줄게."),
];

const ITEM_BASE = {
  instruction: "", requester: "Alex", requesterId: 1, chatId: 42, approved: true, awaitingApproval: false, recommended: false, done: false,
  running: false, liveState: null, worker: null, priority: 0, status: "waiting", model: null, agent: null, ranOn: null, note: null, reports: [],
  unfinished: null, rejections: 0, unfinishedResolvedAt: null, unfinishedResolution: null, heldAt: null, heldReason: null, heldKind: null,
  noticesOff: null, mergedInto: null, mergedAt: null, mergedIntoTitle: null, mergedFrom: [], attempts: 0, progress: null, stopped: null,
  holding: null, waiting: null, deployWaits: false, closing: null, deployHold: false, deployHeld: false, holdPending: false, orderActive: false,
  seconds: null, spans: [], createdAt: NOW - 7200, doneAt: null
};

export function item(id: number, title: string, over: Record<string, unknown> = {}) {
  return { ...ITEM_BASE, id, title, priority: id, ...over };
}

export const QUEUE = [
  item(1290, "임베딩 모델 논문 리서치 문서", { worker: "research", status: "running", running: true, liveState: "running", createdAt: NOW - 560 }),
  item(1288, "캘린더 주간 보기 공휴일 표시", { worker: "calendar", createdAt: NOW - 3000 }),
  item(1287, "드라이브 공유 링크 만료일 선택", { worker: "drive", createdAt: NOW - 4000 }),
  item(1286, "음성 브리핑 재생 속도 조절", { worker: "voice", createdAt: NOW - 5000 }),
];
export const DONE = [
  item(1284, "노트 붙여넣기 줄바꿈 유지", { worker: "note", done: true, status: "done", doneAt: NOW - 1500, createdAt: NOW - 7200 }),
  item(1281, "문서 뷰어 각주 이동", { worker: "artifact", done: true, status: "done", doneAt: NOW - 20000, createdAt: NOW - 40000 }),
  item(1279, "메일 보낸 편지 되돌리기", { worker: "mail", done: true, status: "done", doneAt: NOW - 50000, createdAt: NOW - 90000 }),
];

// Visible labels the server renders itself, swapped in the page for demo names.
export const TEXT_SWAPS: [string, string][] = [
  ["Agent A", "BMO"],
  ["agent-topbar", "Alex"],
  ["screen-a", "노트"],
  ["screen-b", "캘린더"],
  ["screen-released", "문서"],
  ["unread-room", "가족 단톡방"],
  ["record-room", "주간 회의록"],
  ["media-room", "여행 계획"],
  ["sticker-room", "스터디 모임"],
  ["pictures-room", "사진첩"],
  ["high-room", "사이드 프로젝트"],
  ["Repository A", "bmo-note"],
  ["claude-02", "account 1"],
];
