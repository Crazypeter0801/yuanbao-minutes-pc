import type { FC } from 'react';
import IconNoteChevron from '@/assets/d2c/icons/note/icon-note-chevron';
import IconNoteFile from '@/assets/d2c/icons/note/icon-note-file';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface RecordingCardProps {
  /** 卡片标题，默认「元宝笔记」 */
  title?: string;
  /**
   * 有了内容之后的文案；不传就是「正在帮你记」的闪光占位态。
   * 两种状态共用同一个容器尺寸，切换时卡片不会跳动。
   */
  summary?: string;
  /** 点击整张卡片打开云笔记 */
  onOpen?: () => void;
}

/**
 * 「正在帮你记」卡片（Figma 元宝Agent 入会 46:7827 / 46:7838）
 *
 * 刚入会且开启了云笔记时，元宝自动发出：灰底气泡说明已开始记录，气泡下方跟这张 248 宽的卡片。
 * 卡片下半部分先用斜向扫光的骨架占位表示「内容还在生成」，等有内容后由 summary 接管。
 * 图标 46:1389、右箭头 46:7854 都来自设计稿。
 */
export const RecordingCard: FC<RecordingCardProps> = ({ title = '元宝笔记', summary, onOpen }) => (
  <Pressable className={styles.card} onClick={onOpen} ariaLabel={`打开${title}`}>
    <span className={styles.header}>
      <span className={styles.icon} aria-hidden="true">
        <IconNoteFile />
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.chevron} aria-hidden="true">
        <IconNoteChevron />
      </span>
    </span>

    <span className={styles.slot}>
      {summary ? (
        <span className={styles.summary}>{summary}</span>
      ) : (
        <span className={styles.shimmer} aria-hidden="true" />
      )}
    </span>
  </Pressable>
);
