import { useEffect, useRef, useState } from 'react';
import {
  BOARD_PALETTE,
  BOARD_TOOLBAR_TOOLS,
  findLabel,
  findStroke,
  getSceneTransform,
  whiteboardScenario,
  WHITEBOARD_SPEED,
  type BoardLabel,
  type BoardSize,
  type BoardStroke,
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

/** 调色板几何（px）：和 WhiteboardPalette 的样式一一对应 */
export const PALETTE_METRICS = {
  /** 距白板左缘（工具栏右边留 8） */
  left: 60,
  width: 32,
  padding: 6,
  swatch: 20,
  gap: 6,
};

const toolbarHeight = () =>
  TOOLBAR_METRICS.paddingTop +
  TOOLBAR_METRICS.paddingBottom +
  BOARD_TOOLBAR_TOOLS.length * TOOLBAR_METRICS.button +
  (BOARD_TOOLBAR_TOOLS.length - 1) * TOOLBAR_METRICS.gap;

const paletteHeight = () =>
  PALETTE_METRICS.padding * 2 +
  BOARD_PALETTE.length * PALETTE_METRICS.swatch +
  (BOARD_PALETTE.length - 1) * PALETTE_METRICS.gap;

/** 第 index 个工具按钮的中心点（白板像素坐标） */
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

/** 第 index 个色块的中心点 */
function paletteSwatchCenter(index: number, size: BoardSize) {
  return {
    x: PALETTE_METRICS.left + PALETTE_METRICS.padding + PALETTE_METRICS.swatch / 2,
    y:
      (size.height - paletteHeight()) / 2 +
      PALETTE_METRICS.padding +
      index * (PALETTE_METRICS.swatch + PALETTE_METRICS.gap) +
      PALETTE_METRICS.swatch / 2,
  };
}

export interface WhiteboardCursor {
  x: number;
  y: number;
  visible: boolean;
  /** 按住左键拖动：指针略微收紧 */
  pressing: boolean;
  /** 笔尖切线方向（度）；为空时由鼠标位移推算 */
  heading: number | null;
}

export interface WhiteboardRipple {
  x: number;
  y: number;
  /** 每次点击 +1，用来重播涟漪动画 */
  key: number;
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
  /** 当前选中的颜色（调色板下标） */
  activeColor: number | null;
  /** 正在按下的色块 */
  pressedColor: number | null;
  cursor: WhiteboardCursor;
  ripple: WhiteboardRipple | null;
  /** 每一笔描到几成：0～1 */
  strokes: Record<string, number>;
  /** 雨滴填充淡入进度 */
  fills: Record<string, number>;
  /** 标注已经写出几个字 */
  labels: Record<string, number>;
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

/** 单字宽度估算：中文按字号，西文按 0.56 倍，用来排光标 */
const glyphWidth = (glyph: string, fontSize: number) =>
  /[\u4e00-\u9fa5]/.test(glyph) ? fontSize : fontSize * 0.56;

const SVG_NS = 'http://www.w3.org/2000/svg';

interface WhiteboardDrawOptions {
  /** 白板实际像素尺寸；量到之后才开始画 */
  size: BoardSize | null;
  /** 每次触发 +1：同一个白板重播时清空上一轮 */
  runKey: number;
  /** 鼠标淡出后回调，App 用它往对话里补一句「画好了」 */
  onComplete?: () => void;
}

/**
 * 白板绘制引擎（板书版）
 *
 * 按 whiteboardScenario.steps 顺序模拟老师板书：先去左侧工具栏点「文本 / AI 画笔」、挑颜色，
 * 再沿着每一笔的 SVG 路径描出来——笔尖位置由 getPointAtLength 取，描到哪里、线和光标就到哪里，
 * 箭头朝向用笔尖切线。
 * 全程 requestAnimationFrame，重播时通过取消信号中断上一轮。
 */
export function useWhiteboardDraw({ size, runKey, onComplete }: WhiteboardDrawOptions): WhiteboardDrawState {
  const [activeTool, setActiveTool] = useState<BoardToolbarTool | null>(null);
  const [pressedTool, setPressedTool] = useState<BoardToolbarTool | null>(null);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [pressedColor, setPressedColor] = useState<number | null>(null);
  const [cursor, setCursor] = useState<WhiteboardCursor>({
    x: 0,
    y: 0,
    visible: false,
    pressing: false,
    heading: null,
  });
  const [ripple, setRipple] = useState<WhiteboardRipple | null>(null);
  const [strokes, setStrokes] = useState<Record<string, number>>({});
  const [fills, setFills] = useState<Record<string, number>>({});
  const [labels, setLabels] = useState<Record<string, number>>({});
  const [caret, setCaret] = useState<BoardCaret | null>(null);
  const [started, setStarted] = useState(false);

  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const rippleSeq = useRef(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  /**
   * 白板尺寸放 ref 里：侧栏开合会改变会议区宽度，但正在画的这一轮不能因此重来。
   * 每一步取当时的尺寸换算坐标，已经画出的笔画由渲染层按新尺寸重绘。
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

    // 量路径用的离屏 path：getTotalLength / getPointAtLength 都在设计坐标里算
    const measureSvg = document.createElementNS(SVG_NS, 'svg');
    const measurePath = document.createElementNS(SVG_NS, 'path');
    measureSvg.setAttribute('width', '0');
    measureSvg.setAttribute('height', '0');
    measureSvg.style.position = 'absolute';
    measureSvg.style.left = '-9999px';
    measureSvg.style.pointerEvents = 'none';
    measureSvg.appendChild(measurePath);
    document.body.appendChild(measureSvg);

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
        }, ms / WHITEBOARD_SPEED);
        timers.add(timer);
      });

    const tween = (duration: number, onUpdate: (t: number) => void) =>
      new Promise<void>((resolve, reject) => {
        if (cancelled) {
          reject(CANCELLED);
          return;
        }
        // 所有补间统一按全局速度系数缩短，调用处仍写 1 倍速的毫秒值
        const span = duration / WHITEBOARD_SPEED;
        const start = performance.now();
        let handle = 0;
        const tick = (now: number) => {
          rafs.delete(handle);
          if (cancelled) {
            reject(CANCELLED);
            return;
          }
          const t = clamp((now - start) / span, 0, 1);
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

    const moveCursorTo = (point: Point, heading: number | null = null) => {
      cursorRef.current = point;
      setCursor((previous) => ({ ...previous, x: point.x, y: point.y, heading }));
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
      const bend = Math.min(40, length * 0.08);
      const control = {
        x: (from.x + target.x) / 2 + (-dy / length) * bend,
        y: (from.y + target.y) / 2 + (dx / length) * bend,
      };
      const ms = duration ?? clamp(length * 0.5, 80, 260);
      await tween(ms, (t) => {
        const k = easeInOut(t);
        const rest = 1 - k;
        moveCursorTo({
          x: rest * rest * from.x + 2 * rest * k * control.x + k * k * target.x,
          y: rest * rest * from.y + 2 * rest * k * control.y + k * k * target.y,
        });
      });
      await sleep(50);
    };

    /** 移到左侧工具栏点按钮 */
    const selectTool = async (tool: BoardToolbarTool) => {
      const index = BOARD_TOOLBAR_TOOLS.indexOf(tool);
      const target = toolbarButtonCenter(index, currentSize());
      await moveTo(target);
      setPressedTool(tool);
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(40);
      rippleSeq.current += 1;
      setRipple({ x: target.x, y: target.y, key: rippleSeq.current });
      setActiveTool(tool);
      await sleep(100);
      setPressedTool(null);
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(70);
    };

    /** 点调色板挑颜色 */
    const pickColor = async (index: number) => {
      const target = paletteSwatchCenter(index, currentSize());
      // 挑颜色是短促的一下，不用像画线那样慢慢挪
      await moveTo(target, 300);
      setPressedColor(index);
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(40);
      rippleSeq.current += 1;
      setRipple({ x: target.x, y: target.y, key: rippleSeq.current });
      setActiveColor(index);
      await sleep(80);
      setPressedColor(null);
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(60);
    };

    /** 画一笔：沿路径从起点描到终点，笔尖跟着 getPointAtLength 走 */
    const drawStroke = async (stroke: BoardStroke) => {
      measurePath.setAttribute('d', stroke.d);
      const total = measurePath.getTotalLength();
      if (!total) {
        return;
      }
      const at = (length: number) => {
        const transform = getSceneTransform(currentSize());
        const point = measurePath.getPointAtLength(clamp(length, 0, total));
        return {
          x: transform.offsetX + point.x * transform.scale,
          y: transform.offsetY + point.y * transform.scale,
        };
      };
      /** 笔尖切线：前后各取一点算方向 */
      const headingAt = (length: number) => {
        const before = measurePath.getPointAtLength(clamp(length - 4, 0, total));
        const after = measurePath.getPointAtLength(clamp(length + 4, 0, total));
        return (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
      };

      await moveTo(at(0));
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(20);

      await tween(stroke.duration, (t) => {
        const length = total * t;
        setStrokes((previous) => ({ ...previous, [stroke.id]: t }));
        moveCursorTo(at(length), t >= 1 ? null : headingAt(length));
      });

      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(25);

      // 描完轮廓再灌色：雨滴那层淡蓝
      if (stroke.fill) {
        await tween(280, (t) => {
          setFills((previous) => ({ ...previous, [stroke.id]: t }));
        });
      }
    };

    /** 写一段标注：点一下出光标，然后逐字打出来 */
    const typeLabel = async (label: BoardLabel) => {
      const transform = getSceneTransform(currentSize());
      const anchor = {
        x: transform.offsetX + label.at.x * transform.scale,
        y: transform.offsetY + label.at.y * transform.scale,
      };
      const fontSize = label.size * transform.scale;
      const glyphs = Array.from(label.text);
      const caretTop = anchor.y - fontSize * 0.82;

      await moveTo({ x: anchor.x + 2, y: anchor.y - fontSize * 0.32 });
      setCursor((previous) => ({ ...previous, pressing: true }));
      await sleep(60);
      rippleSeq.current += 1;
      setRipple({ x: anchor.x, y: anchor.y - fontSize * 0.32, key: rippleSeq.current });
      setCaret({ x: anchor.x, y: caretTop, height: fontSize * 1.05, visible: true });
      setCursor((previous) => ({ ...previous, pressing: false }));
      await sleep(110);

      let typed = 0;
      for (let index = 1; index <= glyphs.length; index += 1) {
        guard();
        const glyph = glyphs[index - 1];
        typed += glyphWidth(glyph, fontSize);
        setLabels((previous) => ({ ...previous, [label.id]: index }));
        setCaret({ x: anchor.x + typed, y: caretTop, height: fontSize * 1.05, visible: true });
        moveCursorTo({ x: anchor.x + typed, y: anchor.y - fontSize * 0.32 });
        await sleep(glyph === ' ' ? 26 : 32);
      }

      await sleep(90);
      setCaret(null);
      await sleep(50);
    };

    const run = async () => {
      // 从白板左上角外侧进入，像人把鼠标移进画布
      const startPoint = { x: 130, y: 100 };
      cursorRef.current = startPoint;
      setCursor({ x: startPoint.x, y: startPoint.y, visible: true, pressing: false, heading: null });
      setStarted(true);
      await sleep(180);

      for (const step of whiteboardScenario.steps) {
        guard();
        if (step.action === 'select-tool') {
          await selectTool(step.tool);
        } else if (step.action === 'pick-color') {
          await pickColor(step.index);
        } else if (step.action === 'stroke') {
          const stroke = findStroke(step.id);
          if (stroke) {
            await drawStroke(stroke);
          }
        } else if (step.action === 'label') {
          const label = findLabel(step.id);
          if (label) {
            await typeLabel(label);
          }
        } else {
          await sleep(step.ms);
        }
      }

      await sleep(420);
      setCaret(null);
      setCursor((previous) => ({ ...previous, visible: false, pressing: false }));
      await sleep(320);
      guard();
      completeRef.current?.();
    };

    setStrokes({});
    setFills({});
    setLabels({});
    setCaret(null);
    setActiveTool(null);
    setPressedTool(null);
    setActiveColor(null);
    setPressedColor(null);
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
      measureSvg.remove();
    };
  }, [ready, runKey]);

  return {
    activeTool,
    pressedTool,
    activeColor,
    pressedColor,
    cursor,
    ripple,
    strokes,
    fills,
    labels,
    caret,
    started,
  };
}
