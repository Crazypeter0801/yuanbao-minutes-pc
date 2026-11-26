import type { FC } from 'react';
import speakerVideo811 from '@/assets/d2c/frame811/speaker-video-811.png';
import { Barrage } from '@/components/meeting/Barrage';
import type { BarrageItem } from '@/hooks/useMeetingChat';
import styles from './index.module.scss';

/**
 * 左侧会议舞台区（Figma 811:24998 / 811:24999）：
 * #F3F3F4 浅灰画布内垂直居中铺满 16:9 演讲者画面；左下角保留弹幕层。
 */
export const MeetingStage: FC<{ barrage?: BarrageItem[] }> = ({ barrage = [] }) => (
  <div className={styles.stage}>
    <div className={styles.speaker}>
      <img className={styles.speakerVideo} src={speakerVideo811} alt="演讲者视频画面" draggable={false} />
      <Barrage items={barrage} />
    </div>
  </div>
);
