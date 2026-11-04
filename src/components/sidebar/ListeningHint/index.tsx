import type { FC } from 'react';
import IconSideStar from '@/assets/d2c/icons/schemes/icon-side-star';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface ListeningHintProps {
  isListening: boolean;
  /** 立即总结 */
  onSummarize: () => void;
  /** 暂停态下点击「继续记录」 */
  onResume: () => void;
}

/** 「我正在听，2分钟后生成总结... 立即总结」（Figma 248:14143） */
export const ListeningHint: FC<ListeningHintProps> = ({ isListening, onSummarize, onResume }) => (
  <div className={styles.row}>
    <span className={`${styles.star} ${isListening ? styles.starActive : ''}`}>
      <IconSideStar />
    </span>
    <span className={styles.text}>
      {isListening ? '我正在听，2分钟后生成总结...' : '已暂停记录'}
    </span>
    <Pressable className={styles.action} onClick={isListening ? onSummarize : onResume}>
      {isListening ? '立即总结' : '继续记录'}
    </Pressable>
  </div>
);
