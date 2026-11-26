import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import IconNoteChevron from '@/assets/d2c/icons/v2/icon-side3-note-chevron';
import IconNoteFile from '@/assets/d2c/icons/v2/icon-side3-note-file';
import iconNote898 from '@/assets/d2c/icons/yuanbao811/icon-note-898.svg';
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
  /** 次级信息条目（保留兼容） */
  metaItems?: string[];
  /** 会议摘要（保留兼容） */
  summary?: string;
  /** 已识别出的话题，按时间顺序，最后一条是当前正在聊的；为空时显示识别中的过渡态 */
  topics?: string[];
  /** compact：Figma 898:33358 / 898:34050 新版元宝笔记卡片（260×185 预览骨架 + 底部图标标题栏） */
  compact?: boolean;
  /** 点击整张卡片打开云笔记 */
  onOpen?: () => void;
}

/**
 * 元宝笔记卡片：
 * - compact（Figma 898:33358 / 898:34050）：260×185 白底 1px #EBEDF2 描边、圆角 16；
 *   顶部 236×133 圆角 10 预览区（「总结生成中...」+ 三条流光骨架条），底部 20×20 蓝色图标 + 标题（14/20 #000）。
 * - 非 compact：保留「正在帮你记」实时话题过渡卡。
 */
export const RecordingCard: FC<RecordingCardProps> = ({
  title,
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
    const noteTitle = title ?? `元宝笔记：${meetingSession.topic}`;

    return (
      <Pressable
        className={`${styles.card} ${styles.cardNote898}`}
        onClick={onOpen}
        ariaLabel={`打开${noteTitle}`}
      >
        <span className={styles.note898Content}>
          <span className={styles.note898Preview}>
            <span className={styles.note898Status}>总结生成中...</span>
            <span className={styles.note898Skeletons} aria-hidden="true">
              <span className={`${styles.note898Bar} ${styles.note898Bar1}`} />
              <span className={`${styles.note898Bar} ${styles.note898Bar2}`} />
              <span className={`${styles.note898Bar} ${styles.note898Bar3}`} />
            </span>
          </span>
        </span>

        <span className={styles.note898Footer}>
          <span className={styles.note898IconBox} aria-hidden="true">
            <img
              className={styles.note898Icon}
              src={iconNote898}
              alt=""
              width={14}
              height={9.5}
              draggable={false}
            />
          </span>
          <span className={styles.note898Title} title={noteTitle}>
            {noteTitle}
          </span>
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
            <span className={styles.hint} key={hint} role="status">
              {hint}
            </span>
          </span>
        )}
      </span>
    </Pressable>
  );
};
