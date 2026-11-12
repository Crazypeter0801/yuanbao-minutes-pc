/**
 * Agent 状态页 · 任务数据
 * 文案取自 Figma 243:1054（概览）。
 * 状态页只做本地演示状态，不改动元宝会话里的真实任务。
 */

/** 任务状态：进行中 / 已完成 */
export type AgentStatusTaskState = 'running' | 'done';

export interface AgentStatusTask {
  id: string;
  title: string;
  state: AgentStatusTaskState;
}

/** 概览「任务」：进行中 2 条 + 已完成 3 条（Figma 243:1054） */
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
