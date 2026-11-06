import { extractCard, summaryModeCard, taskConfirmCard } from '@/data/interactiveCards';
import { parseMarkedText } from '@/data/richText';
import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, RichBlock } from '@/types/chat';

/**
 * 主动触发场景（演示用）
 * 元宝不该只在被问时才说话，这里覆盖三个主动时机（刚入会 / 别人提到某事 / 会议将结束），
 * 外加一条「用户自己发任务」的入口，点一下就能演示，不用等真实触发条件。
 */

/** 纯文本段落（支持 **加粗** 与 [[人名]] 标记） */
const paragraph = (...texts: string[]): RichBlock => ({
  type: 'paragraph',
  runs: texts.flatMap((text) => parseMarkedText(text)),
});

/** 无序列表 */
const list = (...items: string[]): RichBlock => ({
  type: 'list',
  items: items.map((item) => parseMarkedText(item)),
});

interface ScenarioBase {
  id: string;
  /** 场景名，也是输入框里最直接的触发词 */
  label: string;
  /** 场景说明：这次触发对应什么时机 */
  hint: string;
  /** 输入框里包含任一词即命中本场景（导入 Figma 的版本没有演示条，只能靠打字触发） */
  keywords: string[];
}

/**
 * 两类触发方式：
 * - nudge：元宝主动开口，直接把一条消息推进消息流；
 * - ask：模拟用户自己发一句话，走正常问答流程（先出现用户气泡，再出回答）。
 */
export type ProactiveScenario =
  | (ScenarioBase & {
      kind: 'nudge';
      /** 每次点击都要生成新消息，id 重新取，否则重复触发时 React key 会撞；可连发多条 */
      build: () => AssistantMessage | AssistantMessage[];
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
    hint: '模拟开启云笔记后中途入会：元宝先发「正在帮你记」闪光卡片，再问要不要补前 5 分钟的内容',
    keywords: ['刚入会', '中途入会', '入会'],
    build: () => [
      {
        id: createId('nudge-join-note'),
        role: 'assistant',
        createdAt: Date.now(),
        bubbles: [
          {
            id: createId('nudge-join-note-bubble'),
            blocks: [paragraph('我已经开始记录啦～ 你专心开会就好。')],
          },
        ],
        recordingCard: {},
      },
      {
        id: createId('nudge-join'),
        role: 'assistant',
        createdAt: Date.now(),
        bubbles: [
          {
            id: createId('nudge-join-bubble'),
            blocks: [paragraph('你刚进会。要不要我把前 5 分钟讨论的内容总结一下？')],
          },
        ],
        // 两条快捷提问都要能落到问答规则表里，不能出现点了没回应
        followUps: ['帮我快速回顾', '我有哪些待办'],
      },
    ],
  },
  {
    id: 'mentioned',
    kind: 'nudge',
    label: '别人提到',
    hint: '模拟会中有人提到某事：元宝主动把相关结论找出来',
    keywords: ['别人提到', '有人提到', '提到我', '提到'],
    build: () => ({
      id: createId('nudge-mention'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-mention-bubble'),
          blocks: [
            paragraph('会上 [[黄婷婷]] 提到的**两版视觉探索**，我把结论找出来了：'),
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
    keywords: ['会议将结束', '快结束', '要结束', '将结束', '结束'],
    build: () => ({
      id: createId('nudge-wrap'),
      role: 'assistant',
      createdAt: Date.now(),
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
    keywords: ['建个投票', '创建投票', '发起投票', '投票'],
    userText: '帮我创建一个投票，团建去哪玩',
    opens: 'poll',
  },
  {
    id: 'summary-mode',
    kind: 'nudge',
    label: '选个总结方式',
    hint: '弹单选卡片：简洁摘要 / 按议题组织 / 行动项优先，选完元宝按所选结构写纪要',
    keywords: ['总结方式', '选个总结方式', '怎么总结'],
    build: () => ({
      id: createId('nudge-summary-mode'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-summary-mode-bubble'),
          blocks: [paragraph('这次纪要想要哪种结构？选一个，我就按这个结构来写。')],
          card: summaryModeCard,
        },
      ],
    }),
  },
  {
    id: 'extract-content',
    kind: 'nudge',
    label: '提取内容',
    hint: '弹多选卡片：关键结论 / 待办 / 分歧 / 观点，选完元宝出一份清单',
    keywords: ['提取内容', '提取哪些', '提取哪几项'],
    build: () => ({
      id: createId('nudge-extract'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-extract-bubble'),
          blocks: [paragraph('要我从这场会里提取哪些内容？多选，选完我一次整理。')],
          card: extractCard,
        },
      ],
    }),
  },
  {
    id: 'create-task',
    kind: 'nudge',
    label: '创建任务',
    hint: '弹确认卡片：核对任务名、输出方式、交付时间后开始处理',
    keywords: ['创建任务', '建个任务', '会后任务', '创建会后任务'],
    build: () => ({
      id: createId('nudge-create-task'),
      role: 'assistant',
      createdAt: Date.now(),
      bubbles: [
        {
          id: createId('nudge-create-task-bubble'),
          blocks: [paragraph('先把任务配置摊开，你确认后我就开始处理。')],
          card: taskConfirmCard,
        },
      ],
    }),
  },
];

/**
 * 按输入框内容匹配演示场景
 * 导入 Figma 的版本没有场景切换条，演示时直接打「刚入会」「建个投票」这类词即可命中；
 * 命中不了就当作普通提问，不影响正常问答。
 */
export function matchScenario(text: string): ProactiveScenario | undefined {
  const input = text.trim();
  if (!input) {
    return undefined;
  }
  return proactiveScenarios.find((scenario) => scenario.keywords.some((keyword) => input.includes(keyword)));
}
