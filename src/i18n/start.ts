import type { Locale } from "./index";

// The words of the get-started section, in each language the site is read in. They stand apart from the page's
// other words so the section can be read and changed on its own.
export interface StartWords {
  title: string;
  sub: string;
  // What the person hands their coding agent, the runbook's address inside it.
  line: string;
  lineLabel: string;
  presetsTitle: string;
  presets: { name: string; body: string }[];
  runbook: string;
}

const ADDRESS = "https://bmo.ahas.io/install.md";

export const START: Record<Locale, StartWords> = {
  en: {
    title: "Get started",
    sub: "Your coding agent installs BMO, not you. Open Claude Code or Codex on the machine that will run BMO and hand it this one line. It asks which install you want, asks you only for what only you have — a chat bot's token, an AI provider's sign-in, a domain — and tells you the console's address when it is done.",
    line: `Read ${ADDRESS} and install BMO on this machine.`,
    lineLabel: "Hand this line to your agent",
    presetsTitle: "Three kinds of install",
    presets: [
      { name: "Personal", body: "One person and their own BMO: the console, memory, coding agents, one chat service, documents, notes, calendar, files and mail." },
      { name: "Team", body: "Personal, plus companies, organisation units, members and room permissions, code review and research." },
      { name: "Operator", body: "Everything: the customers' voice, BMO's face, voice and vision, GPU card sharing, the node monitor and the remote machine hub." },
    ],
    runbook: "Read the runbook",
  },
  ko: {
    title: "시작하기",
    sub: "BMO는 사람이 아니라 코딩 에이전트가 설치합니다. BMO를 돌릴 컴퓨터에서 Claude Code나 Codex를 열고 아래 한 줄을 건네세요. 에이전트가 어떤 설치를 원하는지 묻고, 채팅 봇 토큰·AI 공급자 로그인·도메인처럼 당신만 가진 것만 물은 뒤, 끝나면 콘솔 주소를 알려 줍니다.",
    line: `${ADDRESS} 를 읽고 이 컴퓨터에 BMO를 설치해 줘.`,
    lineLabel: "에이전트에게 건넬 한 줄",
    presetsTitle: "세 가지 설치",
    presets: [
      { name: "개인", body: "한 사람과 그 사람의 BMO: 콘솔, 기억, 코딩 에이전트, 채팅 서비스 하나, 문서, 노트, 캘린더, 파일, 메일." },
      { name: "팀", body: "개인에 더해 회사와 조직 단위, 구성원과 방 권한, 코드 리뷰, 리서치." },
      { name: "운영자", body: "전부: 고객의 소리, 비모 얼굴, 음성과 시각, GPU 카드 공유, 노드 모니터, 원격 기기 허브." },
    ],
    runbook: "설치 런북 읽기",
  },
  ja: {
    title: "はじめる",
    sub: "BMO をインストールするのはあなたではなく、コーディングエージェントです。BMO を動かすマシンで Claude Code か Codex を開き、次の一行を渡してください。エージェントがどのインストールにするかを尋ね、チャットボットのトークン、AI プロバイダーへのサインイン、ドメインなど、あなたにしかないものだけを尋ね、終わるとコンソールのアドレスを伝えます。",
    line: `${ADDRESS} を読んで、このマシンに BMO をインストールして。`,
    lineLabel: "エージェントに渡す一行",
    presetsTitle: "三つのインストール",
    presets: [
      { name: "個人", body: "一人とその人の BMO：コンソール、記憶、コーディングエージェント、チャットサービス一つ、文書、ノート、カレンダー、ファイル、メール。" },
      { name: "チーム", body: "個人に加えて、会社と組織単位、メンバーとルームの権限、コードレビュー、リサーチ。" },
      { name: "運用者", body: "すべて：顧客の声、BMO の顔、音声と視覚、GPU カードの共有、ノードモニター、リモートマシンのハブ。" },
    ],
    runbook: "ランブックを読む",
  },
  zh: {
    title: "开始使用",
    sub: "BMO 由你的编程智能体安装，而不是由你手动安装。在将要运行 BMO 的机器上打开 Claude Code 或 Codex，把下面这一行交给它。它会问你要哪种安装，只向你索取只有你才有的东西——聊天机器人的令牌、AI 服务商的登录、域名——完成后告诉你控制台的地址。",
    line: `阅读 ${ADDRESS}，在这台机器上安装 BMO。`,
    lineLabel: "交给智能体的一行",
    presetsTitle: "三种安装",
    presets: [
      { name: "个人", body: "一个人和他自己的 BMO：控制台、记忆、编程智能体、一个聊天服务、文档、笔记、日历、文件和邮件。" },
      { name: "团队", body: "在个人之上，加上公司与组织单元、成员与聊天室权限、代码审查和调研。" },
      { name: "运营者", body: "全部：客户之声、BMO 的脸、语音与视觉、GPU 卡共享、节点监控和远程机器中枢。" },
    ],
    runbook: "阅读安装手册",
  },
};
