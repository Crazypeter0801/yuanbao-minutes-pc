# 腾讯会议 PC · 元宝侧栏三方案（D2C 工程）

会议窗口（998）+ 元宝侧栏（400）的三套方案对比页。左侧会议窗口三套共用，**纯静态视觉还原**；
右侧元宝侧栏是各方案的差异点，**可交互**，交互逻辑与视图分离，便于二次编辑。

| 方案 | 思路 | 来源 |
| --- | --- | --- |
| A | 纪要与问答混排在同一条时间流；标签里可切底栏变体 | Figma `245:5577`（变体底栏取自 `248:13383`） |
| B | 元宝纪要为主，问元宝独立 Tab | Figma `248:13383` |
| C | 问答为主，纪要按需展开；标签里可切底栏变体 | 无稿，参考 Granola 自行设计（变体底栏取自 `248:13383`） |

页面纵向排列三套方案，壁纸固定、滚动时只有内容移动。增删方案改 `src/App.tsx` 的 `SCHEMES` 即可；
给某个方案加变体：在 `SCHEMES` 里传 `variants`，侧栏组件通过 `variant` prop 拿到当前值（示例见 `schemes/SchemeA/variants.ts`、`schemes/SchemeC/variants.ts`）。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建产物
npm run lint     # ESLint 检查
npm run typecheck
```

技术栈：React 18 + TypeScript + Vite 5 + SCSS Modules，无 UI 组件库。

## 目录结构

```
src/
├── App.tsx                         # 固定壁纸 + 方案清单 SCHEMES
├── types/chat.ts                   # 消息 / 富文本 / 纪要数据结构（三方案共用）
├── data/
│   ├── meetingSession.ts           # 会议标题 / 时长
│   └── schemeContent.ts            # 三方案 mock 文案 + 本地问答规则 answerQuestion
├── hooks/
│   ├── useYuanbaoChat.ts           # 消息流：提问 → 思考 → 回答、立即总结
│   ├── useListening.ts             # 正在听 / 暂停
│   ├── useToast.ts                 # 轻提示
│   └── useClipboard.ts             # 复制（含 http 降级）
├── components/
│   ├── SchemeWindow/               # 方案标签 + 会议窗口 + 侧栏开合
│   ├── meeting/                    # 会议窗口（静态，三方案共用）
│   ├── common/                     # Pressable / PopMenu / Toast
│   ├── sidebar/                    # 侧栏积木（三方案共用）
│   │   ├── SidebarShell / SidebarHeader
│   │   ├── MessageStream           # 滚动容器：自动滚底、顶部渐隐、贴底排列
│   │   ├── ChatList / AssistantMessageView / UserMessageView / RichText
│   │   ├── ThinkingIndicator / ListeningHint / AiDisclaimer
│   │   ├── AssistantBar / Composer  # 方案 A、C 的底部
│   │   ├── ListenPill / PillComposer / SegmentedControl  # 方案 B
│   │   └── SendButton
│   └── schemes/
│       ├── SchemeA/                # 混排
│       ├── SchemeB/                # Tab
│       └── SchemeC/                # 问答为主 + MinutesPeek / MinutesSheet
└── assets/
    ├── background/tahoe-light.jpg  # 页面壁纸
    └── d2c/{icons,images}/schemes/ # 设计稿导出（SVGR 组件 / @2x 位图）
```

## 交互清单

**通用（三方案）**：头部独立窗口 / 更多菜单 / 关闭（关闭后右上出现「元宝」恢复入口）；
提问后出现思考动画，约 0.9s 后给出回答，消息流自动滚到底；追问建议可直接点。

| 方案 | 交互 |
| --- | --- |
| A | **变体切换**（方案标签内）：「助手条 + 大输入框」= 原稿，「胶囊底栏」= 方案 B 的元宝胶囊 + 问元宝输入；切换不丢对话。输入框提问 → 问答插入纪要时间流；「立即总结」追加阶段小结；助手条暂停 / 继续；模式切换 快速 ↔ 深度思考；链接徽标定位原文 |
| B | Tab 切换（滑块动画）；在任何 Tab 提问都会切到「问元宝」；不在问元宝时有新回答 → 红点；左下胶囊菜单（立即总结 / 切换助手）、暂停 / 继续 |
| C | **变体切换**：「大输入框」= 默认，「胶囊底栏」= 快捷技能 + 方案 B 的元宝胶囊与问元宝输入（胶囊菜单多一项「查看元宝纪要」，暂停与顶部状态胶囊同步，「追问 / 基于纪要提问」同样填入胶囊输入框）。顶部纪要预览条展开为抽屉（盖住对话、点遮罩收起）；状态胶囊直接暂停 / 继续；待办可勾选；悬停结论出现「追问」，与「基于纪要提问」一样把内容带进输入框；复制全文；输入框上方快捷技能 |

问答目前由 `data/schemeContent.ts` 的 `answerQuestion` 做关键词匹配（待办 / 补一下 / 具体 / 邮件 / 主题色），
接入真实接口时替换它和 `buildStageSummary` 即可，视图不用动。

## 视觉还原

- 与设计稿逐像素比对（`fuzz 8%`）：方案 A 整图差异 0.12%、方案 B 0.08%；会议窗口两稿均 0.03%。
- 颜色全部走 `src/styles/tokens.scss` 的 CSS 变量；不用 CSS `gap`、不用原生 `<button>`；字号行高按设计稿 px。
- 设计稿未覆盖、按同一视觉语言补齐的部分：用户提问气泡、思考态、发送按钮可点态、暂停态、
  B 的「问元宝」Tab 内容、C 整套。

## 方案 C 的设计取舍

- **对话为主体**：元宝回答不用气泡、直接排版，读起来像随问随写的笔记（Granola 的做法）；用户问题用灰色气泡区分。
- **纪要退到一条预览**：只占两行（一句话进展 + 结论 / 待办计数），需要时展开为抽屉，看完就收，不和对话抢位置。
- **纪要 ↔ 问答打通**：结论可一键追问，引用来源可回到纪要，避免两套信息割裂。
- **快捷技能**：对应 Granola 的 recipes，降低面对空白输入框的启动成本。
