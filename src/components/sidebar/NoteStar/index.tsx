import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import {
  NOTE_STAR_DURATION_MS,
  NOTE_STAR_REST_TIME_S,
  NOTE_STAR_ROTATE_KEY_TIMES,
  NOTE_STAR_ROTATE_VALUES,
  NOTE_STAR_SHAPE_KEY_TIMES,
  NOTE_STAR_SHAPE_VALUES,
  NOTE_STAR_REST_PATH,
  NOTE_STAR_VIEWBOX,
} from './frames';
import styles from './index.module.scss';

interface NoteStarProps {
  /** 是否在播放：false 时停在完整的四芒星 */
  playing: boolean;
  /** 显示尺寸，默认 16（与原四芒星图标同大） */
  size?: number;
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * 「元宝正在记笔记」动态星标
 * 圆点 → 圆角方块 → 四芒星 → 圆点，边变形边转一圈，1.8s 循环。
 * 纯矢量 SMIL 动画，关键帧由 scripts/gen-note-star.mjs 从企业微信表情 GIF 逐帧拟合生成。
 * 暂停或系统开启「减少动态效果」时停在完整四芒星。
 */
export const NoteStar: FC<NoteStarProps> = ({ playing, size = 16 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return undefined;
    }
    const media = window.matchMedia(REDUCED_MOTION);
    const sync = () => {
      if (playing && !media.matches) {
        svg.unpauseAnimations();
        return;
      }
      svg.pauseAnimations();
      svg.setCurrentTime(NOTE_STAR_REST_TIME_S);
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [playing]);

  return (
    <svg
      ref={svgRef}
      className={styles.star}
      width={size}
      height={size}
      viewBox={`0 0 ${NOTE_STAR_VIEWBOX} ${NOTE_STAR_VIEWBOX}`}
      aria-hidden="true"
    >
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur={`${NOTE_STAR_DURATION_MS}ms`}
          repeatCount="indefinite"
          keyTimes={NOTE_STAR_ROTATE_KEY_TIMES}
          values={NOTE_STAR_ROTATE_VALUES}
        />
        <path fill="currentColor" d={NOTE_STAR_REST_PATH}>
          <animate
            attributeName="d"
            dur={`${NOTE_STAR_DURATION_MS}ms`}
            repeatCount="indefinite"
            keyTimes={NOTE_STAR_SHAPE_KEY_TIMES}
            values={NOTE_STAR_SHAPE_VALUES}
          />
        </path>
      </g>
    </svg>
  );
};
