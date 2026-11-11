import { useEffect, useRef, type FC } from 'react';
import IconTaskChevron from '@/assets/d2c/icons/agent/icon-task-chevron';
import IconTaskDone from '@/assets/d2c/icons/agent/icon-task-done';
import IconTaskQueued from '@/assets/d2c/icons/agent/icon-task-queued';
import IconTaskRunning from '@/assets/d2c/icons/agent/icon-task-running';
import IconTaskbarCollapse from '@/assets/d2c/icons/agent/icon-taskbar-collapse';
import IconTaskbarStatus from '@/assets/d2c/icons/agent/icon-taskbar-status';
import { Pressable } from '@/components/common/Pressable';
import { isActiveTask, type AgentTask } from '@/data/agentTasks';
import styles from './index.module.scss';

interface TaskTrayProps {
  tasks: AgentTask[];
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板（文件夹）展开时让位 */
  hidden?: boolean;
  /** 点某一行：长程任务进详情，其余的交给外面决定（演示里给 Toast） */
  onOpenTask: (task: AgentTask) => void;
}

/** 列表行右侧：进行中显示百分比（绿）、排队中灰字、待确认 / 已完成带箭头 */
function renderRowStatus(task: AgentTask) {
  switch (task.status) {
    case 'running':
      return <span className={`${styles.rowStatus} ${styles.rowStatusSuccess}`}>{task.progress ?? 0}%</span>;
    case 'queued':
      return <span className={`${styles.rowStatus} ${styles.rowStatusMuted}`}>排队中</span>;
    case 'stopped':
      return <span className={`${styles.rowStatus} ${styles.rowStatusMuted}`}>已停止</span>;
    case 'confirm':
      return (
        <span className={styles.rowAction}>
          <span className={`${styles.rowStatus} ${styles.rowStatusSuccess}`}>去确认</span>
          <IconTaskChevron />
        </span>
      );
    default:
      return (
        <span className={styles.rowAction}>
          <span className={styles.rowStatus}>查看产物</span>
          <IconTaskChevron />
        </span>
      );
  }
}

/** 列表行左侧图标：进行中转圈、排队 / 待确认 / 已停止是时钟、已完成是绿勾 */
function renderRowIcon(task: AgentTask) {
  if (task.status === 'running') {
    return <IconTaskRunning className={styles.spin} />;
  }
  if (task.status === 'done') {
    return <IconTaskDone />;
  }
  return <IconTaskQueued />;
}

/**
 * 输入框上方的任务条 + 任务列表（Figma 197:969，标注 1–4）
 * 收起：只显示「N 个任务进行中」（只剩待确认时显示「N 个任务待确认」，全部收尾后显示「N 个任务已完成」），点一下向上展开任务列表；
 * 列表按 进行中 → 排队中 → 已完成 排序，进行中的带进度；点进行中的长程任务进入详情（Figma 197:1432）。
 * 点列表外、按 Esc、点「收起」都能收起。
 */
export const TaskTray: FC<TaskTrayProps> = ({ tasks, expanded, onExpandedChange, hidden = false, onOpenTask }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeCount = tasks.filter(isActiveTask).length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const allSettled = activeCount === 0;
  const runningCount = tasks.filter((task) => task.status === 'running').length;
  const confirmCount = tasks.filter((task) => task.status === 'confirm').length;
  /** 没有在跑的、只剩等用户确认的：任务条改说「待确认」，不再转圈 */
  const waitingOnly = runningCount === 0 && confirmCount > 0;

  useEffect(() => {
    if (!expanded) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        onExpandedChange(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExpandedChange(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded, onExpandedChange]);

  // 按 进行中 / 待确认 → 排队中 → 已完成 / 已停止 排，同组内保持原顺序
  const order: Record<AgentTask['status'], number> = { running: 0, confirm: 0, queued: 1, done: 2, stopped: 3 };
  const sorted = [...tasks].sort((a, b) => order[a.status] - order[b.status]);
  const summary = [activeCount > 0 && `${activeCount} 进行中`, doneCount > 0 && `${doneCount} 已完成`]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={`${styles.root} ${hidden ? styles.rootHidden : ''}`} ref={rootRef}>
      {expanded && (
        <div className={styles.card} role="dialog" aria-label="任务列表">
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span className={styles.cardTitleText}>任务</span>
              <span className={styles.cardSummary}>{summary}</span>
            </div>
            <Pressable className={styles.collapse} onClick={() => onExpandedChange(false)} ariaLabel="收起任务列表">
              收起
            </Pressable>
          </div>
          <div className={styles.list}>
            {sorted.map((task) => (
              <Pressable
                key={task.id}
                className={styles.row}
                onClick={() => onOpenTask(task)}
                ariaLabel={`${task.title}，${task.desc}`}
              >
                <span className={styles.rowLeft}>
                  <span className={styles.rowIcon} aria-hidden="true">
                    {renderRowIcon(task)}
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{task.title}</span>
                    <span className={styles.rowDesc}>{task.desc}</span>
                    {task.status === 'running' && (
                      <span className={styles.progress} aria-hidden="true">
                        <span className={styles.progressFill} style={{ width: `${task.progress ?? 0}%` }} />
                      </span>
                    )}
                  </span>
                </span>
                {renderRowStatus(task)}
              </Pressable>
            ))}
          </div>
        </div>
      )}

      {/* 任务条（Figma 204:290）：36 高、圆角 18，状态图标 16 + 文案 13/18 500 + 展开箭头 14 */}
      <Pressable
        className={styles.bar}
        onClick={() => onExpandedChange(!expanded)}
        ariaExpanded={expanded}
        ariaLabel={expanded ? '收起任务列表' : '展开任务列表'}
      >
        <span className={styles.barIcon} aria-hidden="true">
          {allSettled && <IconTaskDone width={16} height={16} />}
          {waitingOnly && <IconTaskQueued width={16} height={16} />}
          {!allSettled && !waitingOnly && <IconTaskbarStatus className={styles.spin} />}
        </span>
        <span className={styles.barText}>
          {allSettled && `${doneCount} 个任务已完成`}
          {waitingOnly && `${confirmCount} 个任务待确认`}
          {!allSettled && !waitingOnly && `${activeCount} 个任务进行中`}
        </span>
        <span className={`${styles.barChevron} ${expanded ? styles.barChevronOpen : ''}`} aria-hidden="true">
          <IconTaskbarCollapse />
        </span>
      </Pressable>
    </div>
  );
};
