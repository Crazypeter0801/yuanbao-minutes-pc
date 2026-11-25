import type { FC } from 'react';
import IconYuanbaoWorking from '@/assets/d2c/icons/yuanbao811/icon-yuanbao-working';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { TaskDots } from '@/components/sidebar/TaskDots';
import type { AgentTask } from '@/data/agentTasks';
import styles from './index.module.scss';

export type CommandBarVariant = 'capsules' | 'agent-status';

interface TaskEntryProps {
  tasks: AgentTask[];
  /** 进行中的任务数，显示在收起态的胶囊或展开态标题里 */
  runningCount: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位 */
  hidden?: boolean;
  /** 点一条任务：打开任务详情 */
  onOpenTask: (task: AgentTask) => void;
  /** 打开元宝 Agent 详情页 */
  onOpenAgentDetail?: () => void;
  /** 上方工具栏形态：capsules 为胶囊版（Figma 489:10632），agent-status 为新版元宝状态栏（Figma 811:38164） */
  variant?: CommandBarVariant;
  /** 元宝是否正在生成回复（状态栏形态下切换提示文案） */
  isThinking?: boolean;
}

/**
 * 进行中任务入口：
 * - capsules：点阵图标 + 「进行中任务」+ 数字胶囊（Figma 489:10632）
 * - agent-status：32×32 元宝工作形象 + 10px 间距 + 扫光「正在整理发言内容」（Figma 811:38164 / 811:38683）
 * 两种形态点击均展开完整的长程任务列表，可进入任务详情或元宝 Agent 详情页。
 */
export const TaskEntry: FC<TaskEntryProps> = ({
  tasks,
  runningCount,
  expanded,
  onExpandedChange,
  hidden,
  onOpenTask,
  onOpenAgentDetail,
  variant = 'capsules',
  isThinking = false,
}) => {
  const isAgentStatus = variant === 'agent-status';
  const capsuleSummary = (
    <>
      <TaskDots running={runningCount > 0} />
      <span className={styles.label}>进行中任务</span>
      <span className={styles.count}>{runningCount}</span>
    </>
  );

  const statusText = isThinking ? '正在思考回复...' : '正在整理发言内容';

  return (
    <MorphPanel
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      hidden={hidden}
      triggerVariant={isAgentStatus ? 'ghost' : 'card'}
      summary={
        isAgentStatus ? (
          <span className={styles.agentStatus}>
            <span className={styles.agentMascot} aria-hidden="true">
              <IconYuanbaoWorking width={32} height={32} />
            </span>
            <span className={styles.agentText}>{statusText}</span>
          </span>
        ) : (
          capsuleSummary
        )
      }
      expandedSummary={isAgentStatus ? capsuleSummary : undefined}
      expandedLabel="个任务"
      collapsedPaddingX={isAgentStatus ? 0 : 12}
      panelWidth="full"
      name="进行中的任务"
      contentKey={`${tasks.length}-${runningCount}`}
      layoutKey={`${variant}-${statusText}`}
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
        {onOpenAgentDetail && (
          <Pressable
            className={styles.detailLink}
            onClick={() => {
              onExpandedChange(false);
              onOpenAgentDetail();
            }}
            ariaLabel="查看元宝 Agent 详情"
          >
            <span>查看元宝 Agent 详情</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M4.4 2.8 7.6 6 4.4 9.2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Pressable>
        )}
      </div>
    </MorphPanel>
  );
};
