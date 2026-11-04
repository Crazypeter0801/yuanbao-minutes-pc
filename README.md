# 腾讯会议 PC · 元宝 Agent 对话区（V1）

还原 Figma `3wu4oky69kHrsQLOzOVAJg` / node `257:1540`：一个 1440 × 760 的窗口，左边是会议区，右边是元宝 Agent 对话区。

- 左边的会议区（标题栏、演讲者视图——顶部 5 人头像条 + 主讲人大画面、工具栏）只做了视觉还原。唯一的交互是工具栏胶囊里倒数第二个「元宝」按钮：点它开关右侧元宝侧栏。
- 右边的元宝对话区是**可以交互的**。

## 分支

本工程用 git 管理版本：

| 分支 / 标签 | 内容 |
| --- | --- |
| **`v1`**（当前） | 基于 Figma 257:1540 的元宝对话区 |
| `main` | 三方案对比页的最后状态，只读 |
| `archive/*` 分支、`archive/2026-11-04-*` 标签 | 归档的历史版本，包括三方案对比页和 3 个方案 A code layer 版本 |

```bash
git branch --show-current     # 看当前在哪个分支
git tag -l 'archive/*'        # 列出所有归档版本
```

归档说明和找回方法见 `../_archive/2026-11-04_元宝侧栏历史版本/README.md`。

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
npm run typecheck
```

## 右侧对话区能做什么

| 区域 | 交互 |
| --- | --- |
| 输入框 | 按 Enter 发送，Shift+Enter 换行，最多自动撑高到 4 行；没输入内容时发送按钮置灰 |
| 对话流 | 发出问题后，你的提问显示在右侧气泡里，接着出现思考动画，约 0.9 秒后元宝回答；回答下方带引用来源和追问建议，追问建议点一下就能直接问；有新消息时自动滚到底部 |
| 记笔记胶囊 | 「保存截图」会在对话里插入一条确认消息，并弹出提示；暂停后胶囊显示「元宝已暂停记笔记」，暂停按钮变成播放三角，再点一下继续 |
| 头部 | 独立窗口；更多菜单里有立即总结、导出纪要文档、纪要设置；右上角 × 关闭侧栏，会议区随即撑满整个窗口 |
| 工具栏「元宝」按钮 | 侧栏关闭后点它重新打开（侧栏开着时点它收起）；不再有悬浮的「元宝」入口 |
| 链接图标 | 气泡末尾的链接图标表示「查看原文」，点击后定位到原文（演示） |

元宝的回答目前是按关键词匹配的演示内容，覆盖「待办 / 补一下 / 具体 / 邮件 / 主题色」几类问题。要接入真实接口，替换 `src/data/yuanbaoContent.ts` 里的 `answerQuestion` 即可。

## 目录

```
src/
├── App.tsx                        # 固定壁纸 + 1440×760 窗口；管理侧栏开关
├── styles/tokens.scss             # --wm-* 设计 Token
├── data/
│   ├── meetingSession.ts          # 会议标题 / 时长
│   └── yuanbaoContent.ts          # 初始纪要、问答规则、截图确认文案
├── hooks/                         # useYuanbaoChat / useListening / useToast
├── types/chat.ts
├── components/
│   ├── meeting/                   # 会议区：MeetingTitleBar / MeetingStage（头像条 + 大画面）/ MeetingToolbar
│   ├── YuanbaoSidebar/            # V1 对话区组合
│   ├── sidebar/                   # 对话区积木：Shell / Header / MessageStream / ChatList / 气泡 /
│   │                              #             NotePill（记笔记胶囊）/ ChatInput（输入框）/ SendButton
│   └── common/                    # Pressable / PopMenu / Toast
└── assets/
    ├── background/tahoe-light.jpg
    └── d2c/{icons,images}/v1/     # 设计稿导出的资源（SVGR 组件 / @2x 位图）
```

## 还原度

把页面截图和 Figma `257:1540` 的 2 倍图逐像素比对（容差 8%）：

| 区域 | 差异 |
| --- | --- |
| 整个窗口 | 0.13% |
| 标题栏 | 0.53% |
| 头像条 | 0.29% |
| 主讲人大画面 | 0.04% |
| 工具栏 | 0.09% |
| 元宝对话区 | 0.19% |

设计稿没画、我按同一套视觉补上的部分：你的提问气泡、思考动画、可发送时的发送按钮、暂停状态、保存截图后的确认消息、输入框多行撑高。
