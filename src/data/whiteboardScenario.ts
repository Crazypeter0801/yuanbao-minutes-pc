import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage } from '@/types/chat';

/**
 * 元宝画白板（演示用）
 *
 * 用户在侧栏说一句「帮我在白板上画一个灰度放量的原理流程图」，元宝接管共享画面上
 * 的白板批注工具（Figma 221:30082）：先去左侧工具栏点「文本 / 形状 / AI 画笔」，
 * 再像人一样按下拖拽把图形落在白板上。这里只放「画什么、按什么顺序画、用哪个工具」，
 * 鼠标缓动、拖拽尺寸插值、逐字输入这些表现交给 useWhiteboardDraw。
 *
 * 坐标都是归一化的：x / y 取 0～1，相对白板「内容区」（避开工具栏与右下角缩放条）；
 * 侧栏收起、会议区变宽时，流程图仍然按比例铺在画面里。
 */

/** 左侧工具栏的十个按钮，顺序与设计稿一致（Figma 白板工具栏｜主体） */
export type BoardToolbarTool =
  | 'select'
  | 'ai-pen'
  | 'laser'
  | 'shape'
  | 'text'
  | 'eraser'
  | 'undo'
  | 'redo'
  | 'save'
  | 'add';

/** 工具栏按钮顺序：选中工具时用它算鼠标落点 */
export const BOARD_TOOLBAR_TOOLS: BoardToolbarTool[] = [
  'select',
  'ai-pen',
  'laser',
  'shape',
  'text',
  'eraser',
  'undo',
  'redo',
  'save',
  'add',
];

export interface BoardPoint {
  x: number;
  y: number;
}

interface BoardElementBase {
  id: string;
}

/** 方框 / 判断菱形：由「左上角拖到右下角」画出 */
export interface BoardBoxElement extends BoardElementBase {
  kind: 'box' | 'decision';
  /** 拖拽起点：包围盒左上角（归一化） */
  from: BoardPoint;
  /** 拖拽终点：包围盒右下角（归一化） */
  to: BoardPoint;
  text: string;
}

/** 独立文字（标题）：anchor 为 start 时 x 是左端，否则是中心 */
export interface BoardTextElement extends BoardElementBase {
  kind: 'text';
  at: BoardPoint;
  text: string;
  /** px 字号：白板按 1:1 像素绘制，不随窗口缩放 */
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

/** 一步操作：选工具 / 拖一个框 / 敲一段字 / 停顿 */
export type BoardStep =
  | { action: 'select-tool'; tool: BoardToolbarTool }
  | { action: 'draw'; id: string }
  | { action: 'write'; id: string }
  | { action: 'pause'; ms: number };

/**
 * 演示速度系数：鼠标移动、拖拽、逐字输入、步骤停顿、开场收尾全部按它缩放。
 * 所有时长都按「1 倍速的毫秒值」写在代码里，由 useWhiteboardDraw / useCursorTilt 统一除以它；
 * 调快调慢只改这一个数。
 */
export const WHITEBOARD_SPEED = 2;

/** 白板内容区内边距（px）：左边留出工具栏，下边留出缩放条 */
export const BOARD_CONTENT_INSET = { left: 72, top: 28, right: 28, bottom: 76 };

/** 白板上文字字号（px）：方框、判断菱形分开，判断框里字多一点要小一号 */
export const BOARD_FONT = {
  box: 13,
  decision: 12,
};

export interface BoardSize {
  width: number;
  height: number;
}

export interface BoardFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 内容区（px）：流程图按归一化坐标铺在这块区域里 */
export function getBoardFrame(size: BoardSize): BoardFrame {
  return {
    x: BOARD_CONTENT_INSET.left,
    y: BOARD_CONTENT_INSET.top,
    width: Math.max(1, size.width - BOARD_CONTENT_INSET.left - BOARD_CONTENT_INSET.right),
    height: Math.max(1, size.height - BOARD_CONTENT_INSET.top - BOARD_CONTENT_INSET.bottom),
  };
}

/** 归一化坐标 → 白板像素 */
export function toBoardPx(point: BoardPoint, frame: BoardFrame): BoardPoint {
  return { x: frame.x + point.x * frame.width, y: frame.y + point.y * frame.height };
}

/** 方框 / 菱形的像素包围盒 */
export function boxRectOf(element: BoardBoxElement, frame: BoardFrame) {
  const from = toBoardPx(element.from, frame);
  const to = toBoardPx(element.to, frame);
  return {
    x: Math.min(from.x, to.x),
    y: Math.min(from.y, to.y),
    width: Math.abs(to.x - from.x),
    height: Math.abs(to.y - from.y),
  };
}

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
    at: { x: 0.035, y: 0.045 },
    text: '灰度放量的原理流程图',
    fontSize: 22,
    anchor: 'start',
  },
  {
    id: 'release',
    kind: 'box',
    from: { x: 0.05, y: 0.235 },
    to: { x: 0.23, y: 0.365 },
    text: '发布新版本',
  },
  {
    id: 'canary',
    kind: 'box',
    from: { x: 0.3, y: 0.235 },
    to: { x: 0.48, y: 0.365 },
    text: '1% 灰度',
  },
  {
    id: 'monitor',
    kind: 'box',
    from: { x: 0.55, y: 0.235 },
    to: { x: 0.73, y: 0.365 },
    text: '监控指标',
  },
  {
    id: 'check',
    kind: 'decision',
    from: { x: 0.77, y: 0.165 },
    to: { x: 0.96, y: 0.435 },
    text: '指标是否\n异常？',
  },
  {
    id: 'expand',
    kind: 'box',
    from: { x: 0.47, y: 0.607 },
    to: { x: 0.73, y: 0.752 },
    text: '扩大到 10% → 50% → 100%',
  },
  {
    id: 'rollback',
    kind: 'box',
    from: { x: 0.775, y: 0.635 },
    to: { x: 0.955, y: 0.765 },
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
    labelAt: { x: 0.89, y: 0.53 },
  },
  {
    id: 'check-to-expand',
    kind: 'edge',
    points: [
      { x: 0.865, y: 0.435 },
      { x: 0.865, y: 0.5 },
      { x: 0.7, y: 0.5 },
      { x: 0.7, y: 0.605 },
    ],
    label: '否',
    labelAt: { x: 0.8, y: 0.468 },
  },
  {
    id: 'expand-to-canary',
    kind: 'edge',
    points: [
      { x: 0.47, y: 0.68 },
      { x: 0.3, y: 0.68 },
      { x: 0.3, y: 0.368 },
    ],
    label: '继续观察',
    labelAt: { x: 0.24, y: 0.56 },
  },
];

/**
 * 绘制脚本：和真人用白板工具的顺序一致
 * 写标题 → 形状工具拖四个框（框里直接打字）→ AI 画笔连五条线。
 * 工具只切换三次：文本 / 形状 / AI 画笔，和人在白板上的习惯一致。
 */
const STEPS: BoardStep[] = [
  // 白板铺开后先停一拍，让观众看清工具栏，再开始动鼠标
  { action: 'pause', ms: 820 },

  { action: 'select-tool', tool: 'text' },
  { action: 'write', id: 'title' },
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'shape' },
  { action: 'draw', id: 'release' },
  { action: 'write', id: 'release' },
  { action: 'draw', id: 'canary' },
  { action: 'write', id: 'canary' },
  { action: 'draw', id: 'monitor' },
  { action: 'write', id: 'monitor' },
  { action: 'pause', ms: 160 },

  { action: 'draw', id: 'check' },
  { action: 'write', id: 'check' },
  { action: 'pause', ms: 200 },

  { action: 'draw', id: 'expand' },
  { action: 'write', id: 'expand' },
  { action: 'draw', id: 'rollback' },
  { action: 'write', id: 'rollback' },
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'ai-pen' },
  { action: 'draw', id: 'release-to-canary' },
  { action: 'draw', id: 'canary-to-monitor' },
  { action: 'draw', id: 'monitor-to-check' },
  { action: 'draw', id: 'check-to-rollback' },
  { action: 'draw', id: 'check-to-expand' },
  { action: 'draw', id: 'expand-to-canary' },
  { action: 'pause', ms: 700 },
];

export const whiteboardScenario = {
  elements: ELEMENTS,
  steps: STEPS,
  intro: '好，我来画。借你的白板工具用一下，把灰度放量的主链路和异常回滚都标出来。',
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
