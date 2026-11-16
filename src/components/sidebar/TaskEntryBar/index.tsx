import type { FC } from 'react';
import type { AgentTask } from '@/data/agentTasks';
import styles from './index.module.scss';

/** 画板任务胶囊：进行中转圈，完成打勾；挂在输入框上方（方案 A 保留） */
export const BoardProgressPill: FC<{ task: AgentTask }> = ({ task }) => {
  const running = task.status === 'running';
  return (
    <div className={styles.pill} role="status" aria-label={task.title}>
      <span className={running ? styles.spinner : styles.doneMark} aria-hidden="true" />
      <span className={styles.label}>{task.title}</span>
    </div>
  );
};
