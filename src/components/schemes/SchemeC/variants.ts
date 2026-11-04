import type { SchemeVariant } from '@/components/schemes/types';

/**
 * 方案 C 的两种底栏
 * - composer：快捷技能 + 大输入框（自行设计的默认版）
 * - pill：快捷技能 + 方案 B 的底栏（元宝胶囊 + 「问元宝」单行输入）
 */
export const SCHEME_C_VARIANTS: SchemeVariant[] = [
  { key: 'composer', label: '大输入框' },
  { key: 'pill', label: '胶囊底栏' },
];
