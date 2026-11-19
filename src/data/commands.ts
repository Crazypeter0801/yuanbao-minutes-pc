/**
 * 演示指令（窗口外的三个演示按钮展开后列出）
 *
 * 快捷指令已从会议窗口里拿掉，窗口内只留真实产品的界面；
 * 所有演示触发都放到窗口外：模拟元宝发言 / 模拟用户发言 / 模拟交互功能。
 *
 * 执行方式：
 * - ask：等于用户自己发了这句话，先出用户气泡、再出元宝回答；
 * - card：模拟元宝弹出对话交互卡片（单选 / 多选 / 确认），不出用户气泡；
 * - yuanbao：模拟元宝主动开口，不出用户气泡。
 */

export type CommandKind = 'ask' | 'card' | 'yuanbao';

/** 有副作用、不能单靠一句话表达的动作 */
export type CommandEffect = 'auto-note' | 'screenshot' | 'next-topic';

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

export interface DemoMenu {
  key: 'yuanbao' | 'user' | 'feature';
  /** 按钮文案 */
  label: string;
  groups: CommandGroup[];
}

export const demoMenus: DemoMenu[] = [
  {
    key: 'yuanbao',
    label: '模拟元宝发言',
    groups: [
      {
        title: '会中',
        items: [
          { label: '迟到入会，补错过的内容', kind: 'yuanbao', prompt: '迟到' },
          { label: '聊到白名单，检索上次结论', kind: 'yuanbao', prompt: '上下文检索' },
          { label: '议题跑偏，提醒主持人', kind: 'yuanbao', prompt: '议题跑偏' },
          { label: '时间管理，10 分钟还有 2 个议题', kind: 'yuanbao', prompt: '时间管理' },
          { label: '问题悬而未决，需要决策吗', kind: 'yuanbao', prompt: '悬而未决' },
          { label: '议题结束，阶段性总结', kind: 'yuanbao', prompt: '阶段总结' },
          { label: '专业信息补充（默认折叠）', kind: 'yuanbao', prompt: '专业信息' },
          { label: '实时翻译，检测到英文发言', kind: 'yuanbao', prompt: '实时翻译' },
          { label: 'OCR 识别，提取共享画面文字', kind: 'yuanbao', prompt: 'OCR识别' },
        ],
      },
      {
        title: '跨会议',
        items: [
          { label: '决策记忆，带出旧决策原因', kind: 'yuanbao', prompt: '决策记忆' },
          { label: '个人工作流，今日事项汇总', kind: 'yuanbao', prompt: '个人工作流' },
        ],
      },
      {
        title: '原有',
        items: [
          { label: '记下一条会议要点', kind: 'yuanbao', effect: 'auto-note' },
          { label: '识别到新话题', kind: 'yuanbao', effect: 'next-topic' },
          { label: '会议快结束，约下次', kind: 'yuanbao', prompt: '会议将结束' },
          { label: '记录当前会议画面', kind: 'yuanbao', effect: 'screenshot' },
        ],
      },
    ],
  },
  {
    key: 'user',
    label: '模拟用户发言',
    groups: [
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
    ],
  },
  {
    key: 'feature',
    label: '模拟交互功能',
    groups: [
      {
        title: '功能',
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
        title: '交互卡片',
        items: [
          { label: '单选 · 选个总结方式', kind: 'card', prompt: '总结方式' },
          { label: '多选 · 提取会议内容', kind: 'card', prompt: '提取内容' },
          { label: '确认 · 创建会后任务', kind: 'card', prompt: '创建任务' },
        ],
      },
    ],
  },
];
