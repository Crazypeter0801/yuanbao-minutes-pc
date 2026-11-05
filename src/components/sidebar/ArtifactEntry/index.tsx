import type { FC } from 'react';
import iconFilePdf from '@/assets/d2c/icons/v1/icon-file-pdf.svg';
import iconFileSheet from '@/assets/d2c/icons/v1/icon-file-sheet.svg';
import iconFileSlide from '@/assets/d2c/icons/v1/icon-file-slide.svg';
import iconFileTranscript from '@/assets/d2c/icons/v1/icon-file-transcript.svg';
import iconFileWord from '@/assets/d2c/icons/v1/icon-file-word.svg';
import iconFileYuanbao from '@/assets/d2c/icons/v1/icon-file-yuanbao.svg';
import IconStatusFolder from '@/assets/d2c/icons/input/icon-status-folder';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import type { ArtifactIcon, ArtifactItem } from '@/types/artifact';
import styles from './index.module.scss';

interface ArtifactEntryProps {
  /** 元宝生成并归到本场会议的产物 */
  artifacts: ArtifactItem[];
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位 */
  hidden?: boolean;
  /** 点击某个产物 */
  onOpen: (item: ArtifactItem) => void;
}

/** 文件类型徽标：Figma 导出的矢量图，按 URL 引入后由 img 渲染，避免位图缩放发虚 */
const FILE_ICONS: Record<ArtifactIcon, string> = {
  yuanbao: iconFileYuanbao,
  pdf: iconFilePdf,
  sheet: iconFileSheet,
  transcript: iconFileTranscript,
  word: iconFileWord,
  slide: iconFileSlide,
};

/**
 * 产物入口（Figma 36:2280：文件夹图标 + 条数）
 * 只有生成过文件才出现；展开后撑满底栏这一行，列出本轮产出的文件。
 */
export const ArtifactEntry: FC<ArtifactEntryProps> = ({ artifacts, expanded, onExpandedChange, hidden, onOpen }) => (
  <MorphPanel
    expanded={expanded}
    onExpandedChange={onExpandedChange}
    hidden={hidden}
    summary={
      <>
        <span className={styles.icon}>
          <IconStatusFolder />
        </span>
        <span className={styles.count}>{artifacts.length}</span>
      </>
    }
    expandedLabel="个文件"
    collapsedPaddingX={12}
    panelWidth="full"
    name="产出文件"
    contentKey={artifacts.length}
  >
    {artifacts.map((item) => (
      <Pressable key={item.id} className={styles.file} onClick={() => onOpen(item)}>
        <img className={styles.fileIcon} src={FILE_ICONS[item.icon]} alt="" aria-hidden="true" />
        <span className={styles.fileBody}>
          <span className={styles.fileName} title={item.name}>
            {item.name}
          </span>
          <span className={styles.fileMeta}>
            <span className={styles.fileType}>{item.type}</span>
            <span className={styles.fileSep} aria-hidden="true" />
            <span className={styles.fileSize}>{item.size}</span>
          </span>
        </span>
      </Pressable>
    ))}
  </MorphPanel>
);
