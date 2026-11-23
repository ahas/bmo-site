[English](README.md) | [한국어](README.ko.md) | **日本語** | [简体中文](README.zh-CN.md)

# bmo-site

BMO プロジェクトの Web サイトで、https://bmo.ahas.io で配信しています。英語（`/`）、韓国語（`/ko/`）、日本語（`/ja/`）、簡体字中国語（`/zh/`）のランディングページ1枚に、製品の紹介、コンソールの画面、似たツールとの比較、デスクトップアプリのダウンロード、公開リポジトリの一覧をまとめています。ページはダークテーマで表示され、閲覧者のシステムがライトテーマを求めればライトで表示されます。[Astro](https://astro.build) で作った静的サイトなので、サーバーで動くものはなく、ブラウザにフレームワークも送りません。訪問者の OS に合わせてダウンロードボタンを切り替える小さなインラインスクリプトが1つあるだけです。

## ビルドとプレビュー

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

ダウンロード欄にはデスクトップアプリの公開リリースを載せます。ビルド時に jake の最新 GitHub リリースの `release.json`、つまり `src/lib/release.ts` が指すアドレスから読みます。公開ビルドは初回起動時にそれぞれの BMO サーバーのアドレスを尋ね、そのサーバーのコンソールを開くため、同じインストーラーをどのデプロイでも使えます。そのリリースが公開されるまではアドレスが 404 を返し、ダウンロード欄は公開ビルドがまだないことを示してリリース文書へリンクします。デプロイは `dist/` をドメインを配信するホストへコピーするだけです。

「はじめる」欄は、人が自分のコーディングエージェントに渡す一行を示し、エージェントはインデックスのランブックどおりに BMO をインストールします。`/install.md` はそのランブック、つまりインデックスの `INSTALL.md` を、ビルド時にインデックスの main ブランチから `src/lib/runbook.ts` が指すアドレスで読んで配信します。ビルドがオフラインかインデックスを読めないときは、ランブックを指す短い案内を代わりに配信します。この欄の各言語の文言は `src/i18n/start.ts` にあります。

## チェック

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test` はビルド済みの `dist/` を静的ホストと同じように配信し、4つのページを Chromium で幅 1440、1024、390 ピクセル、ダークとライトの両テーマで開きます。主要なセクションが見出しとともにすべてあること、すべての画像が読み込まれて代替テキストを持ち、そのページの言語とテーマで撮ったものであること、比較表に機能ごとの行と印と脚注がすべてあること、言語メニューがすべての版に届くこと、ウィンドウの右端をはみ出す要素がないこと、存在しないアドレスが 404 ページを返すことを確かめます。`playwright-core` が固定する Chromium ビルドが必要で、ない場合はスキップします。

## 構成

| パス | 中身 |
|---|---|
| `src/pages/` | 英語ページ、`ko/` 以下の韓国語ページ、404 ページ、サイトマップ |
| `src/components/Home.astro` | ランディングページの全セクションを1つの言語の文で |
| `src/layouts/Layout.astro` | 文書のヘッド、ナビゲーション、フッター |
| `src/i18n/` | サイトの文言。`en.ts`、`ko.ts`、`ja.ts`、`zh.ts` が同じ形 |
| `src/lib/` | アドレス、リリースの読み取り、公開リポジトリの一覧 |
| `src/assets/shots/` | ページに載せるスクリーンショット。WebP の元画像をビルドが AVIF と WebP の各サイズにする |
| `src/styles/global.css` | スタイルシート1つ |
| `scripts/shots/` | スクリーンショットを撮ったキャプチャスクリプト |
| `tests/` | ビルド済みページのブラウザテスト |

## スクリーンショット

ページの画像はすべてそのページの言語で、両方のテーマで撮っています。`/ko/` には韓国語のキャプチャ、`/`、`/ja/`、`/zh/` には英語のキャプチャを使います。プラットフォームの画面が英語と韓国語を話すためです。ページがダークならダークのキャプチャを、ライトならライトのキャプチャを見せ、それは閲覧者のシステム設定（`prefers-color-scheme`）が決めます。スタイルシートも同じ設定に従います。元画像のファイル名は言語とテーマで終わり（`<name>-<en|ko>-<dark|light>.webp`）、どの言語でどの画像を見せるかは `src/lib/shots.ts` が、1枚の画像の両テーマを出すのは `src/components/Shot.astro` が受け持ちます。コンソール自身の画面とブレインの画面は韓国語だけなので、`/ko/` にだけ載せています。

スクリーンショットにはデモデータだけを使っています。各画面を持つユニットのブラウザテスト環境で、その環境の応答の代わりにデモの応答を入れ、両方のテーマで撮っています。

- `scripts/shots/console-shot.ts <name> <path> [width] [height]`：コンソールのルームと TODO パネル。`bmo-web` がブラウザテスト用に立ち上げるコンソール（`client/tests/support/browser-console.ts`、アドレスは `BMO_CONSOLE_TEST_URL`）で撮ります。`room /rooms/42` と、`SKIP=2` で `room-phone /rooms/42 390 844`。
- `scripts/shots/console-screens-shot.ts [agents|cards|job]`：同じコンソールのエージェンシーの役割、モニターのサービスタブの GPU カード、実行中の TODO 項目のジョブログ。
- `scripts/shots/brain-shot.ts`：`bmo-brain` のブラウザホストで、ある人についての記憶とまとめ。
- `scripts/shots/calendar-shot.ts <en|ko>`：`bmo-calendar` のテストページの週表示カレンダー。
- `scripts/shots/artifact-shot.ts <en|ko>`：`bmo-artifact` のブラウザホストのアーカイブ文書。
- `scripts/shots/note-shot.ts`：`bmo-note` のブラウザスタックのノート。両方の言語で撮ります。
- `scripts/shots/drive-shot.ts <en|ko>`：`bmo-drive` のブラウザホストのファイル画面。
- `scripts/shots/theater-shot.ts <en|ko>`：`bmo-theater` が生成するブラウザホストの動画ライブラリ。ポスターは抽象的な絵として描きます。
- `scripts/shots/webp.ts`：`shots-out/` のキャプチャを `src/assets/shots/` の元画像に変換します。

キャプチャスクリプトは、`bmo` フォルダーの配置どおりに各ユニットがこのリポジトリの隣にチェックアウトされていることを前提にしています。新しい画像はコミットする前に、個人情報が写っていないか目で確認します。

## 比較

「BMO にしかないもの」のセクションは、BMO を 5 つの分類のツールと並べ、分類ごとに名前を挙げた 2 つのツールで判断します。`src/lib/comparison.ts` に印と、行ごとに他ツールの印の根拠となった公式ページを記しています。印はそれらのページが説明していることだけを示し、ページにもそう明記しています。行・分類・脚注の文言は `src/i18n/` の `compare` にあります。

## ライセンス

MIT。`LICENSE` を参照してください。
