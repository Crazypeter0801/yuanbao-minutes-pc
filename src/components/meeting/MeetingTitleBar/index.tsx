import type { FC, PointerEvent as ReactPointerEvent } from 'react';
import iconChevronDown10 from '@/assets/d2c/frame811/icon-chevron-down-10.svg';
import iconCloudRecord from '@/assets/d2c/frame811/icon-cloud-record.svg';
import iconGridTop from '@/assets/d2c/frame811/icon-grid-top.svg';
import iconSafetyTop from '@/assets/d2c/frame811/icon-safety-top.svg';
import iconSettingsTop from '@/assets/d2c/frame811/icon-settings-top.svg';
import iconShareTop from '@/assets/d2c/frame811/icon-share-top.svg';
import iconWemeetLogo from '@/assets/d2c/frame811/icon-wemeet-logo.svg';
import iconWinClose from '@/assets/d2c/frame811/icon-win-close.svg';
import iconWinMinimize from '@/assets/d2c/frame811/icon-win-minimize.svg';
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
 * 会议窗口顶部状态栏（Figma 811:24867 / 811:24870 `win状态栏`）
 *
 * 白底高 40、底边 1px #EBEDF2；按住空白区域可拖拽移动整个主窗口。
 * 左侧：腾讯会议图标 + 会议详情 + 01:31:09 + 信号 + 分享 + 分隔线 + 云录制；
 * 右侧：宫格 ▾ / 安全 ▾ / 设置 + 分隔线 + 最小化 / 最大化 / 关闭窗口控制。
 */
export const MeetingTitleBar: FC<MeetingTitleBarProps> = ({ dragHandlers }) => (
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
      <div className={styles.titleCluster} data-nodrag>
        <div className={styles.appTitle}>
          <img className={styles.icon20} src={iconWemeetLogo} alt="" width={20} height={20} draggable={false} />
          <span className={styles.text}>{meetingSession.title}</span>
        </div>
        <span className={`${styles.text} ${styles.duration}`}>{meetingSession.duration}</span>
      </div>

      <div className={styles.statusCluster} data-nodrag>
        <span className={styles.iconBtn} title="网络信号良好">
          <span className={styles.signal} aria-hidden="true">
            <span className={`${styles.signalBar} ${styles.signalBar1}`} />
            <span className={`${styles.signalBar} ${styles.signalBar2}`} />
            <span className={`${styles.signalBar} ${styles.signalBar3}`} />
          </span>
        </span>
        <span className={styles.iconBtn} title="分享会议">
          <img className={styles.icon20} src={iconShareTop} alt="" width={20} height={20} draggable={false} />
        </span>
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.statusCluster} data-nodrag>
        <span className={styles.iconBtn} title="云录制中">
          <img className={styles.icon20} src={iconCloudRecord} alt="" width={20} height={20} draggable={false} />
        </span>
      </div>
    </div>

    <div className={styles.right} data-nodrag>
      <div className={styles.tools}>
        <span className={styles.tool}>
          <img className={styles.icon20} src={iconGridTop} alt="" width={20} height={20} draggable={false} />
          <span className={styles.toolGroup}>
            <span className={styles.toolLabel}>宫格</span>
            <img
              className={styles.chevronDown}
              src={iconChevronDown10}
              alt=""
              width={10}
              height={10}
              draggable={false}
            />
          </span>
        </span>
        <span className={styles.tool}>
          <img className={styles.icon20} src={iconSafetyTop} alt="" width={20} height={20} draggable={false} />
          <span className={styles.toolGroup}>
            <span className={styles.toolLabel}>安全</span>
            <img
              className={styles.chevronDown}
              src={iconChevronDown10}
              alt=""
              width={10}
              height={10}
              draggable={false}
            />
          </span>
        </span>
        <span className={`${styles.tool} ${styles.toolSettings}`}>
          <img className={styles.icon20} src={iconSettingsTop} alt="" width={20} height={20} draggable={false} />
          <span className={styles.toolLabel}>设置</span>
        </span>
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.winControls} aria-hidden="true">
        <span className={styles.winBtn}>
          <img className={styles.winIcon16} src={iconWinMinimize} alt="" width={16} height={16} draggable={false} />
        </span>
        <span className={styles.winBtn}>
          <span className={styles.winMaxBox} />
        </span>
        <span className={`${styles.winBtn} ${styles.winBtnClose}`}>
          <img className={styles.winCloseIcon} src={iconWinClose} alt="" width={8.27} height={8.27} draggable={false} />
        </span>
      </div>
    </div>
  </header>
);
