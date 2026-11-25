import { useEffect, useState, type FC } from 'react';
import IconTaskDone from '@/assets/d2c/icons/agentDetail811/icon-task-done';
import IconTaskRunning from '@/assets/d2c/icons/agentDetail811/icon-task-running';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { TaskDots } from '@/components/sidebar/TaskDots';
import { getRunningTaskStatus, type AgentTask } from '@/data/agentTasks';
import { isAgentStatusVariant, type CommandBarVariant } from './types';
import { YuanbaoWorkingSprite } from './YuanbaoWorkingSprite';
import styles from './index.module.scss';

export type { CommandBarVariant };

/** 文案纵向翻滚淡入淡出时长（ms），与 SCSS 动效保持一致 */
const ROLL_EXIT_MS = 300;

interface RollingStatusTextProps {
  text: string;
}

/**
 * 动态状态文案：文案变化时旧文案向上轻移淡出、新文案自下向上轻移淡入，
 * 始终保持单行不折行、超长自动省略，并保留扫光微光效果。
 */
const RollingStatusText: FC<RollingStatusTextProps> = ({ text }) => {
  const [state, setState] = useState<{ current: string; previous: string | null; tick: number }>({
    current: text,
    previous: null,
    tick: 0,
  });

  useEffect(() => {
    setState((prev) =>
      prev.current === text
        ? prev
        : {
            current: text,
            previous: prev.current,
            tick: prev.tick + 1,
          },
    );
  }, [text]);

  useEffect(() => {
    if (state.previous === null) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setState((prev) => (prev.previous === null ? prev : { ...prev, previous: null }));
    }, ROLL_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [state.tick, state.previous]);

  return (
    <span className={styles.agentTextViewport} data-status-text={state.current}>
      {state.previous !== null && (
        <span
          key={`exit-${state.tick}`}
          className={`${styles.agentText} ${styles.agentTextExit}`}
          aria-hidden="true"
        >
          {state.previous}
        </span>
      )}
      <span
        key={`enter-${state.tick}`}
        className={`${styles.agentText} ${state.previous !== null ? styles.agentTextEnter : ''}`}
        title={state.current}
      >
        {state.current}
      </span>
    </span>
  );
};

/** 基础三点加载指示器（元宝状态栏 · 基础加载方案）：三颗圆点柔和交替律动，与 14px 文案垂直居中对齐 */
const StatusLoadingDots: FC = () => (
  <span className={styles.loadingDots} data-status-loading-dots="true" aria-hidden="true">
    <span className={styles.loadingDot} />
    <span className={styles.loadingDot} />
    <span className={styles.loadingDot} />
  </span>
);

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
  /**
   * 上方工具栏形态：
   * - agent-status-sprite：元宝工作形象动态雪碧图 + 简短轮播文案
   * - agent-status-dots：基础三点加载动画 + 简短轮播文案
   * - capsules：推荐与任务胶囊（Figma 489:10632）
   */
  variant?: CommandBarVariant;
  /** 元宝是否正在生成回复（状态栏形态下切换提示文案） */
  isThinking?: boolean;
  /** 外部动态传入的当前任务阶段文案（未传时从当前进行中任务数据读取） */
  statusText?: string;
}

/**
 * 进行中任务入口（与 AgentDetail 共用同一份任务数据与状态图标）：
 * 支持元宝工作形象雪碧图、基础三点加载以及胶囊三种上方工具栏方案，
 * 点击均可展开与 AgentDetail 一致的任务列表。
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
  statusText,
}) => {
  const isAgentStatus = isAgentStatusVariant(variant);
  const capsuleSummary = (
    <>
      <TaskDots running={runningCount > 0} />
      <span className={styles.label}>进行中任务</span>
      <span className={styles.count}>{runningCount}</span>
    </>
  );

  const rawStatusText = isThinking
    ? '正在思考'
    : (statusText ?? getRunningTaskStatus(tasks, 0));
  const resolvedStatusText = rawStatusText.replace(/(\.{3}|…)+$/u, '');

  return (
    <MorphPanel
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      hidden={hidden}
      triggerVariant={isAgentStatus ? 'ghost' : 'card'}
      fullWidthCollapsed={isAgentStatus}
      summary={
        isAgentStatus ? (
          <span
            className={`${styles.agentStatus} ${
              variant === 'agent-status-dots' ? styles.agentStatusDots : ''
            }`}
          >
            {variant === 'agent-status-dots' ? <StatusLoadingDots /> : <YuanbaoWorkingSprite />}
            <RollingStatusText text={resolvedStatusText} />
          </span>
        ) : (
          capsuleSummary
        )
      }
      expandedSummary={isAgentStatus ? capsuleSummary : undefined}
      expandedLabel="个任务"
      collapsedPaddingX={isAgentStatus ? 0 : 12}
      panelWidth="full"
      maxHeight={340}
      name="进行中的任务"
      contentKey={`${tasks.length}-${runningCount}`}
      layoutKey={variant}
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
            <span className={styles.taskIcon} aria-hidden="true">
              {task.state === 'running' ? (
                <IconTaskRunning width={28} height={28} />
              ) : (
                <IconTaskDone width={28} height={28} />
              )}
            </span>
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
