import type { FC } from 'react';
import type { UserMessage } from '@/types/chat';
import styles from './index.module.scss';

interface UserMessageViewProps {
  message: UserMessage;
  /**
   * - round：品牌蓝浅底，右上直角（方案 A，与元宝灰泡左上直角呼应）
   * - compact：同色系，圆角 8（方案 B）
   * - plain：中性灰底大圆角（方案 C，参考 Granola）
   */
  shape: 'round' | 'compact' | 'plain';
}

/** 用户提问气泡（右对齐，设计稿未给，按元宝气泡的镜像补齐） */
export const UserMessageView: FC<UserMessageViewProps> = ({ message, shape }) => (
  <div className={styles.row}>
    <p className={`${styles.bubble} ${styles[shape]}`}>{message.text}</p>
  </div>
);
