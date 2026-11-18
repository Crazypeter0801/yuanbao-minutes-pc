import type { FC } from 'react';
import IconBarEmojiChat from '@/assets/d2c/icons/v2/icon-bar-emoji-chat';
import IconBarLight from '@/assets/d2c/icons/v2/icon-bar-light';
import IconBarYuanbaoActive from '@/assets/d2c/icons/v2/icon-bar-yuanbao-active';
import IconTbArrow from '@/assets/d2c/icons/v1/icon-tb-arrow';
import IconTbCamera from '@/assets/d2c/icons/v1/icon-tb-camera';
import IconTbInviteBody from '@/assets/d2c/icons/v1/icon-tb-invite-body';
import IconTbInviteHead from '@/assets/d2c/icons/v1/icon-tb-invite-head';
import IconTbLeave from '@/assets/d2c/icons/v1/icon-tb-leave';
import IconTbMic from '@/assets/d2c/icons/v1/icon-tb-mic';
import IconTbMore from '@/assets/d2c/icons/v1/icon-tb-more';
import IconTbRecord from '@/assets/d2c/icons/v1/icon-tb-record';
import IconTbShare from '@/assets/d2c/icons/v1/icon-tb-share';
import barEmojiHi from '@/assets/d2c/images/v2/bar-emoji-hi@2x.png';
import barEmojiSmile from '@/assets/d2c/images/v2/bar-emoji-smile@2x.png';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

/** 参会人数（成员按钮右上角的数字） */
const MEMBER_COUNT = 8;

interface MeetingToolbarProps {
  /** 元宝侧栏当前是否展开 */
  yuanbaoOpen: boolean;
  /** 点击胶囊里的元宝按钮：收起时打开侧栏，展开时收起 */
  onToggleYuanbao: () => void;
}

/**
 * 会中底栏（Figma 416:20031）
 *
 * 左：互动表情 / 表情 / 聊天（三个 36×36、间距 4）→ 1×16 分隔线 → 亮度，整组右侧留 100
 * 中：麦克风 / 摄像头 / 共享 / 成员 64×30，录制 / 元宝 / 更多 56×30，间距 8，行高 48
 * 右：结束会议 44×44，靠右对齐
 * 说明：仅「元宝」可点（开关右侧侧栏），其余按钮只做视觉还原。
 */
export const MeetingToolbar: FC<MeetingToolbarProps> = ({ yuanbaoOpen, onToggleYuanbao }) => (
  <div className={styles.toolbar}>
    <div className={styles.side}>
      <div className={styles.sideIcons}>
        <span className={styles.iconBox}>
          <img className={styles.emoji} src={barEmojiHi} alt="互动表情" draggable={false} />
        </span>
        <span className={styles.iconBox}>
          <img className={styles.emoji} src={barEmojiSmile} alt="表情" draggable={false} />
        </span>
        <span className={styles.iconBox}>
          <IconBarEmojiChat />
        </span>
      </div>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.iconBox}>
        <IconBarLight />
      </span>
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
      <span className={styles.slot}>
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
      </span>
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconTbRecord />
      </span>
      <Pressable
        as="span"
        className={`${styles.slot} ${styles.slotNarrow} ${styles.slotAction}`}
        onClick={onToggleYuanbao}
        ariaLabel={yuanbaoOpen ? '收起元宝' : '打开元宝'}
        title={yuanbaoOpen ? '收起元宝' : '打开元宝'}
      >
        <span className={styles.yuanbaoIcon}>
          <IconBarYuanbaoActive />
        </span>
      </Pressable>
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconTbMore />
      </span>
    </div>

    <div className={styles.exit}>
      <IconTbLeave />
    </div>
  </div>
);
