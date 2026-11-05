import type { FC } from 'react';
import IconStatusNotes from '@/assets/d2c/icons/input/icon-status-notes';
import IconNotePause from '@/assets/d2c/icons/v1/icon-note-pause';
import IconNotePlay from '@/assets/d2c/icons/v1/icon-note-play';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface NotePillProps {
  /** 是否正在记笔记 */
  isListening: boolean;
  /** 别的面板展开时让位 */
  hidden?: boolean;
  /** 点胶囊本身：在浏览器打开元宝笔记（演示里只给 Toast） */
  onOpen: () => void;
  /** 暂停 / 继续 */
  onToggleListening: () => void;
}

/**
 * 「元宝正在记笔记」胶囊（Figma 36:2251）
 * 宽度跟着文案走：笔记图标 18 + 文案 12/18 + 24 的暂停钮，padding 0 8 0 12、间距 4。
 * 不再展开面板：点胶囊跳浏览器看完整笔记，点右侧圆钮暂停 / 继续。
 */
export const NotePill: FC<NotePillProps> = ({ isListening, hidden = false, onOpen, onToggleListening }) => (
  <div className={`${styles.slot} ${hidden ? styles.slotHidden : ''}`}>
    <Pressable className={styles.pill} onClick={onOpen} title="在浏览器打开元宝笔记" ariaLabel="在浏览器打开元宝笔记">
      <span className={styles.icon} aria-hidden="true">
        <IconStatusNotes />
      </span>
      {/* 暂停文案沿用 Figma 318:7200 原文「元宝休息中」 */}
      <span className={styles.text}>{isListening ? '元宝正在记笔记' : '元宝休息中'}</span>
      <Pressable
        as="span"
        className={styles.toggle}
        onClick={onToggleListening}
        stopPropagation
        title={isListening ? '暂停记笔记' : '继续记笔记'}
        ariaLabel={isListening ? '暂停记录' : '继续记录'}
      >
        {isListening ? <IconNotePause /> : <IconNotePlay />}
      </Pressable>
    </Pressable>
  </div>
);
