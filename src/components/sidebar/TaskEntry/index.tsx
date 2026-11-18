import type { FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { TaskDots } from '@/components/sidebar/TaskDots';
import type { AgentTask } from '@/data/agentTasks';
import styles from './index.module.scss';

interface TaskEntryProps {
  tasks: AgentTask[];
  /** 进行中的任务数，显示在收起态的胶囊里 */
  runningCount: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位 */
  hidden?: boolean;
  /** 点一条任务：打开任务详情 */
  onOpenTask: (task: AgentTask) => void;
}

/**
 * 进行中任务入口（Figma 489:10632：点阵图标 533:13569 + 「进行中任务」+ 数字）
 * 展开后列出全部长程任务，点任意一条进任务详情。
 */
export const TaskEntry: FC<TaskEntryProps> = ({
  tasks,
  runningCount,
  expanded,
  onExpandedChange,
  hidden,
  onOpenTask,
}) => (
  <MorphPanel
    expanded={expanded}
    onExpandedChange={onExpandedChange}
    hidden={hidden}
    summary={
      <>
        <TaskDots running={runningCount > 0} />
        <span className={styles.label}>进行中任务</span>
        <span className={styles.count}>{runningCount}</span>
      </>
    }
    expandedLabel="个任务"
    collapsedPaddingX={12}
    panelWidth="full"
    name="进行中的任务"
    contentKey={`${tasks.length}-${runningCount}`}
    alignHeaderToContent
  >
    <div className={styles.list}>
      {tasks.map((task) => (
        <Pressable
          key={task.id}
          className={styles.task}
          onClick={() => {
            onExpandedChange(false);
            onOpenTask(task);
          }}
          ariaLabel={`查看任务：${task.title}`}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.body}>
            <span className={styles.title}>{task.title}</span>
            <span className={styles.summary}>{task.summary}</span>
          </span>
          <span className={task.state === 'running' ? styles.badgeRunning : styles.badgeDone}>
            {task.state === 'running' ? '进行中' : '已完成'}
          </span>
        </Pressable>
      ))}
    </div>
  </MorphPanel>
);
