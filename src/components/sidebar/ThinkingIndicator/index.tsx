import type { FC } from 'react';
import styles from './index.module.scss';

interface ThinkingIndicatorProps {
  /** plain：无气泡底（方案 C） */
  plain?: boolean;
}

/** 元宝思考中：三个跳动的点 */
export const ThinkingIndicator: FC<ThinkingIndicatorProps> = ({ plain = false }) => (
  <div className={`${styles.wrap} ${plain ? styles.plain : ''}`} role="status" aria-label="元宝正在思考">
    <span className={styles.dot} />
    <span className={styles.dot} />
    <span className={styles.dot} />
  </div>
);
