/**
 * 对话区阅读偏好（标题栏「更多」菜单里的字号 / 字体）
 *
 * 只影响侧栏对话区：字号决定正文基准，字体整块继承。
 * 通过侧栏根节点上的 --chat-font-size / --chat-line-height / --chat-font-family 下发给对话组件，
 * 对话里的样式一律引用这三个变量，切换时实时生效。
 */

export type ChatFontSizeKey = 'small' | 'standard' | 'large' | 'xlarge';

export interface ChatFontSizeOption {
  key: ChatFontSizeKey;
  label: string;
  /** 正文基准字号 */
  fontSize: string;
  /** 与字号配套的行高，保持 14/22 的阅读节奏 */
  lineHeight: string;
}

/** 四档字号：小 / 标准 / 大 / 特大 */
export const CHAT_FONT_SIZES: ChatFontSizeOption[] = [
  { key: 'small', label: '小', fontSize: '13px', lineHeight: '20px' },
  { key: 'standard', label: '标准', fontSize: '14px', lineHeight: '22px' },
  { key: 'large', label: '大', fontSize: '16px', lineHeight: '25px' },
  { key: 'xlarge', label: '特大', fontSize: '18px', lineHeight: '28px' },
];

export type ChatFontFamilyKey = 'system' | 'pingfang' | 'songti';

export interface ChatFontFamilyOption {
  key: ChatFontFamilyKey;
  label: string;
  /** 字体栈：系统默认 / 苹方 / 宋体 */
  stack: string;
}

export const CHAT_FONT_FAMILIES: ChatFontFamilyOption[] = [
  {
    key: 'system',
    label: '系统默认',
    stack:
      "system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  {
    key: 'pingfang',
    label: '苹方',
    stack: "'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  {
    key: 'songti',
    label: '宋体',
    stack: "'Songti SC', 'SimSun', 'STSong', 'Noto Serif CJK SC', serif",
  },
];

export const DEFAULT_CHAT_FONT_SIZE: ChatFontSizeKey = 'standard';
export const DEFAULT_CHAT_FONT_FAMILY: ChatFontFamilyKey = 'system';

export const findChatFontSize = (key: ChatFontSizeKey) =>
  CHAT_FONT_SIZES.find((option) => option.key === key) ?? CHAT_FONT_SIZES[1];

export const findChatFontFamily = (key: ChatFontFamilyKey) =>
  CHAT_FONT_FAMILIES.find((option) => option.key === key) ?? CHAT_FONT_FAMILIES[0];
