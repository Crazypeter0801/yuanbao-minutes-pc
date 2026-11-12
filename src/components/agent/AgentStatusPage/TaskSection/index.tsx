import type { FC } from 'react';
import iconChevron from '@/assets/detail/icon-chevron.svg';
import iconSpinner from '@/assets/detail/icon-spinner.svg';
import iconTask from '@/assets/detail/icon-task.svg';
import { Pressable } from '@/components/common/Pressable';
import type { AgentStatusTask } from '@/data/agentStatusTasks';
import styles from './index.module.scss';

interface TaskSectionProps {
  tasks: AgentStatusTask[];
  onCreateAuto: () => void;
}

/**
 * 详情页任务区（Figma 289:30737）
 * 进行中左侧圆环、已完成只有标题，行尾都是 chevron。下面另有「自动任务」。
 */
export const TaskSection: FC<TaskSectionProps> = ({ tasks, onCreateAuto }) => {
  const running = tasks.filter((task) => task.state === 'running');
  const done = tasks.filter((task) => task.state === 'done');

  return (
    <>
      <section className={styles.section} aria-label="任务">
        <h2 className={styles.sectionTitle}>任务</h2>
        <div className={styles.taskCard}>
          {running.length > 0 && <p className={styles.groupTitle}>进行中 · {running.length}</p>}
          {running.map((task) => (
            <div className={styles.row} key={task.id}>
              <span className={styles.spinner} aria-hidden="true">
                <img src={iconSpinner} width={16} height={16} alt="" />
              </span>
              <span className={styles.taskTitle}>{task.title}</span>
              <img className={styles.chevron} src={iconChevron} width={16} height={16} alt="" />
            </div>
          ))}
          <div className={styles.divider} role="separator" />
          <p className={styles.groupTitle}>已完成</p>
          {done.map((task) => (
            <div className={styles.row} key={task.id}>
              <span className={styles.taskTitle}>{task.title}</span>
              <img className={styles.chevron} src={iconChevron} width={16} height={16} alt="" />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-label="自动任务">
        <h2 className={styles.sectionTitle}>自动任务</h2>
        <div className={styles.taskCard}>
          <Pressable className={styles.row} onClick={onCreateAuto} ariaLabel="创建自动任务">
            <span className={styles.taskIcon} aria-hidden="true">
              <img src={iconTask} width={16} height={16} alt="" />
            </span>
            <span className={styles.taskTitle}>创建自动任务</span>
            <img className={styles.chevron} src={iconChevron} width={16} height={16} alt="" />
          </Pressable>
        </div>
      </section>
    </>
  );
};
