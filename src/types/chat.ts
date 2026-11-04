/**
 * 元宝侧栏的数据结构
 * 说明：当前为前端 mock，接入真实接口时保持这套结构即可，视图无需改动。
 */

/** 一段文本，可加粗 */
export interface TextRun {
  text: string;
  bold?: boolean;
}

/** 富文本块：段落 / 小标题 / 无序列表 */
export type RichBlock =
  | { type: 'paragraph'; runs: TextRun[] }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: TextRun[][] };

/** 一个气泡 */
export interface Bubble {
  id: string;
  blocks: RichBlock[];
  /** 句首 @ 的参会人（设计稿里的蓝色人名胶囊） */
  mention?: string;
  /** 末尾是否带「查看原文」链接徽标 */
  withLink?: boolean;
}

/** 元宝发出的一组消息（同一时间点的连续气泡） */
export interface AssistantMessage {
  id: string;
  role: 'assistant';
  time: string;
  bubbles: Bubble[];
  /** 回答依据，例如「引用 · 2分钟前 黄婷婷」 */
  source?: string;
  /** 追问建议 */
  followUps?: string[];
}

/** 用户提问 */
export interface UserMessage {
  id: string;
  role: 'user';
  text: string;
}

export type ChatMessage = AssistantMessage | UserMessage;
