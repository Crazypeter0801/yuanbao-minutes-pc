import { OPENUI_MEETING_SUMMARY } from '@/openui/demoPrograms';
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
 * 依次是：开始记录 + 元宝笔记卡片 → 用户「总结刚刚发生的事情」→
 * 元宝小结改走 OpenUI Lang（Intelligent UI）+ 追问建议。
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
      // 生成式主输出：OpenUI 渲染；bubbles 留空以免双渲染
      bubbles: [],
      openui: OPENUI_MEETING_SUMMARY,
      followUps: ['说得更具体些', '列出我的待办'],
    },
  ];
}
