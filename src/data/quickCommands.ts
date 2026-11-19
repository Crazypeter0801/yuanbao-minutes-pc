/**
 * 推荐指令数据（底栏 Book 入口或输入框键入「/」唤起）
 *
 * 分两组展示：
 * - featured（「常用推荐」）：排在最前的 4 条核心指令；
 * - all（「全部指令」）：紧随其后的 5 条扩展指令。
 */

export type QuickCommandGroup = 'featured' | 'all';

export interface QuickCommandItem {
  id: string;
  /** 主标题 */
  title: string;
  /** 简短功能描述 */
  description: string;
  /** 点击后发给元宝的中文提问 */
  prompt: string;
  /** 右侧轻量使用热度文案 */
  usage: string;
  group: QuickCommandGroup;
}

export const QUICK_COMMAND_ITEMS: QuickCommandItem[] = [
  {
    id: 'what-did-i-miss',
    title: '我错过了什么',
    description: '总结会议最近讨论的内容，帮助快速了解错过的信息。',
    prompt: '我错过了什么？请总结会议最近讨论的重点内容',
    usage: '12.8k',
    group: 'featured',
  },
  {
    id: 'make-me-sound-smart',
    title: '帮我聪明发言',
    description: '生成 2 条有见地的观点或问题，帮助你更有价值地参与会议讨论。',
    prompt: '帮我聪明发言：结合当前会议讨论生成 2 条有见地的观点或问题',
    usage: '9.6k',
    group: 'featured',
  },
  {
    id: 'suggest-questions',
    title: '推荐问题',
    description: '根据会议上下文，生成 3 个有思考深度的后续问题，推动讨论深入。',
    prompt: '根据当前会议上下文，推荐 3 个有思考深度的后续问题',
    usage: '8.4k',
    group: 'featured',
  },
  {
    id: 'look-again',
    title: '重新审视',
    description: '识别会议中原本可以提出的、更有深度、更敏锐且出人意料的问题。',
    prompt: '帮我重新审视刚才的讨论，指出原本可以提出的更有深度的问题',
    usage: '6.9k',
    group: 'featured',
  },
  {
    id: 'what-does-that-mean',
    title: '这是什么意思',
    description: '解释会议中的技术术语、缩写及复杂概念，帮助理解当前讨论。',
    prompt: '刚才提到的技术术语和复杂概念是什么意思？请通俗解释一下',
    usage: '11.2k',
    group: 'all',
  },
  {
    id: 'learn-context',
    title: '了解背景',
    description: '补充当前讨论话题的背景信息，帮助快速理解前因后果。',
    prompt: '帮我补充当前讨论话题的背景信息与前因后果',
    usage: '7.5k',
    group: 'all',
  },
  {
    id: 'lighten-mood',
    title: '活跃气氛',
    description: '根据会议情境生成笑话、趣事或冷知识，缓解紧张气氛，让交流更轻松。',
    prompt: '结合当前会议情境，给一句轻松得体的开场或趣事来活跃气氛',
    usage: '4.3k',
    group: 'all',
  },
  {
    id: 'sales-questions',
    title: '销售提问',
    description: '生成有针对性的销售问题和具有说服力的沟通话术，帮助促成合作。',
    prompt: '结合当前客户沟通场景，生成有针对性的销售提问和沟通话术',
    usage: '5.1k',
    group: 'all',
  },
  {
    id: 'assist-decision',
    title: '辅助决策',
    description: '针对当前问题应用决策分析框架，并推荐进一步探索的参考资源。',
    prompt: '请用决策分析框架梳理当前议题的利弊选项，并给出参考建议',
    usage: '6.4k',
    group: 'all',
  },
];
