import { useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import { RichText } from '@/components/sidebar/RichText';
import type { BubbleFold } from '@/types/chat';
import styles from './index.module.scss';

interface FoldCardProps {
  fold: BubbleFold;
}

/**
 * 默认折叠的补充信息卡片（专业信息补充）
 * 折叠态：一行「标题 + 简述 + 展开箭头」，不抢注意力；点击展开全文，再点收起。
 */
export const FoldCard: FC<FoldCardProps> = ({ fold }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.card} ${open ? styles.cardOpen : ''}`} data-fold={open ? 'open' : 'closed'}>
      <Pressable
        className={styles.header}
        onClick={() => setOpen((value) => !value)}
        ariaLabel={open ? `收起：${fold.title}` : `展开：${fold.title}`}
        ariaExpanded={open}
      >
        <span className={styles.spark} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1.5 8.3 5.2 12 6.5 8.3 7.8 7 11.5 5.7 7.8 2 6.5l3.7-1.3L7 1.5Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className={styles.title}>{fold.title}</span>
        {fold.hint && !open && <span className={styles.hint}>{fold.hint}</span>}
        <span className={styles.action}>{open ? '收起' : '展开'}</span>
        <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Pressable>
      {open && (
        <div className={styles.body}>
          <RichText blocks={fold.blocks} />
        </div>
      )}
    </div>
  );
};
