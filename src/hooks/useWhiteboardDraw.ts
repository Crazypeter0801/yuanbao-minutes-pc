import { useEffect, useRef, useState } from 'react';
import {
  BOARD_FONT,
  BOARD_TOOLBAR_TOOLS,
  boxRectOf,
  findBoardElement,
  getBoardFrame,
  toBoardPx,
  whiteboardScenario,
  type BoardBoxElement,
  type BoardEdgeElement,
  type BoardSize,
  type BoardTextElement,
  type BoardToolbarTool,
} from '@/data/whiteboardScenario';

export type { BoardSize };

/** 左侧工具栏量出来的几何（px）：和 WhiteboardToolbar 的样式一一对应 */
export const TOOLBAR_METRICS = {
  /** 距白板左缘 */
  offset: 8,
  width: 44,
  paddingTop: 16,
  paddingBottom: 10,
  button: 28,
  gap: 4,
};

/** 工具栏面板高度：10 个按钮 + 间距 + 上下内边距 */
const toolbarHeight = () =>
  TOOLBAR_METRICS.paddingTop +
  TOOLBAR_METRICS.paddingBottom +
  BOARD_TOOLBAR_TOOLS.length * TOOLBAR_METRICS.button +
  (BOARD_TOOLBAR_TOOLS.length - 1) * TOOLBAR_METRICS.gap;

/** 第 index 个按钮的中心点（白板像素坐标） */
function toolbarButtonCenter(index: number, size: BoardSize) {
  return {
    x: TOOLBAR_METRICS.offset + TOOLBAR_METRICS.width / 2,
    y:
      (size.height - toolbarHeight()) / 2 +
      TOOLBAR_METRICS.paddingTop +
      index * (TOOLBAR_METRICS.button + TOOLBAR_METRICS.gap) +
      TOOLBAR_METRICS.button / 2,
  };
}

export interface WhiteboardCursor {
  x: number;
  y: number;
  visible: boolean;
  /** 按住左键拖动：指针略微收紧 */
  pressing: boolean;
}

export interface WhiteboardRipple {
  x: number;
  y: number;
  /** 每次点击 +1，用来重播涟漪动画 */
  key: number;
}

/** 正在拖拽的方框：宽高跟着鼠标走 */
export interface BoardDragBox {
  id: string;
  kind: 'box' | 'decision';
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 文字工具点下后出现的输入光标 */
export interface BoardCaret {
  x: number;
  y: number;
  height: number;
  visible: boolean;
}

export interface WhiteboardDrawState {
  activeTool: BoardToolbarTool | null;
  /** 点选工具时短暂按下的按钮，松手后回到 activeTool */
  pressedTool: BoardToolbarTool | null;
  cursor: WhiteboardCursor;
  ripple: WhiteboardRipple | null;
  /** 正在拖拽的方框（实时尺寸）；松手后转进 shapes */
  dragBox: BoardDragBox | null;
  /** 已经画完的方框 / 菱形 id */
  shapes: string[];
  /** 连线绘制进度 0～1 */
  edges: Record<string, number>;
  /** 文字已经写出几个字 */
  chars: Record<string, number>;
  caret: BoardCaret | null;
  /** 白板已经出现（元宝开始接管） */
  started: boolean;
}

interface Point {
  x: number;
  y: number;
}

/** 取消信号：重播 / 卸载时打断正在等待的动画 */
const CANCELLED = new Error('whiteboard-draw-cancelled');

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** 缓入缓出：鼠标起步和收尾都慢一点，中段快 */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const distance = (points: Point[]) =>
  points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + Math.hypot(point.x - previous.x, point.y - previous.y);
  }, 0);

/** 折线上按比例取点：0 是起点，1 是终点 */
const pointAlong = (points: Point[], t: number): Point => {
  const total = distance(points);
  let remain = clamp(t, 0, 1) * total;
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const segment = Math.hypot(to.x - from.x, to.y - from.y);
    if (remain <= segment || index === points.length - 1) {
      const ratio = segment === 0 ? 0 : clamp(remain / segment, 0, 1);
      return { x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio };
    }
    remain -= segment;
  }
  return points[points.length - 1];
};

/** 单字宽度估算：中文按字号，西文按 0.56 倍，够用来排光标和推字 */
const glyphWidth = (glyph: string, fontSize: number) => (/[\u4e00-\u9fa5]/.test(glyph) ? fontSize : fontSize * 0.56);

const textWidth = (text: string, fontSize: number) =>
  Array.from(text).reduce((total, glyph) => total + glyphWidth(glyph, fontSize), 0);

interface WhiteboardDrawOptions {
  /** 白板实际像素尺寸；量到之后才开始画 */
  size: BoardSize | null;
  /** 每次触发 +1：同一个白板重播时清空上一轮 */
  runKey: number;
  /** 鼠标淡出后回调，App 用它往对话里补一句「已画好」 */
  onComplete?: () => void;
}

/**
 * 白板绘制引擎
 *
 * 按 whiteboardScenario.steps 顺序模拟真人操作：鼠标沿弧线移到左侧工具栏点按钮（按下态 + 涟漪），
 * 再用对应工具作画——
 * - 形状：在起点按下，拖到终点，包围盒宽高跟着鼠标实时变化，松开定型；
 * - AI 画笔：从起点拖到终点，折线随鼠标延伸，松手后才补上箭头；
 * - 文本：点一下出现输入光标，逐字出现。
 * 全程 requestAnimationFrame，重播时通过取消信号中断上一轮。
 */
export function useWhiteboardDraw({ size, runKey, onComplete }: WhiteboardDrawOptions): WhiteboardDrawState {
  const [activeTool, setActiveTool] = useState<BoardToolbarTool | null>(null);
  const [pressedTool, setPressedTool] = useState<BoardToolbarTool | null>(null);
  const [cursor, setCursor] = useState<WhiteboardCursor>({ x: 0, y: 0, visible: false, pressing: false });
  const [ripple, setRipple] = useState<WhiteboardRipple | null>(null);
  const [dragBox, setDragBox] = useState<BoardDragBox | null>(null);
  const [shapes, setShapes] = useState<string[]>([]);
  const [edges, setEdges] = useState<Record<string, number>>({});
  const [chars, setChars] = useState<Record<string, number>>({});
  const [caret, setCaret] = useState<BoardCaret | null>(null);
  const [started, setStarted] = useState(false);

  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const rippleSeq = useRef(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  /**
   * 白板尺寸放 ref 里：侧栏开合会改变会议区宽度，但正在画的这一轮不能因此重来。
   * 每一步取当时的尺寸换算坐标，已经画出的图形由渲染层按新尺寸重绘。
   */
  const sizeRef = useRef<BoardSize | null>(size);
  sizeRef.current = size;
  const ready = Boolean(size);

  useEffect(() => {
    if (!ready) {
      return undefined;
    }
    const initialSize = sizeRef.current;
    if (!initialSize) {
      return undefined;
    }
    const currentSize = () => sizeRef.current ?? initialSize;

    let cancelled = false;
    const timers = new Set<number>();
    const rafs = new Set<number>();

    const guard = () => {
      if (cancelled) {
        throw CANCELLED;
      }
    };

    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (cancelled) {
          reject(CANCELLED);
          return;
        }
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          if (cancelled) {
            reject(CANCELLED);
            return;
          }
          resolve();
        }, ms);
        timers.add(timer);
      });

    const tween = (duration: number, onUpdate: (t: number) => void) =>
      new Promise<void>((resolve, reject) => {
        if (cancelled) {
          reject(CANCELLED);
          return;
        }
        const start = performance.now();
        let handle = 0;
        const tick = (now: number) => {
          rafs.delete(handle);
          if (cancelled) {
            reject(CANCELLED);
            return;
          }
          const t = clamp((now - start) / duration, 0, 1);
          onUpdate(t);
          if (t >= 1) {
            resolve();
            return;
          }
          handle = window.requestAnimationFrame(tick);
          rafs.add(handle);
        };
        handle = window.requestAnimationFrame(tick);
        rafs.add(handle);
      });

    const moveCursorTo = (point: Point) => {
      cursorRef.current = point;
      setCursor((previous) => ({ ...previous, x: point.x, y: point.y }));
    };

    /** 鼠标沿一条轻微外抛的弧线移动，落点前自然减速 */
    const moveTo = async (target: Point, duration?: number) => {
      const from = { ...cursorRef.current };
      const dx = target.x - from.x;
      const dy = target.y - from.y;
      const length = Math.hypot(dx, dy);
      if (length < 0.5) {
        return;
      }
      // 垂直方向偏一点，避免每一段都是死板直线；距离越远弧度越明显
      const bend = Math.min(46, length * 0.09);
      const control = {
        x: (from.x + target.x) / 2 + (-dy / length) * bend,
        y: (from.y + target.y) / 2 + (dx / length) * bend,
      };
      const ms = duration ?? clamp(length * 1.15, 260, 820);
      await tween(ms, (t) => {
        const k = easeInOut(t);
        const rest = 1 - k;
        moveCursorTo({
          x: rest * rest * from.x + 2 * rest * k * control.x + k * k * target.x,
          y: rest * rest * from.y + 2 * rest * k * control.y + k * k * target.y,
        });
      });
      await sleep(80);
    };

    /** 点一下：按下、涟漪、松手；传 tool 时同时点亮工具栏按钮 */
    const clickAt = async (point: Point, tool?: BoardToolbarTool) => {
      setCursor((previous) => ({ ...previous, pressing: true }));
      if (tool) {
        setPressedTool(tool);
      }
      await sleep(80);
      rippleSeq.current += 1;
      setRipple({ x: point.x, y: point.y, key: rippleSeq.current });
      if (tool) {
        setActiveTool(tool);
      }
      await sleep(170);
      setPressedTool(null);
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(200);
    };

    /** 移到左侧工具栏点按钮：先把鼠标挪到按钮中心，再按下 */
    const selectTool = async (tool: BoardToolbarTool) => {
      const index = BOARD_TOOLBAR_TOOLS.indexOf(tool);
      const target = toolbarButtonCenter(index, currentSize());
      await moveTo(target);
      await clickAt(target, tool);
    };

    /** 拖拽方框：左上角按下，右下角松开，宽高跟着鼠标走 */
    const dragShape = async (element: BoardBoxElement) => {
      const frame = getBoardFrame(currentSize());
      const rect = boxRectOf(element, frame);
      const start = { x: rect.x, y: rect.y };
      const end = { x: rect.x + rect.width, y: rect.y + rect.height };
      const span = Math.hypot(rect.width, rect.height);

      await moveTo(start);
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(90);
      rippleSeq.current += 1;
      setRipple({ x: start.x, y: start.y, key: rippleSeq.current });
      setDragBox({ id: element.id, kind: element.kind, x: start.x, y: start.y, width: 0, height: 0 });
      await sleep(70);

      await tween(clamp(span * 1.35, 420, 820), (t) => {
        const k = easeInOut(t);
        const point = { x: lerp(start.x, end.x, k), y: lerp(start.y, end.y, k) };
        moveCursorTo(point);
        // 宽高按鼠标当前位置反推：左上角固定，右下角跟着指针
        setDragBox({
          id: element.id,
          kind: element.kind,
          x: Math.min(start.x, point.x),
          y: Math.min(start.y, point.y),
          width: Math.abs(point.x - start.x),
          height: Math.abs(point.y - start.y),
        });
      });

      // 松开：定型（和拖拽最后一帧同一个矩形，不会跳）
      setCursor((previous) => ({ ...previous, pressing: false }));
      setDragBox(null);
      setShapes((previous) => (previous.includes(element.id) ? previous : [...previous, element.id]));
      await sleep(120);
    };

    /** 拖连线：从起点拖到终点，线条随鼠标延伸；松手后才出现箭头 */
    const dragEdge = async (element: BoardEdgeElement) => {
      const frame = getBoardFrame(currentSize());
      const points = element.points.map((point) => toBoardPx(point, frame));
      const length = distance(points);

      await moveTo(points[0]);
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(80);
      rippleSeq.current += 1;
      setRipple({ x: points[0].x, y: points[0].y, key: rippleSeq.current });
      await sleep(50);

      await tween(clamp(length * 1.6, 340, 700), (t) => {
        const k = easeInOut(t);
        setEdges((previous) => ({ ...previous, [element.id]: k }));
        moveCursorTo(pointAlong(points, k));
      });

      setCursor((previous) => ({ ...previous, pressing: false }));
      setEdges((previous) => ({ ...previous, [element.id]: 1 }));
      await sleep(110);
    };

    /** 文本工具：点一下出现光标，然后逐字打出来，光标跟着走（多行文字换行时回到下一行行首） */
    const typeText = async (
      element: BoardBoxElement | BoardTextElement,
      anchor: Point,
      fontSize: number,
      centered: boolean,
    ) => {
      const lines = element.text.split('\n');
      const glyphs = Array.from(lines.join(''));
      const lineWidths = lines.map((line) => textWidth(line, fontSize));
      const blockWidth = Math.max(...lineWidths);
      const lineHeight = fontSize * 1.55;
      const firstX = centered ? anchor.x - blockWidth / 2 : anchor.x;
      const caretTop = anchor.y - ((lines.length - 1) * lineHeight) / 2 - fontSize * 0.62;

      await moveTo({ x: firstX, y: anchor.y });
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(70);
      rippleSeq.current += 1;
      setRipple({ x: firstX, y: anchor.y, key: rippleSeq.current });
      setCaret({ x: firstX, y: caretTop, height: fontSize * 1.24, visible: true });
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(180);

      let line = 0;
      let inLine = 0;
      let typedWidth = 0;
      const caretAt = () => ({
        x: (centered ? anchor.x - lineWidths[line] / 2 : firstX) + typedWidth,
        y: caretTop + line * lineHeight,
        height: fontSize * 1.24,
        visible: true,
      });

      for (let index = 1; index <= glyphs.length; index += 1) {
        guard();
        const glyph = glyphs[index - 1];
        if (inLine >= lines[line].length && line < lines.length - 1) {
          line += 1;
          inLine = 0;
          typedWidth = 0;
        }
        typedWidth += glyphWidth(glyph, fontSize);
        inLine += 1;
        setChars((previous) => ({ ...previous, [element.id]: index }));
        setCaret(caretAt());
        await sleep(glyph === ' ' ? 40 : 62);
      }

      await sleep(160);
      setCaret(null);
      await sleep(90);
    };

    /** 方框里的字：点一下框内进入编辑，居中排版 */
    const writeInBox = async (element: BoardBoxElement) => {
      const frame = getBoardFrame(currentSize());
      const rect = boxRectOf(element, frame);
      const fontSize = element.kind === 'decision' ? BOARD_FONT.decision : BOARD_FONT.box;
      const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      await typeText(element, center, fontSize, true);
    };

    /** 独立文字（标题）：点一下出光标，左对齐逐字出现 */
    const writeText = async (element: BoardTextElement) => {
      const frame = getBoardFrame(currentSize());
      const anchor = toBoardPx(element.at, frame);
      await typeText(element, anchor, element.fontSize, element.anchor !== 'start');
    };

    const run = async () => {
      // 从白板左上角外侧进入，像人把鼠标移进画布
      const startPoint = { x: 4, y: 12 };
      cursorRef.current = startPoint;
      setCursor({ x: startPoint.x, y: startPoint.y, visible: true, pressing: false });
      setStarted(true);
      await sleep(200);

      for (const step of whiteboardScenario.steps) {
        guard();
        if (step.action === 'select-tool') {
          await selectTool(step.tool);
        } else if (step.action === 'draw') {
          const element = findBoardElement(step.id);
          if (element?.kind === 'edge') {
            await dragEdge(element);
          } else if (element && (element.kind === 'box' || element.kind === 'decision')) {
            await dragShape(element);
          }
        } else if (step.action === 'write') {
          const element = findBoardElement(step.id);
          if (element && (element.kind === 'box' || element.kind === 'decision')) {
            await writeInBox(element);
          } else if (element?.kind === 'text') {
            await writeText(element);
          }
        } else {
          await sleep(step.ms);
        }
      }

      await sleep(620);
      setCaret(null);
      setCursor((previous) => ({ ...previous, visible: false, pressing: false }));
      await sleep(520);
      guard();
      completeRef.current?.();
    };

    setShapes([]);
    setEdges({});
    setChars({});
    setCaret(null);
    setDragBox(null);
    setActiveTool(null);
    setPressedTool(null);
    setRipple(null);
    setStarted(false);

    run().catch((error: unknown) => {
      if (error !== CANCELLED) {
        throw error;
      }
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      rafs.forEach((handle) => window.cancelAnimationFrame(handle));
      rafs.clear();
    };
  }, [ready, runKey]);

  return { activeTool, pressedTool, cursor, ripple, dragBox, shapes, edges, chars, caret, started };
}
