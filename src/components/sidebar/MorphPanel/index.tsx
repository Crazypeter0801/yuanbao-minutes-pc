import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type ReactNode,
} from 'react';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

/** 卡片内固定占位：上 padding 12 + 标题行 24 */
const PANEL_CHROME = 36;
const PANEL_MIN_HEIGHT = 160;
const PANEL_MAX_HEIGHT = 400;

interface MorphPanelProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位：整块淡出、不可点 */
  hidden?: boolean;
  /** 收起态的内容（图标 / 图标 + 数字 / 元宝状态条），展开后留在标题行左侧 */
  summary: ReactNode;
  /** 展开态自定义标题行左侧内容（不传时复用 summary） */
  expandedSummary?: ReactNode;
  /** 只在展开后接在 summary 后面的文字，如「快捷指令」 */
  expandedLabel?: string;
  /** 收起态外观：card 为白底描边胶囊；ghost 为无边框透明触发态（展开时仍平滑变形为白底卡片） */
  triggerVariant?: 'card' | 'ghost';
  /** 收起态撑满整行宽度（用于新版动态文案状态栏：切换长短文案无横向抖动，超长文案单行省略） */
  fullWidthCollapsed?: boolean;
  /** 收起态左右内边距：纯图标 10（凑成 36 的正圆），图标 + 文字 12，无框态 0/8 */
  collapsedPaddingX: number;
  /** 展开宽度：数字为固定 px，'full' 为撑满底栏这一行 */
  panelWidth: number | 'full';
  /** 读屏用的面板名 */
  name: string;
  /** 内容变化时重新量高度（如产物条数） */
  contentKey?: string | number;
  /** 布局形态变化时重新量收起态位置与宽度（如切换上方工具栏形态） */
  layoutKey?: string | number;
  /** 展开后的最大高度，默认 400；超出部分滚动 */
  maxHeight?: number;
  /** 展开后标题行右侧的操作（如「在侧边打开」）；不传就什么都不放 */
  headerAction?: ReactNode;
  /**
   * 展开后标题行左右再缩进多少，让标题与列表内容对齐到同一条线（产物面板为 true：左 6、操作位右移到对齐线）
   * 收起态不受影响
   */
  alignHeaderToContent?: boolean;
  /** 展开态隐藏 summary（如「推荐指令」展开后标题栏仅保留文字，不显示图标） */
  hideSummaryWhenExpanded?: boolean;
  children: ReactNode;
}

/**
 * 底栏胶囊 ↔ 浮层面板（指令集合、进行中任务共用）
 *
 * 同一张卡片从胶囊/状态条长成面板：宽、高、左边距、内边距、圆角一起过渡，内容延后淡入，
 * 曲线和时长沿用最早的记笔记面板（380ms cubic-bezier(0.32, 0.72, 0, 1)）。
 *
 * 胶囊在底栏里按内容自适应宽度（由一份不可见的 ghost 撑开占位），
 * 展开时卡片向左对齐到这一行的起点再向上长，所以排在第二、第三位或右对齐的触发器也能长成整行面板。
 */
export const MorphPanel: FC<MorphPanelProps> = ({
  expanded,
  onExpandedChange,
  hidden = false,
  summary,
  expandedSummary,
  expandedLabel,
  triggerVariant = 'card',
  fullWidthCollapsed = false,
  collapsedPaddingX,
  panelWidth,
  name,
  contentKey,
  layoutKey,
  headerAction,
  alignHeaderToContent = false,
  hideSummaryWhenExpanded = false,
  maxHeight = PANEL_MAX_HEIGHT,
  children,
}) => {
  const slotRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [collapsedWidth, setCollapsedWidth] = useState(36);
  const [rowWidth, setRowWidth] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [panelHeight, setPanelHeight] = useState(PANEL_MIN_HEIGHT);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const toggle = useCallback(() => onExpandedChange(!expanded), [expanded, onExpandedChange]);
  const collapse = useCallback(() => onExpandedChange(false), [onExpandedChange]);

  // 收起宽度跟着内容与形态走（数字从 5 变 12 或切换形态时触发器宽度同步更新）
  useLayoutEffect(() => {
    const ghost = ghostRef.current;
    if (!ghost) {
      return undefined;
    }
    const measure = () => setCollapsedWidth(ghost.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ghost);
    return () => observer.disconnect();
  }, [layoutKey, collapsedPaddingX]);

  // 这一行的宽度、自己在行里的位置：排布或形态变化时重新量（支持通过 data-morph-row 跨一层过渡容器定位行宽）
  useLayoutEffect(() => {
    const slot = slotRef.current;
    const row = (slot?.closest('[data-morph-row]') as HTMLElement | null) ?? slot?.parentElement;
    if (!slot || !row) {
      return undefined;
    }
    const measure = () => {
      setRowWidth(row.clientWidth);
      const offset =
        slot.parentElement === row
          ? slot.offsetLeft
          : Math.round(slot.getBoundingClientRect().left - row.getBoundingClientRect().left);
      setOffsetLeft(offset);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [expanded, layoutKey, collapsedWidth]);

  const expandedWidth = panelWidth === 'full' ? rowWidth : Math.min(panelWidth, rowWidth || panelWidth);

  // 面板高度 = 标题行 + 内容，夹在上下限之间；收起态 body 被压扁，但 scrollHeight 仍是内容全高
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return;
    }
    const content = PANEL_CHROME + body.scrollHeight;
    setPanelHeight(Math.min(maxHeight, Math.max(PANEL_MIN_HEIGHT, content)));
  }, [contentKey, expandedWidth, maxHeight]);

  // 每次展开都从第一条读起
  useEffect(() => {
    if (expanded && bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [expanded]);

  // 右上角不再放收起按钮：Esc、点标题行、点面板外任意处都能收起
  useEffect(() => {
    if (!expanded) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        collapse();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      if (slotRef.current && !slotRef.current.contains(event.target as Node)) {
        collapse();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [expanded, collapse]);

  // 底部渐隐只在「能滚且没滚到底」时出现
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return undefined;
    }
    const check = () => {
      const scrollable = body.scrollHeight > body.clientHeight + 1;
      const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1;
      setShowBottomFade(scrollable && !atBottom);
    };
    check();
    body.addEventListener('scroll', check);
    const observer = new ResizeObserver(check);
    observer.observe(body);
    return () => {
      body.removeEventListener('scroll', check);
      observer.disconnect();
    };
  }, [expanded, panelHeight]);

  const vars = {
    '--morph-collapsed-width': `${collapsedWidth}px`,
    '--morph-collapsed-padding-x': `${collapsedPaddingX}px`,
    '--morph-expanded-width': `${expandedWidth}px`,
    '--morph-expanded-left': `${-offsetLeft}px`,
    '--morph-panel-height': `${panelHeight}px`,
  } as CSSProperties;

  const displayedSummary = expanded && expandedSummary ? expandedSummary : summary;

  return (
    <div
      className={[
        styles.slot,
        fullWidthCollapsed ? styles.slotFullWidth : '',
        expanded ? styles.slotExpanded : '',
        hidden ? styles.slotHidden : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={slotRef}
      style={vars}
    >
      {/* 不可见的占位：按收起态内容撑出触发器宽度，让底栏这一行自然排布 */}
      <div className={styles.ghost} ref={ghostRef} aria-hidden="true">
        {summary}
      </div>

      <div className={styles.fade} aria-hidden="true" />

      <div
        className={[
          styles.card,
          triggerVariant === 'ghost' ? styles.cardGhost : '',
          fullWidthCollapsed ? styles.cardFullWidthCollapsed : '',
          expanded ? styles.cardExpanded : '',
          alignHeaderToContent ? styles.cardAligned : '',
          alignHeaderToContent && hideSummaryWhenExpanded ? styles.cardAlignedTextOnly : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.header} onClick={toggle} role="presentation">
          <Pressable
            className={styles.summary}
            onClick={toggle}
            stopPropagation
            ariaExpanded={expanded}
            ariaLabel={expanded ? `收起${name}` : `展开${name}`}
            title={name}
          >
            {!(expanded && hideSummaryWhenExpanded) && displayedSummary}
            {expandedLabel && <span className={styles.label}>{expandedLabel}</span>}
          </Pressable>
          {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
        </div>

        <div
          className={`${styles.body} ${showBottomFade ? styles.bodyOverflowing : ''} wm-scroll-hidden`}
          ref={bodyRef}
          aria-hidden={!expanded}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
