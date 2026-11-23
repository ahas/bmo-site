[English](README.md) | [한국어](README.ko.md) | **日本語** | [简体中文](README.zh-CN.md)

# bmo-site

BMO プロジェクトの Web サイトで、https://bmo.ahas.io で配信しています。英語（`/`）、韓国語（`/ko/`）、日本語（`/ja/`）、簡体字中国語（`/zh/`）のランディングページ1枚に、製品の紹介、コンソールの画面、デスクトップアプリのダウンロード、公開リポジトリの一覧をまとめています。[Astro](https://astro.build) で作った静的サイトなので、サーバーで動くものはなく、ブラウザにフレームワークも送りません。訪問者の OS に合わせてダウンロードボタンを切り替える小さなインラインスクリプトが1つあるだけです。

## ビルドとプレビュー

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

ビルド時に、デスクトップアプリの現在のリリースを `https://ai.example.org/bmo/jake/desktop/release.json`（jake の `docs/desktop.md`、"The read the console uses"）から読み、ダウンロード欄にバージョンとインストーラーを書き込みます。このアドレスに届かない場合や `BMO_SITE_OFFLINE=1` のときは、リリース文書へのリンクになります。デプロイは `dist/` をドメインを配信するホストへコピーするだけです。

## チェック

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test` はビルド済みの `dist/` を静的ホストと同じように配信し、4つのページを Chromium で幅 1440、1024、390 ピクセルで開きます。主要なセクションが見出しとともにすべてあること、すべての画像が読み込まれて代替テキストを持ち、そのページの言語で撮ったものであること、言語メニューがすべての版に届くこと、ウィンドウの右端をはみ出す要素がないこと、存在しないアドレスが 404 ページを返すことを確かめます。`playwright-core` が固定する Chromium ビルドが必要で、ない場合はスキップします。

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

ページの画像はすべてそのページの言語で撮っています。`/ko/` には韓国語のキャプチャ、`/`、`/ja/`、`/zh/` には英語のキャプチャを使います。プラットフォームの画面が英語と韓国語を話すためです。元画像のファイル名は言語で終わり（`<name>-en.webp`、`<name>-ko.webp`）、どの言語でどの画像を見せるかは `src/lib/shots.ts` が決めます。コンソールのルームは韓国語だけなので、`/ko/` にだけ載せています。

スクリーンショットにはデモデータだけを使っています。各画面を持つユニットのブラウザテスト環境で、その環境の応答の代わりにデモの応答を入れて撮っています。

- `scripts/shots/console-shot.ts`：コンソールのルームと TODO パネル。`bmo-web` がブラウザテスト用に立てるコンソール（`client/tests/support/browser-console.ts`、アドレスは `BMO_CONSOLE_TEST_URL`）で撮ります。
- `scripts/shots/calendar-shot.ts <en|ko>`：`bmo-calendar` のテストページの週表示。
- `scripts/shots/artifact-shot.ts <en|ko>`：`bmo-artifact` のブラウザホストのアーカイブ文書。
- `scripts/shots/note-shot.ts`：`bmo-note` のブラウザスタックのノート、両言語。
- `scripts/shots/webp.ts`：`shots-out/` のキャプチャを `src/assets/shots/` 以下の元画像に変換します。

キャプチャスクリプトは、`bmo` フォルダが配置するとおり各ユニットがこのリポジトリの隣にチェックアウトされていることを前提にしています。新しい画像はコミット前に個人情報がないか目で確認します。

## ライセンス

MIT。`LICENSE` を参照してください。
