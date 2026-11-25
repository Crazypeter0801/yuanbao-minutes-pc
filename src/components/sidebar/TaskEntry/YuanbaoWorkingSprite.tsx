import { useEffect, useState, type FC } from 'react';
import yuanbaoWorkingSprite from '@/assets/sprites/yuanbao-working-sprite.png';
import styles from './index.module.scss';

/**
 * 雪碧图物理规格（实测 2600×1040 RGBA，10 列 × 4 行，单格 260×260px）：
 * 仅前 36 帧（0..35）含有效图形，第 4 行末尾 4 格（36..39）完全透明，循环严格限定在 0..35。
 */
const SPRITE_COLS = 10;
const SPRITE_ROWS = 4;
const VALID_FRAMES = 36;
const FRAME_INTERVAL_MS = 1000 / 24;

/**
 * 基准视口 32×32px 下的单格缩放与中心补偿参数（36 帧任意一帧均无裁切与抖动）；
 * 外部传入更大尺寸（如对话上方活动态 60×60px）时按 size / BASE_VIEWPORT_SIZE 等比缩放。
 */
const BASE_VIEWPORT_SIZE = 32;
const BASE_CELL_RENDER_SIZE = 38;
const BASE_OFFSET_X = -3.7;
const BASE_OFFSET_Y = -2.4;

interface YuanbaoWorkingSpriteProps {
  /** 视口宽高（px），默认 32（底栏状态条）；对话上方活动态传 60 */
  size?: number;
  /** 是否播放动画；false 时暂停在首帧以节省开销 */
  active?: boolean;
}

/**
 * 元宝工作形象动态雪碧图组件：
 * - 24fps 循环播放 36 帧有效画面，绝不闪现末尾空白格；
 * - prefers-reduced-motion: reduce 或 active=false 时静止停留在首帧。
 */
export const YuanbaoWorkingSprite: FC<YuanbaoWorkingSpriteProps> = ({
  size = BASE_VIEWPORT_SIZE,
  active = true,
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) {
      setFrame(0);
      return undefined;
    }

    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches) {
      setFrame(0);
      return undefined;
    }

    let rafId = 0;
    let lastTick = performance.now();

    const step = (now: number) => {
      const elapsed = now - lastTick;
      if (elapsed >= FRAME_INTERVAL_MS) {
        const advance = Math.floor(elapsed / FRAME_INTERVAL_MS);
        lastTick += advance * FRAME_INTERVAL_MS;
        setFrame((prev) => (prev + advance) % VALID_FRAMES);
      }
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        window.cancelAnimationFrame(rafId);
        setFrame(0);
      }
    };
    media?.addEventListener?.('change', onMotionChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      media?.removeEventListener?.('change', onMotionChange);
    };
  }, [active]);

  const scale = size / BASE_VIEWPORT_SIZE;
  const cellRenderSize = BASE_CELL_RENDER_SIZE * scale;
  const offsetX = BASE_OFFSET_X * scale;
  const offsetY = BASE_OFFSET_Y * scale;

  const col = frame % SPRITE_COLS;
  const row = Math.floor(frame / SPRITE_COLS);
  const translateX = offsetX - col * cellRenderSize;
  const translateY = offsetY - row * cellRenderSize;

  return (
    <span
      className={styles.spriteViewport}
      style={size === BASE_VIEWPORT_SIZE ? undefined : { width: size, height: size, flexBasis: size }}
      data-sprite-frame={frame}
      data-sprite-total={VALID_FRAMES}
      aria-hidden="true"
    >
      <img
        src={yuanbaoWorkingSprite}
        alt=""
        className={styles.spriteSheet}
        width={cellRenderSize * SPRITE_COLS}
        height={cellRenderSize * SPRITE_ROWS}
        style={{
          width: `${cellRenderSize * SPRITE_COLS}px`,
          height: `${cellRenderSize * SPRITE_ROWS}px`,
          transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        }}
        draggable={false}
      />
    </span>
  );
};
