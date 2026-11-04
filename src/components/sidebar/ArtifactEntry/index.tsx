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

/**
 * 「输出 · N」产物入口（收起 Figma 320:7815，展开 Figma 320:8185）
 * - 收起：底栏右侧 36 高胶囊（文件夹图标 + 输出 · N，N 是产物条数、随条数变化），与左侧记笔记状态条同一行；
 * - 点击展开成全宽的面板，列出元宝本轮产出的文件，向上浮在消息流之上，不挤压输入框；
 * - 面板高度跟着产物条数走、最高 400（Figma 320:8185）：条数少时卡片收短，超过 400 时列表滚动，
 *   并在底部渐隐，表示下面还有内容；
 * - 面板内的折叠图标或 Esc 收起。
 * 面板与记笔记面板共用底栏同一条基线，两者不会同时出现：任一面板展开时都会盖住对方。
 */
export const ArtifactEntry: FC<ArtifactEntryProps> = ({ artifacts, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const [panelHeight, setPanelHeight] = useState(0);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 面板高度随内容变化，量出来给外层的渐隐层用，渐隐才不会比面板高一截
  useLayoutEffect(() => {
    const node = panelRef.current;
    if (!node) {
      return undefined;
    }
    const measure = () => setPanelHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [artifacts.length]);

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
  }, [artifacts.length]);

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
    '--artifact-panel-height': `${panelHeight}px`,
  } as CSSProperties;

  return (
    <div className={`${styles.slot} ${expanded ? styles.slotExpanded : ''}`} style={vars}>
      <div
        className={`${styles.panel} ${expanded ? styles.panelExpanded : ''}`}
        ref={panelRef}
        aria-hidden={!expanded}
      >
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <IconArtifactFolder />
            <span className={styles.panelTitleText}>{entryTitle}</span>
          </span>
          <Pressable
            className={styles.fold}
            onClick={collapse}
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

      <Pressable
        className={styles.trigger}
        onClick={toggle}
        ariaExpanded={expanded}
        title={entryTitle}
        ariaLabel={entryTitle}
      >
        <IconArtifactFolder />
        <span className={styles.triggerText}>{entryTitle}</span>
      </Pressable>
    </div>
  );
};
