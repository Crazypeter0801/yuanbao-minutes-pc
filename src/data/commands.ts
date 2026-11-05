/**
 * 快捷指令集合（底栏最左侧的「指令」入口展开后列出）
 *
 * 三类，执行方式不同：
 * - ask：会中常用指令。等于用户自己发了这句话，先出用户气泡、再出元宝回答；
 * - card：模拟元宝弹出对话交互卡片（单选 / 多选 / 确认），不出用户气泡；
 * - yuanbao：模拟元宝主动开口（会中记录、入会补上下文、被提及、会议收尾、记录画面），不出用户气泡。
 *
 * 会中记录不再自动定时出现，全部由这里手动触发，演示节奏完全由讲解人控制。
 */

export type CommandKind = 'ask' | 'card' | 'yuanbao';

/** 有副作用、不能单靠一句话表达的动作 */
export type CommandEffect = 'auto-note' | 'screenshot';

export interface CommandItem {
  label: string;
  kind: CommandKind;
  /** 发给匹配链路的话；ask 类会显示成用户气泡，card / yuanbao 类只用来命中场景 */
  prompt?: string;
  /** 特殊动作，优先于 prompt */
  effect?: CommandEffect;
}

export interface CommandGroup {
  title: string;
  items: CommandItem[];
}

export const commandGroups: CommandGroup[] = [
  {
    title: '会中常用指令',
    items: [
      { label: '总结刚刚说了什么', kind: 'ask', prompt: '总结一下刚刚说了什么' },
      { label: '我有哪些待办', kind: 'ask', prompt: '我有哪些待办' },
      { label: '刚才是谁说的', kind: 'ask', prompt: '刚才是谁说的' },
      { label: '竞品是怎么做的', kind: 'ask', prompt: '竞品对比一下' },
      { label: '写一封会后邮件', kind: 'ask', prompt: '帮我写一封会后邮件' },
      { label: '约下周三同一时间', kind: 'ask', prompt: '约下周三同一时间' },
      { label: '设 10 分钟倒计时', kind: 'ask', prompt: '创建 10 分钟倒计时' },
      { label: '建个投票', kind: 'ask', prompt: '建个投票' },
      { label: '生成一份 PDF 纪要', kind: 'ask', prompt: '生成一份 PDF 纪要' },
      { label: '生成一份 PPT 汇报', kind: 'ask', prompt: '生成一份 PPT 汇报' },
    ],
  },
  {
    title: '模拟交互卡片',
    items: [
      { label: '单选 · 选个总结方式', kind: 'card', prompt: '总结方式' },
      { label: '多选 · 提取会议内容', kind: 'card', prompt: '提取内容' },
      { label: '确认 · 创建会后任务', kind: 'card', prompt: '创建任务' },
    ],
  },
  {
    title: '模拟元宝说话',
    items: [
      { label: '记下一条会议要点', kind: 'yuanbao', effect: 'auto-note' },
      { label: '中途入会，补前情', kind: 'yuanbao', prompt: '刚入会' },
      { label: '有人提到相关内容', kind: 'yuanbao', prompt: '别人提到' },
      { label: '会议快结束，约下次', kind: 'yuanbao', prompt: '会议将结束' },
      { label: '记录当前会议画面', kind: 'yuanbao', effect: 'screenshot' },
    ],
  },
];
