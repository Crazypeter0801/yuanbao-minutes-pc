import type { FC } from 'react';
import iconFilePdf from '@/assets/d2c/icons/v1/icon-file-pdf.svg';
import iconFileSheet from '@/assets/d2c/icons/v1/icon-file-sheet.svg';
import iconFileSlide from '@/assets/d2c/icons/v1/icon-file-slide.svg';
import iconFileTranscript from '@/assets/d2c/icons/v1/icon-file-transcript.svg';
import iconFileWord from '@/assets/d2c/icons/v1/icon-file-word.svg';
import iconFileYuanbao from '@/assets/d2c/icons/v1/icon-file-yuanbao.svg';
import IconAgentFold from '@/assets/d2c/icons/agent/icon-agent-fold';
import IconMeetSidebar from '@/assets/d2c/icons/v1/icon-meet-sidebar';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { NOTE_ARTIFACT_ID } from '@/data/artifacts';
import type { ArtifactGroup, ArtifactIcon, ArtifactItem } from '@/types/artifact';
import styles from './index.module.scss';

interface ArtifactEntryProps {
  /** 本场会议对话里出现过的全部文件（元宝的输出 + 对话里的来源） */
  artifacts: ArtifactItem[];
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位 */
  hidden?: boolean;
  /** 点击某个产物 */
  onOpen: (item: ArtifactItem) => void;
  /** 标题行右侧「在侧边打开」：把文件列表挪到侧边完整查看 */
  onOpenSide: () => void;
}

/** 文件类型徽标：Figma 导出的矢量图，按 URL 引入后由 img 渲染，避免位图缩放发虚；图片类改用缩略图 */
const FILE_ICONS: Record<Exclude<ArtifactIcon, 'image'>, string> = {
  yuanbao: iconFileYuanbao,
  pdf: iconFilePdf,
  sheet: iconFileSheet,
  transcript: iconFileTranscript,
  word: iconFileWord,
  slide: iconFileSlide,
};

/** 分组顺序与标题（参考 Codex：输出在上、来源在下） */
const GROUPS: { key: ArtifactGroup; title: string }[] = [
  { key: 'output', title: '输出' },
  { key: 'source', title: '来源' },
];

/**
 * 文件入口（Figma 36:2280：文件夹图标 + 条数）
 * 文件夹装的是对话里出现过的全部内容，所以展开后按「输出 / 来源」分两组，空组不显示。
 * 元宝笔记也算一个文件（元宝产出），固定在「输出」第一条，所以入会后这个入口就一直在。
 * 对齐（参考 Codex）：标题行图标、分组标题、文件图标同一条左边线；「在侧边打开」、文件类型同一条右边线，分隔线也在两线之间。
 * 每条压成一行（参考 Codex）：20 图标 + 文件名 + 右侧类型，行高 36，比两行版省一半高度。
 * 标题行右侧不是「收起」，而是「在侧边打开」；收起靠点标题行、点面板外或 Esc。
 */
export const ArtifactEntry: FC<ArtifactEntryProps> = ({
  artifacts,
  expanded,
  onExpandedChange,
  hidden,
  onOpen,
  onOpenSide,
}) => {
  // 元宝笔记固定在「输出」第一条，其余按加入顺序（新的在前）
  const groups = GROUPS.map((group) => ({
    ...group,
    items: artifacts
      .filter((item) => item.group === group.key)
      .sort((a, b) => Number(b.id === NOTE_ARTIFACT_ID) - Number(a.id === NOTE_ARTIFACT_ID)),
  })).filter((group) => group.items.length > 0);

  return (
    <MorphPanel
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      hidden={hidden}
      summary={
        <>
          <span className={styles.icon}>
            <IconAgentFold />
          </span>
          <span className={styles.count}>{artifacts.length}</span>
        </>
      }
      expandedLabel="个文件"
      collapsedPaddingX={12}
      panelWidth="full"
      name="会中文件"
      contentKey={artifacts.length}
      alignHeaderToContent
      headerAction={
        <Pressable
          className={styles.sideOpen}
          onClick={onOpenSide}
          stopPropagation
          title="在侧边打开"
          ariaLabel="在侧边打开"
        >
          <IconMeetSidebar width={24} height={24} />
        </Pressable>
      }
    >
      {groups.map((group) => (
        <div className={styles.group} key={group.key}>
          <p className={styles.groupTitle}>{group.title}</p>
          {group.items.map((item) => (
            <Pressable key={item.id} className={styles.file} onClick={() => onOpen(item)} ariaLabel={`打开${item.name}`}>
              {item.icon === 'image' ? (
                <img className={styles.fileThumb} src={item.thumb} alt="" aria-hidden="true" />
              ) : (
                <img className={styles.fileIcon} src={FILE_ICONS[item.icon]} alt="" aria-hidden="true" />
              )}
              <span className={styles.fileName} title={item.name}>
                {item.name}
              </span>
              <span className={styles.fileType} title={item.size}>
                {item.type}
              </span>
            </Pressable>
          ))}
        </div>
      ))}
    </MorphPanel>
  );
};
