import type { FC } from 'react';
import iconChevron from '@/assets/detail/icon-chevron.svg';
import iconTask from '@/assets/detail/icon-task.svg';
import { Pressable } from '@/components/common/Pressable';
import type { AgentStatusTask } from '@/data/agentStatusTasks';
import styles from './index.module.scss';

interface TaskSectionProps {
  tasks: AgentStatusTask[];
  onCreateAuto: () => void;
}

/** 3×3 圆角方点，沿外圈顺时针亮起，表示这条任务还在跑 */
const RunningDots: FC = () => (
  <span className={styles.dots} aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
    <i />
    <i />
    <i />
    <i />
    <i />
  </span>
);

const TaskItem: FC<{ task: AgentStatusTask }> = ({ task }) => {
  const running = task.state === 'running';
  return (
    <div className={running ? styles.item : styles.itemDone}>
      <div className={styles.titleRow}>
        <span className={running ? styles.ring : styles.filled} aria-hidden="true" />
        <span className={styles.taskTitle}>{task.title}</span>
        <img className={styles.chevron} src={iconChevron} width={16} height={16} alt="" />
      </div>
      {running && (
        <div className={styles.statusRow}>
          <RunningDots />
          <span className={styles.status}>{task.status}</span>
        </div>
      )}
    </div>
  );
};

/**
 * 详情页任务区（Figma 289:30737）
 * 进行中两行：绿空心圈和标题，点阵与标题文字左对齐。箭头跟标题行对齐。
 * 已完成一行：实心灰圈和标题。分组和自动任务卡片保持原样。
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
            <TaskItem key={task.id} task={task} />
          ))}
          <div className={styles.divider} role="separator" />
          <p className={styles.groupTitle}>已完成</p>
          {done.map((task) => (
            <TaskItem key={task.id} task={task} />
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
