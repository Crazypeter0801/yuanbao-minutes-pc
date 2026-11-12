import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { WhiteboardBoardTools } from '@/components/whiteboard/WhiteboardBoardTools';
import { WhiteboardCursor, type WhiteboardCursorState } from '@/components/whiteboard/WhiteboardCursor';
import { WhiteboardToolbar } from '@/components/whiteboard/WhiteboardToolbar';
import { WhiteboardWindowControls } from '@/components/whiteboard/WhiteboardWindowControls';
import { splitStrokes, type StrokeChunk } from '@/data/whiteboardChunks';
import {
  WHITEBOARD_SPEED,
  getSceneTransform,
  whiteboardScenario,
  type BoardLabel,
  type BoardSize,
  type SceneTransform,
} from '@/data/whiteboardScenario';
import { generate } from '@/lib/transitions/ui-generation';
import styles from './index.module.scss';

/** 速度系数透给 CSS（光标淡入淡出等过渡） */
const speedStyle = { '--wb-speed-scale': 1 / WHITEBOARD_SPEED } as CSSProperties;

/** 绘制时长（transitions.dev 的 duration），整段约 × 1.09 */
const GEN_DURATION = 2400;
/** 先把成品亮出来，再开始「生成」 */
const PRE_ROLL = 560;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface WhiteboardGenerateOverlayProps {
  /** 每次触发 +1，重播时重来一遍 */
  runKey: number;
  /** 生成结束后回调：App 往侧栏补一句「画好了」 */
  onComplete?: () => void;
}

/** 标注用到的字号换算：设计坐标 → 板面像素 */
const labelBox = (label: BoardLabel, transform: SceneTransform) => ({
  left: label.at.x * transform.scale,
  top: (label.at.y - label.size * 0.86) * transform.scale,
  fontSize: label.size * transform.scale,
  lineHeight: `${label.size * 1.06 * transform.scale}px`,
});

/**
 * 元宝画白板 · 一次生成
 *
 * 与逐笔绘制并存：同样一份图形数据（whiteboardScenario 的 strokes / labels），
 * 但整张图先以终态渲染好，再交给 transitions.dev 的 generate() 做「AI 生成」动画——
 * 点阵线框、参考线、尺寸标签，最后由扫描线一次揭示。
 * 标题单独用 text 变体逐字描边；元宝鼠标在扫描阶段跟着扫描线往下走。
 */
export const WhiteboardGenerateOverlay: FC<WhiteboardGenerateOverlayProps> = ({ runKey, onComplete }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const [size, setSize] = useState<BoardSize | null>(null);
  const [chunks, setChunks] = useState<StrokeChunk[]>([]);
  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState<WhiteboardCursorState>({
    x: 0,
    y: 0,
    visible: false,
    pressing: false,
    heading: null,
  });

  // 白板尺寸
  useLayoutEffect(() => {
    const node = boardRef.current;
    if (!node) {
      return undefined;
    }
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 把长笔画切成 ≤120px 的小 SVG，generate 的点阵线框才能沿真实笔迹描
  useEffect(() => {
    if (!size) {
      return;
    }
    const transform = getSceneTransform(size);
    setChunks(splitStrokes(whiteboardScenario.strokes, 108 / transform.scale));
  }, [size]);

  // 渲染好之后跑一遍生成动画
  useEffect(() => {
    const scene = sceneRef.current;
    const title = titleRef.current;
    if (!size || !scene || !title || !chunks.length) {
      return undefined;
    }

    let cancelled = false;
    let raf = 0;
    let uiRun: ReturnType<typeof generate> | null = null;
    let titleRun: ReturnType<typeof generate> | null = null;
    const timers = new Set<number>();

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, ms / WHITEBOARD_SPEED);
        timers.add(timer);
      });

    const run = async () => {
      setStarted(true);
      // 先把鼠标停在画面右侧，让观众看清成品
      setCursor({ x: size.width - 120, y: size.height * 0.34, visible: true, pressing: false, heading: null });
      await sleep(PRE_ROLL);
      if (cancelled) {
        return;
      }

      uiRun = generate(scene, {
        variant: 'ui',
        mode: 'skeleton',
        duration: GEN_DURATION,
        maxParts: 160,
        keys: 3,
        title: 'rainbow',
      });
      titleRun = generate(title, { variant: 'text', duration: 2200 });

      // 鼠标跟着扫描线走：直接读元素被裁到的位置，比按时间估算更准（扫描线由 runtime 驱动）
      const boardRect = boardRef.current?.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const top = boardRect ? sceneRect.top - boardRect.top : 0;
      // 贴着画面右侧往下扫，但避开右上角那三个窗口控件
      const scanX = size.width - 120;
      const tick = () => {
        if (cancelled) {
          return;
        }
        const clip = getComputedStyle(scene).clipPath;
        const match = clip.match(/inset\(([^)]+)\)/);
        // inset(top right bottom)：第三个值就是扫描线下面的位置
        const bottomInset = match ? Number.parseFloat(match[1].split(/\s+/)[2] ?? '0') : Number.NaN;
        const boundary = Number.isNaN(bottomInset) ? sceneRect.height : sceneRect.height - bottomInset;
        const y = top + 34 + clamp(boundary, 0, sceneRect.height);
        setCursor((previous) => ({ ...previous, x: scanX, y }));
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);

      await Promise.all([uiRun.finished, titleRun.finished]);
      window.cancelAnimationFrame(raf);
      if (cancelled) {
        return;
      }
      await sleep(560);
      setCursor((previous) => ({ ...previous, visible: false }));
      await sleep(400);
      if (!cancelled) {
        completeRef.current?.();
      }
    };

    void run();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      uiRun?.cancel();
      titleRun?.cancel();
      setStarted(false);
      setCursor((previous) => ({ ...previous, visible: false }));
    };
  }, [size, chunks.length, runKey]);

  const transform = size ? getSceneTransform(size) : null;
  const labels = whiteboardScenario.labels.filter((label) => label.id !== 'title');
  const title = whiteboardScenario.labels.find((label) => label.id === 'title');

  return (
    <div
      className={`${styles.overlay} ${started ? styles.overlayStarted : ''}`}
      style={speedStyle}
      aria-hidden="true"
      data-whiteboard="instant"
    >
      <div className={styles.board} ref={boardRef}>
        {transform && (
          <>
            {/* 生成动画作用在这一层：范围就是整张图的包围盒 */}
            <div
              className={styles.scene}
              ref={sceneRef}
              style={{
                left: transform.offsetX,
                top: transform.offsetY,
                width: 1000 * transform.scale,
                height: 560 * transform.scale,
              }}
            >
              {chunks.map((chunk) => (
                <svg
                  key={chunk.id}
                  className={styles.chunk}
                  style={{
                    left: chunk.x * transform.scale,
                    top: chunk.y * transform.scale,
                    width: chunk.w * transform.scale,
                    height: chunk.h * transform.scale,
                  }}
                  viewBox={`${chunk.x} ${chunk.y} ${chunk.w} ${chunk.h}`}
                >
                  <path
                    d={chunk.d}
                    fill="none"
                    stroke={chunk.color}
                    strokeWidth={chunk.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}

              {labels.map((label) => {
                const box = labelBox(label, transform);
                return (
                  <span key={label.id} className={styles.label} style={box}>
                    {label.text}
                  </span>
                );
              })}
            </div>

            {title && (
              <h1
                className={styles.title}
                ref={titleRef}
                style={labelBox(title, transform)}
              >
                {title.text}
              </h1>
            )}
          </>
        )}

        <WhiteboardWindowControls />
        <WhiteboardToolbar activeTool={null} pressedTool={null} />
        <WhiteboardBoardTools />

        {size && <WhiteboardCursor cursor={cursor} />}
      </div>
    </div>
  );
};
