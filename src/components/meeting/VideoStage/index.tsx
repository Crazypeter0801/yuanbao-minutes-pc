import type { FC } from 'react';
import videoStage from '@/assets/images/meet-video-stage@2x.png';
import styles from './index.module.css';

/**
 * 会议画面区（Figma 245:5870）
 * 导出图已含 16px 内边距与圆角，直接撑满 998×582。
 */
export const VideoStage: FC = () => (
  <div className={styles.stage}>
    <img className={styles.image} src={videoStage} alt="会议画面：主讲人视频" draggable={false} />
  </div>
);
