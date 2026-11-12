/**
 * transitions.dev / UI generation 的类型声明
 *
 * 运行时来自 skills/transitions-ui-generation（逐字拷贝，未改动），
 * 这里只补 TS 需要的签名，不改 JS。
 */
export type GenerateVariant = 'ui' | 'text' | 'small-text' | 'image' | 'auto';
export type GenerateMode = 'skeleton' | 'skeleton-texts';

export interface GenerateOptions {
  variant?: GenerateVariant;
  mode?: GenerateMode;
  /** 绘制时长（ms），默认 2400；整段约 duration × 1.09 */
  duration?: number;
  /** 开始前的延迟（ms） */
  delay?: number;
  /** 单行步骤文案（skeleton-texts） */
  steps?: string[];
  done?: string;
  code?: string[];
  title?: string;
  /** 最多描多少个部件，默认 60 */
  maxParts?: number;
  /** 几个关键部件会加参考线和尺寸标签，默认 5 */
  keys?: number;
  onDone?: (element: Element) => void;
  [key: string]: unknown;
}

export interface GenerateRun {
  /** 整个元素完全显现时 resolve */
  finished: Promise<Element>;
  /** 立即停止并直接显示元素 */
  cancel: () => void;
  element: Element;
}

export function generate(element: Element | string, options?: GenerateOptions): GenerateRun;

export function auto(root?: Document | Element): void;

export function timeline(element: Element | string, options?: GenerateOptions): {
  seek: (ms: number) => void;
  destroy: () => void;
};
