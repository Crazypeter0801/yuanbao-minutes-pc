import {
  handArc,
  handArrow,
  handCircle,
  handDashedArc,
  handDashedLine,
  handDrop,
  handLine,
  type SketchPoint,
} from '@/data/whiteboardSketch';
import { createId } from '@/data/yuanbaoContent';
import type { AssistantMessage } from '@/types/chat';

/**
 * 元宝画白板（演示用）· 老师板书的彩虹原理图
 *
 * 会议里老师上课讲彩虹的原理，用户在侧栏说一句「帮我在白板上画一下彩虹形成的原理，给同学们讲讲」，
 * 元宝接管共享画面上的白板工具（Figma 221:30082）：先去左侧工具栏选「文本 / AI 画笔」，
 * 再挑颜色，一笔一笔把太阳、雨滴、光线、彩虹、小人画出来。
 *
 * 这里只放「画什么、用什么颜色、按什么顺序画」；笔尖怎么走、线怎么长出来交给 useWhiteboardDraw。
 * 坐标是板书的设计坐标（1000×560），整体等比缩放铺进白板，窗口变化时不会变形。
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

/**
 * 演示速度系数：鼠标移动、运笔、逐字输入、步骤停顿、开场收尾全部按它缩放。
 * 所有时长都按「1 倍速的毫秒值」写在代码里，由 useWhiteboardDraw / useCursorTilt 统一除以它。
 */
export const WHITEBOARD_SPEED = 2;

/** 板书用的蜡笔色（对应 tokens.scss 里的变量） */
export const CRAYON = {
  ink: 'var(--wm-color-whiteboard-crayon-ink)',
  yellow: 'var(--wm-color-whiteboard-crayon-yellow)',
  blue: 'var(--wm-color-whiteboard-crayon-blue)',
  gray: 'var(--wm-color-whiteboard-crayon-gray)',
  red: 'var(--wm-color-whiteboard-crayon-red)',
  orange: 'var(--wm-color-whiteboard-crayon-orange)',
  green: 'var(--wm-color-whiteboard-crayon-green)',
  cyan: 'var(--wm-color-whiteboard-crayon-cyan)',
  indigo: 'var(--wm-color-whiteboard-crayon-indigo)',
  violet: 'var(--wm-color-whiteboard-crayon-violet)',
} as const;

/** 调色板（选中 AI 画笔时弹出）：顺序即从上到下，pick-color 用下标引用 */
export const BOARD_PALETTE = [
  { key: 'ink', color: CRAYON.ink },
  { key: 'yellow', color: CRAYON.yellow },
  { key: 'blue', color: CRAYON.blue },
  { key: 'gray', color: CRAYON.gray },
  { key: 'red', color: CRAYON.red },
  { key: 'orange', color: CRAYON.orange },
  { key: 'green', color: CRAYON.green },
  { key: 'cyan', color: CRAYON.cyan },
  { key: 'indigo', color: CRAYON.indigo },
  { key: 'violet', color: CRAYON.violet },
] as const;

/** 颜色在调色板里的位置，写脚本时用得到 */
export const PALETTE_INDEX = {
  ink: 0,
  yellow: 1,
  blue: 2,
  gray: 3,
  red: 4,
  orange: 5,
  green: 6,
  cyan: 7,
  indigo: 8,
  violet: 9,
} as const;

/** 板书设计画布（px）：所有路径按它排版，再整体等比缩放铺到白板上 */
export const SCENE = { width: 1000, height: 560 };

/** 缩放时让出的边距：左边给工具栏，其它三边留呼吸 */
export const SCENE_INSET = { left: 84, right: 16, top: 20, bottom: 20 };

export interface BoardSize {
  width: number;
  height: number;
}

export interface SceneTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/** 设计坐标 → 白板像素：等比缩放 + 居中，左侧先让出工具栏 */
export function getSceneTransform(size: BoardSize): SceneTransform {
  const usableWidth = Math.max(1, size.width - SCENE_INSET.left - SCENE_INSET.right);
  const usableHeight = Math.max(1, size.height - SCENE_INSET.top - SCENE_INSET.bottom);
  const scale = Math.min(usableWidth / SCENE.width, usableHeight / SCENE.height);
  return {
    scale,
    offsetX: SCENE_INSET.left + (usableWidth - SCENE.width * scale) / 2,
    offsetY: SCENE_INSET.top + (usableHeight - SCENE.height * scale) / 2,
  };
}

/** 设计坐标点 → 白板像素点 */
export function toScenePx(point: SketchPoint, transform: SceneTransform) {
  return {
    x: transform.offsetX + point.x * transform.scale,
    y: transform.offsetY + point.y * transform.scale,
  };
}

/** 一笔：路径用设计坐标写，画的时候按长度逐段描出来 */
export interface BoardStroke {
  id: string;
  d: string;
  color: string;
  /** 线宽（设计 px） */
  width: number;
  /** 1 倍速下的运笔时长（ms） */
  duration: number;
  /** 描完轮廓后淡入的填充：同一条路径自动闭合 */
  fill?: { color: string; opacity: number };
}

/** 一段手写标注 */
export interface BoardLabel {
  id: string;
  at: SketchPoint;
  text: string;
  /** 设计 px 字号 */
  size: number;
}

/** 一步操作：选工具 / 挑颜色 / 画一笔 / 写一段字 / 停顿 */
export type BoardStep =
  | { action: 'select-tool'; tool: BoardToolbarTool }
  | { action: 'pick-color'; index: number }
  | { action: 'stroke'; id: string }
  | { action: 'label'; id: string }
  | { action: 'pause'; ms: number };

/* ---------- 几何：按板书排版摆好 ---------- */

const SUN = { cx: 112, cy: 150, r: 38 };
const DROP = { cx: 400, cy: 275, r: 52, tipY: 168 };
/** 光线射入雨滴的点（左上方表面） */
const ENTER: SketchPoint = { x: 357, y: 245 };
/** 雨滴内打到背面的点 */
const BACK: SketchPoint = { x: 448, y: 300 };
/** 再从底部射出的点 */
const EXIT: SketchPoint = { x: 414, y: 327 };
const RAINBOW = { cx: 830, cy: 500, fromDeg: 190, toDeg: 350 };
const PERSON = { x: 600, eyeY: 455 };

/** 太阳的一圈光芒：12 条，长度交错，看着像手画的 */
const SUN_RAYS = Array.from({ length: 12 }, (_, index) => {
  const angle = ((-90 + index * 30) * Math.PI) / 180;
  const inner = SUN.r + 12 + (index % 3) * 2;
  const outer = SUN.r + 34 + (index % 2) * 5;
  return {
    id: `sun-ray-${index}`,
    d: handLine(
      [
        { x: SUN.cx + Math.cos(angle) * inner, y: SUN.cy + Math.sin(angle) * inner },
        { x: SUN.cx + Math.cos(angle) * outer, y: SUN.cy + Math.sin(angle) * outer },
      ],
      { seed: 31 + index, amp: 0.7 },
    ),
    color: CRAYON.yellow,
    width: 3,
    duration: 62,
  } satisfies BoardStroke;
});

/** 射出时散开的光：红橙黄绿蓝紫，角度越来越陡 */
const FAN = [
  { key: 'red', color: CRAYON.red, deg: 20, length: 120 },
  { key: 'orange', color: CRAYON.orange, deg: 26, length: 124 },
  { key: 'yellow', color: CRAYON.yellow, deg: 32, length: 128 },
  { key: 'green', color: CRAYON.green, deg: 38, length: 132 },
  { key: 'indigo', color: CRAYON.indigo, deg: 44, length: 136 },
  { key: 'violet', color: CRAYON.violet, deg: 50, length: 140 },
].map(({ key, color, deg, length }) => {
  const rad = (deg * Math.PI) / 180;
  return {
    id: `fan-${key}`,
    color,
    d: handLine([EXIT, { x: EXIT.x + Math.cos(rad) * length, y: EXIT.y + Math.sin(rad) * length }], {
      seed: 60 + deg,
      amp: 1,
    }),
    width: 5,
    duration: 200,
  } satisfies BoardStroke;
});

/** 七层彩虹弧：从外到内一层一层画 */
const RAINBOW_BANDS = [
  { key: 'red', color: CRAYON.red, r: 155 },
  { key: 'orange', color: CRAYON.orange, r: 143 },
  { key: 'yellow', color: CRAYON.yellow, r: 131 },
  { key: 'green', color: CRAYON.green, r: 119 },
  { key: 'cyan', color: CRAYON.cyan, r: 107 },
  { key: 'indigo', color: CRAYON.indigo, r: 95 },
  { key: 'violet', color: CRAYON.violet, r: 83 },
].map(({ key, color, r }, index) => ({
  id: `rainbow-${key}`,
  color,
  d: handArc(RAINBOW.cx, RAINBOW.cy, r, RAINBOW.fromDeg, RAINBOW.toDeg, { seed: 80 + index, amp: 1 }),
  width: 11,
  duration: 420,
}));

const STROKES: BoardStroke[] = [
  {
    id: 'sun-circle',
    d: handCircle(SUN.cx, SUN.cy, SUN.r, { seed: 12, amp: 1.2 }),
    color: CRAYON.yellow,
    width: 4,
    duration: 650,
  },
  ...SUN_RAYS,
  {
    id: 'drop-outline',
    d: handDrop(DROP.cx, DROP.cy, DROP.r, DROP.tipY, { seed: 41, amp: 1.1 }),
    color: CRAYON.blue,
    width: 4,
    duration: 780,
    fill: { color: 'var(--wm-color-whiteboard-droplet-fill)', opacity: 1 },
  },
  {
    id: 'ray-in',
    d: handLine(
      [
        { x: 150, y: 166 },
        ENTER,
      ],
      { seed: 51, amp: 1 },
    ),
    color: CRAYON.gray,
    width: 4.5,
    duration: 480,
  },
  {
    id: 'ray-refract',
    d: handLine([ENTER, BACK], { seed: 52, amp: 0.9 }),
    color: CRAYON.gray,
    width: 4.5,
    duration: 360,
  },
  {
    id: 'ray-reflect',
    d: handLine([BACK, EXIT], { seed: 53, amp: 0.9 }),
    color: CRAYON.gray,
    width: 4.5,
    duration: 360,
  },
  ...FAN,
  ...RAINBOW_BANDS,
  {
    id: 'figure-head',
    d: handCircle(PERSON.x, PERSON.eyeY, 9.5, { seed: 91, amp: 0.6 }),
    color: CRAYON.ink,
    width: 3.6,
    duration: 380,
  },
  {
    id: 'figure-body',
    d: [
      // 身体
      handLine(
        [
          { x: PERSON.x, y: PERSON.eyeY + 10 },
          { x: PERSON.x, y: PERSON.eyeY + 42 },
        ],
        { seed: 92, amp: 0.7 },
      ),
      // 两只手
      handLine(
        [
          { x: PERSON.x - 16, y: PERSON.eyeY + 22 },
          { x: PERSON.x + 16, y: PERSON.eyeY + 22 },
        ],
        { seed: 93, amp: 0.7 },
      ),
      // 两条腿
      handLine(
        [
          { x: PERSON.x, y: PERSON.eyeY + 42 },
          { x: PERSON.x - 11, y: PERSON.eyeY + 67 },
        ],
        { seed: 94, amp: 0.7 },
      ),
      handLine(
        [
          { x: PERSON.x, y: PERSON.eyeY + 42 },
          { x: PERSON.x + 11, y: PERSON.eyeY + 67 },
        ],
        { seed: 95, amp: 0.7 },
      ),
    ].join(' '),
    color: CRAYON.ink,
    width: 3.6,
    duration: 640,
  },
  {
    // 看彩虹的水平基准线
    id: 'angle-base',
    d: handDashedLine(
      { x: PERSON.x + 6, y: PERSON.eyeY },
      { x: PERSON.x + 104, y: PERSON.eyeY },
      { seed: 101 },
    ),
    color: CRAYON.ink,
    width: 2.2,
    duration: 300,
  },
  {
    // 约 42° 的小弧线
    id: 'angle-arc',
    d: handDashedArc(PERSON.x + 4, PERSON.eyeY, 54, 0, -42, { seed: 102 }),
    color: CRAYON.ink,
    width: 2.2,
    duration: 360,
  },
  {
    id: 'arrow-refract',
    d: handArrow({ x: 266, y: 318 }, { x: 352, y: 258 }, { seed: 111, amp: 0.6 }),
    color: CRAYON.ink,
    width: 2.4,
    duration: 260,
  },
  {
    id: 'arrow-reflect',
    d: handArrow({ x: 462, y: 240 }, { x: 452, y: 292 }, { seed: 112, amp: 0.5 }),
    color: CRAYON.ink,
    width: 2.4,
    duration: 250,
  },
  {
    id: 'arrow-split',
    d: handArrow({ x: 336, y: 432 }, { x: 404, y: 338 }, { seed: 113, amp: 0.6 }),
    color: CRAYON.ink,
    width: 2.4,
    duration: 270,
  },
];

const LABELS: BoardLabel[] = [
  { id: 'title', at: { x: 0, y: 56 }, text: '彩虹是怎么形成的', size: 34 },
  { id: 'label-refract', at: { x: 205, y: 330 }, text: '①折射', size: 22 },
  { id: 'label-reflect', at: { x: 462, y: 225 }, text: '②反射', size: 22 },
  { id: 'label-split', at: { x: 300, y: 448 }, text: '③再折射、分光', size: 22 },
  { id: 'label-angle', at: { x: 640, y: 406 }, text: '约 42°', size: 18 },
];

const PICK = PALETTE_INDEX;

/**
 * 绘制脚本：先写标题，再挑黄笔画太阳、蓝笔画雨滴（描完灌色），
 * 灰笔画光线，六种颜色画散开的光，七层彩虹从外往里一层层叠上去，
 * 最后换黑笔补小人和 42° 辅助线，回到文本工具写标注。
 */
const STEPS: BoardStep[] = [
  // 白板铺开后先停一拍，让观众看清工具栏
  { action: 'pause', ms: 220 },

  { action: 'select-tool', tool: 'text' },
  { action: 'label', id: 'title' },
  { action: 'pause', ms: 100 },

  { action: 'select-tool', tool: 'ai-pen' },
  { action: 'pick-color', index: PICK.yellow },
  { action: 'stroke', id: 'sun-circle' },
  ...SUN_RAYS.map((ray): BoardStep => ({ action: 'stroke', id: ray.id })),
  { action: 'pause', ms: 100 },

  { action: 'pick-color', index: PICK.blue },
  { action: 'stroke', id: 'drop-outline' },
  { action: 'pause', ms: 90 },

  { action: 'pick-color', index: PICK.gray },
  { action: 'stroke', id: 'ray-in' },
  { action: 'stroke', id: 'ray-refract' },
  { action: 'stroke', id: 'ray-reflect' },
  { action: 'pause', ms: 110 },

  ...[
    { key: 'red', index: PICK.red },
    { key: 'orange', index: PICK.orange },
    { key: 'yellow', index: PICK.yellow },
    { key: 'green', index: PICK.green },
    { key: 'indigo', index: PICK.indigo },
    { key: 'violet', index: PICK.violet },
  ].flatMap(({ key, index }): BoardStep[] => [
    { action: 'pick-color', index },
    { action: 'stroke', id: `fan-${key}` },
  ]),
  { action: 'pause', ms: 90 },

  ...['red', 'orange', 'yellow', 'green', 'cyan', 'indigo', 'violet'].flatMap(
    (key): BoardStep[] => [
      { action: 'pick-color', index: PICK[key as keyof typeof PICK] },
      { action: 'stroke', id: `rainbow-${key}` },
    ],
  ),
  { action: 'pause', ms: 150 },

  { action: 'pick-color', index: PICK.ink },
  { action: 'stroke', id: 'figure-head' },
  { action: 'stroke', id: 'figure-body' },
  { action: 'stroke', id: 'angle-base' },
  { action: 'stroke', id: 'angle-arc' },
  { action: 'stroke', id: 'arrow-refract' },
  { action: 'stroke', id: 'arrow-reflect' },
  { action: 'stroke', id: 'arrow-split' },
  { action: 'pause', ms: 100 },

  { action: 'select-tool', tool: 'text' },
  { action: 'label', id: 'label-refract' },
  { action: 'label', id: 'label-reflect' },
  { action: 'label', id: 'label-split' },
  { action: 'label', id: 'label-angle' },
  { action: 'pause', ms: 500 },
];

export const whiteboardScenario = {
  strokes: STROKES,
  labels: LABELS,
  steps: STEPS,
  palette: BOARD_PALETTE,
  intro: '好的，我来给同学们画一下彩虹的形成过程～',
  done: '已画好，同学们可以看白板～阳光射进雨滴后折射、内部反射、再折射出来，七色光按角度散开，背对太阳、约 42° 角就能看到彩虹。',
};

export function findStroke(id: string): BoardStroke | undefined {
  return STROKES.find((stroke) => stroke.id === id);
}

export function findLabel(id: string): BoardLabel | undefined {
  return LABELS.find((label) => label.id === id);
}

/** 「画面」指的是共享画面本身，不是绘画意图，不能把 OCR 这类演示场景抢走 */
export function isWhiteboardDrawRequest(text: string): boolean {
  if (text.includes('流程图') || text.includes('彩虹')) {
    return true;
  }
  return text.includes('画') && !text.includes('画面');
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
    source: '操作 · 画笔已收起',
  };
}
