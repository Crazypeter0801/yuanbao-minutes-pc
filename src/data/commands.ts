/**
 * 快捷指令集合（底栏最左侧的「快捷指令」入口展开后列出）
 *
 * 第一组是会中通用指令，不带分组标题——这才是产品里真正给用户的那部分；
 * 后面三组「模拟 ·」是演示 / 测试用的临时入口，用来按需触发功能、交互卡片和元宝主动开口，
 * 上线前整组删掉即可，不影响通用指令。
 *
 * 执行方式：
 * - ask：等于用户自己发了这句话，先出用户气泡、再出元宝回答；
 * - card：模拟元宝弹出对话交互卡片（单选 / 多选 / 确认），不出用户气泡；
 * - yuanbao：模拟元宝主动开口，不出用户气泡。
 */

export type CommandKind = 'ask' | 'card' | 'yuanbao';

/** 有副作用、不能单靠一句话表达的动作 */
export type CommandEffect = 'auto-note' | 'screenshot';

export interface CommandItem {
  label: string;
  kind: CommandKind;
  /** 发给匹配链路的话，不填就用 label；ask 类会显示成用户气泡，card / yuanbao 类只用来命中场景 */
  prompt?: string;
  /** 特殊动作，优先于 prompt */
  effect?: CommandEffect;
}

export interface CommandGroup {
  /** 分组标题；通用指令不带标题 */
  title?: string;
  items: CommandItem[];
}

export const commandGroups: CommandGroup[] = [
  {
    items: [
      { label: '总结刚刚发生的事情', kind: 'ask' },
      { label: '突出关键决策', kind: 'ask' },
      { label: '主要收获是什么？', kind: 'ask' },
      { label: '还有哪些没定论？', kind: 'ask' },
      { label: '我有哪些待办？', kind: 'ask' },
      { label: '下一步该做什么？', kind: 'ask' },
    ],
  },
  {
    title: '模拟 · 功能',
    items: [
      { label: '建个投票', kind: 'ask' },
      { label: '生成一份竞品分析的 PDF', kind: 'ask' },
      { label: '生成一份会后汇报 PPT', kind: 'ask' },
      { label: '创建 10 分钟倒计时', kind: 'ask' },
      { label: '写一封会后邮件', kind: 'ask' },
      { label: '约下周三同一时间', kind: 'ask' },
    ],
  },
  {
    title: '模拟 · 交互卡片',
    items: [
      { label: '单选 · 选个总结方式', kind: 'card', prompt: '总结方式' },
      { label: '多选 · 提取会议内容', kind: 'card', prompt: '提取内容' },
      { label: '确认 · 创建会后任务', kind: 'card', prompt: '创建任务' },
    ],
  },
  {
    title: '模拟 · 元宝说话',
    items: [
      { label: '记下一条会议要点', kind: 'yuanbao', effect: 'auto-note' },
      { label: '中途入会，补前情', kind: 'yuanbao', prompt: '刚入会' },
      { label: '有人提到相关内容', kind: 'yuanbao', prompt: '别人提到' },
      { label: '会议快结束，约下次', kind: 'yuanbao', prompt: '会议将结束' },
      { label: '记录当前会议画面', kind: 'yuanbao', effect: 'screenshot' },
    ],
  },
];
