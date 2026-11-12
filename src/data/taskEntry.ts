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
  /** 绿色增量，例如 +16 */
  count?: string;
  icon: 'pen' | 'file-plus';
  /** 点胶囊进入的 Tab */
  tab: TaskEntryTab;
}

/** 方案 B 输入框上方的两枚任务胶囊（Figma 215:22016 / 268:25268） */
export const TASK_ENTRY_TASKS: TaskEntryTask[] = [
  { key: 'notes', label: '元宝笔记', count: '+16', icon: 'pen', tab: 'overview' },
  { key: 'todos', label: '会议待办', count: '+5', icon: 'file-plus', tab: 'overview' },
];

/**
 * 指令大全（Figma 215:22028 只有图标，文件里没有展开态）
 * 点一项等同用户把这句话发出去，走现有 ask 链路。
 */
export const TASK_ENTRY_COMMANDS = [
  '总结前面说了什么',
  '记下我的待办',
  '总结刚刚发生的事情',
  '说得更具体些',
  '列出我的待办',
];

/** 方案 A 头部胶囊的状态文案（Figma 215:19432） */
export const TASK_ENTRY_RECORDING_TEXT = '正在记笔记...';

/** 方案 B 头部副标题：任务状态已经落到下方胶囊，这里只表示在听（Figma 294:37038） */
export const TASK_ENTRY_LISTENING_TEXT = '正在听...';

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
