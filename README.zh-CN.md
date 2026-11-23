[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | **简体中文**

# bmo-site

BMO 项目的网站，地址为 https://bmo.ahas.io。一个落地页提供英文（`/`）、韩文（`/ko/`）、日文（`/ja/`）和简体中文（`/zh/`）版本，介绍产品、展示控制台界面、提供桌面应用下载，并列出公开仓库。这是用 [Astro](https://astro.build) 构建的静态网站：服务器上不运行任何东西，也不向浏览器发送框架，只有一段很小的内联脚本，用来按访客的系统切换下载按钮。

## 构建与预览

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

构建时会从 `https://ai.example.org/bmo/jake/desktop/release.json`（见 jake 的 `docs/desktop.md`，"The read the console uses"）读取桌面应用的当前版本，并把版本号和安装包写进下载区。若无法访问该地址，或设置了 `BMO_SITE_OFFLINE=1`，则改为链接到发布说明。部署就是把 `dist/` 复制到为该域名提供服务的主机。

## 检查

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test` 会像静态主机一样提供构建好的 `dist/`，并在 Chromium 中以 1440、1024、390 像素宽度打开四个页面，检查：每个关键区块及其标题都在；每张图片都能加载、带有替代文本，且是用该页面语言截取的；语言菜单能到达每个版本；没有元素超出窗口右边缘；不存在的地址返回 404 页面。它需要 `playwright-core` 固定的 Chromium 版本，缺失时会跳过。

## 结构

| 路径 | 内容 |
|---|---|
| `src/pages/` | 英文页面、`ko/` 下的韩文页面、404 页面和站点地图 |
| `src/components/Home.astro` | 落地页的全部区块，以一种语言的文字写成 |
| `src/layouts/Layout.astro` | 文档头部、导航和页脚 |
| `src/i18n/` | 网站文案，`en.ts`、`ko.ts`、`ja.ts`、`zh.ts` 结构相同 |
| `src/lib/` | 地址、版本读取和公开仓库列表 |
| `src/assets/shots/` | 页面使用的截图，WebP 原图由构建生成多种尺寸的 AVIF 与 WebP |
| `src/styles/global.css` | 唯一的样式表 |
| `scripts/shots/` | 用于截图的脚本 |
| `tests/` | 构建后页面的浏览器测试 |

## 截图

每个页面上的图片都以该页面的语言截取：`/ko/` 使用韩文截图，`/`、`/ja/` 和 `/zh/` 使用英文截图，因为平台的界面使用英文和韩文。原图文件名以语言结尾（`<name>-en.webp` 或 `<name>-ko.webp`），每种语言显示哪张图由 `src/lib/shots.ts` 决定。控制台的聊天室只有韩文，因此只出现在 `/ko/`。

截图只包含演示数据。它们取自拥有这些界面的单元的浏览器测试环境，并用演示应答替换了环境自带的应答：

- `scripts/shots/console-shot.ts`：控制台聊天室与 TODO 面板，取自 `bmo-web` 为浏览器测试启动的控制台（`client/tests/support/browser-console.ts`，地址在 `BMO_CONSOLE_TEST_URL`）。
- `scripts/shots/calendar-shot.ts <en|ko>`：`bmo-calendar` 测试页面上的周视图。
- `scripts/shots/artifact-shot.ts <en|ko>`：`bmo-artifact` 浏览器宿主上的归档文档。
- `scripts/shots/note-shot.ts`：`bmo-note` 浏览器环境中的笔记，两种语言。
- `scripts/shots/webp.ts`：把 `shots-out/` 中的截图转换为 `src/assets/shots/` 下的原图。

截图脚本假定各单元按 `bmo` 文件夹的布局检出在本仓库旁边。每张新图片在提交前都会人工检查是否含有个人信息。

## 许可证

MIT，见 `LICENSE`。
