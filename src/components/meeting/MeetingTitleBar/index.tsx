import type { FC } from 'react';
import IconMeetAppLogo from '@/assets/d2c/icons/v1/icon-meet-app-logo';
import IconMeetChevronDown from '@/assets/d2c/icons/v1/icon-meet-chevron-down';
import IconMeetGrid from '@/assets/d2c/icons/v1/icon-meet-grid';
import IconMeetHostTools from '@/assets/d2c/icons/v1/icon-meet-host-tools';
import IconMeetNetwork from '@/assets/d2c/icons/v1/icon-meet-network';
import IconMeetSettings from '@/assets/d2c/icons/v1/icon-meet-settings';
import IconMeetShare from '@/assets/d2c/icons/v1/icon-meet-share';
import IconMeetSidebar from '@/assets/d2c/icons/v1/icon-meet-sidebar';
import { meetingSession } from '@/data/meetingSession';
import styles from './index.module.scss';

/**
 * 会议窗口标题栏（Figma 215:19035 操作栏 439:21021）
 * 左：窗口控制 + 应用图标 + 会议详情 + 时长 + 网络 / 分享
 * 右：宫格 / 安全 / 布局 / 更多，四个纯图标按钮，前三个带下拉箭头
 * 说明：本期仅做视觉还原，不挂交互。
 */
export const MeetingTitleBar: FC = () => (
  <div className={styles.titleBar}>
    <div className={styles.left}>
      <div className={styles.traffic} aria-hidden="true">
        <span className={`${styles.dot} ${styles.dotClose}`} />
        <span className={`${styles.dot} ${styles.dotMinimize}`} />
        <span className={`${styles.dot} ${styles.dotZoom}`} />
      </div>

      <div className={styles.appTitle}>
        <IconMeetAppLogo />
        <span className={styles.text}>{meetingSession.title}</span>
      </div>
      <span className={styles.text}>{meetingSession.duration}</span>

      <div className={styles.metaIcons}>
        <IconMeetNetwork />
        <IconMeetShare />
      </div>
    </div>

    <div className={styles.right}>
      <span className={styles.tool}>
        <IconMeetGrid />
        <IconMeetChevronDown />
      </span>
      <span className={styles.tool}>
        <IconMeetHostTools />
        <IconMeetChevronDown />
      </span>
      <span className={styles.tool}>
        <IconMeetSettings />
        <IconMeetChevronDown />
      </span>
      <span className={styles.tool}>
        <IconMeetSidebar />
      </span>
    </div>
  </div>
);
