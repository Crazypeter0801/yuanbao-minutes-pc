import { useEffect, useState, type FC } from 'react';
import IconNoteChevron from '@/assets/d2c/icons/note/icon-note-chevron';
import IconNoteFile from '@/assets/d2c/icons/note/icon-note-file';
import { Pressable } from '@/components/common/Pressable';
import { recognizingIdle, recognizingSteps } from '@/data/meetingTopics';
import styles from './index.module.scss';

/** 每个阶段停留 4 秒，与光带一轮的时长一致：每扫过一次换一句 */
const STEP_MS = 4000;

interface RecordingCardProps {
  /** 卡片标题，默认「元宝笔记」 */
  title?: string;
  /** 当前正在聊的话题；没有时显示识别中的过渡态 */
  topic?: string;
  /** 点击整张卡片打开云笔记 */
  onOpen?: () => void;
}

/**
 * 「正在帮你记」卡片（Figma 元宝Agent 入会 46:7827 / 46:7838）
 *
 * 灰条里的状态按时间推进，全程同一尺寸，卡片不跳动：
 * ① 前 4 秒：设计稿的空骨架闪光；
 * ② 之后每 4 秒换一句阶段文案（识别说话人 → 理解主题 → 整理要点），光带从文字上扫过；
 * ③ 走完一遍停在「识别到话题后会自动更新」，不再换字，光带继续扫；
 * ④ 有了话题：停掉闪光，显示「当前正在聊 · 话题」，换话题时淡入替换。
 * 中途入会时如果已经有话题，直接从 ④ 开始。
 */
export const RecordingCard: FC<RecordingCardProps> = ({ title = '元宝笔记', topic, onOpen }) => {
  // 0 = 空骨架；1..n = 第 n 句阶段文案；n+1 = 停住的说明
  const [step, setStep] = useState(0);
  const lastStep = recognizingSteps.length + 1;

  useEffect(() => {
    if (topic || step >= lastStep) {
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [topic, step, lastStep]);

  const hint = step === 0 ? '' : step < lastStep ? recognizingSteps[step - 1] : recognizingIdle;

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
        {topic ? (
          <span className={styles.topicBar}>
            <span className={styles.topicLabel}>当前正在聊</span>
            {/* key 跟着话题变：换话题时重新挂载，播一次淡入 */}
            <span className={styles.topic} key={topic} title={topic}>
              {topic}
            </span>
          </span>
        ) : (
          <span className={styles.shimmer}>
            {hint && (
              <span className={styles.hint} key={hint} role="status">
                {hint}
              </span>
            )}
          </span>
        )}
      </span>
    </Pressable>
  );
};
