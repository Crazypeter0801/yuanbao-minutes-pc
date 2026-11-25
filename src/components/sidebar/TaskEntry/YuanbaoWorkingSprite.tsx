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
 * 单格内有效图形并集包围盒为 x:[47..223], y:[32..220]（中心 135, 126，最大边 189px）。
 * 外层视口 32×32px、单格缩放至 38×38px 并做中心补偿后，有效角色视觉尺寸约 27.5×26px（贴合 28px 目标），
 * 36 帧任意一帧均完全落在视口内无裁切与抖动。
 */
const CELL_RENDER_SIZE = 38;
const OFFSET_X = -3.7;
const OFFSET_Y = -2.4;

/**
 * 元宝工作形象动态雪碧图组件：
 * - 24fps 循环播放 36 帧有效画面，绝不闪现末尾空白格；
 * - prefers-reduced-motion: reduce 时静止停留在首帧。
 */
export const YuanbaoWorkingSprite: FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
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
  }, []);

  const col = frame % SPRITE_COLS;
  const row = Math.floor(frame / SPRITE_COLS);
  const translateX = OFFSET_X - col * CELL_RENDER_SIZE;
  const translateY = OFFSET_Y - row * CELL_RENDER_SIZE;

  return (
    <span
      className={styles.spriteViewport}
      data-sprite-frame={frame}
      data-sprite-total={VALID_FRAMES}
      aria-hidden="true"
    >
      <img
        src={yuanbaoWorkingSprite}
        alt=""
        className={styles.spriteSheet}
        width={CELL_RENDER_SIZE * SPRITE_COLS}
        height={CELL_RENDER_SIZE * SPRITE_ROWS}
        style={{
          width: `${CELL_RENDER_SIZE * SPRITE_COLS}px`,
          height: `${CELL_RENDER_SIZE * SPRITE_ROWS}px`,
          transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        }}
        draggable={false}
      />
    </span>
  );
};
