import type { FC } from 'react';
import IconClose from '@/assets/d2c/icons/whiteboard/icon-close';
import IconFullscreen from '@/assets/d2c/icons/whiteboard/icon-fullscreen';
import IconTitleDivider from '@/assets/d2c/icons/whiteboard/icon-title-divider';
import IconWindow from '@/assets/d2c/icons/whiteboard/icon-window';
import styles from './index.module.scss';

/**
 * 白板右上角的窗口控件（Figma 221:30111）
 * 全屏 / 窗口 / 关闭三个 20×20 图标，中间用 1px 竖线分隔；整组 60% 透明，压在画面上不抢内容。
 */
export const WhiteboardWindowControls: FC = () => (
  <div className={styles.controls} aria-hidden="true">
    <span className={styles.button}>
      <IconFullscreen />
    </span>
    <IconTitleDivider className={styles.divider} />
    <span className={styles.button}>
      <IconWindow />
    </span>
    <IconTitleDivider className={styles.divider} />
    <span className={styles.button}>
      <IconClose />
    </span>
  </div>
);
