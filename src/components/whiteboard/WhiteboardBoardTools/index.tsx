import type { FC } from 'react';
import IconArtboard from '@/assets/d2c/icons/whiteboard/icon-artboard';
import IconBackground from '@/assets/d2c/icons/whiteboard/icon-background';
import IconZoomChevron from '@/assets/d2c/icons/whiteboard/icon-zoom-chevron';
import IconZoomDivider from '@/assets/d2c/icons/whiteboard/icon-zoom-divider';
import IconZoomIn from '@/assets/d2c/icons/whiteboard/icon-zoom-in';
import IconZoomOut from '@/assets/d2c/icons/whiteboard/icon-zoom-out';
import styles from './index.module.scss';

/**
 * 白板右下角工具条（Figma 221:30084）
 * 左半是缩放：－ / 100% / ＋（中间两条 1px 分割线）；右半是画板与背景两个入口。
 * 纯展示：演示里不接管点击。
 */
export const WhiteboardBoardTools: FC = () => (
  <div className={styles.bar}>
    <div className={styles.zoom}>
      <span className={styles.zoomButton} aria-label="缩小">
        <IconZoomOut />
      </span>
      <IconZoomDivider className={styles.divider} />
      <span className={styles.ratio} aria-label="当前缩放比例">
        <span className={styles.percent}>100%</span>
        <IconZoomChevron className={styles.chevron} />
      </span>
      <IconZoomDivider className={styles.divider} />
      <span className={styles.zoomButton} aria-label="放大">
        <IconZoomIn />
      </span>
    </div>
    <span className={styles.entry} aria-label="画板">
      <IconArtboard />
    </span>
    <span className={styles.entry} aria-label="背景">
      <IconBackground />
    </span>
  </div>
);
