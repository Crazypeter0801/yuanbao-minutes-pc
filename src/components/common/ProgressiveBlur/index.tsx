import type { CSSProperties, FC } from 'react';
import styles from './index.module.scss';

interface ProgressiveBlurProps {
  /** 外层定位 / 尺寸的 class（需自行指定 position、left/right/bottom、height） */
  className?: string;
  /** 最底层的模糊半径（px），往上每层减半；默认 16 */
  maxBlur?: number;
  /** 渐变带本身加的半透明着色，越往下越实；不传则不着色 */
  tint?: string;
}

const LAYERS = 5;

/**
 * 苹果式渐进模糊：叠几层 backdrop-filter: blur()，模糊半径逐层变大（1/2/4/8/16），
 * 每层各带一个 mask-image 线性渐变，只在自己那一段生效，层与层之间平滑过渡。
 * 层下的内容是真的被模糊，越往下越糊，不用实色去盖。
 */
export const ProgressiveBlur: FC<ProgressiveBlurProps> = ({ className, maxBlur = 16, tint }) => (
  <div
    className={[styles.root, className].filter(Boolean).join(' ')}
    style={tint ? ({ '--pb-tint': tint } as CSSProperties) : undefined}
    aria-hidden="true"
  >
    {Array.from({ length: LAYERS }, (_, i) => {
      const blur = maxBlur / 2 ** (LAYERS - 1 - i);
      const start = i * 15;
      const mask =
        i === LAYERS - 1
          ? `linear-gradient(180deg, transparent ${start}%, #000 ${start + 20}%)`
          : `linear-gradient(180deg, transparent ${start}%, #000 ${start + 20}%, #000 ${start + 40}%, transparent ${start + 60}%)`;
      return (
        <div
          key={blur}
          className={styles.layer}
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      );
    })}
  </div>
);
