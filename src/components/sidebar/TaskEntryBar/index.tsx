import type { FC } from 'react';
import IconTaskEntryIconFilePlus from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-file-plus';
import IconTaskEntryIconPen from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-pen';
import { Pressable } from '@/components/common/Pressable';
import { CommandEntry } from '@/components/sidebar/CommandEntry';
import type { TaskEntryTab, TaskEntryTask } from '@/data/taskEntry';
import styles from './index.module.scss';

interface TaskEntryBarProps {
  /** 输入框上方的任务胶囊（Figma 215:22016 / 268:25268） */
  tasks: TaskEntryTask[];
  /** 点任务胶囊：进入状态页对应 Tab（笔记 / 待办都进概览） */
  onOpen: (tab: TaskEntryTab) => void;
  /** 点快捷指令：走现有提问链路 */
  onCommand: (text: string) => void;
}

const TASK_ICONS = {
  pen: IconTaskEntryIconPen,
  'file-plus': IconTaskEntryIconFilePlus,
} as const;

/**
 * 输入框上方的任务入口（方案 B，Figma 215:22015）
 * 从左到右：书本胶囊（点开长成快捷指令面板）、元宝笔记 +16、会议待办 +5。
 * 三枚都是高 32、圆角 16 的毛玻璃胶囊，间距 4。
 */
export const TaskEntryBar: FC<TaskEntryBarProps> = ({ tasks, onOpen, onCommand }) => (
  <div className={styles.row}>
    <CommandEntry onCommand={onCommand} />

    {tasks.map((task) => {
      const Icon = TASK_ICONS[task.icon];
      const spoken = task.count ? `${task.label} ${task.count}` : task.label;
      return (
        <Pressable
          key={task.key}
          className={styles.pill}
          onClick={() => onOpen(task.tab)}
          title={spoken}
          ariaLabel={spoken}
        >
          <span className={styles.icon} aria-hidden="true">
            <Icon />
          </span>
          <span className={styles.label}>{task.label}</span>
          {task.count && <span className={styles.count}>{task.count}</span>}
        </Pressable>
      );
    })}
  </div>
);
