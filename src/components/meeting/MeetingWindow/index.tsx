import type { FC } from 'react';
import { MeetingStage } from '@/components/meeting/MeetingStage';
import { MeetingTitleBar } from '@/components/meeting/MeetingTitleBar';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import styles from './index.module.scss';

interface MeetingWindowProps {
  /** 元宝侧栏当前是否展开 */
  yuanbaoOpen: boolean;
  /** 工具栏元宝按钮：开关元宝侧栏 */
  onToggleYuanbao: () => void;
}

/**
 * 左侧会议区（Figma 215:19035，除元宝按钮外均为静态）
 * 结构：标题栏 40 + 演讲者视图 691（头像条 118 + 间距 8 + 大画面 + 底边距 4）+ 会中底栏 64 = 795。
 * 宽度撑满侧栏左侧：侧栏展开时 936，收起后 1322。
 */
export const MeetingWindow: FC<MeetingWindowProps> = ({ yuanbaoOpen, onToggleYuanbao }) => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingTitleBar />
    <MeetingStage />
    <MeetingToolbar yuanbaoOpen={yuanbaoOpen} onToggleYuanbao={onToggleYuanbao} />
  </section>
);
