import { useEffect, useRef, useState } from 'react';
import {
  BOARD_DESIGN,
  BOARD_FONT,
  BOARD_TOOL_ORDER,
  BOARD_TOOLBAR,
  findBoardElement,
  getBoardTransform,
  whiteboardScenario,
  type BoardBoxElement,
  type BoardEdgeElement,
  type BoardPoint,
  type BoardTextElement,
  type BoardTool,
} from '@/data/whiteboardScenario';

export interface BoardSize {
  width: number;
  height: number;
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

export interface WhiteboardDrawState {
  activeTool: BoardTool | null;
  /** 点选工具时短暂按下的按钮，松手后回到 activeTool */
  pressedTool: BoardTool | null;
  cursor: WhiteboardCursor;
  ripple: WhiteboardRipple | null;
  /** 元素画到几成：0～1，方框描边 / 连线用它做逐笔绘制 */
  progress: Record<string, number>;
  /** 文字已经写出几个字 */
  chars: Record<string, number>;
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

const quadAt = (from: Point, control: Point, to: Point, t: number): Point => {
  const rest = 1 - t;
  return {
    x: rest * rest * from.x + 2 * rest * t * control.x + t * t * to.x,
    y: rest * rest * from.y + 2 * rest * t * control.y + t * t * to.y,
  };
};

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
 * 按 whiteboardScenario.steps 的顺序执行：把鼠标沿二次贝塞尔曲线缓动到工具栏、
 * 点击（涟漪 + 工具按下态）、再贴着图形轮廓拖动。图形进度 0～1 直接驱动 strokeDashoffset，
 * 文字按字递增；整个过程用 requestAnimationFrame，重播时通过取消信号中断上一轮。
 */
export function useWhiteboardDraw({ size, runKey, onComplete }: WhiteboardDrawOptions): WhiteboardDrawState {
  const [activeTool, setActiveTool] = useState<BoardTool | null>(null);
  const [pressedTool, setPressedTool] = useState<BoardTool | null>(null);
  const [cursor, setCursor] = useState<WhiteboardCursor>({ x: 0, y: 0, visible: false, pressing: false });
  const [ripple, setRipple] = useState<WhiteboardRipple | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [chars, setChars] = useState<Record<string, number>>({});
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

    const currentTransform = () => getBoardTransform(currentSize());
    const toPx = (point: BoardPoint): Point => {
      const transform = currentTransform();
      return {
        x: transform.offsetX + point.x * BOARD_DESIGN.width * transform.scale,
        y: transform.offsetY + point.y * BOARD_DESIGN.height * transform.scale,
      };
    };
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
      await tween(ms, (t) => moveCursorTo(quadAt(from, control, target, easeInOut(t))));
      await sleep(90);
    };

    /** 点一下：按下、涟漪、松手；传 tool 时同时点亮工具栏按钮 */
    const clickAt = async (point: Point, tool?: BoardTool) => {
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
      await sleep(220);
    };

    const selectTool = async (tool: BoardTool) => {
      const index = BOARD_TOOL_ORDER.indexOf(tool);
      const board = currentSize();
      const buttonY =
        board.height - BOARD_TOOLBAR.bottom - BOARD_TOOLBAR.padding - BOARD_TOOLBAR.button / 2;
      const buttonX = board.width / 2 + (index - 1) * (BOARD_TOOLBAR.button + BOARD_TOOLBAR.gap);
      const target = { x: buttonX, y: buttonY };
      await moveTo(target);
      await clickAt(target, tool);
    };

    const boxRect = (element: BoardBoxElement) => {
      const transform = currentTransform();
      const scale = transform.scale;
      return {
        x: transform.offsetX + (element.center.x - element.width / 2) * BOARD_DESIGN.width * scale,
        y: transform.offsetY + (element.center.y - element.height / 2) * BOARD_DESIGN.height * scale,
        w: element.width * BOARD_DESIGN.width * scale,
        h: element.height * BOARD_DESIGN.height * scale,
      };
    };

    /** 矩形从左上角顺时针；菱形从顶点顺时针；末尾重复起点方便按周长取点 */
    const outlineOf = (element: BoardBoxElement): Point[] => {
      const rect = boxRect(element);
      if (element.kind === 'decision') {
        return [
          { x: rect.x + rect.w / 2, y: rect.y },
          { x: rect.x + rect.w, y: rect.y + rect.h / 2 },
          { x: rect.x + rect.w / 2, y: rect.y + rect.h },
          { x: rect.x, y: rect.y + rect.h / 2 },
          { x: rect.x + rect.w / 2, y: rect.y },
        ];
      }
      return [
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.w, y: rect.y },
        { x: rect.x + rect.w, y: rect.y + rect.h },
        { x: rect.x, y: rect.y + rect.h },
        { x: rect.x, y: rect.y },
      ];
    };

    const drawShape = async (element: BoardBoxElement) => {
      const outline = outlineOf(element);
      await moveTo(outline[0]);
      await clickAt(outline[0]);
      setCursor((previous) => ({ ...previous, pressing: true }));
      await tween(700, (t) => {
        setProgress((previous) => ({ ...previous, [element.id]: t }));
        moveCursorTo(pointAlong(outline, t));
      });
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(120);
    };

    const drawEdge = async (element: BoardEdgeElement) => {
      const points = element.points.map(toPx);
      await moveTo(points[0]);
      await clickAt(points[0]);
      setCursor((previous) => ({ ...previous, pressing: true }));
      await tween(560, (t) => {
        setProgress((previous) => ({ ...previous, [element.id]: t }));
        moveCursorTo(pointAlong(points, t));
      });
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(110);
    };

    /** 文字逐字出现，鼠标沿着这一行从左往右走 */
    const writeText = async (element: BoardBoxElement | BoardTextElement) => {
      const fontSize = element.kind === 'text' ? element.fontSize : BOARD_FONT[element.kind];
      const glyphs = Array.from(element.text.replace(/\n/g, ''));
      const transform = currentTransform();
      const approxWidth =
        glyphs.length * fontSize * (element.kind === 'text' ? 1 : 0.95) * transform.scale;
      const anchorX = transform.offsetX + element.center.x * BOARD_DESIGN.width * transform.scale;
      const centerX =
        element.kind === 'text' && element.anchor === 'start' ? anchorX : anchorX - approxWidth / 2;
      const baseline =
        transform.offsetY +
        element.center.y * BOARD_DESIGN.height * transform.scale +
        fontSize * 0.34 * transform.scale;
      await moveTo({ x: centerX, y: baseline });
      await clickAt({ x: centerX, y: baseline });
      setCursor((previous) => ({ ...previous, pressing: true }));
      for (let index = 1; index <= glyphs.length; index += 1) {
        guard();
        setChars((previous) => ({ ...previous, [element.id]: index }));
        moveCursorTo({ x: centerX + (approxWidth * index) / glyphs.length, y: baseline });
        await sleep(48);
      }
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(110);
    };

    const run = async () => {
      // 从白板左上角外侧进入，像人把鼠标移进画布
      const board = currentSize();
      moveCursorTo({ x: board.width * 0.035, y: board.height * 0.14 });
      setCursor({ x: board.width * 0.035, y: board.height * 0.14, visible: true, pressing: false });
      setStarted(true);
      await sleep(120);

      for (const step of whiteboardScenario.steps) {
        guard();
        if (step.action === 'select-tool') {
          await selectTool(step.tool);
        } else if (step.action === 'draw') {
          const element = findBoardElement(step.id);
          if (element?.kind === 'edge') {
            await drawEdge(element);
          } else if (element && (element.kind === 'box' || element.kind === 'decision')) {
            await drawShape(element);
          }
        } else if (step.action === 'write') {
          const element = findBoardElement(step.id);
          if (element && element.kind !== 'edge') {
            await writeText(element);
          }
        } else {
          await sleep(step.ms);
        }
      }

      await sleep(600);
      setCursor((previous) => ({ ...previous, visible: false, pressing: false }));
      await sleep(520);
      guard();
      completeRef.current?.();
    };

    setProgress({});
    setChars({});
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

  return { activeTool, pressedTool, cursor, ripple, progress, chars, started };
}
