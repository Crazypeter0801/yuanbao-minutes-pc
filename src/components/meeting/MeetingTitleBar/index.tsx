import type { FC, PointerEvent as ReactPointerEvent } from 'react';
import IconTopAppLogo from '@/assets/d2c/icons/v2/icon-top-app-logo';
import IconTopChevron from '@/assets/d2c/icons/v2/icon-top-chevron';
import IconTopGrid from '@/assets/d2c/icons/v2/icon-top-grid';
import IconTopNetwork from '@/assets/d2c/icons/v2/icon-top-network';
import IconTopShare from '@/assets/d2c/icons/v2/icon-top-share';
import IconTitleLayout from '@/assets/d2c/icons/v2/icon-title-layout';
import IconTitleMore from '@/assets/d2c/icons/v2/icon-title-more';
import IconTitleSafety from '@/assets/d2c/icons/v2/icon-title-safety';
import { meetingSession } from '@/data/meetingSession';
import styles from './index.module.scss';

export interface TitleBarDragHandlers {
  dragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

interface MeetingTitleBarProps {
  dragHandlers?: TitleBarDragHandlers;
}

/**
 * 会议窗口顶部操作栏（Figma 439:21021）
 *
 * 按住标题栏空白区域可拖拽移动整个主窗口；交通灯与功能图标带 data-nodrag 不误触发拖拽。
 */
export const MeetingTitleBar: FC<MeetingTitleBarProps> = ({ dragHandlers }) => (
  <div
    className={`${styles.titleBar} ${dragHandlers ? styles.titleBarDraggable : ''} ${
      dragHandlers?.dragging ? styles.titleBarDragging : ''
    }`}
    onPointerDown={dragHandlers?.onPointerDown}
    onPointerMove={dragHandlers?.onPointerMove}
    onPointerUp={dragHandlers?.onPointerUp}
    onPointerCancel={dragHandlers?.onPointerUp}
    aria-label="会议窗口标题栏"
    title="按住空白区域拖动主窗口"
  >
    <div className={styles.left}>
      <div className={styles.titleCluster}>
        <div className={styles.trafficWrap} data-nodrag>
          <div className={styles.traffic} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotClose}`} />
            <span className={`${styles.dot} ${styles.dotMinimize}`} />
            <span className={`${styles.dot} ${styles.dotZoom}`} />
          </div>
        </div>

        <div className={styles.appTitle} data-nodrag>
          <IconTopAppLogo />
          <span className={styles.text}>{meetingSession.title}</span>
        </div>
      </div>

      <span className={styles.text}>{meetingSession.duration}</span>
      <IconTopNetwork />
      <span className={styles.statusIcon} data-nodrag>
        <IconTopShare />
      </span>
    </div>

    <div className={styles.right} data-nodrag>
      <div className={styles.tools}>
        <span className={styles.tool}>
          <IconTopGrid />
          <IconTopChevron width={10} height={10} />
        </span>
        <span className={styles.tool}>
          <IconTitleSafety />
          <IconTopChevron width={10} height={10} />
        </span>
        <span className={`${styles.tool} ${styles.toolLoose}`}>
          <IconTitleLayout width={16} height={16} />
        </span>
      </div>
      <span className={styles.more}>
        <IconTitleMore width={28} height={28} />
      </span>
    </div>
  </div>
);
