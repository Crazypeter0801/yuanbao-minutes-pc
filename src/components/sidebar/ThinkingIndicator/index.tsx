import type { FC } from 'react';
import { useSquircle } from '@/hooks/useSquircle';
import styles from './index.module.scss';

interface ThinkingIndicatorProps {
  /** plain：无气泡底（方案 C） */
  plain?: boolean;
}

/** 元宝思考中：三个跳动的点（对称圆角矩形 + Apple 60% 连续曲率） */
export const ThinkingIndicator: FC<ThinkingIndicatorProps> = ({ plain = false }) => {
  const ref = useSquircle<HTMLDivElement>(14, !plain);
  return (
    <div ref={ref} className={`${styles.wrap} ${plain ? styles.plain : ''}`} role="status" aria-label="元宝正在思考">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
};
