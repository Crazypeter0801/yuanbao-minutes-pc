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
 * 中：麦克风 / 摄像头 / 共享 / 成员 / 录制 / 元宝 / 更多，七个 60×40 胶囊位、间距 10，行高 48（Figma 416:20057）
 * 右：结束会议 44×44，靠右对齐
 * 说明：仅「元宝」可点（开关右侧侧栏），其余按钮只做视觉还原。
 */
export const MeetingToolbar: FC<MeetingToolbarProps> = ({ yuanbaoOpen, onToggleYuanbao }) => (
  <div className={styles.toolbar}>
    <div className={styles.side}>
      <div className={styles.sideIcons}>
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
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.iconBox}>
        <IconBarLight />
      </span>
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
      <span className={styles.slot}>
        <IconBar3Members />
      </span>
      <span className={styles.slot}>
        <IconBar3Record />
      </span>
      <Pressable
        as="span"
        className={`${styles.slot} ${styles.slotAction}`}
        onClick={onToggleYuanbao}
        ariaLabel={yuanbaoOpen ? '收起元宝' : '打开元宝'}
        title={yuanbaoOpen ? '收起元宝' : '打开元宝'}
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
