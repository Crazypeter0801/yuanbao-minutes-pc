import type { FC } from 'react';
import IconSidePause from '@/assets/d2c/icons/v1/icon-side-pause';
import { Pressable } from '@/components/common/Pressable';
import { NoteStar } from '@/components/sidebar/NoteStar';
import styles from './index.module.scss';

interface NotePillProps {
  /** 是否正在记笔记 */
  isListening: boolean;
  /** 保存截图 */
  onScreenshot: () => void;
  /** 暂停 / 继续 */
  onToggleListening: () => void;
}

/**
 * 「元宝正在记笔记」状态胶囊（Figma 316:2705）
 * 动态星标 + 状态文案 + 「保存截图」+ 暂停；宽度随内容，左对齐悬浮在输入框上方。
 * 星标记笔记时循环变形（圆点 → 方块 → 四芒星），暂停后停在四芒星。
 */
export const NotePill: FC<NotePillProps> = ({ isListening, onScreenshot, onToggleListening }) => (
  <div className={styles.pill}>
    <NoteStar playing={isListening} />
    <span className={styles.text}>{isListening ? '元宝正在记笔记... ' : '元宝已暂停记笔记'}</span>
    <Pressable className={styles.chip} onClick={onScreenshot} title="把当前画面存进纪要">
      保存截图
    </Pressable>
    <Pressable
      className={`${styles.toggle} ${isListening ? '' : styles.togglePaused}`}
      onClick={onToggleListening}
      title={isListening ? '暂停记笔记' : '继续记笔记'}
      ariaLabel={isListening ? '暂停记录' : '继续记录'}
    >
      {isListening ? <IconSidePause /> : <span className={styles.play} />}
    </Pressable>
  </div>
);
