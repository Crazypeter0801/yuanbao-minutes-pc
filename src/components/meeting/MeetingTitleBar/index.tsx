import type { FC } from 'react';
import IconMeetAppLogo from '@/assets/d2c/icons/v1/icon-meet-app-logo';
import IconMeetChevronDown from '@/assets/d2c/icons/v1/icon-meet-chevron-down';
import IconMeetGrid from '@/assets/d2c/icons/v1/icon-meet-grid';
import IconMeetNetwork from '@/assets/d2c/icons/v1/icon-meet-network';
import IconMeetShare from '@/assets/d2c/icons/v1/icon-meet-share';
import IconTitleLayout from '@/assets/d2c/icons/v2/icon-title-layout';
import IconTitleMore from '@/assets/d2c/icons/v2/icon-title-more';
import IconTitleSafety from '@/assets/d2c/icons/v2/icon-title-safety';
import { meetingSession } from '@/data/meetingSession';
import styles from './index.module.scss';

/**
 * 会议窗口顶部操作栏（Figma 439:21021）
 *
 * 左：窗口控制（12 圆点 ×3）→ 应用图标 → 会议详情 → 时长 → 网络 → 分享
 * 右：宫格▾ / 安全▾ / 布局 / 更多（仅前两个带下拉箭头）
 * 间距按稿：图标与标题 4、标题与时长 8、时长与网络 8、网络与分享 10、右侧按钮 4 / 8。
 * 说明：本期仅做视觉还原，不挂交互。
 */
export const MeetingTitleBar: FC = () => (
  <div className={styles.titleBar}>
    <div className={styles.left}>
      <div className={styles.titleCluster}>
        <div className={styles.trafficWrap}>
          <div className={styles.traffic} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotClose}`} />
            <span className={`${styles.dot} ${styles.dotMinimize}`} />
            <span className={`${styles.dot} ${styles.dotZoom}`} />
          </div>
        </div>

        <div className={styles.appTitle}>
          <IconMeetAppLogo />
          <span className={styles.text}>{meetingSession.title}</span>
        </div>
      </div>

      <span className={styles.text}>{meetingSession.duration}</span>
      <IconMeetNetwork />
      <span className={styles.statusIcon}>
        <IconMeetShare />
      </span>
    </div>

    <div className={styles.right}>
      <div className={styles.tools}>
        <span className={styles.tool}>
          <IconMeetGrid />
          <IconMeetChevronDown />
        </span>
        <span className={styles.tool}>
          <IconTitleSafety />
          <IconMeetChevronDown />
        </span>
        <span className={`${styles.tool} ${styles.toolLoose}`}>
          <IconTitleLayout />
        </span>
      </div>
      <span className={styles.more}>
        <IconTitleMore />
      </span>
    </div>
  </div>
);
