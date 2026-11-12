import type { FC } from 'react';
import { BOARD_PALETTE } from '@/data/whiteboardScenario';
import styles from './index.module.scss';

interface WhiteboardPaletteProps {
  /** AI 画笔被选中时弹出 */
  visible: boolean;
  /** 当前选中的颜色（下标） */
  activeColor: number | null;
  /** 鼠标正按下的色块 */
  pressedColor: number | null;
}

/**
 * 画笔调色板：选中 AI 画笔后从工具栏右侧弹出的一列色块。
 * 元宝换颜色时会真的来这里点一下；色值和顺序来自场景数据的 BOARD_PALETTE。
 */
export const WhiteboardPalette: FC<WhiteboardPaletteProps> = ({ visible, activeColor, pressedColor }) => (
  <div className={`${styles.palette} ${visible ? styles.visible : ''}`} aria-hidden="true">
    {BOARD_PALETTE.map((swatch, index) => (
      <span
        key={swatch.key}
        className={`${styles.swatch} ${activeColor === index ? styles.active : ''} ${
          pressedColor === index ? styles.pressed : ''
        }`}
        style={{ backgroundColor: swatch.color }}
        data-color={swatch.key}
      />
    ))}
  </div>
);
