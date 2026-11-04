import type { FC, ReactNode } from 'react';
import IconTbApps from '@/assets/icons/icon-tb-apps';
import IconTbCamera from '@/assets/icons/icon-tb-camera';
import IconTbChat from '@/assets/icons/icon-tb-chat';
import IconTbChevron from '@/assets/icons/icon-tb-chevron';
import IconTbEmoji from '@/assets/icons/icon-tb-emoji';
import IconTbHand from '@/assets/icons/icon-tb-hand';
import IconTbLeave from '@/assets/icons/icon-tb-leave';
import IconTbMembers from '@/assets/icons/icon-tb-members';
import IconTbMic from '@/assets/icons/icon-tb-mic';
import IconTbRecord from '@/assets/icons/icon-tb-record';
import IconTbShare from '@/assets/icons/icon-tb-share';
import IconTbYuanbao from '@/assets/icons/icon-tb-yuanbao';
import styles from './index.module.css';

/** 54×36 灰底按钮；withArrow 时右侧带展开箭头 */
const ControlButton: FC<{ children: ReactNode; withArrow?: boolean }> = ({ children, withArrow }) => (
  <div className={styles.control}>
    {children}
    {withArrow && <IconTbChevron />}
  </div>
);

/**
 * 会议底部工具栏（Figma 245:5872）
 * 左：聊天输入框 + 举手；中：麦克风/摄像头/共享/成员/聊天/录制/元宝/应用；右：离开会议。
 * 说明：本期仅做视觉还原，不挂交互。
 */
export const MeetingToolbar: FC = () => (
  <div className={styles.toolbar}>
    <div className={styles.interact}>
      <div className={styles.input}>
        <IconTbEmoji />
        <span className={styles.inputText}>说点什么...</span>
      </div>
      <IconTbHand />
    </div>

    <div className={styles.controls}>
      <ControlButton withArrow>
        <IconTbMic />
      </ControlButton>
      <ControlButton withArrow>
        <IconTbCamera />
      </ControlButton>
      <ControlButton withArrow>
        <IconTbShare />
      </ControlButton>
      <ControlButton>
        <IconTbMembers />
      </ControlButton>
      <ControlButton>
        <IconTbChat />
      </ControlButton>
      <ControlButton withArrow>
        <IconTbRecord />
      </ControlButton>
      <ControlButton>
        <IconTbYuanbao />
      </ControlButton>
      {/* 应用按钮的灰底已包含在导出图标内 */}
      <IconTbApps />
    </div>

    <IconTbLeave />
  </div>
);
