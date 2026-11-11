/**
 * Agent 状态页 · 任务数据
 * 文案取自 Figma 243:1054（方案一 · 动态）与 243:1376（方案二 · 自上而下）。
 * 两个方案的任务结构不同，分别导出；状态页只做本地演示状态，不改动元宝会话里的真实任务。
 */

/** 任务状态：进行中 / 待确认 / 已完成 */
export type AgentStatusTaskState = 'running' | 'confirm' | 'done';

export interface AgentStatusTask {
  id: string;
  title: string;
  /** 方案二任务行副标题；方案一的任务行不显示 */
  meta?: string;
  state: AgentStatusTaskState;
  /** 方案二右侧的附加信息，如「128 句」「18 页」 */
  trailing?: string;
  /** 方案二待确认任务的按钮文案 */
  action?: string;
  /** 用户点过停止后置为 true：只保留一行标题 */
  stopped?: boolean;
}

/** 方案一「动态」：进行中 2 条 + 已完成 3 条（Figma 243:1054） */
export const AGENT_STATUS_TASKS: AgentStatusTask[] = [
  {
    id: 'status-note',
    title: '元宝笔记：正在记录本场要点',
    state: 'running',
  },
  {
    id: 'status-todo',
    title: '待办捕捉：已记下 2 条与你相关的待办',
    state: 'running',
  },
  {
    id: 'status-missed',
    title: '总结了你入会前错过的 12 分钟',
    state: 'done',
  },
  {
    id: 'status-whitelist',
    title: '找到 10-28 白名单评审的结论和原文',
    state: 'done',
  },
  {
    id: 'status-scale',
    title: '解释了“灰度放量”并附上内部文档',
    state: 'done',
  },
];

/** 方案二「自上而下」：最近任务 3 条（Figma 243:1376） */
export const AGENT_FLOW_TASKS: AgentStatusTask[] = [
  {
    id: 'flow-translate',
    title: '实时翻译（中→英）',
    meta: '已翻译 128 句 · 英文字幕已开启',
    state: 'running',
    trailing: '128 句',
  },
  {
    id: 'flow-ocr',
    title: '识别 PPT 第 12 页',
    meta: '共享画面 OCR · 已识别 86 字',
    state: 'confirm',
    action: '去确认',
  },
  {
    id: 'flow-early',
    title: '补上前 5 分钟要点',
    meta: '为中途入会的 Lori · 刚刚',
    state: 'done',
    trailing: '查看',
  },
];
