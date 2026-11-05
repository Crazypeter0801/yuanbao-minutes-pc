/**
 * 元宝侧栏的数据结构
 * 说明：当前为前端 mock，接入真实接口时保持这套结构即可，视图无需改动。
 */

/** 一段文本，可加粗、可标成人名 */
export interface TextRun {
  text: string;
  bold?: boolean;
  /** 参会人名：渲染成浅蓝底胶囊，人名可能出现在句中，不限于开头 */
  mention?: boolean;
}

/** 富文本块：段落 / 小标题 / 无序列表 */
export type RichBlock =
  | { type: 'paragraph'; runs: TextRun[] }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: TextRun[][] };

/** 气泡里附带的图片（如截图记录里缩小的会议画面） */
export interface BubbleImage {
  src: string;
  alt: string;
  /** 显示宽度（px），高度按图片比例自动算 */
  width?: number;
  height?: number;
}

/**
 * 对话里的交互卡片（Figma 元宝Agent · Component Gallery 4:351）
 * - single：单选，选完提交；
 * - multi：多选，选完提交；
 * - confirm：只做确认，展示 summary 后按主按钮执行。
 */
export interface BubbleCard {
  /** 卡片类型标识，决定提交后元宝回什么 */
  id: 'summary-mode' | 'extract' | 'task-confirm';
  kind: 'single' | 'multi' | 'confirm';
  title: string;
  description: string;
  /** single / multi 的选项文案 */
  options?: string[];
  /** confirm 的摘要行 */
  summary?: { label: string; value: string }[];
  /** 主按钮文案 */
  primaryLabel: string;
  /** 次按钮文案（如「返回修改」） */
  secondaryLabel?: string;
}

/** 一个气泡 */
export interface Bubble {
  id: string;
  blocks: RichBlock[];
  /** 末尾是否带「查看原文」链接徽标 */
  withLink?: boolean;
  /** 附在文字下方的图片 */
  image?: BubbleImage;
  /** 附在文字下方的交互卡片 */
  card?: BubbleCard;
}

/** 元宝发出的一组消息（同一时间点的连续气泡） */
export interface AssistantMessage {
  id: string;
  role: 'assistant';
  /**
   * 毫秒时间戳
   * 渲染时不再每条都显示「元宝 + 时间」：连续消息间隔短时只标一次，
   * 所以时间必须是真实值，不能再用「刚刚」这种文案。
   */
  createdAt: number;
  bubbles: Bubble[];
  /** 回答依据，例如「引用 · 2分钟前 黄婷婷」 */
  source?: string;
  /** 追问建议 */
  followUps?: string[];
  /** 元宝主动记下的笔记（实时纪要、阶段小结、截图记录）；回答用户提问的消息不算 */
  isNote?: boolean;
}

/** 用户提问 */
export interface UserMessage {
  id: string;
  role: 'user';
  text: string;
  createdAt: number;
}

export type ChatMessage = AssistantMessage | UserMessage;
