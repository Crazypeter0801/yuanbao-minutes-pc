export type ScheduledTaskKind = 'auto';

export interface AgentScheduledTask {
  id: string;
  title: string;
  schedule: string;
  kind: ScheduledTaskKind;
  enabled: boolean;
  /** 展开后的详细信息 */
  description: string;
  nextRun: string;
  scope: string;
  /** 关联到长程任务详情（可选） */
  linkedTaskId?: string;
}

export type RecentTaskStatus = 'running' | 'done';

export interface AgentRecentTaskItem {
  id: string;
  title: string;
  summary: string;
  status: RecentTaskStatus;
  /** 进行中任务在输入框上方状态栏轮播展示的实时执行阶段文案 */
  statusStages?: string[];
  detail: string;
  actionLabel: string;
  /** 点击动作后是否返回元宝对话 */
  returnToChat?: boolean;
  /** 关联到长程任务详情（可选） */
  linkedTaskId?: string;
}

export type LibraryFileIconKind = 'yuanbao' | 'pdf' | 'xlsx' | 'screenshot' | 'docx';

export interface AgentLibraryDoc {
  id: string;
  name: string;
  format: string;
  size: string;
  icon: LibraryFileIconKind;
  group: 'current' | 'earlier';
}

export type ConnectorIconId = 'figma' | 'granola' | 'tencent-doc' | 'notion' | 'zoom' | 'feishu';

export interface AgentConnectorItem {
  id: ConnectorIconId;
  name: string;
  description: string;
  connected: boolean;
  connectedAt: string;
  account: string;
}

/**
 * 自动任务列表（Figma 811:40960）
 * 默认展示 2 条自动任务，点击可展开查看执行说明与启停开关。
 */
export const INITIAL_SCHEDULED_TASKS: AgentScheduledTask[] = [
  {
    id: 'sched-record-notes',
    title: '记录会议要点',
    schedule: '每次入会时，自动整理相关讨论与待办',
    kind: 'auto',
    enabled: true,
    description: '持续识别发言主题、关键结论与待办负责人，自动同步到本场元宝笔记与资料库。',
    nextRun: '本场会议实时运行中',
    scope: '本场会议 · 仅自己可见',
    linkedTaskId: 'recent-1',
  },
  {
    id: 'sched-host-agenda',
    title: '主持会议与推进议程',
    schedule: '留意议题进展，及时提醒讨论超时或偏离主题',
    kind: 'auto',
    enabled: true,
    description: '结合会议议程自动跟踪每个议题的讨论进度，出现超时或偏题时仅在侧栏内静默提示。',
    nextRun: '每 15 分钟自动巡检议题节奏',
    scope: '静默提醒 · 仅推送到元宝对话',
    linkedTaskId: 'recent-2',
  },
];

/**
 * 最近任务列表（Figma 811:40985）
 * 与侧栏底部「进行中任务」展开面板共用同一份任务数据源：
 * 第 1 项为运行中状态，其余 3 项为已完成状态。
 */
export const RECENT_AGENT_TASKS: AgentRecentTaskItem[] = [
  {
    id: 'recent-1',
    title: '整理与我相关的结论',
    summary: '正在持续更新讨论要点',
    status: 'running',
    statusStages: [
      '正在持续更新讨论要点',
      '正在整理与我相关的结论',
      '正在提取会议关键结论与待办',
      '正在检索关联文档与历史纪要',
    ],
    detail: '当前聚焦「AI 生成内容与会议聊天框」的交互分工，已暂存 2 条与你相关的待确认结论。',
    actionLabel: '回到对话查看',
    returnToChat: true,
    linkedTaskId: 'recent-1',
  },
  {
    id: 'recent-2',
    title: '跟进「侧栏多标签」议题',
    summary: '已整理讨论要点，待确认问题已单独标出',
    status: 'done',
    detail: '结论摘要：成员管理与会议聊天在同一侧栏内以标签切换，元宝浮出或关闭时会议画面保持原宽。',
    actionLabel: '回到对话查看',
    returnToChat: true,
    linkedTaskId: 'recent-2',
  },
  {
    id: 'recent-3',
    title: '检索上周「白名单方案」评审结论',
    summary: '已找到相关记录，并提取当时的决定与条件',
    status: 'done',
    detail: '来自 11 月 12 日产品评审纪要：灰度白名单优先覆盖内部核心项目组，观察 3 天后再放开。',
    actionLabel: '回到对话查看',
    returnToChat: true,
    linkedTaskId: 'recent-3',
  },
  {
    id: 'recent-4',
    title: '保存会上分享的架构草图',
    summary: '已保存关键画面，并关联当时的讨论内容',
    status: 'done',
    detail: '已识别画面中的 4 个核心模块与接口流向，并归档至「资料库 → 本场会议」随时回看。',
    actionLabel: '查看已存资料',
    linkedTaskId: 'recent-4',
  },
];

/**
 * 资料库：本场会议文件列表（Figma 777:72286）
 */
export const LIBRARY_CURRENT_MEETING_ITEMS: AgentLibraryDoc[] = [
  {
    id: 'lib-cur-yuanbao',
    name: '竞品参考汇总',
    format: 'PDF',
    size: '8.4MB',
    icon: 'yuanbao',
    group: 'current',
  },
  {
    id: 'lib-cur-pdf',
    name: '竞品参考汇总',
    format: 'PDF',
    size: '8.4MB',
    icon: 'pdf',
    group: 'current',
  },
  {
    id: 'lib-cur-xlsx',
    name: '待办与排期',
    format: 'XLSX',
    size: '256KB',
    icon: 'xlsx',
    group: 'current',
  },
  {
    id: 'lib-cur-shot',
    name: '共享画面截图',
    format: 'PNG',
    size: '640KB',
    icon: 'screenshot',
    group: 'current',
  },
  {
    id: 'lib-cur-docx',
    name: '会后跟进清单',
    format: 'DOCX',
    size: '320KB',
    icon: 'docx',
    group: 'current',
  },
];

/**
 * 资料库：更早文件列表（Figma 777:72286）
 */
export const LIBRARY_EARLIER_ITEMS: AgentLibraryDoc[] = [
  {
    id: 'lib-old-pdf',
    name: '竞品参考汇总',
    format: 'PDF',
    size: '8.4MB',
    icon: 'pdf',
    group: 'earlier',
  },
  {
    id: 'lib-old-xlsx',
    name: '待办与排期',
    format: 'XLSX',
    size: '256KB',
    icon: 'xlsx',
    group: 'earlier',
  },
  {
    id: 'lib-old-docx',
    name: '会后跟进清单',
    format: 'DOCX',
    size: '320KB',
    icon: 'docx',
    group: 'earlier',
  },
];

/**
 * 连接器列表（Figma 777:73914 & 796:85424）
 */
export const INITIAL_AGENT_CONNECTORS: AgentConnectorItem[] = [
  {
    id: 'figma',
    name: 'Figma',
    description: '阅读设计稿，梳理反馈，开发还原',
    connected: true,
    connectedAt: '2026年11月8日',
    account: 'lichangpan@tencent.com',
  },
  {
    id: 'granola',
    name: 'Granola',
    description: '创建设计，构建可运行',
    connected: true,
    connectedAt: '2026年11月6日',
    account: 'lichangpan@tencent.com',
  },
  {
    id: 'tencent-doc',
    name: '腾讯文档',
    description: '查找文档，整理和更新内容',
    connected: false,
    connectedAt: '未连接',
    account: 'lichangpan@tencent.com',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: '查找笔记，整理知识和想法',
    connected: true,
    connectedAt: '2026年11月5日',
    account: 'lichangpan@tencent.com',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: '安排会议回顾讨论要点',
    connected: false,
    connectedAt: '未连接',
    account: 'lichangpan@tencent.com',
  },
  {
    id: 'feishu',
    name: '飞书',
    description: '查找工作资料，安排日程',
    connected: false,
    connectedAt: '未连接',
    account: 'lichangpan@tencent.com',
  },
];
