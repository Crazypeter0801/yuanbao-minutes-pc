import type { FC, ReactNode } from 'react';
import { MeetingStage } from '@/components/meeting/MeetingStage';
import { MeetingTitleBar } from '@/components/meeting/MeetingTitleBar';
import { MeetingToolbar } from '@/components/meeting/MeetingToolbar';
import { MembersSidebar } from '@/components/meeting/MembersSidebar';
import styles from './index.module.scss';

interface MeetingWindowProps {
  /** 元宝侧栏当前是否展开 */
  yuanbaoOpen: boolean;
  /** 工具栏元宝按钮：开关元宝侧栏 */
  onToggleYuanbao: () => void;
  /** 「管理成员」是否打开（与元宝并存，三栏 OK） */
  membersOpen: boolean;
  /** 工具栏成员按钮：开关管理成员侧栏 */
  onToggleMembers: () => void;
  /** 关闭管理成员 */
  onCloseMembers: () => void;
  /** 盖在主讲人画面上的图层（演示用：元宝画白板） */
  stageOverlay?: ReactNode;
}

/**
 * 左侧会议区（Figma 215:19035 / 406:16873）
 * 结构：标题栏 +（演讲者视图 + 工具栏）[+ 管理成员侧栏]。
 * 打开「管理成员」时与元宝窗并存，不互斥；元宝浮出时本区宽度不自动撑开（见 App 预留位逻辑）。
 */
export const MeetingWindow: FC<MeetingWindowProps> = ({
  yuanbaoOpen,
  onToggleYuanbao,
  membersOpen,
  onToggleMembers,
  onCloseMembers,
  stageOverlay,
}) => (
  <section className={styles.window} aria-label="会议窗口">
    <MeetingTitleBar />
    <div className={styles.main}>
      <div className={styles.stageColumn}>
        <MeetingStage overlay={stageOverlay} />
        <MeetingToolbar
          yuanbaoOpen={yuanbaoOpen}
          onToggleYuanbao={onToggleYuanbao}
          membersOpen={membersOpen}
          onToggleMembers={onToggleMembers}
        />
      </div>
      {membersOpen && <MembersSidebar onClose={onCloseMembers} />}
    </div>
  </section>
);
