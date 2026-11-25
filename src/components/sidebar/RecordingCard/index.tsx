import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import IconNoteChevron from '@/assets/d2c/icons/v2/icon-side3-note-chevron';
import IconNoteFile from '@/assets/d2c/icons/v2/icon-side3-note-file';
import IconYuanbaoNoteDoc from '@/assets/d2c/icons/yuanbao811/icon-yuanbao-note-doc';
import { Pressable } from '@/components/common/Pressable';
import { meetingSession } from '@/data/meetingSession';
import { recognizingIdle, recognizingSteps } from '@/data/meetingTopics';
import styles from './index.module.scss';

/** 每个阶段停留 4 秒，与字上闪光一轮的时长一致：每扫过一次换一句 */
const STEP_MS = 4000;
/** 话题列表最高 76：一行 20、行距 12，正好露出 2.5 条，提示下面还能滚 */
const LIST_MAX_HEIGHT = 76;
/** 列表长高的过渡时长，与样式里的 height transition 一致 */
const LIST_GROW_MS = 260;

interface RecordingCardProps {
  /** 卡片标题（compact 新版默认取当前会议主题，展开态默认「元宝笔记」） */
  title?: string;
  /** 次级信息条目（如 ['PDF', '128KB']，对齐 Figma 811:38610） */
  metaItems?: string[];
  /** 会议摘要（compact 新版单行省略展示，未传 metaItems 时兜底） */
  summary?: string;
  /** 已识别出的话题，按时间顺序，最后一条是当前正在聊的；为空时显示识别中的过渡态 */
  topics?: string[];
  /** compact：Figma 811:38610 新版元宝笔记卡片（260×60 左文档徽标 + 右标题与元信息） */
  compact?: boolean;
  /** 点击整张卡片打开云笔记 */
  onOpen?: () => void;
}

/**
 * 元宝笔记卡片：
 * - compact（Figma 811:38610 / 582:33088）：260×60 白底 1px #EBEDF2 描边、圆角 16；
 *   左 40×40 元宝笔记图标，右标题（14/20 #000）+ 次级元信息/摘要（12/18 #7B818F）。
 * - 非 compact：保留「正在帮你记」实时话题过渡卡。
 */
export const RecordingCard: FC<RecordingCardProps> = ({
  title,
  metaItems,
  summary,
  topics = [],
  compact = false,
  onOpen,
}) => {
  // 0..n-1 = 第几句阶段文案；n = 停住的说明
  const [step, setStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  /** 话题列表的显示高度：新话题出现时从旧高度过渡到新高度，不再瞬间撑开 */
  const [listHeight, setListHeight] = useState<number>();
  const listRef = useRef<HTMLSpanElement>(null);
  const lastStep = recognizingSteps.length;
  const hasTopics = topics.length > 0;

  useEffect(() => {
    if (compact || hasTopics || step >= lastStep) {
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [compact, hasTopics, step, lastStep]);

  /*
   * 新话题出现：
   * - 没到上限：列表高度平滑长高（CSS height 过渡），内容不动；
   * - 到上限：高度不变，列表平滑滚到底，让最新一条露出来。
   * 新条目只做淡入、不做位移，避免「长高 + 上移 + 滚动」三个动作叠在一起产生弹跳。
   */
  useLayoutEffect(() => {
    if (compact) {
      return undefined;
    }
    const node = listRef.current;
    if (!node) {
      return undefined;
    }
    const natural = node.scrollHeight;
    const growing = node.clientHeight < LIST_MAX_HEIGHT;
    setListHeight(Math.min(natural, LIST_MAX_HEIGHT));
    if (natural <= LIST_MAX_HEIGHT) {
      return undefined;
    }
    const scrollToEnd = () => node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
    if (growing) {
      const timer = window.setTimeout(scrollToEnd, LIST_GROW_MS);
      return () => window.clearTimeout(timer);
    }
    scrollToEnd();
    return undefined;
  }, [compact, topics.length]);

  if (compact) {
    const noteTitle = title ?? meetingSession.topic;
    const noteSummary = summary ?? meetingSession.summary;
    const hasMetaItems = Boolean(metaItems && metaItems.length > 0);

    return (
      <Pressable
        className={`${styles.card} ${styles.cardNote811}`}
        onClick={onOpen}
        ariaLabel={`打开元宝笔记：${noteTitle}`}
      >
        <span className={styles.noteIcon} aria-hidden="true">
          <IconYuanbaoNoteDoc width={40} height={40} />
        </span>
        <span className={styles.noteMeta}>
          <span className={styles.noteTitle} title={noteTitle}>
            {noteTitle}
          </span>
          {hasMetaItems ? (
            <span className={styles.noteMetaRow}>
              {metaItems?.map((item, idx) => (
                <span className={styles.noteMetaItem} key={`${item}-${idx}`}>
                  {item}
                </span>
              ))}
            </span>
          ) : (
            <span className={styles.noteSummary} title={noteSummary}>
              {noteSummary}
            </span>
          )}
        </span>
      </Pressable>
    );
  }

  const cardTitle = title ?? '元宝笔记';
  const hint = step < lastStep ? recognizingSteps[step] : recognizingIdle;

  return (
    <Pressable className={styles.card} onClick={onOpen} ariaLabel={`打开${cardTitle}`}>
      <span className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <IconNoteFile />
        </span>
        <span className={styles.title}>{cardTitle}</span>
        <span className={styles.chevron} aria-hidden="true">
          <IconNoteChevron />
        </span>
      </span>

      <span className={`${styles.slot} ${hasTopics ? styles.slotTopics : ''}`}>
        {hasTopics ? (
          <span className={styles.topicPanel}>
            <span className={styles.topicLabel}>当前正在聊</span>
            <span
              className={`${styles.topicList} ${scrolled ? styles.topicListScrolled : ''} wm-scroll-hidden`}
              ref={listRef}
              style={listHeight === undefined ? undefined : { height: listHeight }}
              onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
            >
              {topics.map((topic, index) => {
                const current = index === topics.length - 1;
                return (
                  // 话题池会轮回，同名话题可能出现两次，用序号做 key
                  <span className={`${styles.topicItem} ${current ? styles.topicCurrent : ''}`} key={index}>
                    <span className={styles.topicDot} aria-hidden="true" />
                    <span className={styles.topicText} title={topic}>
                      {topic}
                    </span>
                  </span>
                );
              })}
            </span>
          </span>
        ) : (
          <span className={styles.hintBar}>
            {/* key 跟着文案变：换句时重新挂载，播一次淡入 */}
            <span className={styles.hint} key={hint} role="status">
              {hint}
            </span>
          </span>
        )}
      </span>
    </Pressable>
  );
};
