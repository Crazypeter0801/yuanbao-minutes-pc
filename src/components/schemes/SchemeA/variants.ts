import type { SchemeVariant } from '@/components/schemes/types';

/**
 * 方案 A 的两种底栏
 * - stacked：设计稿原样，助手条 + 大输入框
 * - pill：沿用方案 B 的底栏（元宝胶囊 + 「问元宝」单行输入）
 */
export const SCHEME_A_VARIANTS: SchemeVariant[] = [
  { key: 'stacked', label: '助手条 + 大输入框' },
  { key: 'pill', label: '胶囊底栏' },
];
