import type { FC } from 'react';
import IconStepDone from '@/assets/d2c/icons/agent/icon-step-done';
import IconStepPending from '@/assets/d2c/icons/agent/icon-step-pending';
import IconStepRunning from '@/assets/d2c/icons/agent/icon-step-running';
import IconTaskBack from '@/assets/d2c/icons/agent/icon-task-back';
import IconTaskStop from '@/assets/d2c/icons/agent/icon-task-stop';
import { Pressable } from '@/components/common/Pressable';
import type { AgentTask, AgentTaskStatus, AgentTaskStep } from '@/data/agentTasks';
import styles from './index.module.scss';

interface TaskDetailProps {
  task: AgentTask;
  /** 「返回对话」 */
  onBack: () => void;
  /** 「停止任务」：已完成的步骤保留 */
  onStop: () => void;
  /** 「在会议中预览」：把产物投到左侧会议面板（演示里只给 Toast） */
  onPreview: () => void;
}

/** 右上角状态标签 */
const STATUS_TAG: Record<AgentTaskStatus, { label: string; muted?: boolean }> = {
  running: { label: '生成中' },
  queued: { label: '排队中', muted: true },
  confirm: { label: '待确认' },
  done: { label: '已完成' },
  stopped: { label: '已停止', muted: true },
};

const STEP_ICONS: Record<AgentTaskStep['status'], FC<{ className?: string }>> = {
  done: IconStepDone,
  running: IconStepRunning,
  pending: IconStepPending,
};

/**
 * 长程任务详情（Figma 197:1432 / 205:335）
 * 面包屑（返回对话 + 状态标签）→ 标题与说明 → 总进度 → 执行步骤（已完成 ✓ / 进行中 ◐ / 待开始 ○）→ 停止 / 预览。
 * 占用对话区的位置，底栏的任务条和输入框保持不动，返回对话后任务状态不丢。
 */
export const TaskDetail: FC<TaskDetailProps> = ({ task, onBack, onStop, onPreview }) => {
  const steps = task.steps ?? [];
  const doneSteps = steps.filter((step) => step.status === 'done').length;
  const progress = task.status === 'done' ? 100 : task.progress ?? 0;
  const tag = STATUS_TAG[task.status];
  const stoppable = task.status === 'running' || task.status === 'queued' || task.status === 'confirm';

  return (
    <section className={styles.detail} aria-label={`${task.title}详情`}>
      <div className={styles.breadcrumb}>
        <Pressable className={styles.back} onClick={onBack} ariaLabel="返回对话">
          <IconTaskBack />
          <span>返回对话</span>
        </Pressable>
        <span className={`${styles.tag} ${tag.muted ? styles.tagMuted : ''}`}>{tag.label}</span>
      </div>

      <div className={styles.titleBlock}>
        <h2 className={styles.title}>{task.title}</h2>
        {task.meta && <p className={styles.meta}>{task.meta}</p>}
      </div>

      <div className={styles.progressRow}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} style={{ width: `${progress}%` }} />
        </span>
        <span className={styles.percent}>{progress}%</span>
      </div>

      <div className={styles.steps}>
        <div className={styles.stepsHeader}>
          <span className={styles.stepsTitle}>执行步骤</span>
          <span className={styles.stepsCount}>
            {doneSteps} / {steps.length} 已完成
          </span>
        </div>
        {steps.map((step) => {
          const Icon = STEP_ICONS[step.status];
          return (
            <div className={styles.step} key={step.title}>
              <span className={styles.stepLeft}>
                <span className={styles.stepIcon} aria-hidden="true">
                  <Icon className={step.status === 'running' ? styles.spin : undefined} />
                </span>
                <span className={styles.stepText}>
                  <span
                    className={[
                      styles.stepTitle,
                      step.status === 'running' ? styles.stepTitleRunning : '',
                      step.status === 'pending' ? styles.stepTitlePending : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {step.title}
                  </span>
                  <span className={styles.stepDesc}>{step.desc}</span>
                </span>
              </span>
              <span className={styles.stepTime}>{step.time}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        {stoppable && (
          <Pressable className={styles.stopButton} onClick={onStop} ariaLabel="停止任务">
            <IconTaskStop />
            <span>停止任务</span>
          </Pressable>
        )}
        <Pressable className={styles.previewButton} onClick={onPreview} ariaLabel="在会议中预览">
          在会议中预览
        </Pressable>
      </div>
      <p className={styles.footnote}>
        {stoppable ? '停止后已完成的步骤会保留，可稍后继续。' : '已完成的步骤和产物都保留在这里，可随时回看。'}
      </p>
    </section>
  );
};
