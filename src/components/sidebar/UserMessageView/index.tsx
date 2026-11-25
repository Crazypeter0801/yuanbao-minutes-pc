import type { FC } from 'react';
import { ArtifactCard } from '@/components/sidebar/ArtifactCard';
import { useSquircle } from '@/hooks/useSquircle';
import type { ArtifactItem } from '@/types/artifact';
import type { UserMessage } from '@/types/chat';
import styles from './index.module.scss';

interface UserMessageViewProps {
  message: UserMessage;
  shape: 'round' | 'compact' | 'plain';
  /** 点击用户附带的文件卡片 */
  onOpenArtifact?: (artifact: ArtifactItem) => void;
}

/** 用户提问气泡（右对齐，四角对称圆角矩形 + Apple 60% 平滑曲率；如附带文件卡片则同按 Figma 811:30015 展示） */
export const UserMessageView: FC<UserMessageViewProps> = ({ message, shape, onOpenArtifact }) => {
  const bubbleRef = useSquircle<HTMLParagraphElement>(shape === 'compact' ? 12 : 16);
  const fileCards = [
    ...(message.artifact ? [message.artifact] : []),
    ...(message.artifacts ?? []),
  ];

  return (
    <div className={styles.row}>
      <div className={styles.stack}>
        {message.text && (
          <p ref={bubbleRef} className={`${styles.bubble} ${styles[shape]}`}>
            {message.text}
          </p>
        )}
        {fileCards.length > 0 && (
          <div className={styles.fileSlot}>
            {fileCards.map((item) => (
              <ArtifactCard key={item.id} artifact={item} onOpen={onOpenArtifact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
