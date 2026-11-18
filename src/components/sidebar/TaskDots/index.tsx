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
 * 动画沿用 Frame-based Matrix Loader：8 帧、7fps，带拖尾的「蛇」沿外圈顺时针走，中心格不亮；
 * 颜色换成稿里的 off #E6E8EB / on #B0B6C3。帧数据见 scripts/gen-task-dots.py。
 * 系统开启「减少动态效果」时停在稿里的静帧。
 */
export const TaskDots: FC<TaskDotsProps> = ({ running }) => (
  <span className={`${styles.dots} ${running ? styles.running : ''}`} aria-hidden="true">
    {CELLS.map((index) => (
      <span key={index} className={`${styles.cell} ${styles[`cell${index}`]}`} />
    ))}
  </span>
);
