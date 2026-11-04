# 元宝侧栏 · 方案 A v1（Figma code layer 版）

腾讯会议 PC 会议窗口（998，静态）+ 元宝侧栏（400，可交互）= **1398 × 674**，
对应 Figma `3wu4oky69kHrsQLOzOVAJg` / node `245:5577`「纪要与问答混排」，底部为「助手条 + 大输入框」。

这是从三方案对比工程 `yuanbao-minutes-pc` 中拆出的**独立工程**，专门用于导入 Figma code layer；
不含方案 B / C、变体切换和壁纸，原工程不受影响。

## 导入 Figma（上传本地文件夹）

1. 在 Figma Design 文件里按 `B`（或工具栏 **Code**），在画布上拉出一个 code layer，
   右侧尺寸设为 **W 1398 / H 674**。
2. 选择 **Upload a local folder**，选中本文件夹 `yuanbao-scheme-a-codelayer`。
   - 不要带 `node_modules`、`dist`（本文件夹交付时已不含）。
3. 等 Figma 安装依赖并执行 `npm run build`，完成后点右上角 **Play** 即可交互。

> 本地上传的文件夹**不会**与 Git 保持连接：在 Figma 里改的代码无法 push 回来。
> 想要两边持续同步，需要把本工程放到 **github.com** 的仓库，再在 code layer 里用
> **Connect a GitHub repo**（Figma 无法访问 git.woa.com 这类内网仓库）。放外部仓库前请先确认是否符合公司的信息安全要求，建议使用私有仓库。

## 满足的导入要求

| 要求（Figma 文档） | 本工程 |
| --- | --- |
| 前端 Web 应用 | Vite 5 + React 18 + TypeScript |
| 有入口 | `index.html` → `src/main.tsx`；`npm start` / `npm run dev` |
| 有 build 脚本 | `npm run build`（= `vite build`） |
| 只用公共 npm 包 | 依赖全部来自 registry.npmjs.org（见 `package-lock.json`），无私有包、无内网地址 |
| 体积（上传 ≤ 1 GB） | 源码约 3 MB（含一张 2.6 MB 会议画面） |

## 为了在 Figma 里好协作做的处理

- **纯 CSS Modules，无 Sass**：样式是普通 `.module.css`，Figma 的 **Edit（点选改属性）** 和 agent 都更好识别。
- **类名可读、无 hash**：渲染出的类名形如 `AssistantBar__bar`、`Composer__composer`、`MeetingTitleBar__dotClose`，
  用 **Extract designs** 抽回设计图层时，图层名能直接对应到组件。
- **设计 Token 集中**：所有颜色 / 阴影 / 渐变都是 `src/styles/global.css` 顶部的 `--wm-*` 变量，
  改一处即全局生效；变量名沿用设计侧 `wm_color_*`。
- **文案集中**：`src/data/schemeContent.ts`（初始纪要 + 关键词问答规则）、`src/data/meetingSession.ts`（会议标题 / 时长）。
- **描边不占布局**：0.5px 发丝线用 `inset box-shadow` 实现（同 Figma 内侧描边），任何缩放下高度都与设计稿一致。

## 可交互的部分（只在右侧元宝侧栏）

- 输入框提问（Enter 发送，Shift+Enter 换行）→ 思考动画 → 回答插入纪要时间流，自动滚到底
- 追问建议、「立即总结」、助手条暂停 / 继续、回答模式「快速 ↔ 深度思考」
- 头部：独立窗口、更多菜单（导出纪要 / 纪要设置）、关闭侧栏（关闭后右上出现「元宝」恢复入口）
- 链接徽标「查看原文」、各操作的轻提示

问答为本地关键词匹配（待办 / 补一下 / 具体 / 邮件 / 主题色），不连接真实元宝接口。

## 本地运行

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build
npm run typecheck
```

## 目录

```
src/
├── App.tsx                       # 1398×674 窗口：会议窗口 + 元宝侧栏
├── styles/global.css             # --wm-* 设计 Token + reset
├── data/                         # 文案与问答规则
├── hooks/                        # useYuanbaoChat / useListening / useToast
├── types/chat.ts
├── components/
│   ├── meeting/                  # 会议窗口（标题栏 / 画面 / 工具栏），静态
│   ├── YuanbaoSidebar/           # 方案 A v1 组合
│   ├── sidebar/                  # 侧栏积木：头部、消息流、气泡、助手条、输入框……
│   └── common/                   # Pressable / PopMenu / Toast
└── assets/
    ├── icons/                    # 设计稿导出的 SVG（React 组件）
    └── images/                   # 会议画面 @2x
```

## 还原度

与 Figma `245:5577` 的 2x 导出图逐像素比对（容差 8%）：整图差异 **0.14%**，会议窗口 0.04%，侧栏 0.41%
（剩余差异主要是字体抗锯齿与阴影）。
