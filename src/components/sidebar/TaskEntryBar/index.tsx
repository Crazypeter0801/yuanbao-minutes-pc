import { useEffect, useRef, type FC, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import IconTaskEntryIconFilePlus from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-file-plus';
import IconTaskEntryIconPen from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-pen';
import { Pressable } from '@/components/common/Pressable';
import { CommandEntry } from '@/components/sidebar/CommandEntry';
import type { AgentTask } from '@/data/agentTasks';
import type { TaskEntryTab, TaskEntryTask } from '@/data/taskEntry';
import styles from './index.module.scss';

interface TaskEntryBarProps {
  /** 输入框上方的任务胶囊（Figma 215:22016 / 268:25268） */
  tasks: TaskEntryTask[];
  /** 画板长程任务：进行中 / 刚完成。不传则不出现 */
  boardTask?: AgentTask;
  /** 点任务胶囊：进入状态页对应 Tab（笔记 / 待办都进概览） */
  onOpen: (tab: TaskEntryTab) => void;
  /** 点快捷指令：走现有提问链路 */
  onCommand: (text: string) => void;
}

/** 画板任务胶囊：和笔记 / 待办齐高，进行中转圈，完成打勾 */
export const BoardProgressPill: FC<{ task: AgentTask }> = ({ task }) => {
  const running = task.status === 'running';
  return (
    <div className={styles.pill} role="status" aria-label={task.title}>
      <span className={running ? styles.spinner : styles.doneMark} aria-hidden="true" />
      <span className={styles.label}>{task.title}</span>
    </div>
  );
};

const TASK_ICONS = {
  pen: IconTaskEntryIconPen,
  'file-plus': IconTaskEntryIconFilePlus,
} as const;

/**
 * 输入框上方的任务入口（方案 B，Figma 215:22015）
 * 书本胶囊固定在最左。右边的任务永远单行：新任务贴着书本，老任务往右顶，
 * 装不下就滑出可见区域，拖动、触控板横滑或 Shift+滚轮可以再看回来。
 */
export const TaskEntryBar: FC<TaskEntryBarProps> = ({ tasks, boardTask, onOpen, onCommand }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ pointer: -1, x: 0, left: 0, moved: false });

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) {
      return undefined;
    }
    const onWheel = (event: WheelEvent) => {
      if (node.scrollWidth <= node.clientWidth + 1) {
        return;
      }
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (!delta) {
        return;
      }
      event.preventDefault();
      node.scrollLeft += delta;
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    const node = scrollerRef.current;
    if (!node) {
      return;
    }
    dragRef.current = { pointer: event.pointerId, x: event.clientX, left: node.scrollLeft, moved: false };
    node.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointer !== event.pointerId) {
      return;
    }
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 4) {
      drag.moved = true;
    }
    const node = scrollerRef.current;
    if (node && drag.moved) {
      node.scrollLeft = drag.left - dx;
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointer !== event.pointerId) {
      return;
    }
    dragRef.current.pointer = -1;
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  return (
    <div className={styles.row}>
      <CommandEntry onCommand={onCommand} />
      <div
        className={styles.scroller}
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {boardTask && <BoardProgressPill task={boardTask} />}
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
    </div>
  );
};
