import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage } from '@/types/chat';

/**
 * 元宝画白板（演示用）
 *
 * 用户在侧栏说一句「帮我在白板上画一个灰度放量的原理流程图」，元宝接管共享画面上的批注工具，
 * 先选工具、再一笔一笔把流程图落在白板上。这里只放「画什么、按什么顺序画」，
 * 鼠标缓动、点击涟漪、逐字出现这些表现交给 useWhiteboardDraw。
 *
 * 坐标都是归一化的：x / y 取 0～1，相对白板宽高；
 * 这样侧栏收起、会议区变宽时，流程图仍然按比例落在画面里。
 */

/** 批注工具栏里的工具（顺序与工具栏按钮一致） */
export type BoardTool = 'rect' | 'arrow' | 'text';

export interface BoardPoint {
  x: number;
  y: number;
}

interface BoardElementBase {
  id: string;
}

/** 方框 / 判断菱形：文字居中放在框内 */
export interface BoardBoxElement extends BoardElementBase {
  kind: 'box' | 'decision';
  center: BoardPoint;
  /** 归一化宽度、高度（相对白板宽 / 高） */
  width: number;
  height: number;
  text: string;
}

/** 独立文字（标题）：anchor 为 start 时 x 是左端，否则是中心 */
export interface BoardTextElement extends BoardElementBase {
  kind: 'text';
  center: BoardPoint;
  text: string;
  /** px 字号（白板按 1:1 像素绘制，不随窗口缩放） */
  fontSize: number;
  anchor: 'start' | 'middle';
}

/** 连线：折线，终点画箭头 */
export interface BoardEdgeElement extends BoardElementBase {
  kind: 'edge';
  points: BoardPoint[];
  label?: string;
  labelAt?: BoardPoint;
}

export type BoardElement = BoardBoxElement | BoardTextElement | BoardEdgeElement;

/** 一步操作：选工具 / 画框 / 写字 / 停顿 */
export type BoardStep =
  | { action: 'select-tool'; tool: BoardTool }
  | { action: 'draw'; id: string }
  | { action: 'write'; id: string }
  | { action: 'pause'; ms: number };

/** 工具箱按钮顺序，选中工具时用来算鼠标要落在哪一格 */
export const BOARD_TOOL_ORDER: BoardTool[] = ['rect', 'arrow', 'text'];

/** 白板的设计尺寸（px）：流程图按它排版，实际白板等比缩放并居中，窗口变宽时框不会被拉扁 */
export const BOARD_DESIGN = { width: 928, height: 512 };

export interface BoardTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/** 归一化坐标 → 白板像素：等比缩放，多出来的宽度平均分到左右 */
export function getBoardTransform(size: { width: number; height: number }): BoardTransform {
  const scale = Math.min(size.width / BOARD_DESIGN.width, size.height / BOARD_DESIGN.height);
  return {
    scale,
    offsetX: (size.width - BOARD_DESIGN.width * scale) / 2,
    offsetY: (size.height - BOARD_DESIGN.height * scale) / 2,
  };
}

/** 批注工具栏尺寸（px）：白板底边居中的胶囊，鼠标落点由它推算 */
export const BOARD_TOOLBAR = {
  /** 距白板底边 */
  bottom: 18,
  /** 胶囊内边距 */
  padding: 5,
  /** 按钮边长 */
  button: 38,
  /** 按钮间距 */
  gap: 6,
};

/** 白板上文字字号（px）：方框、判断菱形分开，判断框里字多一点要小一号 */
export const BOARD_FONT = {
  box: 13,
  decision: 12,
};

/** 「画面」指的是共享画面本身，不是绘画意图，不能把 OCR 这类演示场景抢走 */
export function isWhiteboardDrawRequest(text: string): boolean {
  if (text.includes('流程图')) {
    return true;
  }
  return text.includes('画') && !text.includes('画面');
}

const ELEMENTS: BoardElement[] = [
  {
    id: 'title',
    kind: 'text',
    center: { x: 0.055, y: 0.105 },
    text: '灰度放量的原理流程图',
    fontSize: 22,
    anchor: 'start',
  },
  {
    id: 'release',
    kind: 'box',
    center: { x: 0.14, y: 0.3 },
    width: 0.18,
    height: 0.13,
    text: '发布新版本',
  },
  {
    id: 'canary',
    kind: 'box',
    center: { x: 0.39, y: 0.3 },
    width: 0.18,
    height: 0.13,
    text: '1% 灰度',
  },
  {
    id: 'monitor',
    kind: 'box',
    center: { x: 0.64, y: 0.3 },
    width: 0.18,
    height: 0.13,
    text: '监控指标',
  },
  {
    id: 'check',
    kind: 'decision',
    center: { x: 0.865, y: 0.3 },
    width: 0.19,
    height: 0.27,
    text: '指标是否\n异常？',
  },
  {
    id: 'expand',
    kind: 'box',
    center: { x: 0.6, y: 0.68 },
    width: 0.26,
    height: 0.145,
    text: '扩大到 10% → 50% → 100%',
  },
  {
    id: 'rollback',
    kind: 'box',
    center: { x: 0.865, y: 0.7 },
    width: 0.18,
    height: 0.13,
    text: '回滚上一版本',
  },
  {
    id: 'release-to-canary',
    kind: 'edge',
    points: [
      { x: 0.23, y: 0.3 },
      { x: 0.3, y: 0.3 },
    ],
  },
  {
    id: 'canary-to-monitor',
    kind: 'edge',
    points: [
      { x: 0.48, y: 0.3 },
      { x: 0.55, y: 0.3 },
    ],
  },
  {
    id: 'monitor-to-check',
    kind: 'edge',
    points: [
      { x: 0.73, y: 0.3 },
      { x: 0.77, y: 0.3 },
    ],
  },
  {
    id: 'check-to-rollback',
    kind: 'edge',
    points: [
      { x: 0.865, y: 0.435 },
      { x: 0.865, y: 0.635 },
    ],
    label: '是',
    labelAt: { x: 0.89, y: 0.535 },
  },
  {
    id: 'check-to-expand',
    kind: 'edge',
    points: [
      { x: 0.865, y: 0.435 },
      { x: 0.865, y: 0.5 },
      { x: 0.73, y: 0.5 },
      { x: 0.73, y: 0.608 },
    ],
    label: '否',
    labelAt: { x: 0.8, y: 0.468 },
  },
  {
    id: 'expand-to-canary',
    kind: 'edge',
    points: [
      { x: 0.47, y: 0.68 },
      { x: 0.39, y: 0.68 },
      { x: 0.39, y: 0.368 },
    ],
    label: '继续观察',
    labelAt: { x: 0.352, y: 0.555 },
  },
];

/**
 * 绘制脚本：和真人用批注工具的顺序一致
 * 写标题 → 矩形画三个方框 → 箭头连线 → 画判断菱形 → 否 / 是 两条分支 → 回流箭头。
 */
const STEPS: BoardStep[] = [
  { action: 'pause', ms: 420 },
  { action: 'select-tool', tool: 'text' },
  { action: 'write', id: 'title' },
  { action: 'pause', ms: 260 },

  { action: 'select-tool', tool: 'rect' },
  { action: 'draw', id: 'release' },
  { action: 'write', id: 'release' },
  { action: 'draw', id: 'canary' },
  { action: 'write', id: 'canary' },
  { action: 'draw', id: 'monitor' },
  { action: 'write', id: 'monitor' },
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'arrow' },
  { action: 'draw', id: 'release-to-canary' },
  { action: 'draw', id: 'canary-to-monitor' },
  { action: 'draw', id: 'monitor-to-check' },
  { action: 'pause', ms: 200 },

  { action: 'select-tool', tool: 'rect' },
  { action: 'draw', id: 'check' },
  { action: 'write', id: 'check' },
  { action: 'pause', ms: 180 },

  { action: 'draw', id: 'expand' },
  { action: 'write', id: 'expand' },
  { action: 'draw', id: 'rollback' },
  { action: 'write', id: 'rollback' },
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'arrow' },
  { action: 'draw', id: 'check-to-rollback' },
  { action: 'draw', id: 'check-to-expand' },
  { action: 'draw', id: 'expand-to-canary' },
  { action: 'pause', ms: 700 },
];

export const whiteboardScenario = {
  /** 白板相对共享画面留一圈内边距，流程图不贴着窗沿 */
  elements: ELEMENTS,
  steps: STEPS,
  intro: '好，我来画。借你的批注工具用一下，把灰度放量的主链路和异常回滚都标出来。',
  done: '已画好。流程是：发布新版本 → 1% 灰度 → 监控指标 → 判断是否异常；异常就回滚，正常就按 10% / 50% / 100% 继续放量。',
};

export function findBoardElement(id: string): BoardElement | undefined {
  return ELEMENTS.find((element) => element.id === id);
}

/** 元宝回复「开始画」 */
export function buildWhiteboardIntroMessage(): AssistantMessage {
  return {
    id: createId('whiteboard-intro'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('whiteboard-intro-bubble'),
        blocks: [{ type: 'paragraph', runs: [{ text: whiteboardScenario.intro }] }],
      },
    ],
    source: '操作 · 正在批注共享画面',
  };
}

/** 画完后的确认 */
export function buildWhiteboardDoneMessage(): AssistantMessage {
  return {
    id: createId('whiteboard-done'),
    role: 'assistant',
    createdAt: Date.now(),
    bubbles: [
      {
        id: createId('whiteboard-done-bubble'),
        blocks: [{ type: 'paragraph', runs: [{ text: whiteboardScenario.done }] }],
      },
    ],
    source: '操作 · 流程图已画在白板上',
  };
}
