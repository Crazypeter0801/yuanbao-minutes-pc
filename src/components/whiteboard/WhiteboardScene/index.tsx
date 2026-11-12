import { useId, type FC } from 'react';
import {
  SCENE,
  whiteboardScenario,
  type BoardLabel,
  type SceneTransform,
} from '@/data/whiteboardScenario';
import type { BoardCaret } from '@/hooks/useWhiteboardDraw';
import styles from './index.module.scss';

interface WhiteboardSceneProps {
  transform: SceneTransform;
  /** 每一笔描到几成 */
  strokes: Record<string, number>;
  /** 填充淡入进度 */
  fills: Record<string, number>;
  /** 标注写出几个字 */
  labels: Record<string, number>;
  caret: BoardCaret | null;
}

/** 手写标注：未写出的字占位透明，逐字出现 */
const Label: FC<{ label: BoardLabel; revealed: number }> = ({ label, revealed }) => {
  const glyphs = Array.from(label.text);
  return (
    <text
      x={label.at.x}
      y={label.at.y}
      fontSize={label.size}
      className={styles.label}
      opacity={revealed > 0 ? 1 : 0}
    >
      {glyphs.map((glyph, index) => (
        <tspan key={`${label.id}-${index}`} opacity={index < revealed ? 1 : 0}>
          {glyph}
        </tspan>
      ))}
    </text>
  );
};

/**
 * 板书内容：太阳、雨滴、光线、彩虹、小人、标注
 *
 * 一笔一笔按 SVG 路径描出来（dashoffset 驱动），描完的填充单独淡入；
 * 整组笔画套一层轻微的 turbulence 位移，让线条有点手抖的粗糙感。
 */
export const WhiteboardScene: FC<WhiteboardSceneProps> = ({
  transform,
  strokes,
  fills,
  labels,
  caret,
}) => {
  const filterId = `whiteboard-hand-${useId().replace(/:/g, '')}`;

  return (
    <>
      <svg
        className={styles.canvas}
        width={SCENE.width * transform.scale}
        height={SCENE.height * transform.scale}
        viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
        style={{ left: transform.offsetX, top: transform.offsetY }}
        aria-hidden="true"
      >
        <defs>
          {/* 手绘感：极轻的噪声位移，让边缘不是尺子画出来的直线 */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter={`url(#${filterId})`}>
          {/* 填充先画：雨滴那层淡蓝要压在轮廓下面 */}
          {whiteboardScenario.strokes.map((stroke) => {
            if (!stroke.fill) {
              return null;
            }
            const progress = fills[stroke.id] ?? 0;
            if (progress <= 0) {
              return null;
            }
            return (
              <path
                key={`${stroke.id}-fill`}
                d={`${stroke.d} Z`}
                fill={stroke.fill.color}
                fillOpacity={stroke.fill.opacity * progress}
                stroke="none"
              />
            );
          })}

          {whiteboardScenario.strokes.map((stroke) => {
            const progress = strokes[stroke.id] ?? 0;
            if (progress <= 0) {
              return null;
            }
            return (
              <path
                key={stroke.id}
                data-stroke={stroke.id}
                d={stroke.d}
                fill="none"
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - progress}
              />
            );
          })}
        </g>

        {whiteboardScenario.labels.map((label) => (
          <Label key={label.id} label={label} revealed={labels[label.id] ?? 0} />
        ))}
      </svg>

      {caret && (
        <span
          className={styles.caret}
          style={{ left: caret.x, top: caret.y, height: caret.height }}
          aria-hidden="true"
        />
      )}
    </>
  );
};
