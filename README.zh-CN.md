[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | **简体中文**

# bmo-site

BMO 项目的网站，地址为 https://bmo.ahas.io。一个落地页提供英文（`/`）、韩文（`/ko/`）、日文（`/ja/`）和简体中文（`/zh/`）版本，介绍产品、展示控制台界面、与同类工具作比较、说明这个版本新增的内容，提供两个桌面应用的下载，并列出公开仓库。页面默认使用深色主题，访客的系统要求浅色时则显示浅色。这是用 [Astro](https://astro.build) 构建的静态网站：服务器上不运行任何东西，也不向浏览器发送框架或脚本。

## 构建与预览

```sh
bun install
bun run build      # writes the site to dist/
bun run preview    # serves dist/ at http://localhost:4321
bun run dev        # the development server with reload
```

下载区提供两个桌面应用：打开你已在运行的 BMO 服务器的远程控制器，以及在你的电脑上安装并运行 BMO 本身的 All-in-One。两者都在构建时从 jake 最新 GitHub 发布中的 `release.json`，即 `src/lib/release.ts` 指定的地址读取：远程控制器的文件在 `files` 下，All-in-One 的文件在 `allInOne.files` 下，如有每夜版，其文件在 `nightly` 下。远程控制器会在首次启动时询问各自 BMO 服务器的地址，因此同一套安装程序适用于所有部署。在发布上线之前，这个地址返回 404，下载区会说明暂时还没有可下载的版本，并链接到发布说明。部署就是把 `dist/` 复制到为该域名提供服务的主机。

“开始使用”区给出一个人交给自己编程智能体的那一行，智能体按索引的安装手册安装 BMO。`/install.md` 提供这份手册，即索引的 `INSTALL.md`，在构建时从索引的 main 分支、`src/lib/runbook.ts` 指定的地址读取；构建离线或读不到索引时，改为提供一段指向手册的简短说明。该区各语言的文字在 `src/i18n/start.ts` 中。

## 检查

```sh
bun run check      # astro check: types of the pages and scripts
bun run build && bun run test
```

`bun run test` 会像静态主机一样提供构建好的 `dist/`，并在 Chromium 中以 1440、1024、390 像素宽度、在深色与浅色两种主题下打开四个页面，检查：每个关键区块及其标题都在；每张图片都能加载、带有替代文本，且是用该页面的语言和主题截取的；比较表中每项能力都有一行，标记和脚注齐全；语言菜单能到达每个版本；没有元素超出窗口右边缘；不存在的地址返回 404 页面。它需要 `playwright-core` 固定的 Chromium 版本，缺失时会跳过。

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

每个页面上的图片都以该页面的语言、并在两种主题下截取：`/ko/` 使用韩文截图，`/`、`/ja/` 和 `/zh/` 使用英文截图，因为平台的界面使用英文和韩文。页面为深色时显示深色截图，为浅色时显示浅色截图，由访客的系统设置（`prefers-color-scheme`）决定，样式表也遵循同一设置。原图文件名以语言和主题结尾（`<name>-<en|ko>-<dark|light>.webp`），每种语言显示哪些图由 `src/lib/shots.ts` 决定，一张图的两种主题由 `src/components/Shot.astro` 提供。控制台的组织界面和应用界面用两种语言截取；其他控制台界面和大脑界面只用韩文截取，因此只出现在 `/ko/`。

截图只包含演示数据。它们取自拥有这些界面的单元的浏览器测试环境，用演示应答替换了环境自带的应答，并在两种主题下截取：

- `scripts/shots/console-shot.ts <name> <path> [width] [height]`：控制台聊天室和 TODO 面板，取自 `bmo-web` 为浏览器测试启动的控制台（`client/tests/support/browser-console.ts`，地址见 `BMO_CONSOLE_TEST_URL`）；`room /rooms/42`，以及带 `SKIP=2` 的 `room-phone /rooms/42 390 844`。
- `scripts/shots/console-screens-shot.ts [agents|cards|job]`：同一控制台中的调度角色、监控页服务标签下的 GPU 显卡，以及运行中 TODO 项目的任务日志。
- `scripts/shots/console-apps-shot.ts <en|ko> [org|catalogue|personal-apps|language]`：在同一控制台中使用一家演示公司，截取一个团队的组织界面智能体标签页、应用目录、个人应用和显示设置中的语言菜单。
- `scripts/shots/brain-shot.ts`：`bmo-brain` 浏览器宿主中关于一个人的记忆和概要。
- `scripts/shots/calendar-shot.ts <en|ko>`：`bmo-calendar` 测试页面中的周视图日历。
- `scripts/shots/artifact-shot.ts <en|ko>`：`bmo-artifact` 浏览器宿主中的档案文档。
- `scripts/shots/note-shot.ts`：`bmo-note` 浏览器环境中的笔记，按文件夹整理并加了书签，两种语言都截取。
- `scripts/shots/drive-shot.ts <en|ko>`：`bmo-drive` 浏览器宿主中的文件界面。
- `scripts/shots/theater-shot.ts <en|ko>`：`bmo-theater` 生成的浏览器宿主中的视频库，海报以抽象图案绘制。
- `scripts/shots/webp.ts`：把 `shots-out/` 中的截图转换为 `src/assets/shots/` 下的原图。

截图脚本假定各单元按 `bmo` 文件夹的布局检出在本仓库旁边。每张新图片在提交前都会人工检查是否含有个人信息。

## 比较

“BMO 与众不同之处”区块把 BMO 与五类工具并列，每一类以列出名称的两款工具为准。`src/lib/comparison.ts` 保存各项标记，并在每一行旁边记下其他工具的标记所依据的官方页面；标记只说明这些页面所描述的内容，页面上也如此注明。行、类别和脚注的文字在 `src/i18n/` 的 `compare` 下。

## 许可证

MIT，见 `LICENSE`。
