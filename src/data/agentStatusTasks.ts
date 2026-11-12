/**
 * 详情页任务条目。
 * 进行中拆成标题、当前状态和更细的说明；已完成保留原来的结果型标题。
 * 只用于详情页演示，不改会话里的真实任务。
 */

/** 任务状态：进行中 / 已完成 */
export type AgentStatusTaskState = 'running' | 'done';

export interface AgentStatusDetail {
  text: string;
  /** 这条细项还在进行 */
  active?: boolean;
}

export interface AgentStatusTask {
  id: string;
  title: string;
  state: AgentStatusTaskState;
  /** 进行中是第二行状态；已完成是标题下的一句结果 */
  status?: string;
  details?: AgentStatusDetail[];
}

/** 任务 Tab：进行中 2 条 + 已完成 3 条 */
export const AGENT_STATUS_TASKS: AgentStatusTask[] = [
  {
    id: 'status-note',
    title: '元宝笔记',
    state: 'running',
    status: '正在记录本场要点',
    details: [
      { text: '记录本场讨论要点' },
      { text: '整理待确认事项', active: true },
    ],
  },
  {
    id: 'status-todo',
    title: '待办捕捉',
    state: 'running',
    status: '已记下 2 条与你相关的待办',
    details: [
      { text: '对照竞品「以面为主」的布局' },
      { text: '登录页做得更亲和、有趣' },
    ],
  },
  {
    id: 'status-missed',
    title: '总结了你入会前错过的 12 分钟',
    state: 'done',
    status: '已完成',
  },
  {
    id: 'status-whitelist',
    title: '找到 10-28 白名单评审的结论和原文',
    state: 'done',
    status: '已完成',
  },
  {
    id: 'status-scale',
    title: '解释了“灰度放量”并附上内部文档',
    state: 'done',
    status: '已完成',
  },
];
