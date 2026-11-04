import type { FC } from 'react';
import IconMeetAppLogo from '@/assets/icons/icon-meet-app-logo';
import IconMeetChevronDown from '@/assets/icons/icon-meet-chevron-down';
import IconMeetCloudRecord from '@/assets/icons/icon-meet-cloud-record';
import IconMeetFullscreen from '@/assets/icons/icon-meet-fullscreen';
import IconMeetGrid from '@/assets/icons/icon-meet-grid';
import IconMeetHostTools from '@/assets/icons/icon-meet-host-tools';
import IconMeetNetwork from '@/assets/icons/icon-meet-network';
import IconMeetSettings from '@/assets/icons/icon-meet-settings';
import IconMeetShare from '@/assets/icons/icon-meet-share';
import IconMeetSidebar from '@/assets/icons/icon-meet-sidebar';
import IconMeetYuanbaoStatus from '@/assets/icons/icon-meet-yuanbao-status';
import { meetingSession } from '@/data/meetingSession';
import styles from './index.module.css';

/**
 * 会议窗口标题栏（Figma 245:5689）
 * 左：窗口控制 + 会议标题 + 时长 + 网络/分享 | 元宝纪要开启 / 云录制
 * 右：宫格 / 主持人工具 / 设置 + 全屏 / 侧边栏
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

      <div className={styles.meta}>
        <div className={styles.metaMain}>
          <div className={styles.appTitle}>
            <IconMeetAppLogo />
            <span className={styles.text}>{meetingSession.title}</span>
          </div>
          <span className={styles.text}>{meetingSession.duration}</span>
        </div>
        <div className={styles.metaIcons}>
          <IconMeetNetwork />
          <IconMeetShare />
        </div>
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <span className={styles.status} title="元宝纪要已开启">
        <IconMeetYuanbaoStatus />
      </span>
      <span className={styles.status} title="云录制中">
        <IconMeetCloudRecord />
      </span>
    </div>

    <div className={styles.right}>
      <div className={styles.tools}>
        <div className={styles.tool}>
          <IconMeetGrid />
          <span className={styles.toolLabel}>
            <span className={styles.toolText}>宫格</span>
            <IconMeetChevronDown />
          </span>
        </div>
        <div className={styles.tool}>
          <IconMeetHostTools />
          <span className={styles.toolLabel}>
            <span className={styles.toolText}>主持人工具</span>
            <IconMeetChevronDown />
          </span>
        </div>
        <div className={`${styles.tool} ${styles.toolLoose}`}>
          <span className={styles.settingsIcon}>
            <IconMeetSettings />
          </span>
          <span className={styles.toolText}>设置</span>
        </div>
      </div>
      <IconMeetFullscreen />
      <IconMeetSidebar />
    </div>
  </div>
);
