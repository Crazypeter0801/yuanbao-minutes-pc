import type { FC } from 'react';
import { useSquircle } from '@/hooks/useSquircle';
import type { UserMessage } from '@/types/chat';
import styles from './index.module.scss';

interface UserMessageViewProps {
  message: UserMessage;
  shape: 'round' | 'compact' | 'plain';
}

/** 用户提问气泡（右对齐，四角对称圆角矩形 + Apple 60% 平滑曲率） */
export const UserMessageView: FC<UserMessageViewProps> = ({ message, shape }) => {
  const bubbleRef = useSquircle<HTMLParagraphElement>(shape === 'compact' ? 12 : 16);
  return (
    <div className={styles.row}>
      <p ref={bubbleRef} className={`${styles.bubble} ${styles[shape]}`}>
        {message.text}
      </p>
    </div>
  );
};
