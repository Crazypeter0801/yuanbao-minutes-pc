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
import styles from './index.module.scss';

/** 参会人数（成员按钮右上角的数字） */
const MEMBER_COUNT = 8;

/**
 * 会议底部工具栏（Figma 257:1968）
 * 左：表情 / 聊天；中：灰底胶囊（麦克风 / 摄像头 / 共享 / 成员 / 录制 / 元宝 / 更多）；右：离开会议。
 * 说明：本期仅做视觉还原，不挂交互。
 */
export const MeetingToolbar: FC = () => (
  <div className={styles.toolbar}>
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
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconTbYuanbao />
      </span>
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconTbMore />
      </span>
    </div>

    <div className={`${styles.side} ${styles.sideRight}`}>
      <IconTbLeave />
    </div>
  </div>
);
