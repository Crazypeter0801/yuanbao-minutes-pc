import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import IconNoteChevron from '@/assets/d2c/icons/note/icon-note-chevron';
import IconNoteFile from '@/assets/d2c/icons/note/icon-note-file';
import { Pressable } from '@/components/common/Pressable';
import { recognizingIdle, recognizingSteps } from '@/data/meetingTopics';
import styles from './index.module.scss';

/** 每个阶段停留 4 秒，与字上闪光一轮的时长一致：每扫过一次换一句 */
const STEP_MS = 4000;
/** 话题列表最高 76：一行 20、行距 12，正好露出 2.5 条，提示下面还能滚 */
const LIST_MAX_HEIGHT = 76;
/** 列表长高的过渡时长，与样式里的 height transition 一致 */
const LIST_GROW_MS = 260;

interface RecordingCardProps {
  /** 卡片标题，默认「元宝笔记」 */
  title?: string;
  /** 已识别出的话题，按时间顺序，最后一条是当前正在聊的；为空时显示识别中的过渡态 */
  topics?: string[];
  /** 点击整张卡片打开云笔记 */
  onOpen?: () => void;
}

/**
 * 「正在帮你记」卡片（Figma 元宝Agent 入会 46:7827 / 46:7838）
 *
 * 识别中：灰条 36 高，阶段文案每 4 秒换一句，字上一道亮光扫过；走完一遍停在「识别到话题后会自动更新」。
 * 有话题后（Figma 91:15376）：灰底区展开，「当前正在聊」灰字单独一行，下面一行一条短话题；
 * 新话题追加在最下面，当前话题蓝点、之前的灰点，文字都是黑色，左侧一根竖线串起来。
 * 话题区最多露出 2.5 条（话题 14/20、行距 12），再多在列表里上下滚动，新话题出现时自动滚到底。
 */
export const RecordingCard: FC<RecordingCardProps> = ({ title = '元宝笔记', topics = [], onOpen }) => {
  // 0..n-1 = 第几句阶段文案；n = 停住的说明
  const [step, setStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  /** 话题列表的显示高度：新话题出现时从旧高度过渡到新高度，不再瞬间撑开 */
  const [listHeight, setListHeight] = useState<number>();
  const listRef = useRef<HTMLSpanElement>(null);
  const lastStep = recognizingSteps.length;
  const hasTopics = topics.length > 0;

  useEffect(() => {
    if (hasTopics || step >= lastStep) {
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [hasTopics, step, lastStep]);

  /*
   * 新话题出现：
   * - 没到上限：列表高度平滑长高（CSS height 过渡），内容不动；
   * - 到上限：高度不变，列表平滑滚到底，让最新一条露出来。
   * 新条目只做淡入、不做位移，避免「长高 + 上移 + 滚动」三个动作叠在一起产生弹跳。
   */
  useLayoutEffect(() => {
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
    // 正好在这一条撑到上限：先等长高过渡结束再滚，两段动作不叠在一起
    if (growing) {
      const timer = window.setTimeout(scrollToEnd, LIST_GROW_MS);
      return () => window.clearTimeout(timer);
    }
    scrollToEnd();
    return undefined;
  }, [topics.length]);

  const hint = step < lastStep ? recognizingSteps[step] : recognizingIdle;

  return (
    <Pressable className={styles.card} onClick={onOpen} ariaLabel={`打开${title}`}>
      <span className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <IconNoteFile />
        </span>
        <span className={styles.title}>{title}</span>
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
