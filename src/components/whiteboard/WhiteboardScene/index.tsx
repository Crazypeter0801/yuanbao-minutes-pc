import { useId, type FC } from 'react';
import {
  BOARD_FONT,
  boxRectOf,
  isBoardBox,
  toBoardPx,
  whiteboardScenario,
  type BoardBoxElement,
  type BoardEdgeElement,
  type BoardFrame,
  type BoardSize,
  type BoardTextElement,
} from '@/data/whiteboardScenario';
import type { BoardCaret, BoardDragBox } from '@/hooks/useWhiteboardDraw';
import styles from './index.module.scss';

interface Point {
  x: number;
  y: number;
}

interface WhiteboardSceneProps {
  size: BoardSize;
  frame: BoardFrame;
  /** 已经落定的方框 / 菱形 id */
  shapes: string[];
  /** 正在拖拽的方框：宽高随鼠标实时变化 */
  dragBox: BoardDragBox | null;
  /** 连线进度 0～1 */
  edges: Record<string, number>;
  /** 文字已显示字数 */
  chars: Record<string, number>;
  caret: BoardCaret | null;
}

const LINE_HEIGHT_RATIO = 1.55;

const distance = (points: Point[]) =>
  points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + Math.hypot(point.x - previous.x, point.y - previous.y);
  }, 0);

/** 折线按比例截断：拖到哪就画到哪 */
const trimPolyline = (points: Point[], progress: number): Point[] => {
  if (progress >= 1 || points.length < 2) {
    return points;
  }
  const total = distance(points);
  let remain = Math.max(0, progress) * total;
  const result: Point[] = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const segment = Math.hypot(to.x - from.x, to.y - from.y);
    if (remain >= segment) {
      result.push(to);
      remain -= segment;
      continue;
    }
    const ratio = segment === 0 ? 0 : remain / segment;
    result.push({ x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio });
    break;
  }
  return result;
};

const polylineAttr = (points: Point[]) => points.map((point) => `${point.x},${point.y}`).join(' ');

/** 方框 / 菱形的四个角（菱形从顶点开始），像素坐标 */
const cornersOf = (rect: { x: number; y: number; width: number; height: number }) => {
  const { x, y, width, height } = rect;
  return [
    { x: x + width / 2, y },
    { x: x + width, y: y + height / 2 },
    { x: x + width / 2, y: y + height },
    { x, y: y + height / 2 },
  ];
};

/** 判断菱形：包围盒内接菱形 */
const BoxShape: FC<{
  kind: BoardBoxElement['kind'];
  rect: { x: number; y: number; width: number; height: number };
  className?: string;
}> = ({ kind, rect, className }) => {
  if (kind === 'decision') {
    return <polygon points={polylineAttr(cornersOf(rect))} className={className ?? styles.shape} />;
  }
  // 注释框：虚线边框 + 浅底，和主流程的实线框区分
  return (
    <rect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      rx={8}
      className={className ?? (kind === 'note' ? styles.note : styles.shape)}
    />
  );
};

/** 逐字出现的文字：未写出的字占位但透明，避免文字在居中时左右跳动 */
const RevealText: FC<{
  element: BoardBoxElement | BoardTextElement;
  anchor: Point;
  fontSize: number;
  centered: boolean;
  revealed: number;
  muted?: boolean;
}> = ({ element, anchor, fontSize, centered, revealed, muted = false }) => {
  const lines = element.text.split('\n');
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const firstBaseline = anchor.y - ((lines.length - 1) * lineHeight) / 2 + fontSize * 0.34;
  let cursor = 0;

  return (
    <text
      x={anchor.x}
      y={firstBaseline}
      textAnchor={centered ? 'middle' : 'start'}
      fontSize={fontSize}
      className={muted ? styles.labelMuted : styles.label}
      opacity={revealed > 0 ? 1 : 0}
    >
      {lines.map((line, lineIndex) => (
        <tspan key={`${element.id}-line-${lineIndex}`} x={anchor.x} dy={lineIndex === 0 ? 0 : lineHeight}>
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

/**
 * 白板内容：方框、连线、文字、输入光标
 * 全部按白板实际像素绘制；图形尺寸由 scenario 的归一化坐标换算，窗口变化时自动跟随。
 */
export const WhiteboardScene: FC<WhiteboardSceneProps> = ({ size, frame, shapes, dragBox, edges, chars, caret }) => {
  const markerId = `whiteboard-arrow-${useId().replace(/:/g, '')}`;
  const elements = whiteboardScenario.elements;
  const boxes = elements.filter((element): element is BoardBoxElement => isBoardBox(element));
  const edgeList = elements.filter((element): element is BoardEdgeElement => element.kind === 'edge');
  const texts = elements.filter((element): element is BoardTextElement => element.kind === 'text');

  return (
    <svg className={styles.canvas} viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0.6 0.6 9.4 5 0.6 9.4Z" className={styles.arrowHead} />
        </marker>
      </defs>

      {/* 已落定的方框 / 菱形 */}
      {boxes
        .filter((element) => shapes.includes(element.id))
        .map((element) => (
          <BoxShape key={element.id} kind={element.kind} rect={boxRectOf(element, frame)} />
        ))}

      {/* 正在拖拽：直接画半成品，眼睛能看到宽高在长 */}
      {dragBox && (
        <BoxShape
          kind={dragBox.kind}
          rect={{ x: dragBox.x, y: dragBox.y, width: dragBox.width, height: dragBox.height }}
          className={styles.shapeDragging}
        />
      )}

      {/* 连线：拖到哪画到哪，进度到 1 才补箭头 */}
      {edgeList.map((edge) => {
        const progress = edges[edge.id] ?? 0;
        if (progress <= 0) {
          return null;
        }
        const points = edge.points.map((point) => toBoardPx(point, frame));
        const labelOpacity = progress < 0.82 ? 0 : Math.min(1, (progress - 0.82) / 0.18);
        return (
          <g key={edge.id}>
            <polyline
              points={polylineAttr(trimPolyline(points, progress))}
              markerEnd={progress >= 1 ? `url(#${markerId})` : undefined}
              className={edge.dashed ? styles.edgeDashed : styles.edge}
            />
            {edge.label && edge.labelAt && (
              <text
                x={toBoardPx(edge.labelAt, frame).x}
                y={toBoardPx(edge.labelAt, frame).y}
                textAnchor="middle"
                fontSize={12}
                className={styles.edgeLabel}
                opacity={labelOpacity}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* 框里的字 */}
      {boxes.map((element) => {
        const rect = boxRectOf(element, frame);
        return (
          <RevealText
            key={`${element.id}-label`}
            element={element}
            anchor={{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }}
            fontSize={BOARD_FONT[element.kind]}
            centered
            muted={element.kind === 'note'}
            revealed={chars[element.id] ?? 0}
          />
        );
      })}

      {/* 独立文字（标题） */}
      {texts.map((element) => {
        const anchor = toBoardPx(element.at, frame);
        return (
          <RevealText
            key={element.id}
            element={element}
            anchor={anchor}
            fontSize={element.fontSize}
            centered={element.anchor !== 'start'}
            revealed={chars[element.id] ?? 0}
          />
        );
      })}

      {/* 文字工具点下后的光标 */}
      {caret && (
        <rect
          x={caret.x}
          y={caret.y}
          width={1.5}
          height={caret.height}
          className={styles.caret}
          opacity={caret.visible ? 1 : 0}
        />
      )}
    </svg>
  );
};
