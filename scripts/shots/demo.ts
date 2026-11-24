// Demo data for product shots: fictional rooms, a fictional user "Alex", the agent BMO, in every language the site is
// read in: the rooms' titles, the conversation with BMO, the TODO board and the labels the console's stand-ins render
// themselves.
import type { Locale } from "./locale";

export const NOW = Math.floor(Date.now() / 1000);

/** The rooms the console lists, by the stand-in's chat id; a room not named here is left out. */
export const ROOM_TITLES: Record<Locale, Record<string, string>> = {
  en: {
    "42": "BMO",
    "43": "Family chat",
    "-9000000000099": "Weekly sync notes",
    "44": "Trip planning",
    "45": "Study group",
    "46": "Photo album",
    [String(-9_002_000_000_001)]: "Side project",
  },
  ko: {
    "42": "BMO",
    "43": "가족 단톡방",
    "-9000000000099": "주간 회의록",
    "44": "여행 계획",
    "45": "스터디 모임",
    "46": "사진첩",
    [String(-9_002_000_000_001)]: "사이드 프로젝트",
  },
  ja: {
    "42": "BMO",
    "43": "家族のグループ",
    "-9000000000099": "週次ミーティングの議事録",
    "44": "旅行の計画",
    "45": "勉強会",
    "46": "アルバム",
    [String(-9_002_000_000_001)]: "サイドプロジェクト",
  },
  zh: {
    "42": "BMO",
    "43": "家庭群聊",
    "-9000000000099": "周会纪要",
    "44": "旅行计划",
    "45": "学习小组",
    "46": "相册",
    [String(-9_002_000_000_001)]: "业余项目",
  },
};

function msg(id: number, at: number, who: "me" | "bmo", text: string, extra: Record<string, unknown> = {}) {
  return {
    chatId: 42, messageId: String(1000 + id), senderId: who === "me" ? 1 : 501, senderName: who === "me" ? "Alex" : "BMO",
    sentAt: NOW - at, text, imagePath: null, replyToMessageId: null, answerSeconds: who === "bmo" ? 4 : null, round: null, album: null,
    agent: who === "bmo", notice: false, attachments: [], expressions: [], formats: [], replyQuote: null, transcript: null, voiceSeconds: null,
    voiceState: null, spend: null, actions: null, drafts: null, editedAt: null, deletedAt: null, pinnedAt: null, reactions: [], ...extra
  };
}

/** The seven lines of the conversation with BMO, in the order said, in one language. */
function conversation(lines: readonly [string, string, string, string, string, string, string]) {
  const [said, at] = [["me", "bmo", "me", "bmo", "bmo", "me", "bmo"] as const, [3600 * 3, 3600 * 3 - 20, 3600 * 2, 3600 * 2 - 30, 1500, 600, 560]];

  return lines.map((text, index) => msg(index + 1, at[index]!, said[index]!, text));
}

/** BMO's room: the day's schedule, a bug turned into a TODO item and its outcome, and a research run asked for. */
export const MESSAGES: Record<Locale, ReturnType<typeof msg>[]> = {
  en: conversation([
    "BMO, what's on today?",
    "Today you have the design review at 10:00, the dentist at 14:00 and the study group at 19:30. I'll remind you again 30 minutes before the dentist.",
    "You know the bug where pasting into the notes app loses the line breaks? Please fix it",
    "Added it to the TODO board. A worker will find the cause in the notes repository, and once the tests pass it goes all the way to deployment.\n\n**#1284 Keep line breaks when pasting** — first in the queue",
    "#1284 is done. Pasting split the text into one paragraph per line, which was the cause, and I added a browser test. It passed the testbed and is waiting for deployment.",
    "Thanks. Also, write up the embedding model papers we looked at last week as a document",
    "I'll run it as research. When it's done you'll get the document's link with a spoken summary to listen to while you read.",
  ]),
  ko: conversation([
    "비모, 오늘 일정 알려줘",
    "오늘은 10:00 디자인 리뷰, 14:00 치과, 19:30 스터디 모임이야. 치과 가기 30분 전에 한 번 더 알려줄게.",
    "노트 앱에서 붙여넣기하면 줄바꿈이 사라지는 버그 있잖아. 고쳐줘",
    "TODO로 올렸어. 워커가 노트 저장소에서 원인을 찾고, 테스트를 통과하면 배포까지 할게.\n\n**#1284 붙여넣기 줄바꿈 유지** — 대기열 1번",
    "#1284 끝났어. 붙여넣을 때 문단을 줄 단위로 나누던 게 원인이었고, 브라우저 테스트를 하나 추가했어. 테스트베드 통과하고 배포 대기 중이야.",
    "고마워. 그리고 지난주에 본 임베딩 모델 논문 정리해서 문서로 남겨줘",
    "리서치로 돌릴게. 끝나면 문서 링크랑 같이 들으면서 볼 수 있게 요약 음성도 붙여 줄게.",
  ]),
  ja: conversation([
    "BMO、今日の予定を教えて",
    "今日は10:00にデザインレビュー、14:00に歯医者、19:30に勉強会だよ。歯医者の30分前にまた知らせるね。",
    "ノートアプリで貼り付けると改行が消えるバグ、直しておいて",
    "TODOに登録したよ。ワーカーが原因を探して、テストが通ったらデプロイまでやるね。\n\n**#1284 貼り付け時の改行を保持** — 待ち行列の1番目",
    "#1284 終わったよ。行ごとに段落を分けていたのが原因で、ブラウザーテストも足したよ。テストベッドを通って今はデプロイ待ち。",
    "ありがとう。あと、先週読んだ埋め込みモデルの論文をドキュメントにまとめて",
    "リサーチで回すね。終わったらドキュメントのリンクと聴ける要約音声を送るよ。",
  ]),
  zh: conversation([
    "BMO，告诉我今天的日程",
    "今天 10:00 设计评审，14:00 看牙医，19:30 学习小组。去看牙医前 30 分钟我会再提醒你一次。",
    "笔记应用里一粘贴换行就没了的那个 bug，帮我修一下",
    "已经加到 TODO 里了。工作器会在笔记仓库里找原因，测试通过后就部署上线。\n\n**#1284 粘贴时保留换行** — 队列第 1 位",
    "#1284 完成了。原因是粘贴时把段落按行拆开了，我还加了一个浏览器测试。已经通过测试台，正在等待部署。",
    "谢谢。另外，把上周看的嵌入模型论文整理成文档留下来",
    "我会作为调研来跑。完成后把文档链接和一段可以边看边听的摘要语音一起发给你。",
  ]),
};

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

/** The TODO items' titles, by item id, in one language. */
type Titles = Record<1290 | 1288 | 1287 | 1286 | 1284 | 1281 | 1279, string>;

const TITLES: Record<Locale, Titles> = {
  en: {
    1290: "Research write-up on embedding model papers",
    1288: "Show public holidays in the calendar's week view",
    1287: "Choose an expiry date for drive share links",
    1286: "Playback speed for voice briefings",
    1284: "Keep line breaks when pasting into notes",
    1281: "Footnote jumps in the document viewer",
    1279: "Undo a sent mail",
  },
  ko: {
    1290: "임베딩 모델 논문 리서치 문서",
    1288: "캘린더 주간 보기 공휴일 표시",
    1287: "드라이브 공유 링크 만료일 선택",
    1286: "음성 브리핑 재생 속도 조절",
    1284: "노트 붙여넣기 줄바꿈 유지",
    1281: "문서 뷰어 각주 이동",
    1279: "메일 보낸 편지 되돌리기",
  },
  ja: {
    1290: "埋め込みモデル論文のリサーチ文書",
    1288: "カレンダーの週表示に祝日を表示",
    1287: "ドライブ共有リンクの有効期限を選択",
    1286: "音声ブリーフィングの再生速度調整",
    1284: "ノート貼り付け時の改行を保持",
    1281: "ドキュメントビューアーの脚注ジャンプ",
    1279: "送信済みメールの取り消し",
  },
  zh: {
    1290: "嵌入模型论文调研文档",
    1288: "日历周视图显示公共假日",
    1287: "云盘共享链接可选过期日期",
    1286: "语音简报播放速度调节",
    1284: "笔记粘贴时保留换行",
    1281: "文档查看器脚注跳转",
    1279: "撤回已发送的邮件",
  },
};

/** The TODO board's waiting and running items, in the language given. */
export function queueOf(locale: Locale) {
  const titles = TITLES[locale];

  return [
    item(1290, titles[1290], { worker: "research", status: "running", running: true, liveState: "running", createdAt: NOW - 560 }),
    item(1288, titles[1288], { worker: "calendar", createdAt: NOW - 3000 }),
    item(1287, titles[1287], { worker: "drive", createdAt: NOW - 4000 }),
    item(1286, titles[1286], { worker: "voice", createdAt: NOW - 5000 }),
  ];
}

/** The TODO board's done items, in the language given. */
export function doneOf(locale: Locale) {
  const titles = TITLES[locale];

  return [
    item(1284, titles[1284], { worker: "note", done: true, status: "done", doneAt: NOW - 1500, createdAt: NOW - 7200 }),
    item(1281, titles[1281], { worker: "artifact", done: true, status: "done", doneAt: NOW - 20000, createdAt: NOW - 40000 }),
    item(1279, titles[1279], { worker: "mail", done: true, status: "done", doneAt: NOW - 50000, createdAt: NOW - 90000 }),
  ];
}

/** The item a worker runs in the job screen: the note bug of BMO's room, as it was asked, in the language given. */
export function runningItemOf(locale: Locale) {
  const instruction = {
    en: "Fix the bug where pasting several lines into the notes app loses the line breaks.",
    ko: "노트 앱에서 여러 줄을 붙여넣으면 줄바꿈이 사라지는 버그를 고쳐 주세요.",
    ja: "ノートアプリに複数行を貼り付けると改行が消えるバグを直してください。",
    zh: "修复在笔记应用中粘贴多行文字时换行丢失的问题。",
  }[locale];

  return item(1284, TITLES[locale][1284], { instruction, worker: "note", status: "running", running: true, liveState: "running", attempts: 1, createdAt: NOW - 7200 });
}

/** Visible labels the server's stand-ins render themselves, swapped in the page for demo names. */
const NEUTRAL_SWAPS: [string, string][] = [
  ["Agent A", "BMO"],
  ["agent-topbar", "Alex"],
  ["Repository A", "bmo-note"],
  ["claude-02", "account 1"],
];

/** The stand-ins' screen and room names, each swapped for its demo name in one language. */
function localSwaps(screens: [string, string, string], rooms: Record<string, string>): [string, string][] {
  return [
    ["screen-a", screens[0]],
    ["screen-b", screens[1]],
    ["screen-released", screens[2]],
    ["unread-room", rooms["43"]!],
    ["record-room", rooms["-9000000000099"]!],
    ["media-room", rooms["44"]!],
    ["sticker-room", rooms["45"]!],
    ["pictures-room", rooms["46"]!],
    ["high-room", rooms[String(-9_002_000_000_001)]!],
  ];
}

export const TEXT_SWAPS: Record<Locale, [string, string][]> = {
  en: [...NEUTRAL_SWAPS, ...localSwaps(["Notes", "Calendar", "Documents"], ROOM_TITLES.en)],
  ko: [...NEUTRAL_SWAPS, ...localSwaps(["노트", "캘린더", "문서"], ROOM_TITLES.ko)],
  ja: [...NEUTRAL_SWAPS, ...localSwaps(["ノート", "カレンダー", "ドキュメント"], ROOM_TITLES.ja)],
  zh: [...NEUTRAL_SWAPS, ...localSwaps(["笔记", "日历", "文档"], ROOM_TITLES.zh)],
};
