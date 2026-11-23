import type { Locale } from "../i18n";

// The public repositories the site lists, grouped as a reader meets them. Each carries its role in every language
// the site is read in; a repository that is not public is never listed here.

export interface Repository {
  name: string;
  role: Record<Locale, string>;
  retired?: boolean;
}

export interface RepositoryGroup {
  title: Record<Locale, string>;
  items: Repository[];
}

const r = (name: string, en: string, ko: string, ja: string, zh: string, retired = false): Repository => ({ name, role: { en, ko, ja, zh }, retired });

export const REPOSITORY_GROUPS: RepositoryGroup[] = [
  {
    title: { en: "The turn", ko: "대화의 흐름", ja: "会話の流れ", zh: "对话流程" },
    items: [
      r("bmo", "The structure every unit holds to, and the index of units", "모든 유닛이 따르는 구조와 유닛 목록", "全ユニットが従う構成とユニット一覧", "所有单元遵循的结构与单元目录"),
      r("bmo-receiver", "Rooms, rules, windows, the turn and the wake", "방, 규칙, 대화 창, 턴과 깨우기", "ルーム、ルール、会話ウィンドウ、ターンと起動", "聊天室、规则、对话窗口、轮次与唤醒"),
      r("bmo-gate", "Sanitises a turn, picks its reference, checks the answer", "턴 정화, 참고 자료 선택, 답변 검사", "ターンの浄化、参考資料の選択、回答のチェック", "净化每一轮、挑选参考资料、检查回答"),
      r("bmo-agency", "Agent sessions supplied, placed, carried and ended", "에이전트 세션의 공급, 배치, 진행, 종료", "エージェントセッションの供給・配置・進行・終了", "智能体会话的供给、安排、推进与结束"),
      r("bmo-brain", "Long-term memory as a service", "서비스로서의 장기 기억", "サービスとしての長期記憶", "以服务形式提供的长期记忆"),
      r("bmo-pocket", "The tool host, the toolbook and the tool SDK", "도구 호스트, 도구 목록, 도구 SDK", "ツールホスト、ツールブック、ツール SDK", "工具宿主、工具手册与工具 SDK"),
      r("bmo-cli", "The `bmo` entry command", "진입 명령 `bmo`", "入口コマンド `bmo`", "入口命令 `bmo`"),
    ],
  },
  {
    title: { en: "Rooms and presence", ko: "방과 존재감", ja: "ルームと存在感", zh: "聊天室与存在感" },
    items: [
      r("bmo-web", "The console: accounts, language packs and screens", "콘솔: 계정, 언어 팩, 화면", "コンソール：アカウント、言語パック、画面", "控制台：账号、语言包与界面"),
      r("bmo-telegram", "The Telegram chat provider", "Telegram 채팅 프로바이더", "Telegram チャットプロバイダー", "Telegram 聊天接入"),
      r("bmo-discord", "The Discord chat provider", "Discord 채팅 프로바이더", "Discord チャットプロバイダー", "Discord 聊天接入"),
      r("bmo-voice", "Trained voices and speech synthesis", "학습된 목소리와 음성 합성", "学習した声と音声合成", "训练好的声音与语音合成"),
      r("bmo-face", "The face on the case's screen and its editor", "케이스 화면의 얼굴과 편집기", "本体画面の顔とそのエディター", "机身屏幕上的面孔及其编辑器"),
      r("bmo-word-chain", "The word-chain game a room plays with its agent", "방에서 에이전트와 하는 끝말잇기", "ルームでエージェントと遊ぶしりとり", "聊天室里与智能体玩的词语接龙"),
      r("bmo-tui", "The terminal screen an agent session stands in", "에이전트 세션의 터미널 화면", "エージェントセッションのターミナル画面", "智能体会话所在的终端界面"),
      r("bmo-persona", "BMO's persona: its voice, manner and lore", "BMO의 페르소나: 말투, 성격, 이야기", "BMO のペルソナ：話し方、性格、物語", "BMO 的人设：语气、性格与故事"),
      r("bmo-script", "The script studio for BMO's spoken lines", "BMO 대사를 다듬는 대사 작업실", "BMO のセリフを磨くスクリプト工房", "打磨 BMO 台词的剧本工作室"),
    ],
  },
  {
    title: { en: "Work", ko: "업무", ja: "仕事", zh: "工作" },
    items: [
      r("bmo-job", "Items, queues, leases and questions", "항목, 대기열, 임대, 질문", "項目、キュー、リース、質問", "工作项、队列、租约与提问"),
      r("bmo-testbed", "The build queue, checks, suite and deployment", "빌드 대기열, 검사, 테스트, 배포", "ビルドキュー、チェック、テスト、デプロイ", "构建队列、检查、测试与部署"),
      r("bmo-review", "Code review over registered checkouts", "등록된 체크아웃의 코드 리뷰", "登録済みチェックアウトのコードレビュー", "对已登记检出目录的代码评审"),
      r("bmo-research", "Research runs filed as documents", "문서로 남는 리서치", "ドキュメントとして残るリサーチ", "以文档形式存档的调研"),
      r("bmo-skills", "The skills every worker is handed", "모든 워커가 받는 스킬 모음", "すべてのワーカーに渡されるスキル集", "每个工作者都会拿到的技能集"),
      r("bmo-voc", "Bug reports and suggestions from users", "사용자의 버그 신고와 제안", "ユーザーからの不具合報告と提案", "用户的问题反馈与建议"),
      r("bmo-cache-siren", "A live watch of prompt-cache hits", "프롬프트 캐시 적중 실시간 감시", "プロンプトキャッシュのヒットをリアルタイム監視", "实时监看提示词缓存命中"),
      r("bmo-cache-warmer", "Keeps prompt caches warm", "프롬프트 캐시 유지", "プロンプトキャッシュを温めておく", "让提示词缓存保持有效"),
    ],
  },
  {
    title: { en: "Your desk", ko: "책상", ja: "デスク", zh: "办公桌" },
    items: [
      r("bmo-artifact", "Documents kept, searched and shared", "문서 보관, 검색, 공유", "ドキュメントの保管・検索・共有", "文档的存档、搜索与分享"),
      r("bmo-note", "Editable notes on the BlockSuite editor", "BlockSuite 편집기 기반 노트", "BlockSuite エディターによるノート", "基于 BlockSuite 编辑器的笔记"),
      r("bmo-calendar", "Calendars, events, alarms and bookings", "캘린더, 일정, 알림, 예약", "カレンダー、予定、通知、予約", "日历、日程、提醒与预约"),
      r("bmo-drive", "Files across drives, storage and nodes", "드라이브, 스토리지, 노드의 파일", "ドライブ、ストレージ、ノード上のファイル", "跨磁盘、存储和节点的文件"),
      r("bmo-mail", "Mail over your own mailboxes", "내 메일함 위의 메일", "自分のメールボックスで使うメール", "基于你自己邮箱的邮件"),
      r("bmo-remote", "Terminals and the remote desktop", "터미널과 원격 데스크톱", "ターミナルとリモートデスクトップ", "终端与远程桌面"),
      r("bmo-theater", "A video store with playlists and subtitles", "재생 목록과 자막이 있는 영상 보관함", "プレイリストと字幕つきの動画庫", "带播放列表和字幕的视频库"),
    ],
  },
  {
    title: { en: "Machines and models", ko: "머신과 모델", ja: "マシンとモデル", zh: "机器与模型" },
    items: [
      r("jake", "The agent proxy and desktop app that join a PC to the hub", "PC를 허브에 연결하는 에이전트 프록시와 데스크톱 앱", "PC をハブにつなぐエージェントプロキシとデスクトップアプリ", "把电脑接入中枢的代理程序与桌面应用"),
      r("bmo-node", "The list of machines and the hardware monitor", "머신 목록과 하드웨어 모니터", "マシン一覧とハードウェアモニター", "机器列表与硬件监控"),
      r("bmo-arbiter", "Shares GPU cards among engines", "엔진 사이의 GPU 카드 중재", "エンジン間で GPU カードを調停", "在各引擎之间调度 GPU 显卡"),
      r("bmo-explorer", "Web search, pages, previews and pictures", "웹 검색, 페이지, 미리보기, 그림", "Web 検索、ページ、プレビュー、画像", "网页搜索、页面、预览与图片"),
      r("bmo-eye", "Vision: one request shape over three modes", "비전: 세 가지 모드의 하나의 요청", "ビジョン：3 つのモードに共通のリクエスト", "视觉：三种模式共用一种请求"),
      r("bmo-paint", "Images drawn on a local image engine", "로컬 이미지 엔진으로 그리기", "ローカルの画像エンジンで描く", "用本地图像引擎绘图"),
      r("bmo-song", "Songs made in a named voice", "지정한 목소리로 만드는 노래", "指定した声で作る歌", "用指定声音生成歌曲"),
    ],
  },
  {
    title: { en: "Libraries", ko: "라이브러리", ja: "ライブラリ", zh: "基础库" },
    items: [
      r("bmo-chat", "The chat protocol between providers and the receiver", "프로바이더와 리시버 사이의 채팅 프로토콜", "プロバイダーとレシーバー間のチャットプロトコル", "接入端与接收端之间的聊天协议"),
      r("bmo-text", "Markdown and text as rooms and the console read them", "방과 콘솔이 읽는 마크다운과 텍스트", "ルームとコンソールが読む Markdown とテキスト", "聊天室和控制台读取的 Markdown 与文本"),
      r("bmo-ui", "The console's Nuxt layer: tokens and components", "콘솔의 Nuxt 레이어: 토큰과 컴포넌트", "コンソールの Nuxt レイヤー：トークンとコンポーネント", "控制台的 Nuxt 层：设计令牌与组件"),
      r("bmo-site", "This website", "이 웹사이트", "この Web サイト", "本网站"),
      r("bmo-graph", "The code dependency graph", "코드 의존성 그래프", "コードの依存関係グラフ", "代码依赖关系图", true),
    ],
  },
];
