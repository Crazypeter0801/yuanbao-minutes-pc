import type { FC } from 'react';
import IconTbArrow from '@/assets/d2c/icons/v1/icon-tb-arrow';
import IconTbCamera from '@/assets/d2c/icons/v1/icon-tb-camera';
import IconTbChat from '@/assets/d2c/icons/v1/icon-tb-chat';
import IconTbEmoji from '@/assets/d2c/icons/v1/icon-tb-emoji';
import IconTbInviteBody from '@/assets/d2c/icons/v1/icon-tb-invite-body';
import IconTbInviteHead from '@/assets/d2c/icons/v1/icon-tb-invite-head';
import IconTbLeave from '@/assets/d2c/icons/v1/icon-tb-leave';
import IconTbMic from '@/assets/d2c/icons/v1/icon-tb-mic';
import IconTbMore from '@/assets/d2c/icons/v1/icon-tb-more';
import IconTbRecord from '@/assets/d2c/icons/v1/icon-tb-record';
import IconTbShare from '@/assets/d2c/icons/v1/icon-tb-share';
import IconTbYuanbao from '@/assets/d2c/icons/v1/icon-tb-yuanbao';
import { ProgressiveBlur } from '@/components/common/ProgressiveBlur';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

/** 参会人数（成员按钮右上角的数字） */
const MEMBER_COUNT = 8;

interface MeetingToolbarProps {
  /** 右侧应用容器是否打开 */
  sidebarOpen: boolean;
  /** 当前应用 Tab */
  appTab: import('@/lib/meetingAppTab').MeetingAppTab;
  /** 元宝侧栏当前是否展开（兼容旧称呼：容器打开且当前是元宝） */
  yuanbaoOpen: boolean;
  /** 点击元宝按钮：关着则打开元宝 Tab；已在元宝则关闭；在其他 Tab 则切回元宝 */
  onToggleYuanbao: () => void;
  /** 成员按钮：在同一侧栏打开或切换到管理成员 */
  onToggleMembers: () => void;
  /** 聊天按钮：在同一侧栏打开或切换到会议聊天 */
  onToggleChat: () => void;
}

/**
 * 会议底部工具栏（Figma 215:16706 / 406:16873）
 * 左：表情 / 聊天；中：麦克风 / 摄像头 / 共享 / 成员 / 录制 / 元宝 / 更多（无底色）；右：离开会议。
 * 「聊天」「成员」「元宝」可点，都作用在同一右侧应用容器上，用 Tab 切换。
 */
export const MeetingToolbar: FC<MeetingToolbarProps> = ({
  sidebarOpen,
  appTab,
  yuanbaoOpen,
  onToggleYuanbao,
  onToggleMembers,
  onToggleChat,
}) => (
  <div className={styles.toolbar}>
    <div className={styles.blurBase} aria-hidden="true" />
    <ProgressiveBlur className={styles.blur} tint="var(--wm-color-blur-tint-meeting)" />
    <div className={styles.side}>
      <IconTbEmoji />
      <Pressable
        as="span"
        className={`${styles.sideAction} ${sidebarOpen && appTab === 'chat' ? styles.slotActive : ''}`}
        onClick={onToggleChat}
        ariaLabel={sidebarOpen && appTab === 'chat' ? '关闭会议聊天' : '打开会议聊天'}
        ariaExpanded={sidebarOpen && appTab === 'chat'}
        title={sidebarOpen && appTab === 'chat' ? '关闭会议聊天' : '打开会议聊天'}
      >
        <IconTbChat />
      </Pressable>
    </div>

    <div className={styles.controls}>
      {/* 导出的按钮图含底部一块透明占位，按 64×30 / 56×30 裁出可见区域 */}
      <span className={styles.slot}>
        <IconTbMic />
      </span>
      <span className={styles.slot}>
        <IconTbCamera />
      </span>
      <span className={styles.slot}>
        <IconTbShare />
      </span>
      <Pressable
        as="span"
        className={`${styles.slot} ${styles.slotAction} ${sidebarOpen && appTab === 'members' ? styles.slotActive : ''}`}
        onClick={onToggleMembers}
        ariaLabel={sidebarOpen && appTab === 'members' ? '关闭管理成员' : '打开管理成员'}
        ariaExpanded={sidebarOpen && appTab === 'members'}
        title={sidebarOpen && appTab === 'members' ? '关闭管理成员' : '打开管理成员'}
      >
        <span className={styles.invite} aria-hidden="true">
          <span className={styles.inviteHead} />
          <span className={styles.inviteFriendHead}>
            <IconTbInviteHead />
          </span>
          <span className={styles.inviteBody}>
            <IconTbInviteBody />
          </span>
          <span className={styles.inviteCount}>{MEMBER_COUNT}</span>
        </span>
        <span className={styles.arrow}>
          <IconTbArrow />
        </span>
      </Pressable>
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconTbRecord />
      </span>
      <Pressable
        as="span"
        className={`${styles.slot} ${styles.slotNarrow} ${styles.slotAction} ${yuanbaoOpen ? styles.slotActive : ''}`}
        onClick={onToggleYuanbao}
        ariaLabel={yuanbaoOpen ? '关闭元宝' : '打开元宝'}
        ariaExpanded={yuanbaoOpen}
        title={yuanbaoOpen ? '关闭元宝' : '打开元宝'}
      >
        <IconTbYuanbao />
      </Pressable>
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconTbMore />
      </span>
    </div>

    <div className={`${styles.side} ${styles.sideRight}`}>
      <IconTbLeave />
    </div>
  </div>
);
