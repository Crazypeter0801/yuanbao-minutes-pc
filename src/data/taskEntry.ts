import { createId } from '@/data/yuanbaoContent';
import type { ChatMessage, RichBlock } from '@/types/chat';

/** 头部胶囊的状态文案（Figma 215:19432，方案 A） */
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
 * 演示初始对话（Figma 215:19035）
 * 依次是：开始记录 + 元宝笔记卡片 → 用户「总结刚刚发生的事情」→ 元宝的两件事小结 + 追问建议。
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
            paragraph('到目前为止主要聊了两件事：'),
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
