import type { FC } from 'react';
import { MeetingStage } from '@/components/meeting/MeetingStage';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import type { SideAppId } from '@/components/sidebar/SideDock';
import type { BarrageItem } from '@/hooks/useMeetingChat';
import styles from './index.module.scss';

interface MeetingWindowProps {
  /** 侧栏当前激活的应用 */
  activeApp: SideAppId | null;
  /** 所有已打开（停靠或独立浮窗）的应用集合，用于高亮底栏按钮 */
  openApps: SideAppId[];
  /** 底栏成员 / 聊天 / 元宝按钮 */
  onToggleApp: (app: SideAppId) => void;
  /** 主画面左下角的弹幕 */
  barrage: BarrageItem[];
  /** 底栏「发送弹幕」浮层发出一条 */
  onSendBarrage: (text: string) => boolean;
  /** 弹幕浮层里的「聊天 >」 */
  onOpenChat: () => void;
}

/**
 * 左侧会议区（Figma 811:24997）：
 * 上：16:9 演讲者画布；下：66px 白色会中底栏（Figma 811:25000）。
 */
export const MeetingWindow: FC<MeetingWindowProps> = ({
  activeApp,
  openApps,
  onToggleApp,
  barrage,
  onSendBarrage,
  onOpenChat,
}) => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingStage barrage={barrage} />
    <MeetingToolbar
      activeApp={activeApp}
      openApps={openApps}
      onToggleApp={onToggleApp}
      onSendBarrage={onSendBarrage}
      onOpenChat={onOpenChat}
    />
  </section>
);
