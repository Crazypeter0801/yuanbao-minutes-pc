import { useId, useLayoutEffect, useRef, useState, type FC } from 'react';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import {
  BOARD_DESIGN,
  BOARD_FONT,
  BOARD_TOOL_ORDER,
  getBoardTransform,
  whiteboardScenario,
  type BoardBoxElement,
  type BoardEdgeElement,
  type BoardPoint,
  type BoardTextElement,
  type BoardTool,
} from '@/data/whiteboardScenario';
import { useWhiteboardDraw, type BoardSize } from '@/hooks/useWhiteboardDraw';
import styles from './index.module.scss';

interface WhiteboardOverlayProps {
  /** 每次触发 +1，重播时清空白板 */
  runKey: number;
  /** 鼠标淡出后回调：App 往侧栏补一句「已画好」 */
  onComplete?: () => void;
}

const LINE_HEIGHT_RATIO = 1.55;

/** 矩形 / 菱形的四个角（菱形从顶点开始），在 928×512 的设计坐标里算，外层统一缩放 */
const outlinePoints = (element: BoardBoxElement): BoardPoint[] => {
  const left = (element.center.x - element.width / 2) * BOARD_DESIGN.width;
  const top = (element.center.y - element.height / 2) * BOARD_DESIGN.height;
  const width = element.width * BOARD_DESIGN.width;
  const height = element.height * BOARD_DESIGN.height;
  if (element.kind === 'decision') {
    return [
      { x: left + width / 2, y: top },
      { x: left + width, y: top + height / 2 },
      { x: left + width / 2, y: top + height },
      { x: left, y: top + height / 2 },
    ];
  }
  return [
    { x: left, y: top },
    { x: left + width, y: top },
    { x: left + width, y: top + height },
    { x: left, y: top + height },
  ];
};

/** 逐字出现的文字：未写出的字占位但透明，避免文字在居中时左右跳动 */
const RevealText: FC<{
  element: BoardBoxElement | BoardTextElement;
  revealed: number;
}> = ({ element, revealed }) => {
  const fontSize = element.kind === 'text' ? element.fontSize : BOARD_FONT[element.kind];
  const lines = element.text.split('\n');
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const firstBaseline =
    element.center.y * BOARD_DESIGN.height -
    ((lines.length - 1) * lineHeight) / 2 +
    fontSize * 0.34;
  const x = element.center.x * BOARD_DESIGN.width;
  const anchor = element.kind === 'text' ? element.anchor : 'middle';
  let cursor = 0;

  return (
    <text
      x={x}
      y={firstBaseline}
      textAnchor={anchor}
      fontSize={fontSize}
      className={styles.label}
      opacity={revealed > 0 ? 1 : 0}
    >
      {lines.map((line, lineIndex) => (
        <tspan key={`${element.id}-line-${lineIndex}`} x={x} dy={lineIndex === 0 ? 0 : lineHeight}>
          {Array.from(line).map((glyph, glyphIndex) => {
            const offset = cursor;
            cursor += 1;
            return (
              <tspan key={`${element.id}-${lineIndex}-${glyphIndex}`} opacity={offset < revealed ? 1 : 0}>
                {glyph}
              </tspan>
            );
          })}
        </tspan>
      ))}
    </text>
  );
};

/** 连线：折线 + 终点箭头；虚线感只保留在「继续观察」的回流线上 */
const EdgeShape: FC<{ element: BoardEdgeElement; progress: number; markerId: string }> = ({
  element,
  progress,
  markerId,
}) => {
  const points = element.points
    .map((point) => `${point.x * BOARD_DESIGN.width},${point.y * BOARD_DESIGN.height}`)
    .join(' ');
  const labelOpacity = progress <= 0.72 ? 0 : Math.min(1, (progress - 0.72) / 0.28);

  return (
    <>
      <polyline
        points={points}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
        markerEnd={progress > 0.96 ? `url(#${markerId})` : undefined}
        className={styles.edge}
        opacity={progress > 0 ? 1 : 0}
      />
      {element.label && element.labelAt && (
        <text
          x={element.labelAt.x * BOARD_DESIGN.width}
          y={element.labelAt.y * BOARD_DESIGN.height}
          textAnchor="middle"
          fontSize={12}
          className={styles.edgeLabel}
          opacity={labelOpacity}
        >
          {element.label}
        </text>
      )}
    </>
  );
};

const ToolIcon: FC<{ tool: BoardTool }> = ({ tool }) => {
  if (tool === 'rect') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2.75" y="4" width="12.5" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (tool === 'arrow') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 15 14.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M8.2 4.2h6.6v6.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 5V3.5h11V5M9 3.5v11M6.8 14.5h4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * 元宝画白板（演示）
 * 盖在主讲人画面上的一层批注白板：白底点阵 + 工具栏 + 逐笔绘制的流程图 + 元宝鼠标。
 * 只负责渲染，什么时候画、画到哪一步由 useWhiteboardDraw 驱动；整块 pointer-events: none，
 * 不拦截会议区本身的交互。上线前整块删掉即可，不牵连会议窗口。
 */
export const WhiteboardOverlay: FC<WhiteboardOverlayProps> = ({ runKey, onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<BoardSize | null>(null);
  const markerId = useId().replace(/:/g, '');
  const draw = useWhiteboardDraw({ size, runKey, onComplete });
  const elements = whiteboardScenario.elements;
  const edges = elements.filter((element): element is BoardEdgeElement => element.kind === 'edge');
  const shapes = elements.filter(
    (element): element is BoardBoxElement => element.kind === 'box' || element.kind === 'decision',
  );
  const texts = elements.filter(
    (element): element is BoardTextElement => element.kind === 'text',
  );

  // 白板尺寸按实际像素量：流程图的归一化坐标乘上它就是 svg 坐标，侧栏开合都不用改数据
  useLayoutEffect(() => {
    const node = rootRef.current;
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

  /** 流程图在 928×512 的设计坐标里排版，再整体等比缩放居中到实际白板上 */
  const transform = size ? getBoardTransform(size) : null;

  return (
    <div
      className={`${styles.overlay} ${draw.started ? styles.overlayStarted : ''}`}
      ref={rootRef}
      aria-hidden="true"
      data-whiteboard="active"
    >
      <div className={styles.board} />
      {size && transform && (
        <svg className={styles.canvas} viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0.5 0.6 9.5 5 0.5 9.4Z" className={styles.arrowHead} />
            </marker>
          </defs>

          <g transform={`translate(${transform.offsetX} ${transform.offsetY}) scale(${transform.scale})`}>
            {edges.map((edge) => (
              <EdgeShape
                key={edge.id}
                element={edge}
                progress={draw.progress[edge.id] ?? 0}
                markerId={markerId}
              />
            ))}

            {shapes.map((element) => {
              const progress = draw.progress[element.id] ?? 0;
              const outline = outlinePoints(element);
              if (element.kind === 'decision') {
                return (
                  <polygon
                    key={element.id}
                    data-board-shape={element.id}
                    points={outline.map((point) => `${point.x},${point.y}`).join(' ')}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - progress}
                    className={styles.shape}
                    fillOpacity={progress * 0.9}
                    opacity={progress > 0 ? 1 : 0}
                  />
                );
              }
              const left = (element.center.x - element.width / 2) * BOARD_DESIGN.width;
              const top = (element.center.y - element.height / 2) * BOARD_DESIGN.height;
              return (
                <rect
                  key={element.id}
                  data-board-shape={element.id}
                  x={left}
                  y={top}
                  width={element.width * BOARD_DESIGN.width}
                  height={element.height * BOARD_DESIGN.height}
                  rx={10}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - progress}
                  className={styles.shape}
                  fillOpacity={progress * 0.9}
                  opacity={progress > 0 ? 1 : 0}
                />
              );
            })}

            {shapes.map((element) => (
              <RevealText
                key={`${element.id}-label`}
                element={element}
                revealed={draw.chars[element.id] ?? 0}
              />
            ))}
            {texts.map((element) => (
              <RevealText key={element.id} element={element} revealed={draw.chars[element.id] ?? 0} />
            ))}
          </g>
        </svg>
      )}

      <div className={styles.toolbar}>
        {BOARD_TOOL_ORDER.map((tool) => (
          <span
            key={tool}
            className={`${styles.tool} ${draw.activeTool === tool ? styles.toolActive : ''} ${
              draw.pressedTool === tool ? styles.toolPressed : ''
            }`}
          >
            <ToolIcon tool={tool} />
          </span>
        ))}
      </div>

      {size && draw.ripple && (
        <span
          key={draw.ripple.key}
          className={styles.ripple}
          style={{ left: draw.ripple.x, top: draw.ripple.y }}
        />
      )}

      {size && (
        <div
          className={`${styles.cursor} ${draw.cursor.visible ? styles.cursorVisible : ''} ${
            draw.cursor.pressing ? styles.cursorPressing : ''
          }`}
          style={{ transform: `translate3d(${draw.cursor.x}px, ${draw.cursor.y}px, 0)` }}
        >
          <svg className={styles.pointer} width="26" height="28" viewBox="0 0 22 24" fill="none">
            <path
              d="M3.2 2.2 3.2 18.4 7.5 14.3 10.3 20.6 13.2 19.3 10.4 13.2 16.6 12.9Z"
              className={styles.pointerBody}
            />
          </svg>
          <span className={styles.cursorAvatar}>
            <YuanbaoAvatar mood="working" size={34} />
          </span>
        </div>
      )}
    </div>
  );
};
