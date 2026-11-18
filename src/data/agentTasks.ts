/**
 * 元宝长程任务（底栏「进行中」入口 → 任务列表 → 任务详情）
 *
 * 演示数据：入会即有一条正在跑的记录任务，另有一条已完成的历史任务，
 * 方便看清「列表里怎么区分进行中/已完成」「详情页里的步骤时间线长什么样」。
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
  steps: AgentTaskStep[];
  outputs: AgentTaskOutput[];
}

export const AGENT_TASKS: AgentTask[] = [
  {
    id: 'note',
    title: '元宝笔记：产品方案评审',
    summary: '正在记录会议内容，已识别 1 个话题',
    state: 'running',
    steps: [
      { label: '开始记录会议内容', time: '20:03', state: 'done' },
      { label: '识别到新话题：AI 生成内容与会议聊天框', time: '20:14', state: 'done' },
      { label: '整理话题要点', time: '20:21', state: 'doing' },
      { label: '生成元宝笔记', state: 'todo' },
    ],
    outputs: [
      { name: '元宝笔记', kind: '笔记' },
      { name: '逐字稿', kind: '文本' },
    ],
  },
  {
    id: 'recap',
    title: '会后回顾：上周评审结论',
    summary: '已完成，整理出 3 条结论与 2 条待办',
    state: 'done',
    steps: [
      { label: '读取会议记录与逐字稿', time: '昨天 18:20', state: 'done' },
      { label: '按议题归并讨论内容', time: '昨天 18:22', state: 'done' },
      { label: '提取结论与待办', time: '昨天 18:24', state: 'done' },
    ],
    outputs: [{ name: '回顾纪要', kind: '文档' }],
  },
];

/** 进行中的任务数（底栏胶囊上的数字） */
export const RUNNING_TASK_COUNT = AGENT_TASKS.filter((task) => task.state === 'running').length;
