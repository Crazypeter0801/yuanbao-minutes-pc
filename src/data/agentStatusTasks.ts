/**
 * 详情页任务条目。
 * 进行中只有标题和一行状态；已完成只有带勾的标题。
 * 只用于详情页演示，不改会话里的真实任务。
 */

/** 任务状态：进行中 / 已完成 */
export type AgentStatusTaskState = 'running' | 'done';

export interface AgentStatusTask {
  id: string;
  title: string;
  state: AgentStatusTaskState;
  /** 进行中第二行的状态说明 */
  status?: string;
}

/** 任务 Tab：进行中 2 条 + 已完成 3 条 */
export const AGENT_STATUS_TASKS: AgentStatusTask[] = [
  {
    id: 'status-note',
    title: '元宝笔记',
    state: 'running',
    status: '正在记录本场要点',
  },
  {
    id: 'status-todo',
    title: '待办捕捉',
    state: 'running',
    status: '已记下 2 条与你相关的待办',
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
