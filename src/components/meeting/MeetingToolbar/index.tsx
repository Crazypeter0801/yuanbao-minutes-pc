import type { FC } from 'react';
import IconBarCamera from '@/assets/d2c/icons/v2/icon-bar-camera';
import IconBarEmojiChat from '@/assets/d2c/icons/v2/icon-bar-emoji-chat';
import IconBarExit from '@/assets/d2c/icons/v2/icon-bar-exit';
import IconBarLight from '@/assets/d2c/icons/v2/icon-bar-light';
import IconBarMembers from '@/assets/d2c/icons/v2/icon-bar-members';
import IconBarMic from '@/assets/d2c/icons/v2/icon-bar-mic';
import IconBarMore from '@/assets/d2c/icons/v2/icon-bar-more';
import IconBarRecord from '@/assets/d2c/icons/v2/icon-bar-record';
import IconBarShare from '@/assets/d2c/icons/v2/icon-bar-share';
import IconBarYuanbaoActive from '@/assets/d2c/icons/v2/icon-bar-yuanbao-active';
import barEmojiHi from '@/assets/d2c/images/v2/bar-emoji-hi@2x.png';
import barEmojiSmile from '@/assets/d2c/images/v2/bar-emoji-smile@2x.png';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

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
      {/* 每个按钮都是设计稿原尺寸导出（64×30 / 56×30），图里已含下拉箭头 */}
      <span className={styles.slot}>
        <IconBarMic />
      </span>
      <span className={styles.slot}>
        <IconBarCamera />
      </span>
      <span className={styles.slot}>
        <IconBarShare />
      </span>
      <span className={styles.slot}>
        <IconBarMembers />
      </span>
      <span className={`${styles.slot} ${styles.slotNarrow}`}>
        <IconBarRecord />
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
        <IconBarMore />
      </span>
    </div>

    <div className={styles.exit}>
      <IconBarExit />
    </div>
  </div>
);
