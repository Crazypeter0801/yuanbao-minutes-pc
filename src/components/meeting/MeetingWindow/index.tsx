import type { FC } from 'react';
import { MeetingTitleBar } from '@/components/meeting/MeetingTitleBar';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import { VideoStage } from '@/components/meeting/VideoStage';
import styles from './index.module.scss';

/**
 * 左侧会议窗口
 * 结构：标题栏 40 + 画面区 582 + 工具栏 52 = 674，宽 998（Figma 245:5688，三个方案共用）。
 */
export const MeetingWindow: FC = () => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingTitleBar />
    <VideoStage />
    <MeetingToolbar />
  </section>
);
