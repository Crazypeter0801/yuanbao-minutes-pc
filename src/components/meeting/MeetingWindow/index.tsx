import type { FC, ReactNode } from 'react';
import { MeetingStage } from '@/components/meeting/MeetingStage';
import { MeetingTitleBar } from '@/components/meeting/MeetingTitleBar';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import styles from './index.module.scss';

interface MeetingWindowProps {
  /** 元宝侧栏当前是否展开 */
  yuanbaoOpen: boolean;
  /** 工具栏元宝按钮：开关元宝侧栏 */
  onToggleYuanbao: () => void;
  /** 右侧应用容器当前是否打开 */
  sidebarOpen: boolean;
  /** 当前应用 Tab：用于底栏高亮 */
  appTab: import('@/lib/meetingAppTab').MeetingAppTab;
  /** 工具栏成员按钮：在同一侧栏打开或切换到管理成员 */
  onToggleMembers: () => void;
  /** 工具栏聊天按钮：在同一侧栏打开或切换到会议聊天 */
  onToggleChat: () => void;
  /** 盖在主讲人画面上的图层（演示用：元宝画白板） */
  stageOverlay?: ReactNode;
}

/**
 * 左侧会议区（Figma 215:19035）
 * 结构：标题栏 + 演讲者视图 + 会中底栏（Component 6 · 416:20031，始终保留）。
 * 成员 / 聊天改在右侧同一应用容器里用 Tab 切换，不再在会议窗内加第三栏。
 */
export const MeetingWindow: FC<MeetingWindowProps> = ({
  yuanbaoOpen,
  onToggleYuanbao,
  sidebarOpen,
  appTab,
  onToggleMembers,
  onToggleChat,
  stageOverlay,
}) => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingTitleBar />
    <div className={styles.main}>
      <div className={styles.stageColumn}>
        <MeetingStage overlay={stageOverlay} />
        {/* 硬约束：会中底栏必须始终存在，外壳还原时不可移除 */}
        <MeetingToolbar
          yuanbaoOpen={yuanbaoOpen}
          onToggleYuanbao={onToggleYuanbao}
          sidebarOpen={sidebarOpen}
          appTab={appTab}
          onToggleMembers={onToggleMembers}
          onToggleChat={onToggleChat}
        />
      </div>
    </div>
  </section>
);
