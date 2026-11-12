import type { FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import {
  DETAIL_LIBRARY,
  DETAIL_LIBRARY_FILTERS,
  type DetailLibraryFilter,
  type DetailLibraryItem,
} from '@/data/detailLibrary';
import styles from './index.module.scss';

interface LibrarySectionProps {
  activeFilter: DetailLibraryFilter;
  onFilterChange: (filter: DetailLibraryFilter) => void;
  onOpenItem: (item: DetailLibraryItem) => void;
}

/**
 * 详情页资料库（Figma 289:31272）
 * 筛选真实过滤；笔记和链接没有卡片时给空态。点卡片打开同一份文件查看器。
 */
export const LibrarySection: FC<LibrarySectionProps> = ({ activeFilter, onFilterChange, onOpenItem }) => {
  const items =
    activeFilter === 'all' ? DETAIL_LIBRARY : DETAIL_LIBRARY.filter((item) => item.filter === activeFilter);

  return (
    <section className={styles.section} aria-label="资料库">
      <div className={styles.filters} role="tablist" aria-label="资料筛选">
        {DETAIL_LIBRARY_FILTERS.map((filter) => (
          <Pressable
            key={filter.key}
            className={`${styles.chip} ${activeFilter === filter.key ? styles.chipActive : ''}`}
            onClick={() => onFilterChange(filter.key)}
            ariaLabel={filter.label}
            ariaExpanded={activeFilter === filter.key}
          >
            {filter.label}
          </Pressable>
        ))}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>这里还没有内容</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => {
            const media = item.kind === 'photo' || item.kind === 'video';
            const baked = item.kind === 'code' || item.kind === 'logo';
            return (
            <Pressable
              key={item.id}
              className={`${styles.card} ${media ? styles.cardMedia : ''}`}
              onClick={() => onOpenItem(item)}
              ariaLabel={item.title}
            >
              <span className={media || baked ? styles.mediaCover : styles.docCover}>
                <img src={item.cover} alt="" />
              </span>
              {item.kind === 'photo' && (
                <span className={styles.album}>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <rect x="1.5" y="3" width="11" height="8.5" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1.8 9.2 4.4 6.8l2 1.8 1.6-1.4L12 10" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  </svg>
                  {item.count}
                </span>
              )}
              {item.kind === 'video' && (
                <span className={styles.play} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M5.2 3.6v6.8L10.6 7 5.2 3.6Z" fill="currentColor" />
                  </svg>
                </span>
              )}
              {!media && !baked && (
                <span className={styles.meta}>
                  <span className={styles.cardTitle}>{item.title}</span>
                  <span className={styles.cardTime}>{item.meta}</span>
                </span>
              )}
            </Pressable>
            );
          })}
        </div>
      )}
    </section>
  );
};
