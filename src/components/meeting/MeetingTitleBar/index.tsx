import type { FC } from 'react';
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
          <IconTopAppLogo />
          <span className={styles.text}>{meetingSession.title}</span>
        </div>
      </div>

      <span className={styles.text}>{meetingSession.duration}</span>
      <IconTopNetwork />
      <span className={styles.statusIcon}>
        <IconTopShare />
      </span>
    </div>

    <div className={styles.right}>
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
