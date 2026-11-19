import type { FC, PointerEvent as ReactPointerEvent } from 'react';
import IconTopAppLogo from '@/assets/d2c/icons/v2/icon-top-app-logo';
import IconTopChevron from '@/assets/d2c/icons/v2/icon-top-chevron';
import IconTopGrid from '@/assets/d2c/icons/v2/icon-top-grid';
import IconTopNetwork from '@/assets/d2c/icons/v2/icon-top-network';
import IconTopShare from '@/assets/d2c/icons/v2/icon-top-share';
import IconTitleLayout from '@/assets/d2c/icons/v2/icon-title-layout';
import IconTitleMore from '@/assets/d2c/icons/v2/icon-title-more';
import IconTitleSafety from '@/assets/d2c/icons/v2/icon-title-safety';
import { Pressable } from '@/components/common/Pressable';
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
  /** 右上角侧栏开关按钮点击 */
  onToggleSidebar?: () => void;
  /** 侧栏当前是否展开 */
  sidebarOpen?: boolean;
}

/**
 * 会议窗口顶部通栏操作栏（Figma 574:19176 / 574:19177）
 *
 * 横跨整个主窗口顶部（左侧会议区 + 右侧侧栏上方），按住空白处可拖拽移动整个主窗口；
 * 右侧图标带文字标签：宫格视图 ▾ / 主持人工具 ▾ / 设置 / 侧栏切换。
 */
export const MeetingTitleBar: FC<MeetingTitleBarProps> = ({
  dragHandlers,
  onToggleSidebar,
  sidebarOpen = true,
}) => (
  <header
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
          <span className={styles.toolLabel}>宫格视图</span>
          <IconTopChevron width={10} height={10} />
        </span>
        <span className={styles.tool}>
          <IconTitleSafety />
          <span className={styles.toolLabel}>主持人工具</span>
          <IconTopChevron width={10} height={10} />
        </span>
        <span className={`${styles.tool} ${styles.toolLoose}`}>
          <IconTitleLayout width={16} height={16} />
          <span className={styles.toolLabel}>设置</span>
        </span>
      </div>
      {onToggleSidebar ? (
        <Pressable
          as="span"
          className={`${styles.more} ${styles.moreInteractive}`}
          onClick={onToggleSidebar}
          ariaLabel={sidebarOpen ? '收起侧栏' : '展开侧栏'}
          title={sidebarOpen ? '收起侧栏' : '展开侧栏'}
        >
          <IconTitleMore width={28} height={28} />
        </Pressable>
      ) : (
        <span className={styles.more}>
          <IconTitleMore width={28} height={28} />
        </span>
      )}
    </div>
  </header>
);
