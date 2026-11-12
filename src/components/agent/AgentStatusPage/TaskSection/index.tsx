import type { FC } from 'react';
import IconStatusSpinner from '@/assets/d2c/icons/agent-status/icon-status-spinner';
import IconStatusStop from '@/assets/d2c/icons/agent-status/icon-status-stop';
import { Pressable } from '@/components/common/Pressable';
import type { AgentStatusTask } from '@/data/agentStatusTasks';
import styles from './index.module.scss';

interface TaskSectionProps {
  tasks: AgentStatusTask[];
  /** 停止进行中的任务：移到已完成，只保留一行标题 */
  onStop: (id: string) => void;
}

/**
 * 状态页任务区（Figma 250:1324）
 * 进行中分组右侧转圈，悬停换成停止按钮；已完成只保留一行标题。
 */
export const TaskSection: FC<TaskSectionProps> = ({ tasks, onStop }) => {
  const running = tasks.filter((task) => task.state === 'running');
  const done = tasks.filter((task) => task.state === 'done');

  return (
    <section className={styles.section} aria-label="任务">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>任务</h2>
      </div>
      <div className={styles.taskCard}>
        {running.length > 0 && (
          <>
            <p className={styles.groupTitle}>进行中 · {running.length}</p>
            {running.map((task) => (
              <div className={styles.runningRow} key={task.id}>
                <span className={styles.taskTitle}>{task.title}</span>
                <Pressable
                  className={styles.stopSlot}
                  onClick={() => onStop(task.id)}
                  ariaLabel={`停止${task.title}`}
                  title="停止任务"
                >
                  <IconStatusSpinner className={styles.spinner} width={16} height={16} />
                  <IconStatusStop className={styles.stopIcon} />
                </Pressable>
              </div>
            ))}
          </>
        )}
        {running.length > 0 && done.length > 0 && <div className={styles.divider} />}
        {done.length > 0 && (
          <>
            <p className={styles.groupTitle}>已完成</p>
            {done.map((task) => (
              <div className={styles.doneRow} key={task.id}>
                {task.title}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};
