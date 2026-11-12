import { createId } from '@/data/yuanbaoContent';
import type { ChatMessage, RichBlock } from '@/types/chat';

/**
 * 任务入口两套方案（Figma 215:19035 / 215:21463）
 * - header：任务状态收进头部胶囊（方案 A）；
 * - footer：头部只留「元宝 ›」，任务胶囊排到输入框上方（方案 B）。
 */
export type TaskEntryMode = 'header' | 'footer';

/** 任务胶囊点进去对应的状态页 Tab */
export type TaskEntryTab = 'overview' | 'library';

export interface TaskEntryTask {
  key: string;
  /** 胶囊文案，与 Figma 一致 */
  label: string;
  icon: 'pen' | 'list';
  /** 点胶囊进入的 Tab */
  tab: TaskEntryTab;
}

/** 方案 B 输入框上方的两枚任务胶囊（Figma 215:22019 / 268:25271） */
export const TASK_ENTRY_TASKS: TaskEntryTask[] = [
  { key: 'notes', label: '元宝笔记中...', icon: 'pen', tab: 'overview' },
  { key: 'todos', label: '待办捕捉中...', icon: 'list', tab: 'overview' },
];

/** 文件夹里显示的文件数（Figma 215:22034 为 7）；实际文件更多时以实际为准 */
export const TASK_ENTRY_FILE_COUNT = 7;

/** 方案 A 头部胶囊的状态文案（Figma 215:19432） */
export const TASK_ENTRY_RECORDING_TEXT = '正在记笔记...';

/** Figma 演示对话的时间：今天 17:22 */
function taskEntryTime(): number {
  const date = new Date();
  date.setHours(17, 22, 0, 0);
  return date.getTime();
}

const paragraph = (...texts: string[]): RichBlock => ({
  type: 'paragraph',
  runs: texts.map((text) => ({ text })),
});

/**
 * 演示初始对话（Figma 215:19035 / 215:21463）
 * 依次是：开始记录 + 元宝笔记卡片 → 用户「总结刚刚发生的事情」→ 元宝的三件事小结 + 追问建议。
 * 三条消息共用 17:22，和设计稿一样只出现一次时间分割。
 */
export function buildTaskEntryConversation(): ChatMessage[] {
  const createdAt = taskEntryTime();

  return [
    {
      id: createId('task-entry-recording'),
      role: 'assistant',
      createdAt,
      bubbles: [
        {
          id: createId('task-entry-recording-bubble'),
          blocks: [paragraph('我已经开始记录啦～ 你专心开会就好。')],
        },
      ],
      recordingCard: true,
    },
    {
      id: createId('task-entry-question'),
      role: 'user',
      createdAt,
      text: '总结刚刚发生的事情',
    },
    {
      id: createId('task-entry-summary'),
      role: 'assistant',
      createdAt,
      bubbles: [
        {
          id: createId('task-entry-summary-bubble'),
          blocks: [
            paragraph('到目前为止主要聊了三件事：'),
            {
              type: 'list',
              items: [
                [{ text: '竞品偏“以面为主”的布局，当前产品更偏线性结构，会上做了对照。' }],
                [{ text: '视觉方向暂定两版并行：线条／卡片版、少色大灰版。' }],
                [{ text: '登录页需要更亲和、有趣。' }],
              ],
            },
            {
              type: 'paragraph',
              runs: [
                { text: '还没定：', bold: true },
                { text: '是否保留现有主题色、竖向布局怎么改。' },
              ],
            },
          ],
        },
      ],
      followUps: ['说得更具体些', '列出我的待办'],
    },
  ];
}
