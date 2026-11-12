import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage } from '@/types/chat';

/**
 * 元宝画白板（演示用）
 *
 * 会议里老师上课讲彩虹的原理，用户在侧栏说一句「帮我在白板上画一下彩虹形成的原理，给同学们讲讲」，
 * 元宝接管共享画面上的白板批注工具（Figma 221:30082）：先去左侧工具栏点「文本 / 形状 / AI 画笔」，
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

/** 方框 / 判断菱形 / 注释框：由「左上角拖到右下角」画出 */
export interface BoardBoxElement extends BoardElementBase {
  kind: 'box' | 'decision' | 'note';
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
  /** 注释引线用虚线，和主流程的实线箭头区分开 */
  dashed?: boolean;
}

export type BoardElement = BoardBoxElement | BoardTextElement | BoardEdgeElement;

/** 会被「拖出来」的元素：方框 / 判断菱形 / 注释框 */
export function isBoardBox(element: BoardElement): element is BoardBoxElement {
  return element.kind === 'box' || element.kind === 'decision' || element.kind === 'note';
}

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

/** 白板上文字字号（px）：方框、判断菱形、注释框分开，字多的框小一号 */
export const BOARD_FONT = {
  box: 13,
  decision: 12,
  note: 12,
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
  if (text.includes('流程图') || text.includes('彩虹')) {
    return true;
  }
  return text.includes('画') && !text.includes('画面');
}

/**
 * 彩虹形成原理（老师在会议里上课）
 * 七步主链路蛇形排两行：第一行从左往右「阳光 → 雨滴 → 折射 → 内反射」，
 * 掉头后第二行从右往左「再次折射射出 → 七色光分开 → 看到彩虹」，
 * 再从「七色光按角度分开」拉一条虚线到注释框，说明看彩虹要背对太阳、约 42° 角。
 */
const ELEMENTS: BoardElement[] = [
  {
    id: 'title',
    kind: 'text',
    at: { x: 0.03, y: 0.045 },
    text: '彩虹是怎么形成的',
    fontSize: 22,
    anchor: 'start',
  },
  // 第一行：太阳 → 雨滴 → 折射 → 内反射
  {
    id: 'sunlight',
    kind: 'box',
    from: { x: 0.03, y: 0.16 },
    to: { x: 0.2, y: 0.29 },
    text: '阳光（白光）',
  },
  {
    id: 'raindrop',
    kind: 'box',
    from: { x: 0.25, y: 0.16 },
    to: { x: 0.42, y: 0.29 },
    text: '射入雨滴',
  },
  {
    id: 'refract',
    kind: 'box',
    from: { x: 0.47, y: 0.16 },
    to: { x: 0.64, y: 0.29 },
    text: '折射（分光）',
  },
  {
    id: 'reflect',
    kind: 'box',
    from: { x: 0.69, y: 0.16 },
    to: { x: 0.86, y: 0.29 },
    text: '雨滴内反射',
  },
  // 第二行（从右往左）：再次折射 → 七色光分开 → 看到彩虹
  {
    id: 'exit',
    kind: 'box',
    from: { x: 0.69, y: 0.58 },
    to: { x: 0.86, y: 0.71 },
    text: '再次折射射出',
  },
  {
    id: 'split',
    kind: 'box',
    from: { x: 0.4, y: 0.58 },
    to: { x: 0.6, y: 0.71 },
    text: '七色光按角度分开',
  },
  {
    id: 'see',
    kind: 'box',
    from: { x: 0.08, y: 0.58 },
    to: { x: 0.26, y: 0.71 },
    text: '看到彩虹',
  },
  // 注释框：挂在「七色光按角度分开」下方
  {
    id: 'see-note',
    kind: 'note',
    from: { x: 0.36, y: 0.83 },
    to: { x: 0.64, y: 0.95 },
    text: '背对太阳、约 42° 角',
  },
  {
    id: 'sunlight-to-raindrop',
    kind: 'edge',
    points: [
      { x: 0.2, y: 0.225 },
      { x: 0.25, y: 0.225 },
    ],
  },
  {
    id: 'raindrop-to-refract',
    kind: 'edge',
    points: [
      { x: 0.42, y: 0.225 },
      { x: 0.47, y: 0.225 },
    ],
  },
  {
    id: 'refract-to-reflect',
    kind: 'edge',
    points: [
      { x: 0.64, y: 0.225 },
      { x: 0.69, y: 0.225 },
    ],
  },
  {
    id: 'reflect-to-exit',
    kind: 'edge',
    points: [
      { x: 0.775, y: 0.29 },
      { x: 0.775, y: 0.58 },
    ],
  },
  {
    id: 'exit-to-split',
    kind: 'edge',
    points: [
      { x: 0.69, y: 0.645 },
      { x: 0.6, y: 0.645 },
    ],
  },
  {
    id: 'split-to-see',
    kind: 'edge',
    points: [
      { x: 0.4, y: 0.645 },
      { x: 0.26, y: 0.645 },
    ],
  },
  {
    id: 'split-to-note',
    kind: 'edge',
    points: [
      { x: 0.5, y: 0.71 },
      { x: 0.5, y: 0.83 },
    ],
    dashed: true,
  },
];

/**
 * 绘制脚本：和真人用白板工具的顺序一致
 * 写标题 → 形状工具拖七个框（框里直接打字）→ AI 画笔连主流程、再补注释的虚线。
 */
const STEPS: BoardStep[] = [
  // 白板铺开后先停一拍，让观众看清工具栏，再开始动鼠标
  { action: 'pause', ms: 820 },

  { action: 'select-tool', tool: 'text' },
  { action: 'write', id: 'title' },
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'shape' },
  { action: 'draw', id: 'sunlight' },
  { action: 'write', id: 'sunlight' },
  { action: 'draw', id: 'raindrop' },
  { action: 'write', id: 'raindrop' },
  { action: 'draw', id: 'refract' },
  { action: 'write', id: 'refract' },
  { action: 'draw', id: 'reflect' },
  { action: 'write', id: 'reflect' },
  { action: 'pause', ms: 160 },

  { action: 'draw', id: 'exit' },
  { action: 'write', id: 'exit' },
  { action: 'draw', id: 'split' },
  { action: 'write', id: 'split' },
  { action: 'draw', id: 'see' },
  { action: 'write', id: 'see' },
  { action: 'pause', ms: 200 },

  { action: 'draw', id: 'see-note' },
  { action: 'write', id: 'see-note' },
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'ai-pen' },
  { action: 'draw', id: 'sunlight-to-raindrop' },
  { action: 'draw', id: 'raindrop-to-refract' },
  { action: 'draw', id: 'refract-to-reflect' },
  { action: 'draw', id: 'reflect-to-exit' },
  { action: 'draw', id: 'exit-to-split' },
  { action: 'draw', id: 'split-to-see' },
  { action: 'draw', id: 'split-to-note' },
  { action: 'pause', ms: 700 },
];

export const whiteboardScenario = {
  elements: ELEMENTS,
  steps: STEPS,
  intro: '好的，我来给同学们画一下彩虹的形成过程～',
  done: '已画好，同学们可以看白板～阳光射进雨滴后折射、内部反射、再折射出来，七色光按角度散开，背对太阳、约 42° 角就能看到彩虹。',
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
