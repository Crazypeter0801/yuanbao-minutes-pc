import type { FC } from 'react';
import IconYuanbaoNoteDoc from '@/assets/d2c/icons/yuanbao811/icon-yuanbao-note-doc';
import iconFileDoc from '@/assets/d2c/images/chatCards811/icon-file-doc@2x.png';
import iconFilePdf from '@/assets/d2c/images/chatCards811/icon-file-pdf@2x.png';
import iconFilePpt from '@/assets/d2c/images/chatCards811/icon-file-ppt@2x.png';
import iconFileXls from '@/assets/d2c/images/chatCards811/icon-file-xls@2x.png';
import iconFileXmp from '@/assets/d2c/images/chatCards811/icon-file-xmp@2x.png';
import { Pressable } from '@/components/common/Pressable';
import type { ArtifactIcon, ArtifactItem } from '@/types/artifact';
import styles from './index.module.scss';

interface ArtifactCardProps {
  artifact: ArtifactItem;
  /** 点击卡片打开或预览文件 */
  onOpen?: (artifact: ArtifactItem) => void;
}

const ASCII_EXT_PATTERN = /^[a-z0-9]{2,6}$/i;

const ICON_ASSET_BY_KIND: Record<Exclude<ArtifactIcon, 'yuanbao' | 'image'>, string> = {
  pdf: iconFilePdf,
  word: iconFileDoc,
  slide: iconFilePpt,
  sheet: iconFileXls,
  transcript: iconFileXmp,
};

function resolveFileIconSrc(artifact: ArtifactItem): string {
  if (artifact.icon !== 'yuanbao' && artifact.icon !== 'image') {
    return ICON_ASSET_BY_KIND[artifact.icon];
  }
  const normalizedType = artifact.type.trim().toLowerCase();
  if (normalizedType === 'pdf') {
    return iconFilePdf;
  }
  if (normalizedType === 'doc' || normalizedType === 'docx') {
    return iconFileDoc;
  }
  if (normalizedType === 'ppt' || normalizedType === 'pptx') {
    return iconFilePpt;
  }
  if (normalizedType === 'xls' || normalizedType === 'xlsx' || normalizedType === 'xsl' || normalizedType === 'csv') {
    return iconFileXls;
  }
  return iconFileXmp;
}

function formatDisplayTitle(artifact: ArtifactItem): string {
  const type = artifact.type.trim();
  if (!ASCII_EXT_PATTERN.test(type)) {
    return artifact.name;
  }
  const ext = `.${type.toLowerCase()}`;
  return artifact.name.toLowerCase().endsWith(ext) ? artifact.name : `${artifact.name}${ext}`;
}

function formatTypeLabel(type: string): string {
  const trimmed = type.trim();
  return ASCII_EXT_PATTERN.test(trimmed) ? trimmed.toUpperCase() : trimmed;
}

/**
 * 对话中的文件卡片（Figma 811:30015）
 * 260×60 白底卡片、圆角 16px、1px #EBEDF2 内描边、内边距 10 12 10 10、间距 8px；
 * 左侧 40×40 文件类型图标（PDF/DOC/PPT/XMP/XLS/截图/笔记），右侧单行省略文件名（14/20 #000）+ 类型与体积（12/18 #7B818F）。
 */
export const ArtifactCard: FC<ArtifactCardProps> = ({ artifact, onOpen }) => {
  const fileName = formatDisplayTitle(artifact);
  const typeLabel = formatTypeLabel(artifact.type);

  return (
    <Pressable
      className={styles.card}
      onClick={() => onOpen?.(artifact)}
      ariaLabel={`打开${fileName}`}
    >
      <span className={styles.iconBox} aria-hidden="true" data-chat-file-card="811-30015">
        {artifact.icon === 'yuanbao' ? (
          <IconYuanbaoNoteDoc width={40} height={40} />
        ) : artifact.icon === 'image' && artifact.thumb ? (
          <img className={styles.thumb} src={artifact.thumb} alt="" draggable={false} />
        ) : (
          <img className={styles.typeIcon} src={resolveFileIconSrc(artifact)} alt="" draggable={false} />
        )}
      </span>

      <span className={styles.meta}>
        <span className={styles.name} title={fileName}>
          {fileName}
        </span>
        <span className={styles.subline}>
          {typeLabel && <span className={styles.subItem}>{typeLabel}</span>}
          {artifact.size && <span className={styles.subItem}>{artifact.size}</span>}
        </span>
      </span>
    </Pressable>
  );
};
