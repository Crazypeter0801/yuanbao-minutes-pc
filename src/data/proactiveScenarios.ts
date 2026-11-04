import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, RichBlock } from '@/types/chat';

/**
 * 主动触发场景（演示用）
 * 元宝不该只在被问时才说话，这里覆盖三个主动时机（刚入会 / 别人提到某事 / 会议将结束），
 * 外加一条「用户自己发任务」的入口，点一下就能演示，不用等真实触发条件。
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

interface ScenarioBase {
  id: string;
  /** 触发按钮上的文案 */
  label: string;
  /** 按钮的悬浮说明：这次触发对应什么时机 */
  hint: string;
}

/**
 * 两类触发方式：
 * - nudge：元宝主动开口，直接把一条消息推进消息流；
 * - ask：模拟用户自己发一句话，走正常问答流程（先出现用户气泡，再出回答）。
 */
export type ProactiveScenario =
  | (ScenarioBase & {
      kind: 'nudge';
      /** 每次点击都要生成新消息，id 重新取，否则重复触发时 React key 会撞 */
      build: () => AssistantMessage;
    })
  | (ScenarioBase & {
      kind: 'ask';
      userText: string;
      /** 这类任务除了对话还会弹出对应的操作界面 */
      opens?: 'poll';
    });

export const proactiveScenarios: ProactiveScenario[] = [
  {
    id: 'mid-join',
    kind: 'nudge',
    label: '刚入会',
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
    kind: 'nudge',
    label: '别人提到',
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
  {
    id: 'wrapping-up',
    kind: 'nudge',
    label: '会议将结束',
    hint: '模拟会议收尾：元宝主动问要不要预约下一次会议',
    build: () => ({
      id: createId('nudge-wrap'),
      role: 'assistant',
      time: '刚刚',
      bubbles: [
        {
          id: createId('nudge-wrap-bubble'),
          blocks: [paragraph('这场快结束了。要不要我按同样的参会人和时长，帮你预约下一次会议？')],
        },
      ],
      // 两条快捷提问都能落到预约 / 邮件规则上，点了不会答非所问
      followUps: ['约下周三同一时间', '改成每周重复'],
    }),
  },
  {
    id: 'create-poll',
    kind: 'ask',
    label: '建个投票',
    hint: '模拟用户主动发任务：「帮我创建一个投票，团建去哪玩」，元宝回话的同时弹出投票确认',
    userText: '帮我创建一个投票，团建去哪玩',
    opens: 'poll',
  },
];
