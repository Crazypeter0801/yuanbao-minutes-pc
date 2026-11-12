import type { FC } from 'react';
import fileDocx from '@/assets/d2c/images/agent-status/icon-status-file-docx@2x.png';
import fileNote from '@/assets/d2c/images/agent-status/icon-status-file-note@2x.png';
import filePdf from '@/assets/d2c/images/agent-status/icon-status-file-pdf@2x.png';
import filePptx from '@/assets/d2c/images/agent-status/icon-status-file-pptx@2x.png';
import fileTxt from '@/assets/d2c/images/agent-status/icon-status-file-txt@2x.png';
import fileXlsx from '@/assets/d2c/images/agent-status/icon-status-file-xlsx@2x.png';
import IconStatusFileLink from '@/assets/d2c/icons/agent-status/icon-status-file-link';
import IconStatusFileMedia from '@/assets/d2c/icons/agent-status/icon-status-file-media';
import { Pressable } from '@/components/common/Pressable';
import type {
  AgentFileKind,
  AgentLibraryFilter,
  AgentLibraryItem,
} from '@/data/agentStatusLibrary';
import styles from './index.module.scss';

/** 位图文件图标（Figma 252:1315 中带渐变的 24×24 图标已按规范降级为 @2x PNG） */
const FILE_IMAGES: Partial<Record<AgentFileKind, string>> = {
  note: fileNote,
  pptx: filePptx,
  pdf: filePdf,
  xlsx: fileXlsx,
  docx: fileDocx,
  txt: fileTxt,
};

/** 无渐变、可稳定导出为 SVG 的链接 / 媒体图标 */
const FileTypeIcon: FC<{ kind: AgentFileKind }> = ({ kind }) => {
  if (kind === 'link') {
    return <IconStatusFileLink width={24} height={24} />;
  }
  if (kind === 'media') {
    return <IconStatusFileMedia width={24} height={24} />;
  }
  const source = FILE_IMAGES[kind];
  return source ? (
    <img className={styles.fileImage} src={source} width={24} height={24} alt="" aria-hidden="true" />
  ) : null;
};

interface LibrarySectionProps {
  items: AgentLibraryItem[];
  filters: { key: AgentLibraryFilter; label: string }[];
  activeFilter: AgentLibraryFilter;
  onFilterChange: (filter: AgentLibraryFilter) => void;
  /** 打开资料（演示） */
  onOpenItem: (item: AgentLibraryItem) => void;
}

/**
 * 状态页资料库（Figma 243:1294）
 * 全部 / 笔记 / 文件 / 媒体 / 链接 五个筛选标签会真实过滤列表；
 * 每行右侧保留整合副标题。
 */
export const LibrarySection: FC<LibrarySectionProps> = ({
  items,
  filters,
  activeFilter,
  onFilterChange,
  onOpenItem,
}) => {
  const visible = items.filter((item) => activeFilter === 'all' || item.filter === activeFilter);
  const current = visible.filter((item) => item.group === 'current');
  const earlier = visible.filter((item) => item.group === 'earlier');

  const renderRow = (item: AgentLibraryItem) => (
    <Pressable
      key={item.id}
      className={styles.row}
      onClick={() => onOpenItem(item)}
      ariaLabel={item.meta ? `${item.title}，${item.meta}` : item.title}
    >
      <FileTypeIcon kind={item.fileKind} />
      <span className={styles.title}>{item.title}</span>
      {item.meta && <span className={styles.meta}>{item.meta}</span>}
    </Pressable>
  );

  return (
    <section className={styles.section} aria-label="资料库">
      <div className={styles.filters}>
        {filters.map((filter) => {
          const active = filter.key === activeFilter;
          return (
            <Pressable
              key={filter.key}
              className={`${styles.filterPill} ${active ? styles.filterPillActive : ''}`}
              onClick={() => onFilterChange(filter.key)}
              ariaLabel={filter.label}
              ariaExpanded={active}
            >
              {filter.label}
            </Pressable>
          );
        })}
      </div>

      <div className={styles.card}>
        {visible.length === 0 && <p className={styles.empty}>暂无资料</p>}
        {current.length > 0 && (
          <>
            <p className={styles.groupTitle}>本场会议</p>
            {current.map(renderRow)}
          </>
        )}
        {current.length > 0 && earlier.length > 0 && <div className={styles.divider} />}
        {earlier.length > 0 && (
          <>
            <p className={styles.groupTitle}>更早</p>
            {earlier.map(renderRow)}
          </>
        )}
      </div>
    </section>
  );
};
