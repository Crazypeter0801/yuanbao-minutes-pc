import type { FC } from 'react';
import IconArtifactChevron from '@/assets/d2c/icons/artifact/icon-artifact-chevron';
import iconArtifactPpt from '@/assets/d2c/images/artifact/icon-artifact-ppt@2x.png';
import iconFilePdf from '@/assets/d2c/icons/v1/icon-file-pdf.svg';
import { Pressable } from '@/components/common/Pressable';
import type { ArtifactItem } from '@/types/artifact';
import styles from './index.module.scss';

interface ArtifactCardProps {
  artifact: ArtifactItem;
  /** 点击卡片打开文件 */
  onOpen?: (artifact: ArtifactItem) => void;
}

/**
 * 气泡下方的产物卡片（Figma PC 新框架改版 14330:23470）
 * 固定 248 宽，不随消息区撑满：标题行（类型图标 + 文件名 + 箭头）+ 224×126 的封面预览，整张可点。
 *
 * 设计稿的封面是一张写着别的主题的示例图，放到这里会和文件名对不上，
 * 所以封面用代码绘制：版式取自设计稿，标题跟随当前文件。
 */
export const ArtifactCard: FC<ArtifactCardProps> = ({ artifact, onOpen }) => {
  const isPdf = artifact.icon === 'pdf';
  const fileName = `${artifact.name}.${artifact.type.toLowerCase()}`;

  return (
    <Pressable className={styles.card} onClick={() => onOpen?.(artifact)} ariaLabel={`打开${fileName}`}>
      <span className={styles.header}>
        <img className={styles.typeIcon} src={isPdf ? iconFilePdf : iconArtifactPpt} alt="" aria-hidden="true" />
        <span className={styles.name} title={fileName}>
          {fileName}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <IconArtifactChevron />
        </span>
      </span>

      <span className={styles.preview} aria-hidden="true">
        <span className={styles.cover}>
          <span className={styles.coverTitle}>{artifact.name}</span>
          <span className={styles.coverSubtitle} />
          {isPdf ? (
            <span className={styles.coverLines}>
              <span />
              <span />
              <span />
              <span />
            </span>
          ) : (
            <span className={styles.coverBlocks}>
              <span className={styles.blockPattern} />
              <span className={styles.blockSoft} />
              <span className={styles.blockSolid} />
            </span>
          )}
        </span>
      </span>
    </Pressable>
  );
};
