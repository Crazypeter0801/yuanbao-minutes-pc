import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, RichBlock } from '@/types/chat';

/**
 * 主动触发场景（演示用）
 * 元宝不该只在被问时才说话，这两个场景分别是「刚入会」和「会中别人提到某事」两个时机，
 * 点一下就等于让元宝在该时机主动开口，方便演示时不用等真实触发条件。
 */

/** 纯文本段落 */
const paragraph = (...texts: string[]): RichBlock => ({
  type: 'paragraph',
  runs: texts.map((text) => ({ text })),
});

/** 无序列表 */
const list = (...items: string[]): RichBlock => ({
  type: 'list',
  items: items.map((item) => [{ text: item }]),
});

export interface ProactiveScenario {
  id: string;
  /** 触发按钮上的文案 */
  label: string;
  /** 按钮的悬浮说明：这次触发对应什么时机 */
  hint: string;
  /** 每个场景每次点击都生成新消息，id 必须重新取，否则重复触发时 React key 会撞 */
  build: () => AssistantMessage;
}

export const proactiveScenarios: ProactiveScenario[] = [
  {
    id: 'mid-join',
    label: '假装刚入会',
    hint: '模拟中途入会：元宝主动问要不要补前 5 分钟的内容',
    build: () => ({
      id: createId('nudge-join'),
      role: 'assistant',
      time: '刚刚',
      bubbles: [
        {
          id: createId('nudge-join-bubble'),
          blocks: [paragraph('你刚进会。要不要我把前 5 分钟讨论的内容总结一下？')],
        },
      ],
      // 两条快捷提问都要能落到问答规则表里，不能出现点了没回应
      followUps: ['帮我快速回顾', '我有哪些待办'],
    }),
  },
  {
    id: 'mentioned',
    label: '别人提到了',
    hint: '模拟会中有人提到某事：元宝主动把相关结论找出来',
    build: () => ({
      id: createId('nudge-mention'),
      role: 'assistant',
      time: '刚刚',
      bubbles: [
        {
          id: createId('nudge-mention-bubble'),
          mention: '黄婷婷',
          blocks: [
            paragraph('提到的「两版视觉探索」，我顺手把会上的结论找出来了：'),
            list(
              '线条／卡片版：重点验证内容分组和层级是否清晰。',
              '少色大灰版：重点验证简洁感，以及少量强调色能否突出重点。',
            ),
            paragraph('还没定的是：是否保留现有主题色、竖向布局怎么改善。'),
          ],
        },
      ],
      source: '引用 · 2分钟前 黄婷婷',
      followUps: ['说得更具体些', '我有哪些待办'],
    }),
  },
];
