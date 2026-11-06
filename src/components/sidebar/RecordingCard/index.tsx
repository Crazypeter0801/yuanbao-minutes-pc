import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import IconNoteChevron from '@/assets/d2c/icons/note/icon-note-chevron';
import IconNoteFile from '@/assets/d2c/icons/note/icon-note-file';
import { Pressable } from '@/components/common/Pressable';
import { recognizingIdle, recognizingSteps } from '@/data/meetingTopics';
import styles from './index.module.scss';

/** 每个阶段停留 4 秒，与字上闪光一轮的时长一致：每扫过一次换一句 */
const STEP_MS = 4000;

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
 * 有话题后（参考飞书 AI 视图）：灰底区展开，「当前正在聊」单独一行，下面按时间一条条排话题；
 * 新话题换行追加在最下面，最新一条蓝点 + 黑字，旧的灰点 + 灰字，左侧一根竖线串起来。
 * 卡片最高 186（与产物卡片同高），超出后在话题区里上下滚动，新话题出现时自动滚到底。
 */
export const RecordingCard: FC<RecordingCardProps> = ({ title = '元宝笔记', topics = [], onOpen }) => {
  // 0..n-1 = 第几句阶段文案；n = 停住的说明
  const [step, setStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
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

  // 新话题出现：滚到最底，让最新一条完整露出来
  useLayoutEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: topics.length > 1 ? 'smooth' : 'auto' });
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

      <span className={styles.slot}>
        {hasTopics ? (
          <span className={styles.topicPanel}>
            <span className={styles.topicLabel}>当前正在聊</span>
            <span
              className={`${styles.topicList} ${scrolled ? styles.topicListScrolled : ''} wm-scroll-hidden`}
              ref={listRef}
              onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
            >
              {topics.map((topic, index) => {
                const current = index === topics.length - 1;
                return (
                  <span className={`${styles.topicItem} ${current ? styles.topicCurrent : ''}`} key={topic}>
                    <span className={styles.topicDot} aria-hidden="true" />
                    <span className={styles.topicText}>{topic}</span>
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
