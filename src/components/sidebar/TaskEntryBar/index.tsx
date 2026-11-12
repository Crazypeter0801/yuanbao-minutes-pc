import { useEffect, useRef, useState, type FC } from 'react';
import IconTaskEntryIconBook from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-book';
import IconTaskEntryIconFilePlus from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-file-plus';
import IconTaskEntryIconPen from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-pen';
import { Pressable } from '@/components/common/Pressable';
import type { TaskEntryTab, TaskEntryTask } from '@/data/taskEntry';
import styles from './index.module.scss';

interface TaskEntryBarProps {
  /** 输入框上方的任务胶囊（Figma 215:22016 / 268:25268） */
  tasks: TaskEntryTask[];
  /** 指令大全里的基础指令，点一项等同用户发出这句话 */
  commands: string[];
  /** 点任务胶囊：进入状态页对应 Tab（笔记 / 待办都进概览） */
  onOpen: (tab: TaskEntryTab) => void;
  /** 点指令：走现有提问链路 */
  onCommand: (text: string) => void;
}

const TASK_ICONS = {
  pen: IconTaskEntryIconPen,
  'file-plus': IconTaskEntryIconFilePlus,
} as const;

/**
 * 输入框上方的任务入口（方案 B，Figma 215:22015）
 * 从左到右：指令大全（只有书本图标）、元宝笔记 +16、会议待办 +5。
 * 三枚都是高 32、圆角 16 的毛玻璃胶囊，间距 4；不再放右侧文件夹数字。
 */
export const TaskEntryBar: FC<TaskEntryBarProps> = ({ tasks, commands, onOpen, onCommand }) => {
  const [commandsOpen, setCommandsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!commandsOpen) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setCommandsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCommandsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [commandsOpen]);

  return (
    <div className={styles.row} ref={rootRef}>
      <div className={styles.commandSlot}>
        {commandsOpen && (
          <div className={styles.menu} role="menu" aria-label="指令大全">
            {commands.map((text) => (
              <Pressable
                key={text}
                className={styles.menuItem}
                onClick={() => {
                  setCommandsOpen(false);
                  onCommand(text);
                }}
                ariaLabel={text}
              >
                {text}
              </Pressable>
            ))}
          </div>
        )}
        <Pressable
          className={`${styles.pill} ${styles.iconPill}`}
          onClick={() => setCommandsOpen((open) => !open)}
          title="指令大全"
          ariaLabel="指令大全"
          ariaExpanded={commandsOpen}
        >
          <span className={styles.icon} aria-hidden="true">
            <IconTaskEntryIconBook />
          </span>
        </Pressable>
      </div>

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
};
