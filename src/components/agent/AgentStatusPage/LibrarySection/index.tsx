import { Fragment, type FC } from 'react';
import fileDocx from '@/assets/d2c/images/agent-status/icon-status-file-docx@2x.png';
import fileNote from '@/assets/d2c/images/agent-status/icon-status-file-note@2x.png';
import filePdf from '@/assets/d2c/images/agent-status/icon-status-file-pdf@2x.png';
import filePptx from '@/assets/d2c/images/agent-status/icon-status-file-pptx@2x.png';
import fileTxt from '@/assets/d2c/images/agent-status/icon-status-file-txt@2x.png';
import fileXlsx from '@/assets/d2c/images/agent-status/icon-status-file-xlsx@2x.png';
import IconStatusFileLink from '@/assets/d2c/icons/agent-status/icon-status-file-link';
import IconStatusFileMedia from '@/assets/d2c/icons/agent-status/icon-status-file-media';
import IconStatusFileOcr from '@/assets/d2c/icons/agent-status/icon-status-file-ocr';
import IconStatusFileTranslate from '@/assets/d2c/icons/agent-status/icon-status-file-translate';
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

/** 无渐变、可稳定导出为 SVG 的两类图标 */
const FileTypeIcon: FC<{ kind: AgentFileKind; size: number }> = ({ kind, size }) => {
  if (kind === 'link') {
    return <IconStatusFileLink width={size} height={size} />;
  }
  if (kind === 'media') {
    return <IconStatusFileMedia width={size} height={size} />;
  }
  if (kind === 'ocr') {
    return <IconStatusFileOcr width={size} height={size} />;
  }
  if (kind === 'translate') {
    return <IconStatusFileTranslate width={size} height={size} />;
  }
  const source = FILE_IMAGES[kind];
  return source ? (
    <img
      className={styles.fileImage}
      src={source}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  ) : null;
};

interface LibrarySectionProps {
  variant: 'tabs' | 'flow';
  items: AgentLibraryItem[];
  filters: { key: AgentLibraryFilter; label: string }[];
  activeFilter: AgentLibraryFilter;
  onFilterChange: (filter: AgentLibraryFilter) => void;
  /** 打开资料（演示） */
  onOpenItem: (item: AgentLibraryItem) => void;
}

/**
 * 状态页资料库
 * - tabs（方案一）：全部 / 笔记 / 文件 / 媒体 / 链接 五个筛选标签，真实过滤列表；
 * - flow（方案二）：按设计稿只保留全部 / 媒体 / 文件，并沿用同一份过滤逻辑。
 */
export const LibrarySection: FC<LibrarySectionProps> = ({
  variant,
  items,
  filters,
  activeFilter,
  onFilterChange,
  onOpenItem,
}) => {
  const visible = items.filter(
    (item) => activeFilter === 'all' || item.filter === activeFilter,
  );
  const current = visible.filter((item) => item.group === 'current');
  const earlier = visible.filter((item) => item.group === 'earlier');

  return (
    <section className={styles.section} aria-label="资料库">
      {variant === 'flow' && (
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>资料库</h2>
          <span className={styles.sectionAction}>展开 ›</span>
        </div>
      )}

      <div className={`${styles.filters} ${variant === 'flow' ? styles.filtersFlow : ''}`}>
        {filters.map((filter) => {
          const active = filter.key === activeFilter;
          return (
            <Pressable
              key={filter.key}
              className={`${styles.filterPill} ${variant === 'flow' ? styles.filterPillFlow : ''} ${active ? (variant === 'flow' ? styles.filterPillActiveFlow : styles.filterPillActive) : ''}`}
              onClick={() => onFilterChange(filter.key)}
              ariaLabel={filter.label}
              ariaExpanded={active}
            >
              {filter.label}
            </Pressable>
          );
        })}
      </div>

      {variant === 'flow' ? (
        <div className={styles.flowCard}>
          {visible.length === 0 && <p className={styles.empty}>暂无资料</p>}
          {visible.map((item, index) => (
            <Fragment key={item.id}>
              <Pressable
                className={styles.flowRow}
                onClick={() => onOpenItem(item)}
                ariaLabel={item.title}
              >
                <FileTypeIcon kind={item.fileKind} size={36} />
                <div className={styles.flowText}>
                  <span className={styles.flowTitle}>{item.title}</span>
                  {item.meta && <span className={styles.flowMeta}>{item.meta}</span>}
                </div>
                {item.trailing && <span className={styles.flowTrailing}>{item.trailing}</span>}
              </Pressable>
              {index < visible.length - 1 && <div className={styles.flowDivider} />}
            </Fragment>
          ))}
        </div>
      ) : (
        <div className={styles.tabCard}>
          {visible.length === 0 && <p className={styles.empty}>暂无资料</p>}
          {current.length > 0 && (
            <>
              <p className={styles.groupTitle}>本场会议</p>
              {current.map((item) => (
                <Pressable
                  key={item.id}
                  className={styles.tabRow}
                  onClick={() => onOpenItem(item)}
                  ariaLabel={item.title}
                >
                  <FileTypeIcon kind={item.fileKind} size={24} />
                  <span className={styles.tabTitle}>{item.title}</span>
                  {item.meta && <span className={styles.tabMeta}>{item.meta}</span>}
                </Pressable>
              ))}
            </>
          )}
          {current.length > 0 && earlier.length > 0 && <div className={styles.divider} />}
          {earlier.length > 0 && (
            <>
              <p className={styles.groupTitle}>更早</p>
              {earlier.map((item) => (
                <Pressable
                  key={item.id}
                  className={styles.tabRow}
                  onClick={() => onOpenItem(item)}
                  ariaLabel={item.title}
                >
                  <FileTypeIcon kind={item.fileKind} size={24} />
                  <span className={styles.tabTitle}>{item.title}</span>
                  {item.meta && <span className={styles.tabMeta}>{item.meta}</span>}
                </Pressable>
              ))}
            </>
          )}
        </div>
      )}
    </section>
  );
};
