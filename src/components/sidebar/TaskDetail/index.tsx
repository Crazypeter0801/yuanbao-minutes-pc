import type { FC } from 'react';
import IconMeetChevronDown from '@/assets/d2c/icons/v1/icon-meet-chevron-down';
import { Pressable } from '@/components/common/Pressable';
import type { AgentTask } from '@/data/agentTasks';
import styles from './index.module.scss';

interface TaskDetailProps {
  task: AgentTask;
  /** 返回对话 */
  onBack: () => void;
}

/**
 * 任务详情（从「进行中」面板点进来）
 * 侧栏里的一层独立页面：顶栏返回、任务名与状态、步骤时间线、产出文件。
 * 进行中的步骤用绿色高亮，未开始的步骤灰掉。
 */
export const TaskDetail: FC<TaskDetailProps> = ({ task, onBack }) => (
  <section className={styles.overlay} aria-label="任务详情">
    <header className={styles.header}>
      <Pressable className={styles.back} onClick={onBack} ariaLabel="返回对话" title="返回">
        <span className={styles.backIcon}>
          <IconMeetChevronDown />
        </span>
      </Pressable>
      <span className={styles.headerTitle}>任务详情</span>
    </header>

    <div className={`${styles.body} wm-scroll-hidden`}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{task.title}</h2>
        <span className={task.state === 'running' ? styles.badgeRunning : styles.badgeDone}>
          {task.state === 'running' ? '进行中' : '已完成'}
        </span>
      </div>
      <p className={styles.summary}>{task.summary}</p>

      <h3 className={styles.sectionTitle}>进度</h3>
      <ol className={styles.steps}>
        {task.steps.map((step) => (
          <li className={`${styles.step} ${styles[step.state]}`} key={step.label}>
            <span className={styles.stepDot} aria-hidden="true" />
            <div className={styles.stepBody}>
              <span className={styles.stepLabel}>{step.label}</span>
              {step.time ? <span className={styles.stepTime}>{step.time}</span> : null}
            </div>
          </li>
        ))}
      </ol>

      <h3 className={styles.sectionTitle}>产出</h3>
      <ul className={styles.outputs}>
        {task.outputs.map((output) => (
          <li className={styles.output} key={output.name}>
            <span className={styles.outputName}>{output.name}</span>
            <span className={styles.outputKind}>{output.kind}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
