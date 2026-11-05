import type { FC } from 'react';
import IconArtifactChevron from '@/assets/d2c/icons/artifact/icon-artifact-chevron';
import IconNoteFile from '@/assets/d2c/icons/note/icon-note-file';
import { Pressable } from '@/components/common/Pressable';
import type { NoteFile } from '@/types/chat';
import styles from './index.module.scss';

/** 波形每根竖条的高度（px）：三段起伏，中间高、两头低 */
const WAVE_BARS = [
  2, 2, 3, 2, 4, 3, 5, 8, 12, 16, 12, 8, 5, 3, 2, 2, 3, 2, 3, 5, 9, 6, 4, 3, 2, 3, 4, 7, 11, 16, 13, 9, 6, 4, 3, 2, 2, 3,
  5, 8, 5, 3, 2, 3, 2, 2, 2, 2,
];

interface NoteFileCardProps {
  note: NoteFile;
  /** 点击卡片：打开云笔记 */
  onOpen?: () => void;
  /** 点击播放按钮：只播录音，不打开笔记 */
  onPlay?: () => void;
}

/**
 * 云笔记文件卡片：刚入会且开启了云笔记时，元宝随消息发出
 * 外壳与产物卡片保持同一规格（248 宽、圆角 20、标题行），下方灰底区放录音时长、波形和播放按钮。
 * 图标来自 Figma 元宝Agent 入会 46:1389。
 */
export const NoteFileCard: FC<NoteFileCardProps> = ({ note, onOpen, onPlay }) => (
  <Pressable className={styles.card} onClick={onOpen} ariaLabel={`打开云笔记${note.title}`}>
    <span className={styles.header}>
      <span className={styles.icon} aria-hidden="true">
        <IconNoteFile />
      </span>
      <span className={styles.title} title={note.title}>
        {note.title}
      </span>
      <span className={styles.chevron} aria-hidden="true">
        <IconArtifactChevron />
      </span>
    </span>

    <span className={styles.player}>
      <span className={styles.duration}>{note.duration}</span>
      <span className={styles.wave} aria-hidden="true">
        {WAVE_BARS.map((height, index) => (
          // 波形是固定装饰，顺序不会变，下标可以当 key
          <span className={styles.bar} key={index} style={{ height }} />
        ))}
      </span>
      <Pressable as="span" className={styles.play} onClick={onPlay} ariaLabel="播放录音" stopPropagation>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.5 2.2c0-.6.66-.97 1.17-.66l6.1 3.8c.48.3.48 1 0 1.3l-6.1 3.8c-.51.31-1.17-.06-1.17-.66V2.2Z"
            fill="currentColor"
          />
        </svg>
      </Pressable>
    </span>
  </Pressable>
);
