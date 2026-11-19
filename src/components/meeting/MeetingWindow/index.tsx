import type { FC } from 'react';
import { MeetingStage } from '@/components/meeting/MeetingStage';
import { MeetingTitleBar, type TitleBarDragHandlers } from '@/components/meeting/MeetingTitleBar';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import type { SideAppId } from '@/components/sidebar/SideDock';
import type { BarrageItem } from '@/hooks/useMeetingChat';
import styles from './index.module.scss';

interface MeetingWindowProps {
  /** 侧栏当前显示的应用 */
  activeApp: SideAppId | null;
  /** 底栏成员 / 元宝按钮 */
  onToggleApp: (app: SideAppId) => void;
  /** 主画面左下角的弹幕 */
  barrage: BarrageItem[];
  /** 底栏「发送弹幕」浮层发出一条 */
  onSendBarrage: (text: string) => boolean;
  /** 弹幕浮层里的「聊天 >」 */
  onOpenChat: () => void;
  /** 主窗口标题栏拖拽句柄 */
  titleBarDrag?: TitleBarDragHandlers;
}

/**
 * 左侧会议区（Figma 215:19035）
 * 结构：标题栏 40 + 演讲者视图 691（头像条 118 + 间距 8 + 大画面 + 底边距 4）+ 会中底栏 64 = 795。
 */
export const MeetingWindow: FC<MeetingWindowProps> = ({
  activeApp,
  onToggleApp,
  barrage,
  onSendBarrage,
  onOpenChat,
  titleBarDrag,
}) => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingTitleBar dragHandlers={titleBarDrag} />
    <MeetingStage barrage={barrage} />
    <MeetingToolbar
      activeApp={activeApp}
      onToggleApp={onToggleApp}
      onSendBarrage={onSendBarrage}
      onOpenChat={onOpenChat}
    />
  </section>
);
