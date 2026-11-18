import type { FC } from 'react';
import styles from './index.module.scss';

interface TaskDotsProps {
  /** 有任务在跑时点阵逐格亮起循环；没有任务时停在全灰 */
  running: boolean;
}

/** 3×3 共 9 格，按阅读顺序编号 */
const CELLS = Array.from({ length: 9 }, (_, index) => index);

/**
 * 进行中任务的点阵（Figma 533:13569，16×16，九个 3.5 的圆角方块、间距 1）
 *
 * 动画：九格按阅读顺序一格格由浅（#E6E8EB）变深（#B0B6C3），像进度在往前推；
 * 九格全亮后停一下，再一起淡回浅色，循环。设计稿静帧正好是「第一行亮、第二行第一格正在亮」的那一刻。
 * 系统开启「减少动态效果」时直接显示这一静帧。
 */
export const TaskDots: FC<TaskDotsProps> = ({ running }) => (
  <span className={`${styles.dots} ${running ? styles.running : ''}`} aria-hidden="true">
    {CELLS.map((index) => (
      <span key={index} className={`${styles.cell} ${styles[`cell${index}`]}`} />
    ))}
  </span>
);
