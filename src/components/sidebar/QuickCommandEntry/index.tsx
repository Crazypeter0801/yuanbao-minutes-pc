import { useEffect, useMemo, type FC, type RefObject } from 'react';
import IconSide3Book from '@/assets/d2c/icons/v2/icon-side3-book';
import { Pressable } from '@/components/common/Pressable';
import { QUICK_COMMAND_ITEMS, type QuickCommandItem } from '@/data/quickCommands';
import styles from './index.module.scss';

interface QuickCommandEntryProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位 */
  hidden?: boolean;
}

/**
 * 推荐指令触发胶囊（Figma 489:10625：Book AI 图标小卡）
 * 与右侧「进行中任务」并排放在输入框上方；点击唤起整合在输入框上方的推荐指令面板。
 */
export const QuickCommandEntry: FC<QuickCommandEntryProps> = ({
  expanded,
  onExpandedChange,
  hidden = false,
}) => (
  <Pressable
    className={`${styles.trigger} ${hidden || expanded ? styles.triggerHidden : ''}`}
    onClick={() => onExpandedChange(!expanded)}
    ariaLabel={expanded ? '收起推荐指令' : '查看推荐指令'}
    ariaExpanded={expanded}
    title="查看推荐指令（也可输入 / 唤起）"
  >
    <IconSide3Book />
  </Pressable>
);

interface QuickCommandPopoverProps {
  open: boolean;
  /** 通过输入框「/关键词」唤起时的过滤词 */
  query?: string;
  /** 外部容器 ref（包含底部输入框），用于点击外部关闭判定 */
  containerRef: RefObject<HTMLDivElement>;
  /** 底部输入框当前高度，用于为一体化底框预留精确占位 */
  inputHeight: number;
  onClose: () => void;
  onPick: (item: QuickCommandItem) => void;
  onCreate?: () => void;
  onInspect?: (item: QuickCommandItem) => void;
}

/** 圆角方框「/」指令图标（参考图一 / 图二） */
const SlashBadgeIcon: FC = () => (
  <span className={styles.slashIcon} aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.25" y="2.25" width="15.5" height="15.5" rx="4.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M11.6 6.2 8.4 13.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  </span>
);

/**
 * 推荐指令面板（参考图一弹层布局 + 图二优先指令）
 * 以一体化白色圆角卡片承托底部输入框，顶部含「推荐指令 / + 创建 / ×」，
 * 中部按「推荐」与「全部指令」分组展示：左侧「/」图标、中间标题+说明、右侧常态热度 hover 切为 (i)。
 */
export const QuickCommandPopover: FC<QuickCommandPopoverProps> = ({
  open,
  query = '',
  containerRef,
  inputHeight,
  onClose,
  onPick,
  onCreate,
  onInspect,
}) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, containerRef, onClose]);

  const normalizedQuery = query.trim().toLowerCase();

  const { featured, rest } = useMemo(() => {
    const matched = normalizedQuery
      ? QUICK_COMMAND_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery),
        )
      : QUICK_COMMAND_ITEMS;

    return {
      featured: matched.filter((item) => item.group === 'featured'),
      rest: matched.filter((item) => item.group === 'all'),
    };
  }, [normalizedQuery]);

  if (!open) {
    return null;
  }

  const renderRow = (item: QuickCommandItem) => (
    <Pressable
      key={item.id}
      className={styles.row}
      onClick={() => onPick(item)}
      ariaLabel={`发送指令：${item.title}`}
    >
      <SlashBadgeIcon />
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{item.title}</span>
        <span className={styles.rowDesc}>{item.description}</span>
      </span>
      <span className={styles.rowRight}>
        <span className={styles.usage} aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1.2 7.15 4.85 10.8 6 7.15 7.15 6 10.8 4.85 7.15 1.2 6 4.85 4.85 6 1.2Z"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeLinejoin="round"
            />
          </svg>
          <span>{item.usage}</span>
        </span>
        <Pressable
          as="span"
          className={styles.infoBtn}
          onClick={() => onInspect?.(item)}
          ariaLabel={`查看「${item.title}」说明`}
          title={item.description}
          stopPropagation
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 7.3v3.3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            <circle cx="8" cy="5.2" r="0.75" fill="currentColor" />
          </svg>
        </Pressable>
      </span>
    </Pressable>
  );

  const hasAny = featured.length > 0 || rest.length > 0;

  return (
    <section
      className={styles.popover}
      aria-label="推荐指令"
      style={{ paddingBottom: `${Math.max(48, inputHeight) + 12}px` }}
    >
      <header className={styles.header}>
        <h3 className={styles.headerTitle}>推荐指令</h3>
        <div className={styles.headerActions}>
          {onCreate && (
            <Pressable className={styles.createBtn} onClick={onCreate} ariaLabel="创建自定义指令">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 2.2v7.6M2.2 6h7.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
              </svg>
              <span>创建</span>
            </Pressable>
          )}
          <Pressable className={styles.closeBtn} onClick={onClose} ariaLabel="关闭推荐指令" title="关闭">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            </svg>
          </Pressable>
        </div>
      </header>

      <div className={`${styles.scroll} wm-scroll-hidden`}>
        {hasAny ? (
          <>
            {featured.length > 0 && (
              <div className={styles.group}>
                <p className={styles.groupTitle}>常用推荐</p>
                <div className={styles.groupList}>{featured.map(renderRow)}</div>
              </div>
            )}
            {rest.length > 0 && (
              <div className={styles.group}>
                <p className={styles.groupTitle}>全部指令</p>
                <div className={styles.groupList}>{rest.map(renderRow)}</div>
              </div>
            )}
          </>
        ) : (
          <p className={styles.empty}>未找到匹配的指令，按 Enter 可直接提问</p>
        )}
      </div>
    </section>
  );
};
