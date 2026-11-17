import { createLibrary, defineComponent } from '@openuidev/react-lang';
import { z } from 'zod/v4';
import styles from './yuanbaoOpenui.module.scss';

/**
 * 元宝 Intelligent UI 原子库（OpenUI Lang）
 *
 * 听记方向：容器 + 原子样式约束，内容形态交给模型，少硬编码固定卡片。
 * 这里只注册模型可生成的原子；外观走元宝 token，不引入 OpenUI 默认 chat chrome。
 */

const Text = defineComponent({
  name: 'Text',
  description: 'Body paragraph in Yuanbao chat voice.',
  props: z.object({
    content: z.string().describe('Paragraph text'),
  }),
  component: ({ props }) => <p className={styles.text}>{props.content}</p>,
});

const Heading = defineComponent({
  name: 'Heading',
  description: 'Section heading; same size as body, heavier weight.',
  props: z.object({
    content: z.string().describe('Heading text'),
  }),
  component: ({ props }) => <p className={styles.heading}>{props.content}</p>,
});

const Bullet = defineComponent({
  name: 'Bullet',
  description: 'One bullet item in a meeting summary or todo list.',
  props: z.object({
    content: z.string().describe('Bullet text'),
  }),
  component: ({ props }) => <li className={styles.bullet}>{props.content}</li>,
});

const BulletList = defineComponent({
  name: 'BulletList',
  description: 'Unordered list of Bullet items.',
  props: z.object({
    items: z.array(Bullet.ref).describe('Bullet children'),
  }),
  component: ({ props, renderNode }) => (
    <ul className={styles.bulletList}>{renderNode(props.items)}</ul>
  ),
});

const Fact = defineComponent({
  name: 'Fact',
  description: 'Compact label/value row for a meeting fact or owner assignment.',
  props: z.object({
    label: z.string().describe('Short label, e.g. owner or topic'),
    value: z.string().describe('Fact or assignment detail'),
  }),
  component: ({ props }) => (
    <div className={styles.fact}>
      <span className={styles.factLabel}>{props.label}</span>
      <span className={styles.factValue}>{props.value}</span>
    </div>
  ),
});

const Callout = defineComponent({
  name: 'Callout',
  description: 'Soft highlight for open decisions or caveats.',
  props: z.object({
    title: z.string().describe('Short callout title'),
    body: z.string().describe('Callout body'),
  }),
  component: ({ props }) => (
    <div className={styles.callout}>
      <p className={styles.calloutTitle}>{props.title}</p>
      <p className={styles.calloutBody}>{props.body}</p>
    </div>
  ),
});

const Stack = defineComponent({
  name: 'Stack',
  description: 'Vertical container for generative chat content. Always use as root.',
  props: z.object({
    children: z
      .array(z.union([Text.ref, Heading.ref, BulletList.ref, Fact.ref, Callout.ref]))
      .describe('Ordered content blocks'),
  }),
  component: ({ props, renderNode }) => (
    <div className={styles.stack}>{renderNode(props.children)}</div>
  ),
});

/** 元宝主对话可用的 OpenUI 组件库 */
export const yuanbaoOpenuiLibrary = createLibrary({
  root: 'Stack',
  components: [Stack, Text, Heading, BulletList, Bullet, Fact, Callout],
  componentGroups: [
    {
      name: 'Layout',
      components: ['Stack'],
      notes: ['Always start with root = Stack([...]).'],
    },
    {
      name: 'Content',
      components: ['Text', 'Heading', 'BulletList', 'Bullet', 'Fact', 'Callout'],
      notes: [
        '- Prefer BulletList for enumerations; Fact for owner/assignment rows.',
        '- Callout for undecided items, not for normal paragraphs.',
      ],
    },
  ],
});

/** 给后端 / 模型的系统提示片段（演示与文档用） */
export function buildYuanbaoOpenuiPrompt(): string {
  return yuanbaoOpenuiLibrary.prompt({
    preamble:
      'You are 元宝 in a Tencent Meeting sidebar. Output OpenUI Lang only. Match concise Chinese meeting-assistant tone.',
    additionalRules: [
      'Never invent chrome outside Stack / Text / Heading / BulletList / Bullet / Fact / Callout.',
      'Keep copy short enough to read while the user is still in the meeting.',
    ],
    examples: [
      `root = Stack([t, list, open])
t = Text("到目前为止主要聊了两件事：")
list = BulletList([b1, b2])
b1 = Bullet("竞品偏以面为主的布局，当前产品更偏线性结构。")
b2 = Bullet("登录页需要更亲和、有趣。")
open = Callout("还没定", "是否保留现有主题色、竖向布局怎么改。")`,
    ],
  });
}
