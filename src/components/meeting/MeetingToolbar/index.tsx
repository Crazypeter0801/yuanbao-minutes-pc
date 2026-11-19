import type { FC } from 'react';
import IconBar3Camera from '@/assets/d2c/icons/v2/icon-bar3-camera';
import IconBar3Members from '@/assets/d2c/icons/v2/icon-bar3-members';
import IconBar3Mic from '@/assets/d2c/icons/v2/icon-bar3-mic';
import IconBar3More from '@/assets/d2c/icons/v2/icon-bar3-more';
import IconBar3Record from '@/assets/d2c/icons/v2/icon-bar3-record';
import IconBar3Share from '@/assets/d2c/icons/v2/icon-bar3-share';
import IconBar3Yuanbao from '@/assets/d2c/icons/v2/icon-bar3-yuanbao';
import IconBarEmojiChat from '@/assets/d2c/icons/v2/icon-bar-emoji-chat';
import IconBarExit from '@/assets/d2c/icons/v2/icon-bar-exit';
import IconBarLight from '@/assets/d2c/icons/v2/icon-bar-light';
import barEmojiHi from '@/assets/d2c/images/v2/bar-emoji-hi@2x.png';
import barEmojiSmile from '@/assets/d2c/images/v2/bar-emoji-smile@2x.png';
import { Pressable } from '@/components/common/Pressable';
import { ChatCompose } from '@/components/meeting/ChatCompose';
import type { SideAppId } from '@/components/sidebar/SideDock';
import styles from './index.module.scss';

interface MeetingToolbarProps {
  /** 侧栏当前显示的应用（没打开时为 null） */
  activeApp: SideAppId | null;
  /** 成员 / 元宝按钮：没开就打开（已有侧栏时加一个页签），正在看就关掉 */
  onToggleApp: (app: SideAppId) => void;
  /** 「发送弹幕」浮层发出一条 */
  onSendBarrage: (text: string) => boolean;
  /** 弹幕浮层里的「聊天 >」 */
  onOpenChat: () => void;
}

/**
 * 会中底栏（Figma 416:20031）
 *
 * 左：互动表情 / 吉祥物 / 表情（三个 36×36、间距 4）→ 1×16 分隔线 → 聊天，整组右侧留 100
 * 中：麦克风 / 摄像头 / 共享 / 成员 / 录制 / 元宝 / 更多，七个 60×40 胶囊位、间距 10，行高 48（Figma 416:20057）
 * 右：结束会议 44×44，靠右对齐
 * 可点：聊天（发送弹幕浮层 → 聊天侧栏）、成员、元宝；其余按钮只做视觉还原。
 */
export const MeetingToolbar: FC<MeetingToolbarProps> = ({ activeApp, onToggleApp, onSendBarrage, onOpenChat }) => (
  <div className={styles.toolbar}>
    <div className={styles.side}>
      {/* Figma 574:19176 (582:61127)：最左 3 个图标共用一块浅灰底板（r=12、#0000000A） */}
      <div className={styles.sidePlate}>
        <span className={styles.iconBox}>
          <img className={styles.emojiHi} src={barEmojiHi} alt="互动表情" draggable={false} />
        </span>
        <span className={styles.iconBox}>
          <img className={styles.emojiSmile} src={barEmojiSmile} alt="表情" draggable={false} />
        </span>
        <span className={styles.iconBox}>
          <IconBarEmojiChat />
        </span>
      </div>
      {/* Figma 574:19176 (582:61143)：第 4 个聊天图标独立一块 36×36 浅灰底板（r=12、#0000000A） */}
      <div className={styles.chatPlate}>
        <ChatCompose triggerClassName={styles.iconBox} onSend={onSendBarrage} onOpenChat={onOpenChat}>
          <IconBarLight />
        </ChatCompose>
      </div>
    </div>

    <div className={styles.controls}>
      {/* 每个按钮按节点 60×40 原尺寸导出，图里已含图标、下拉箭头与内边距 */}
      <span className={styles.slot}>
        <IconBar3Mic />
      </span>
      <span className={styles.slot}>
        <IconBar3Camera />
      </span>
      <span className={styles.slot}>
        <IconBar3Share />
      </span>
      <Pressable
        as="span"
        className={`${styles.slot} ${styles.slotAction}`}
        onClick={() => onToggleApp('members')}
        ariaLabel={activeApp === 'members' ? '收起管理成员' : '管理成员'}
        title="管理成员"
      >
        <IconBar3Members />
      </Pressable>
      <span className={styles.slot}>
        <IconBar3Record />
      </span>
      <Pressable
        as="span"
        className={`${styles.slot} ${styles.slotAction}`}
        onClick={() => onToggleApp('yuanbao')}
        ariaLabel={activeApp === 'yuanbao' ? '收起元宝' : '打开元宝'}
        title={activeApp === 'yuanbao' ? '收起元宝' : '打开元宝'}
      >
        <IconBar3Yuanbao />
      </Pressable>
      <span className={styles.slot}>
        <IconBar3More />
      </span>
    </div>

    <div className={styles.exit}>
      <IconBarExit />
    </div>
  </div>
);
