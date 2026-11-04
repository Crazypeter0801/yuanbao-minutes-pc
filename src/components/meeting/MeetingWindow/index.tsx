import type { FC } from 'react';
import { MeetingTitleBar } from '@/components/meeting/MeetingTitleBar';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import { VideoGrid } from '@/components/meeting/VideoGrid';
import styles from './index.module.scss';

/**
 * 左侧会议区（Figma 316:2617，静态）
 * 结构：标题栏 40 + 两宫格画面 616 + 工具栏 64 = 720；宽度撑满侧栏左侧（1034）。
 */
export const MeetingWindow: FC = () => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingTitleBar />
    <VideoGrid />
    <MeetingToolbar />
  </section>
);
