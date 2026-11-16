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
  /** 元宝侧栏当前是否展开 */
  yuanbaoOpen: boolean;
  /** 点击胶囊里的元宝按钮：收起时打开侧栏，展开时收起 */
  onToggleYuanbao: () => void;
  /** 「管理成员」是否打开 */
  membersOpen: boolean;
  /** 成员按钮：与元宝并存，打开管理成员不关掉元宝 */
  onToggleMembers: () => void;
}

/**
 * 会议底部工具栏（Figma 215:16706 / 406:16873）
 * 左：表情 / 聊天；中：麦克风 / 摄像头 / 共享 / 成员 / 录制 / 元宝 / 更多（无底色）；右：离开会议。
 * 「元宝」「成员」可点；成员与元宝互不挤掉（三栏 OK）。
 */
export const MeetingToolbar: FC<MeetingToolbarProps> = ({
  yuanbaoOpen,
  onToggleYuanbao,
  membersOpen,
  onToggleMembers,
}) => (
  <div className={styles.toolbar}>
    <div className={styles.blurBase} aria-hidden="true" />
    <ProgressiveBlur className={styles.blur} tint="var(--wm-color-blur-tint-meeting)" />
    <div className={styles.side}>
      <IconTbEmoji />
      <IconTbChat />
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
        className={`${styles.slot} ${styles.slotAction} ${membersOpen ? styles.slotActive : ''}`}
        onClick={onToggleMembers}
        ariaLabel={membersOpen ? '关闭管理成员' : '打开管理成员'}
        ariaExpanded={membersOpen}
        title={membersOpen ? '关闭管理成员' : '打开管理成员'}
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
        className={`${styles.slot} ${styles.slotNarrow} ${styles.slotAction}`}
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
