import type { FC } from 'react';
import IconAgentNoteStop from '@/assets/d2c/icons/agent/icon-agent-note-stop';
import IconAgentPenAi from '@/assets/d2c/icons/agent/icon-agent-pen-ai';
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
 * 「正在记笔记」胶囊（Figma 214:11115）
 * 宽度跟着文案走：（笔 AI 图标 16 + 间距 4 + 文案 12/18）+ 间距 8 + 24 的暂停钮，padding 0 8 0 12。
 * 不再展开面板：点胶囊跳浏览器看完整笔记，点右侧圆钮暂停 / 继续。
 */
export const NotePill: FC<NotePillProps> = ({ isListening, hidden = false, onOpen, onToggleListening }) => (
  <div className={`${styles.slot} ${hidden ? styles.slotHidden : ''}`}>
    <Pressable className={styles.pill} onClick={onOpen} title="在浏览器打开元宝笔记" ariaLabel="在浏览器打开元宝笔记">
      <span className={styles.label}>
        <span className={styles.icon} aria-hidden="true">
          <IconAgentPenAi />
        </span>
        {/* 暂停文案沿用 Figma 318:7200 原文「元宝休息中」 */}
        <span className={styles.text}>{isListening ? '正在记笔记' : '元宝休息中'}</span>
      </span>
      <Pressable
        as="span"
        className={styles.toggle}
        onClick={onToggleListening}
        stopPropagation
        title={isListening ? '暂停记笔记' : '继续记笔记'}
        ariaLabel={isListening ? '暂停记录' : '继续记录'}
      >
        {isListening ? <IconAgentNoteStop /> : <IconNotePlay />}
      </Pressable>
    </Pressable>
  </div>
);
