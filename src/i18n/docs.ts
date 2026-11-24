import type { Locale } from "./index";

// The words of the three reading sections — the API reference, the guidebook and the release notes — in each language
// the site is read in. The guidebook's chapters and the release notes' entries are long-form text and stand in
// src/content/guide/ and src/data/releases.json; these are the words around them.

export interface ApiWords {
  title: string;
  sub: string;
  meta: string;
  unitMeta: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchCount: string;
  searchMore: string;
  units: string;
  endpoints: string;
  noEndpoints: string;
  contents: string;
  other: string;
  parameters: string;
  requestBody: string;
  responses: string;
  codes: string;
  schemas: string;
  required: string;
  deprecated: string;
  secured: string;
  servers: string;
  security: string;
  source: string;
  version: string;
  values: string;
  fallback: string;
  columns: { name: string; in: string; type: string; description: string };
  back: string;
  snapshot: string;
}

export interface GuideWords {
  title: string;
  sub: string;
  meta: string;
  chapters: string;
  previous: string;
  next: string;
  shotNote: string;
}

export interface ReleaseWords {
  title: string;
  sub: string;
  meta: string;
  upcoming: string;
  upcomingNote: string;
  released: string;
  versioningTitle: string;
  versioning: string[];
  listingTitle: string;
  listing: string;
  whatsNew: string;
}

export interface DocsWords {
  api: ApiWords;
  guide: GuideWords;
  releases: ReleaseWords;
}

export const DOCS: Record<Locale, DocsWords> = {
  en: {
    api: {
      title: "API reference",
      sub: "The HTTP API of every public unit, read from the OpenAPI document each repository keeps on its main branch. Every unit serves one documented API, and this is it.",
      meta: "The HTTP API of every public BMO unit: endpoints by tag, parameters, bodies, responses and error codes.",
      unitMeta: "The HTTP API of {unit}: {count} endpoints with their parameters, bodies, responses and error codes.",
      searchLabel: "Search every unit's endpoints",
      searchPlaceholder: "A method, a path or words, such as POST /rooms",
      searchEmpty: "No endpoint matches.",
      searchCount: "{count} endpoints match",
      searchMore: "The first {count} are shown; add words to narrow it.",
      units: "Units",
      endpoints: "{count} endpoints",
      noEndpoints: "This document declares no HTTP endpoints. The schemas it defines are listed below.",
      contents: "On this page",
      other: "Other",
      parameters: "Parameters",
      requestBody: "Request body",
      responses: "Responses",
      codes: "Error codes",
      schemas: "Schemas",
      required: "required",
      deprecated: "deprecated",
      secured: "Needs a token",
      servers: "Servers",
      security: "Authentication",
      source: "The OpenAPI document",
      version: "Version {version} · OpenAPI {openapi}",
      values: "One of",
      fallback: "Default",
      columns: { name: "Name", in: "In", type: "Type", description: "Description" },
      back: "Every unit",
      snapshot: "The descriptions are the units' own, in English. They are read from each repository's main branch when the site's snapshot is refreshed.",
    },
    guide: {
      title: "Guidebook",
      sub: "How to use BMO, from installing it to running an organisation on it, in plain words.",
      meta: "The BMO guidebook: install, the console, organisations and delegation, apps, notes, the brain, languages, sessions and administration.",
      chapters: "Chapters",
      previous: "Previous",
      next: "Next",
      shotNote: "Every picture shows demo data.",
    },
    releases: {
      title: "Release notes",
      sub: "What each release of the BMO set holds. Every unit carries the same version.",
      meta: "BMO release notes: what each release of the set holds, and how versions are numbered.",
      upcoming: "Not yet released",
      upcomingNote: "This release is being prepared for first publication. What follows is what the set holds as it stands now; the date is set on the day it is released.",
      released: "Released {date}",
      versioningTitle: "How versions are numbered",
      versioning: [
        "From 1.0.0 the whole set shares one version, numbered by semantic versioning: a release raises the version of every unit together, so the units of one version are known to work together.",
        "Between releases, nightly builds carry the next minor version with the day they were built, as <next minor>-nightly.<YYYYMMDD> — after 1.0.0, for example, 1.1.0-nightly.20261201.",
      ],
      listingTitle: "How releases are listed",
      listing: "Each release adds its entry to the release list the site is built from, the newest first, in all four languages. A release marked as not yet released has no date until it is published.",
      whatsNew: "The home page's what's new",
    },
  },
  ko: {
    api: {
      title: "API 명세",
      sub: "공개된 모든 유닛의 HTTP API입니다. 각 저장소가 main 브랜치에 두는 OpenAPI 문서를 읽어 만듭니다. 유닛마다 문서화된 API 하나를 제공하며, 이 페이지가 그 목록입니다.",
      meta: "공개된 모든 BMO 유닛의 HTTP API: 태그별 엔드포인트, 매개변수, 본문, 응답, 오류 코드.",
      unitMeta: "{unit}의 HTTP API: 엔드포인트 {count}개의 매개변수, 본문, 응답, 오류 코드.",
      searchLabel: "모든 유닛의 엔드포인트 검색",
      searchPlaceholder: "메서드, 경로 또는 단어 (예: POST /rooms)",
      searchEmpty: "일치하는 엔드포인트가 없습니다.",
      searchCount: "엔드포인트 {count}개 일치",
      searchMore: "처음 {count}개만 보여 줍니다. 단어를 더 넣어 좁혀 보세요.",
      units: "유닛",
      endpoints: "엔드포인트 {count}개",
      noEndpoints: "이 문서에는 HTTP 엔드포인트가 없습니다. 문서가 정의하는 스키마는 아래에 있습니다.",
      contents: "이 페이지의 내용",
      other: "기타",
      parameters: "매개변수",
      requestBody: "요청 본문",
      responses: "응답",
      codes: "오류 코드",
      schemas: "스키마",
      required: "필수",
      deprecated: "사용 중단",
      secured: "토큰 필요",
      servers: "서버",
      security: "인증",
      source: "OpenAPI 문서",
      version: "버전 {version} · OpenAPI {openapi}",
      values: "다음 중 하나",
      fallback: "기본값",
      columns: { name: "이름", in: "위치", type: "타입", description: "설명" },
      back: "모든 유닛",
      snapshot: "설명은 각 유닛이 직접 쓴 영어 원문입니다. 사이트의 스냅샷을 새로 고칠 때 각 저장소의 main 브랜치에서 읽어 옵니다.",
    },
    guide: {
      title: "가이드북",
      sub: "설치부터 조직 운영까지, BMO를 쓰는 방법을 쉬운 말로 정리했습니다.",
      meta: "BMO 가이드북: 설치, 콘솔, 조직과 위임, 앱, 노트, 브레인, 언어, 세션, 관리.",
      chapters: "목차",
      previous: "이전",
      next: "다음",
      shotNote: "모든 그림은 데모 데이터입니다.",
    },
    releases: {
      title: "릴리즈 노트",
      sub: "BMO 세트의 릴리즈마다 담긴 내용입니다. 모든 유닛이 같은 버전을 씁니다.",
      meta: "BMO 릴리즈 노트: 릴리즈마다 담긴 내용과 버전을 매기는 방법.",
      upcoming: "공개 예정",
      upcomingNote: "이 릴리즈는 첫 공개를 준비하고 있습니다. 아래는 지금 세트에 담긴 내용이며, 날짜는 공개하는 날 정해집니다.",
      released: "{date} 공개",
      versioningTitle: "버전을 매기는 방법",
      versioning: [
        "1.0.0부터 세트 전체가 하나의 버전을 함께 씁니다. 시맨틱 버저닝을 따르며, 릴리즈가 나오면 모든 유닛의 버전이 함께 오르므로 같은 버전의 유닛끼리는 함께 동작함이 보장됩니다.",
        "릴리즈 사이의 나이틀리 빌드는 다음 마이너 버전에 빌드한 날짜를 붙여 <다음 마이너>-nightly.<YYYYMMDD> 형식을 씁니다. 예를 들어 1.0.0 다음에는 1.1.0-nightly.20261201처럼 붙습니다.",
      ],
      listingTitle: "릴리즈를 싣는 방법",
      listing: "릴리즈가 나올 때마다 사이트가 읽는 릴리즈 목록에 네 가지 언어로 항목이 하나씩 추가되며, 가장 최근 릴리즈가 맨 위에 옵니다. 공개 예정인 릴리즈는 공개될 때까지 날짜가 없습니다.",
      whatsNew: "홈 페이지의 새 기능",
    },
  },
  ja: {
    api: {
      title: "API リファレンス",
      sub: "公開されているすべてのユニットの HTTP API です。各リポジトリが main ブランチに置く OpenAPI ドキュメントから作られます。ユニットはそれぞれ文書化された API を 1 つ提供し、このページがその一覧です。",
      meta: "公開されているすべての BMO ユニットの HTTP API：タグ別のエンドポイント、パラメーター、ボディ、レスポンス、エラーコード。",
      unitMeta: "{unit} の HTTP API：{count} 個のエンドポイントのパラメーター、ボディ、レスポンス、エラーコード。",
      searchLabel: "すべてのユニットのエンドポイントを検索",
      searchPlaceholder: "メソッド、パス、または語句（例：POST /rooms）",
      searchEmpty: "一致するエンドポイントはありません。",
      searchCount: "{count} 個のエンドポイントが一致",
      searchMore: "最初の {count} 件を表示しています。語句を足して絞り込んでください。",
      units: "ユニット",
      endpoints: "エンドポイント {count} 個",
      noEndpoints: "このドキュメントには HTTP エンドポイントがありません。定義されているスキーマは下にあります。",
      contents: "このページの内容",
      other: "その他",
      parameters: "パラメーター",
      requestBody: "リクエストボディ",
      responses: "レスポンス",
      codes: "エラーコード",
      schemas: "スキーマ",
      required: "必須",
      deprecated: "非推奨",
      secured: "トークンが必要",
      servers: "サーバー",
      security: "認証",
      source: "OpenAPI ドキュメント",
      version: "バージョン {version} · OpenAPI {openapi}",
      values: "次のいずれか",
      fallback: "既定値",
      columns: { name: "名前", in: "場所", type: "型", description: "説明" },
      back: "すべてのユニット",
      snapshot: "説明は各ユニット自身による英語の原文です。サイトのスナップショットを更新するときに、各リポジトリの main ブランチから読み込みます。",
    },
    guide: {
      title: "ガイドブック",
      sub: "インストールから組織の運用まで、BMO の使い方をやさしい言葉でまとめました。",
      meta: "BMO ガイドブック：インストール、コンソール、組織と委任、アプリ、ノート、ブレイン、言語、セッション、管理。",
      chapters: "目次",
      previous: "前へ",
      next: "次へ",
      shotNote: "画像はすべてデモデータです。",
    },
    releases: {
      title: "リリースノート",
      sub: "BMO セットの各リリースの内容です。すべてのユニットが同じバージョンを使います。",
      meta: "BMO リリースノート：各リリースの内容とバージョンの付け方。",
      upcoming: "公開予定",
      upcomingNote: "このリリースは初公開に向けて準備中です。以下は現在セットに含まれている内容で、日付は公開日に決まります。",
      released: "{date} 公開",
      versioningTitle: "バージョンの付け方",
      versioning: [
        "1.0.0 からはセット全体で 1 つのバージョンを共有します。セマンティック バージョニングに従い、リリースのたびにすべてのユニットのバージョンがそろって上がるため、同じバージョンのユニットどうしは一緒に動くことが保証されます。",
        "リリースの間のナイトリービルドは、次のマイナーバージョンにビルド日を付けた <次のマイナー>-nightly.<YYYYMMDD> の形を使います。たとえば 1.0.0 の後なら 1.1.0-nightly.20261201 です。",
      ],
      listingTitle: "リリースの載せ方",
      listing: "リリースのたびに、サイトが読み込むリリース一覧へ 4 つの言語で項目が 1 つずつ加わり、最新のものがいちばん上に来ます。公開予定のリリースには公開されるまで日付がありません。",
      whatsNew: "ホームページの新機能",
    },
  },
  zh: {
    api: {
      title: "API 参考",
      sub: "所有公开单元的 HTTP API，读取自各仓库 main 分支上的 OpenAPI 文档。每个单元都提供一套有文档的 API，本页就是它们的汇总。",
      meta: "所有公开 BMO 单元的 HTTP API：按标签分组的接口、参数、请求体、响应与错误码。",
      unitMeta: "{unit} 的 HTTP API：{count} 个接口的参数、请求体、响应与错误码。",
      searchLabel: "搜索所有单元的接口",
      searchPlaceholder: "方法、路径或关键词，例如 POST /rooms",
      searchEmpty: "没有匹配的接口。",
      searchCount: "匹配到 {count} 个接口",
      searchMore: "只显示前 {count} 个；请再加些关键词缩小范围。",
      units: "单元",
      endpoints: "{count} 个接口",
      noEndpoints: "此文档没有声明 HTTP 接口，其中定义的数据结构列在下方。",
      contents: "本页内容",
      other: "其他",
      parameters: "参数",
      requestBody: "请求体",
      responses: "响应",
      codes: "错误码",
      schemas: "数据结构",
      required: "必填",
      deprecated: "已弃用",
      secured: "需要令牌",
      servers: "服务器",
      security: "认证",
      source: "OpenAPI 文档",
      version: "版本 {version} · OpenAPI {openapi}",
      values: "可选值",
      fallback: "默认值",
      columns: { name: "名称", in: "位置", type: "类型", description: "说明" },
      back: "所有单元",
      snapshot: "说明文字是各单元自己写的英文原文，在刷新网站快照时从各仓库的 main 分支读取。",
    },
    guide: {
      title: "使用指南",
      sub: "从安装到用它运营一个组织，用浅显的话讲清 BMO 的用法。",
      meta: "BMO 使用指南：安装、控制台、组织与委托、应用、笔记、记忆库、语言、会话与管理。",
      chapters: "目录",
      previous: "上一章",
      next: "下一章",
      shotNote: "所有图片均为演示数据。",
    },
    releases: {
      title: "发布说明",
      sub: "BMO 套件每次发布的内容。所有单元使用同一个版本号。",
      meta: "BMO 发布说明：每次发布的内容，以及版本号的编排方式。",
      upcoming: "尚未发布",
      upcomingNote: "此版本正在为首次公开做准备。以下是套件目前包含的内容，日期将在发布当天确定。",
      released: "{date} 发布",
      versioningTitle: "版本号如何编排",
      versioning: [
        "从 1.0.0 起，整个套件共用一个版本号，遵循语义化版本：每次发布时所有单元的版本一起提升，因此同一版本的单元保证可以协同工作。",
        "两次发布之间的每夜构建使用下一个次版本号加上构建日期，形如 <下一次版本>-nightly.<YYYYMMDD>；例如 1.0.0 之后为 1.1.0-nightly.20261201。",
      ],
      listingTitle: "发布如何列出",
      listing: "每次发布都会在网站读取的发布列表中以四种语言各添加一条，最新的排在最前。尚未发布的版本在发布之前没有日期。",
      whatsNew: "首页的新功能",
    },
  },
};

/** A phrase with its {name} slots filled. */
export function fill(phrase: string, values: Record<string, string | number>): string {
  return phrase.replace(/\{(\w+)\}/g, (slot, name: string) => (name in values ? String(values[name]) : slot));
}
