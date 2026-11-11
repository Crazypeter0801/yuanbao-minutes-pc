/**
 * 元宝 personal agent 的会话列表（演示数据）
 * 听记 11-10：会议场景作为元宝主端的一个「分组」，用户在会议里建的对话都沉淀在主端「腾讯会议」分组里；
 * 会议里的对话和主端是同一份上下文、记忆、产物，两边信息打通。
 */
export interface AgentSession {
  id: string;
  title: string;
  /** 右侧小字：状态或时间 */
  meta: string;
  /** 进行中的会议会话（当前会议默认置顶，和历史会话区分） */
  live?: boolean;
}

export interface AgentSessionGroup {
  id: string;
  title: string;
  sessions: AgentSession[];
}

/** 当前这场会议对应的会话 id */
export const CURRENT_SESSION_ID = 'meeting-visual-review';

export const agentSessionGroups: AgentSessionGroup[] = [
  {
    id: 'meeting',
    title: '腾讯会议',
    sessions: [
      { id: CURRENT_SESSION_ID, title: '视觉改版方向评审', meta: '进行中', live: true },
      { id: 'meeting-weekly', title: '设计周会', meta: '昨天' },
      { id: 'meeting-competitor', title: '竞品分析同步', meta: '11-08' },
    ],
  },
  {
    id: 'all',
    title: '全部对话',
    sessions: [
      { id: 'chat-okr', title: 'Q4 OKR 梳理', meta: '11-07' },
      { id: 'chat-report', title: '周报润色', meta: '11-06' },
    ],
  },
];

/** 当前会议会话的标题，显示在会话切换条上 */
export const currentSessionTitle =
  agentSessionGroups[0].sessions.find((session) => session.id === CURRENT_SESSION_ID)?.title ?? '';
