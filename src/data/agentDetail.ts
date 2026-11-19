export type ScheduledTaskKind = 'live-note' | 'heartbeat' | 'scheduled' | 'memory';

export interface AgentScheduledTask {
  id: string;
  title: string;
  schedule: string;
  kind: ScheduledTaskKind;
  enabled: boolean;
  /** 默认收起态展示前 3 项，展开「查看所有预定任务」后显示其余 */
  secondary?: boolean;
  /** 展开后的详细信息 */
  description: string;
  nextRun: string;
  scope: string;
  /** 关联到长程任务详情（可选） */
  linkedTaskId?: string;
}

export type TimelineIconKind = 'active' | 'done' | 'memory' | 'capture';

export interface AgentTimelineItem {
  id: string;
  title: string;
  summary: string;
  time: string;
  icon: TimelineIconKind;
  detail: string;
  actionLabel: string;
  /** 点击动作后是否返回元宝对话 */
  returnToChat?: boolean;
}

export type LibraryFilter = 'all' | 'note' | 'file' | 'capture';

export interface AgentLibraryDoc {
  id: string;
  name: string;
  category: Exclude<LibraryFilter, 'all'>;
  kindLabel: string;
  meta: string;
  time: string;
}

export interface AgentPreferenceItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const INITIAL_SCHEDULED_TASKS: AgentScheduledTask[] = [
  {
    id: 'sched-live-note',
    title: '实时元宝笔记与要点提炼',
    schedule: '运行中 · 本场会议实时记录',
    kind: 'live-note',
    enabled: true,
    description: '持续识别发言主题与关键结论，自动归档至本场「元宝笔记」并同步大纲。',
    nextRun: '持续运行中（已识别 2 个核心话题）',
    scope: '本场会议 · 仅自己可见',
    linkedTaskId: 'note',
  },
  {
    id: 'sched-heartbeat',
    title: 'Heartbeat · 议题节奏守护',
    schedule: '每 15 分钟检查议题偏离与剩余时间',
    kind: 'heartbeat',
    enabled: true,
    description: '定时巡检当前讨论是否偏离既定议程，在剩余 10 分钟或出现悬而未决项时轻提示。',
    nextRun: '下次检查：16:25',
    scope: '静默提醒 · 仅推送到元宝对话',
  },
  {
    id: 'sched-post-recap',
    title: '会后自动纪要与待办分发',
    schedule: '今天 17:00 会议结束时自动触发',
    kind: 'scheduled',
    enabled: true,
    description: '散会后 2 分钟内输出默认纪要卡片与个人待办清单，支持一键分享到会议群。',
    nextRun: '预计 17:00 触发',
    scope: '输出默认纪要卡片 + 待办项',
    linkedTaskId: 'recap',
  },
  {
    id: 'sched-memory-recall',
    title: '跨会议决策记忆自动召回',
    schedule: '检测到历史项目关键词时自动触发',
    kind: 'memory',
    enabled: true,
    secondary: true,
    description: '当讨论涉及「白名单」「灰度发布」等历史议题时，自动带出上次评审结论与背景。',
    nextRun: '实时监听中',
    scope: '关联近 30 天本人参与的会议',
  },
  {
    id: 'sched-weekly-digest',
    title: '周度产品评审复盘汇总',
    schedule: '每周五 18:00 · 自动整理本周决策',
    kind: 'scheduled',
    enabled: false,
    secondary: true,
    description: '汇总本周所有产品评审会的已定结论、未决风险与待跟进项，生成周报草稿。',
    nextRun: '已暂停',
    scope: '写入个人元宝笔记空间',
  },
];

export const TODAY_TIMELINE_ITEMS: AgentTimelineItem[] = [
  {
    id: 'act-1',
    title: '正在整理「产品方案评审」实时纪要',
    summary: '已提炼 12 条核心发言，持续更新议题要点与待办',
    time: '16:10',
    icon: 'active',
    detail: '当前聚焦「AI 生成内容与会议聊天框」的交互分工，已暂存 2 条待确认决策。',
    actionLabel: '回到对话查看',
    returnToChat: true,
  },
  {
    id: 'act-2',
    title: '识别到关键议题：侧栏多标签容器规则',
    summary: '已同步至本场笔记大纲，并标注负责人与结论摘要',
    time: '16:08',
    icon: 'done',
    detail: '结论摘要：成员管理与会议聊天在同一侧栏内以标签切换，元宝浮出或全部关闭时左侧会议画面保持原宽。',
    actionLabel: '定位到笔记原文',
  },
  {
    id: 'act-3',
    title: '检索上周「白名单方案」评审结论',
    summary: '已召回 2 条历史决策记录与灰度放量条件',
    time: '15:42',
    icon: 'memory',
    detail: '来自 11 月 12 日产品评审纪要：灰度白名单优先覆盖内部核心项目组，观察 3 天后再放开。',
    actionLabel: '回到对话查看',
    returnToChat: true,
  },
  {
    id: 'act-4',
    title: '记录共享画面：客户端架构草图',
    summary: '已自动截取清晰帧并归档至本场资料库',
    time: '15:25',
    icon: 'capture',
    detail: '已识别画面中的 4 个核心模块与接口流向，可在「资料库 → 截图」随时回看。',
    actionLabel: '查看已存截图',
  },
  {
    id: 'act-5',
    title: '准备本场会议开场议程与背景卡片',
    summary: '自动对齐上次遗留的 3 项待办与今日议题顺序',
    time: '15:00',
    icon: 'done',
    detail: '入会前 2 分钟自动拉取日程与关联文档，帮助快速进入讨论上下文。',
    actionLabel: '回到对话查看',
    returnToChat: true,
  },
];

export const EXTRA_LIBRARY_DOCS: AgentLibraryDoc[] = [
  {
    id: 'hist-decision-memo',
    name: '上周评审结论：白名单灰度与容器规则',
    category: 'note',
    kindLabel: '历史纪要',
    meta: '11 月 12 日 · 3 条决策',
    time: '上周',
  },
  {
    id: 'hist-architecture-shot',
    name: '共享画面 · 客户端单窗口布局标注',
    category: 'capture',
    kindLabel: '会议截图',
    meta: '15:25 自动记录',
    time: '15:25',
  },
];

export const INITIAL_AGENT_PREFERENCES: AgentPreferenceItem[] = [
  {
    id: 'pref-auto-note',
    title: '入会后自动开启元宝笔记',
    description: '进入会议自动记录要点与议题，无需手动触发',
    enabled: true,
  },
  {
    id: 'pref-proactive',
    title: '议题跑偏与超时轻提醒',
    description: '仅在对话内以静默气泡提醒，不打断他人发言',
    enabled: true,
  },
  {
    id: 'pref-translate',
    title: '外语发言实时双语翻译',
    description: '检测到英文发言时自动在侧栏输出双语对照',
    enabled: false,
  },
  {
    id: 'pref-default-card',
    title: '会后自动生成默认纪要卡片',
    description: '会议结束后自动沉淀结构化纪要链接至个人空间',
    enabled: true,
  },
];
