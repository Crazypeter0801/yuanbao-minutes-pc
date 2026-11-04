import type { FC } from 'react';
import IconMeetChevronDown from '@/assets/d2c/icons/schemes/icon-meet-chevron-down';
import IconSideStar from '@/assets/d2c/icons/schemes/icon-side-star';
import { Pressable } from '@/components/common/Pressable';
import type { MeetingMinutes } from '@/types/chat';
import styles from './index.module.scss';

interface MinutesPeekProps {
  minutes: MeetingMinutes;
  isListening: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleListening: () => void;
}

/**
 * 方案 C 顶部纪要预览条
 * 平时只占两行：一句话进展 + 结论 / 待办计数；点开后由 MinutesSheet 展开全文。
 * 状态胶囊可直接暂停 / 继续记录，不必打开纪要。
 */
export const MinutesPeek: FC<MinutesPeekProps> = ({
  minutes,
  isListening,
  expanded,
  onToggleExpand,
  onToggleListening,
}) => {
  const doneCount = minutes.todos.filter((todo) => todo.done).length;

  return (
    <Pressable
      className={`${styles.peek} ${expanded ? styles.peekExpanded : ''}`}
      onClick={onToggleExpand}
      ariaLabel={expanded ? '收起元宝纪要' : '展开元宝纪要'}
    >
      <div className={styles.head}>
        <span className={styles.star}>
          <IconSideStar />
        </span>
        <span className={styles.title}>元宝纪要</span>
        <Pressable
          as="span"
          stopPropagation
          className={`${styles.status} ${isListening ? styles.statusLive : ''}`}
          onClick={onToggleListening}
          title={isListening ? '点击暂停记录' : '点击继续记录'}
          ariaLabel={isListening ? '暂停记录' : '继续记录'}
        >
          <span className={styles.statusDot} />
          {isListening ? '记录中' : '已暂停'}
        </Pressable>
        <span className={styles.expand}>
          {expanded ? '收起' : '展开'}
          <span className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}>
            <IconMeetChevronDown />
          </span>
        </span>
      </div>

      {!expanded && (
        <>
          <p className={styles.summary}>{minutes.overview}</p>
          <p className={styles.meta}>
            {minutes.conclusions.length} 条结论 · 待办 {doneCount}/{minutes.todos.length} · 刚刚更新
          </p>
        </>
      )}
    </Pressable>
  );
};
