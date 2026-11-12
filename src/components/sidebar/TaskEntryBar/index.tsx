import type { FC } from 'react';
import IconTaskEntryIconFolder from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-folder';
import IconTaskEntryIconList from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-list';
import IconTaskEntryIconPen from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-pen';
import { Pressable } from '@/components/common/Pressable';
import type { TaskEntryTab, TaskEntryTask } from '@/data/taskEntry';
import styles from './index.module.scss';

interface TaskEntryBarProps {
  /** 输入框上方的一排任务胶囊（Figma 215:22019 / 268:25271） */
  tasks: TaskEntryTask[];
  /** 文件夹里显示的文件数（Figma 215:22034） */
  fileCount: number;
  /** 点任务胶囊 / 文件夹：进入状态页对应 Tab */
  onOpen: (tab: TaskEntryTab) => void;
}

/**
 * 输入框上方的任务入口（方案 B，Figma 215:22015）
 * 左边两枚白底胶囊：「元宝笔记中...」「待办捕捉中...」，点击都进状态页「概览」；
 * 右侧是文件夹胶囊（图标 + 文件数），点击进「资料库」。
 * 尺寸：高 36、圆角 18、白底 + 0.5px 描边 + 0 4 24 的落影；图标 16、文字 12/18。
 */
export const TaskEntryBar: FC<TaskEntryBarProps> = ({ tasks, fileCount, onOpen }) => (
  <div className={styles.row}>
    <div className={styles.tasks}>
      {tasks.map((task) => {
        const Icon = task.icon === 'pen' ? IconTaskEntryIconPen : IconTaskEntryIconList;
        return (
          <Pressable
            key={task.key}
            className={styles.pill}
            onClick={() => onOpen(task.tab)}
            title={task.label}
            ariaLabel={task.label}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            <span className={styles.label}>{task.label}</span>
          </Pressable>
        );
      })}
    </div>
    <Pressable
      className={`${styles.pill} ${styles.filePill}`}
      onClick={() => onOpen('library')}
      title="打开资料库"
      ariaLabel="打开资料库"
    >
      <span className={styles.icon} aria-hidden="true">
        <IconTaskEntryIconFolder />
      </span>
      <span className={`${styles.label} ${styles.count}`}>{fileCount}</span>
    </Pressable>
  </div>
);
