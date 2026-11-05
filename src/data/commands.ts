/**
 * 「元宝正在记笔记」展开后的指令集合
 *
 * 上半是会议里真正常用的问法，下半把原本要打字才能触发的演示场景也搬进来，
 * 这样演示时不用记关键词，点一下就能跑。点击后统一交给 App 的 handleSubmit，
 * 走的是和输入框完全相同的匹配链路。
 */

export interface CommandItem {
  label: string;
  /** 实际发出去的话；不填就用 label */
  prompt?: string;
  /** 特殊动作：创建产物文件 / 打开浏览器 */
  action?: 'create-file' | 'open-browser';
}

export interface CommandGroup {
  title: string;
  items: CommandItem[];
}

export const commandGroups: CommandGroup[] = [
  {
    title: '常用',
    items: [
      { label: '总结刚刚说了什么', prompt: '总结一下' },
      { label: '刚才谁说了什么', prompt: '刚才谁说的' },
      { label: '我有哪些待办', prompt: '我有哪些待办' },
      { label: '竞品是怎么做的', prompt: '竞品对比一下' },
      { label: '发一封会后邮件', prompt: '发一封会后邮件' },
      { label: '约下周三同一时间', prompt: '约下周三同一时间' },
    ],
  },
  {
    title: '场景与快捷指令',
    items: [
      { label: '总结一下', prompt: '总结一下' },
      { label: '整理待办', prompt: '整理待办' },
      { label: '建个会后纪要', prompt: '建个会后纪要' },
      { label: '刚入会', prompt: '刚入会' },
      { label: '别人提到', prompt: '别人提到' },
      { label: '会议将结束', prompt: '会议将结束' },
      { label: '建个投票', prompt: '建个投票' },
      { label: '选个总结方式', prompt: '总结方式' },
      { label: '提取内容', prompt: '提取内容' },
      { label: '创建任务', prompt: '创建任务' },
      { label: '创建一个 PDF 文件', prompt: '创建一个 PDF 文件', action: 'create-file' },
      { label: '创建一个 PPT 文件', prompt: '创建一个 PPT 文件', action: 'create-file' },
      { label: '在浏览器打开元宝笔记', action: 'open-browser' },
    ],
  },
];
