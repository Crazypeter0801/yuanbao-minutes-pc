import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import iconFilePdf from '@/assets/d2c/icons/v1/icon-file-pdf.svg';
import iconFileSheet from '@/assets/d2c/icons/v1/icon-file-sheet.svg';
import iconFileSlide from '@/assets/d2c/icons/v1/icon-file-slide.svg';
import iconFileTranscript from '@/assets/d2c/icons/v1/icon-file-transcript.svg';
import iconFileWord from '@/assets/d2c/icons/v1/icon-file-word.svg';
import iconFileYuanbao from '@/assets/d2c/icons/v1/icon-file-yuanbao.svg';
import IconArtifactFold from '@/assets/d2c/icons/v1/icon-artifact-fold';
import IconArtifactFolder from '@/assets/d2c/icons/v1/icon-artifact-folder';
import { Pressable } from '@/components/common/Pressable';
import type { ArtifactIcon, ArtifactItem } from '@/types/artifact';
import styles from './index.module.scss';

interface ArtifactEntryProps {
  /** 元宝生成并归到本场会议的产物 */
  artifacts: ArtifactItem[];
  /** 点击某个产物 */
  onOpen: (item: ArtifactItem) => void;
  /** 记笔记面板展开时把入口藏起来：那一行已经被更宽的面板占满，胶囊露在上面会打架 */
  hidden?: boolean;
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

/** 展开后面板的上下限：条数少时收短但不低于 200，超过 400 则列表滚动（Figma 320:8185） */
const PANEL_MAX_HEIGHT = 400;
const PANEL_MIN_HEIGHT = 200;

/** 卡片内固定占位：上 padding 12 + 标题行 24 */
const PANEL_CHROME = 36;

/**
 * 「输出 · N」产物入口（收起 Figma 320:7815，展开 Figma 320:8185）
 * - 收起：底栏右侧 36 高胶囊（文件夹图标 + 输出 · N），与左侧记笔记状态条同一行；
 * - 展开：同一个卡片向右上长成全宽面板，宽度、高度、圆角一起过渡，
 *   动画曲线与时长跟记笔记面板完全一致（380ms cubic-bezier(0.32, 0.72, 0, 1)），
 *   内容等卡片长到七八成再淡入——所以不是「另一块面板淡出来」，而是胶囊自己变成了面板；
 * - 面板高度跟着产物条数走、最高 400：条数少时收短，超过 400 时列表滚动并在底部渐隐；
 * - 面板内的折叠图标或 Esc 收起。
 */
export const ArtifactEntry: FC<ArtifactEntryProps> = ({ artifacts, onOpen, hidden = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [panelWidth, setPanelWidth] = useState(0);
  const [panelHeight, setPanelHeight] = useState(PANEL_MIN_HEIGHT);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 展开宽度 = 底栏内容宽度；量成 px 才能和收起时的 104px 胶囊平滑过渡
  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) {
      return undefined;
    }
    const measure = () => setPanelWidth(slot.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  // 展开高度 = 标题行 + 列表实际内容，夹在 200–400 之间；列表此刻被收起态压扁，scrollHeight 仍是内容全高
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const content = PANEL_CHROME + list.scrollHeight;
    setPanelHeight(Math.min(PANEL_MAX_HEIGHT, Math.max(PANEL_MIN_HEIGHT, content)));
  }, [artifacts.length, panelWidth]);

  // 底部渐隐只在「确实还能往下滚」时出现：
  // 条数不多时不加，免得压暗最后一条；滚到底后也撤掉，否则最后一条会一直发灰
  useLayoutEffect(() => {
    const node = listRef.current;
    if (!node) {
      return undefined;
    }
    const check = () => {
      const scrollable = node.scrollHeight > node.clientHeight + 1;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      setShowBottomFade(scrollable && !atBottom);
    };
    check();
    node.addEventListener('scroll', check);
    const observer = new ResizeObserver(check);
    observer.observe(node);
    return () => {
      node.removeEventListener('scroll', check);
      observer.disconnect();
    };
  }, [artifacts.length, expanded]);

  // 每次展开都从头看，沿用上次滚到的位置会让人以为列表是空的
  useEffect(() => {
    if (expanded && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [expanded]);

  // 入口文案里的数字跟着产物条数走，避免条数变了文案对不上
  const entryTitle = `输出 · ${artifacts.length}`;

  const collapse = useCallback(() => setExpanded(false), []);
  const toggle = useCallback(() => setExpanded((open) => !open), []);

  useEffect(() => {
    if (!expanded) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        collapse();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded, collapse]);

  const vars = {
    '--artifact-panel-width': `${panelWidth}px`,
    '--artifact-panel-height': `${panelHeight}px`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.slot} ${expanded ? styles.slotExpanded : ''} ${hidden ? styles.slotHidden : ''}`}
      ref={slotRef}
      style={vars}
    >
      <div
        className={`${styles.card} ${expanded ? styles.cardExpanded : ''}`}
        // 收起态整块都能点开；展开后交给标题行与列表项，避免误触
        onClick={expanded ? undefined : toggle}
        role={expanded ? undefined : 'button'}
        tabIndex={expanded ? undefined : 0}
        aria-label={expanded ? undefined : `展开${entryTitle}`}
        aria-expanded={expanded}
        onKeyDown={(event) => {
          if (!expanded && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggle();
          }
        }}
      >
        <div className={styles.header}>
          <Pressable
            className={styles.summary}
            onClick={toggle}
            stopPropagation
            ariaExpanded={expanded}
            ariaLabel={expanded ? `收起${entryTitle}` : `展开${entryTitle}`}
          >
            <IconArtifactFolder />
            <span className={styles.titleText}>{entryTitle}</span>
          </Pressable>
          <Pressable
            className={styles.fold}
            onClick={collapse}
            stopPropagation
            disabled={!expanded}
            title="收起"
            ariaLabel={`收起${entryTitle}`}
          >
            <IconArtifactFold />
          </Pressable>
        </div>

        <div
          className={`${styles.list} ${showBottomFade ? styles.listOverflowing : ''} wm-scroll-hidden`}
          ref={listRef}
          aria-hidden={!expanded}
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
        </div>
      </div>
    </div>
  );
};
