import type { FC } from 'react';
import IconStatusSpinner from '@/assets/d2c/icons/agent-status/icon-status-spinner';
import IconStatusStop from '@/assets/d2c/icons/agent-status/icon-status-stop';
import IconStatusTaskConfirm from '@/assets/d2c/icons/agent-status/icon-status-task-confirm';
import IconStatusTaskDone from '@/assets/d2c/icons/agent-status/icon-status-task-done';
import IconStatusTaskRunning from '@/assets/d2c/icons/agent-status/icon-status-task-running';
import { Pressable } from '@/components/common/Pressable';
import type { AgentStatusTask } from '@/data/agentStatusTasks';
import styles from './index.module.scss';

interface TaskSectionProps {
  /** 方案一 / 方案二分别使用不同的任务结构 */
  variant: 'tabs' | 'flow';
  tasks: AgentStatusTask[];
  /** 停止进行中的任务：方案一移到已完成，方案二折叠为一行标题 */
  onStop: (id: string) => void;
}

/**
 * 状态页任务区
 * - tabs（方案一）：进行中分组右侧转圈，悬停换成停止按钮；已完成只保留一行标题；
 * - flow（方案二）：按 Figma 最近任务行渲染，进行中的任务同样支持悬停停止。
 */
export const TaskSection: FC<TaskSectionProps> = ({ variant, tasks, onStop }) => {
  if (variant === 'flow') {
    return (
      <section className={styles.section} aria-label="最近任务">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>最近任务</h2>
          <span className={styles.sectionAction}>全部 ›</span>
        </div>
        <div className={styles.flowList}>
          {tasks.map((task) => {
            if (task.stopped) {
              return (
                <div className={styles.flowCollapsed} key={task.id}>
                  <IconStatusTaskDone />
                  <span className={styles.flowCollapsedTitle}>{task.title}</span>
                </div>
              );
            }
            return (
              <div className={styles.flowRow} key={task.id}>
                {task.state === 'confirm' ? (
                  <IconStatusTaskConfirm />
                ) : task.state === 'done' ? (
                  <IconStatusTaskDone />
                ) : (
                  <IconStatusTaskRunning />
                )}
                <div className={styles.flowText}>
                  <span className={styles.flowTitle}>{task.title}</span>
                  {task.meta && <span className={styles.flowMeta}>{task.meta}</span>}
                </div>
                {task.state === 'running' ? (
                  <Pressable
                    className={styles.stopSlot}
                    onClick={() => onStop(task.id)}
                    ariaLabel={`停止${task.title}`}
                    title="停止任务"
                  >
                    <IconStatusSpinner className={styles.spinner} />
                    <IconStatusStop className={styles.stopIcon} />
                  </Pressable>
                ) : task.state === 'confirm' ? (
                  <span className={styles.confirmPill}>{task.action}</span>
                ) : (
                  <span className={styles.flowTrailing}>{task.trailing}</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

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
                  <IconStatusSpinner className={styles.spinner} />
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
