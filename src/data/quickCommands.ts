/**
 * 推荐指令（底栏 Book 入口展开后的面板，基于 Figma 563:16230）
 *
 * 9 条会中高频指令，点击后均先以用户消息气泡发入对话，再由元宝回复。
 */

export interface QuickCommandItem {
  id: string;
  /** 主标题 */
  title: string;
  /** 同行浅灰副标题（13～16 字，344px 侧栏内单行完整可读） */
  description: string;
  /** 点击后作为用户消息发给元宝的中文提问 */
  prompt: string;
}

export const QUICK_COMMANDS: QuickCommandItem[] = [
  {
    id: 'what-did-i-miss',
    title: '我错过了什么',
    description: '总结前 5～10 分钟的讨论重点',
    prompt: '我错过了什么？帮我总结前 5～10 分钟的讨论重点',
  },
  {
    id: 'make-me-sound-smart',
    title: '帮我聪明发言',
    description: '提供 2 条有见地的观点或提问',
    prompt: '帮我聪明发言：结合当前讨论给我 2 条有见地的观点或提问',
  },
  {
    id: 'suggest-questions',
    title: '推荐问题',
    description: '生成 3 个有深度的后续追问',
    prompt: '推荐几个好问题：根据当前议题生成 3 个有深度的后续追问',
  },
  {
    id: 'look-again',
    title: '重新审视',
    description: '发现原本可提的更敏锐、更深刻问题',
    prompt: '重新审视刚才的讨论，帮我找出原本可以提出的更深刻问题',
  },
  {
    id: 'what-does-that-mean',
    title: '这是什么意思',
    description: '通俗解释刚才提到的术语与概念',
    prompt: '这是什么意思？请通俗解释刚才聊到的技术术语和缩写',
  },
  {
    id: 'learn-context',
    title: '了解背景',
    description: '补充当前话题的前因后果与上下文',
    prompt: '帮我了解背景：补充当前讨论话题的前因后果与上下文',
  },
  {
    id: 'lighten-mood',
    title: '活跃气氛',
    description: '来句应景趣事或冷知识，轻松破冰',
    prompt: '帮我活跃一下气氛，结合当前场景给一句轻松得体的趣事或冷知识',
  },
  {
    id: 'sales-questions',
    title: '销售提问',
    description: '给出针对性销售提问与说服话术',
    prompt: '帮我准备针对性的销售提问和有说服力的沟通话术',
  },
  {
    id: 'assist-decision',
    title: '辅助决策',
    description: '用分析框架梳理选项并推荐参考',
    prompt: '辅助决策：用决策分析框架梳理当前议题的选项并给出参考建议',
  },
];
