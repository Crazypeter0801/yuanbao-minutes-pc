import { RECENT_AGENT_TASKS, type AgentRecentTaskItem } from '@/data/agentDetail';

/**
 * 元宝长程任务共享数据层（底栏状态栏 / 展开「进行中任务」面板 / Agent 详情页 / 任务步骤详情共用）
 *
 * 直接基于 AgentDetail 的 RECENT_AGENT_TASKS 派生，确保侧栏展开面板与 Agent 详情页任务列表完全一致，
 * 并由进行中任务的 statusStages 实时驱动底部状态栏文案轮播。
 */

export type AgentTaskStepState = 'done' | 'doing' | 'todo';

export interface AgentTaskStep {
  /** 这一步做了什么 */
  label: string;
  /** 发生时间；未开始的步骤留空 */
  time?: string;
  state: AgentTaskStepState;
}

export interface AgentTaskOutput {
  name: string;
  /** 类型文案，如「笔记」「逐字稿」 */
  kind: string;
}

export interface AgentTask {
  id: string;
  title: string;
  /** 列表里的一行说明 */
  summary: string;
  state: 'running' | 'done';
  /** 进行中任务在输入框上方状态栏轮播展示的实时执行阶段文案 */
  statusStages?: string[];
  steps: AgentTaskStep[];
  outputs: AgentTaskOutput[];
}

/** 兜底的会议 Agent 执行阶段文案序列 */
export const DEFAULT_AGENT_STATUS_STAGES: readonly string[] = [
  '正在持续更新讨论要点',
  '正在整理与我相关的结论',
  '正在提取会议关键结论与待办',
  '正在检索关联文档与历史纪要',
];

const TASK_DETAIL_META: Record<
  string,
  { steps: AgentTaskStep[]; outputs: AgentTaskOutput[] }
> = {
  'recent-1': {
    steps: [
      { label: '开始记录本场会议发言', time: '20:03', state: 'done' },
      { label: '识别到「AI 生成内容与会议聊天框」讨论焦点', time: '20:14', state: 'done' },
      { label: '持续整理与我相关的结论与待办', time: '20:21', state: 'doing' },
      { label: '汇总写入元宝笔记', state: 'todo' },
    ],
    outputs: [
      { name: '元宝笔记：产品方案评审', kind: '笔记' },
      { name: '实时逐字稿', kind: '文本' },
    ],
  },
  'recent-2': {
    steps: [
      { label: '汇总「侧栏多标签」讨论内容', time: '20:08', state: 'done' },
      { label: '归纳成员与聊天标签切换规则', time: '20:11', state: 'done' },
      { label: '标出待确认问题并写入对话', time: '20:13', state: 'done' },
    ],
    outputs: [{ name: '侧栏多标签议题纪要', kind: '纪要' }],
  },
  'recent-3': {
    steps: [
      { label: '检索 11 月 12 日产品评审历史纪要', time: '20:05', state: 'done' },
      { label: '提取灰度白名单范围与观察期条件', time: '20:06', state: 'done' },
      { label: '关联引用原文供会中核对', time: '20:07', state: 'done' },
    ],
    outputs: [{ name: '白名单方案评审结论摘录', kind: '文档' }],
  },
  'recent-4': {
    steps: [
      { label: '捕获共享屏幕中的系统架构草图', time: '20:09', state: 'done' },
      { label: '识别 4 个核心模块与接口流向', time: '20:10', state: 'done' },
      { label: '归档至「资料库 → 本场会议」', time: '20:11', state: 'done' },
    ],
    outputs: [{ name: '共享画面截图', kind: '图片' }],
  },
};

function toAgentTask(item: AgentRecentTaskItem): AgentTask {
  const meta = TASK_DETAIL_META[item.id];
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    state: item.status,
    statusStages: item.statusStages,
    steps: meta?.steps ?? [
      { label: item.title, state: item.status === 'running' ? 'doing' : 'done' },
    ],
    outputs: meta?.outputs ?? [{ name: '元宝笔记', kind: '笔记' }],
  };
}

/** 共享任务列表（与 AgentDetail 的 RECENT_AGENT_TASKS 完全一致） */
export const AGENT_TASKS: AgentTask[] = RECENT_AGENT_TASKS.map(toAgentTask);

/** 按共享任务列表实时计算进行中任务数量 */
export const RUNNING_TASK_COUNT = AGENT_TASKS.filter((task) => task.state === 'running').length;

/** 读取当前所有进行中任务汇总出的阶段文案序列（用于输入框上方状态栏轮播） */
export function getRunningTaskStatus(tasks: AgentTask[], stageIndex = 0): string {
  const runningTasks = tasks.filter((task) => task.state === 'running');
  const stages = runningTasks.flatMap((task) =>
    task.statusStages?.length ? task.statusStages : [task.summary],
  );
  const pool = stages.length > 0 ? stages : DEFAULT_AGENT_STATUS_STAGES;
  const safeIndex = ((stageIndex % pool.length) + pool.length) % pool.length;
  return pool[safeIndex] ?? DEFAULT_AGENT_STATUS_STAGES[0];
}
