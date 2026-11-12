import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEMO_TIMING,
  DEMO_WORKING_TICKS,
  demoConfirmTasks,
  demoDoneTasks,
  demoScanTasks,
  demoWorkingTasks,
  type AgentTask,
  type YuanbaoMood,
} from '@/data/agentTasks';

/** 外部要求头像播放的一次表情（演示面板 / 文件生成 / 投票发布）；id 每次 +1，同一个表情连点也能重播 */
export interface MoodReaction {
  id: number;
  mood: YuanbaoMood;
  /** 强制播放：不管元宝当前在忙什么（演示面板用）；否则只在空闲 / 休眠时播 */
  force: boolean;
  /** 触发时间：侧栏刚被这次触发打开时，刚挂载的头像据此判断要不要补播 */
  at: number;
}

export interface AgentTasksControl {
  tasks: AgentTask[];
  /** 打招呼动画是否已播完：元宝窗口关掉再打开不再重播 */
  greeted: boolean;
  /** 刚全部完成，头像播「已完成」 */
  celebrating: boolean;
  finishGreeting: () => void;
  /** 最近一次外部触发的头像表情 */
  reaction: MoodReaction | null;
  /** 触发一次头像表情：喝彩（文件生成 / 投票发布）、演示面板逐个看动画 */
  react: (mood: YuanbaoMood, options?: { force?: boolean }) => void;
  /** 窗口外的演示按钮：元宝依次走一遍 空闲 → 识别画面 → 工作中 → 待确认 → 已完成 → 喝彩 */
  runDemo: () => void;
  /** 长程任务详情里的「停止任务」：已完成的步骤保留 */
  stopTask: (id: string) => void;
  /** 按 id 写入一条任务，不冲掉旁边已有的任务 */
  setTask: (task: AgentTask) => void;
  /** 收起一条已经展示完的任务 */
  removeTask: (id: string) => void;
}

/**
 * 元宝任务（演示数据）
 * 任务本身由 App 持有：元宝窗口关掉再打开，任务和打招呼状态都不丢。
 * 演示是一串定时器，重新点演示会先清掉上一轮；停掉的任务不会被后续阶段改回来。
 */
export function useAgentTasks(): AgentTasksControl {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [greeted, setGreeted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [reaction, setReaction] = useState<MoodReaction | null>(null);
  const reactionId = useRef(0);
  const timers = useRef<number[]>([]);
  /** 用户手动停掉的任务：演示后续阶段跳过它们 */
  const stopped = useRef(new Set<string>());

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /** 换成下一阶段的任务，但保留已停止的那几条 */
  const applyPhase = useCallback((next: AgentTask[]) => {
    setTasks((previous) =>
      next.map((task) =>
        stopped.current.has(task.id) ? previous.find((item) => item.id === task.id) ?? task : task,
      ),
    );
  }, []);

  const runDemo = useCallback(() => {
    clearTimers();
    stopped.current.clear();
    setTasks([]);
    setCelebrating(false);

    const schedule = (delay: number, run: () => void) => {
      timers.current.push(window.setTimeout(run, delay));
    };
    let at = DEMO_TIMING.idle;
    schedule(at, () => applyPhase(demoScanTasks()));
    at += DEMO_TIMING.scan;
    for (let tick = 0; tick < DEMO_WORKING_TICKS; tick += 1) {
      schedule(at, () => applyPhase(demoWorkingTasks(tick)));
      at += DEMO_TIMING.workingTick;
    }
    schedule(at, () => applyPhase(demoConfirmTasks()));
    at += DEMO_TIMING.confirm;
    schedule(at, () => {
      applyPhase(demoDoneTasks());
      setCelebrating(true);
    });
    at += DEMO_TIMING.celebrate;
    schedule(at, () => {
      setCelebrating(false);
      // 庆祝完回到空闲，再喝一声彩
      setReaction({ id: (reactionId.current += 1), mood: 'cheer', force: false, at: Date.now() });
    });
  }, [applyPhase, clearTimers]);

  const react = useCallback((mood: YuanbaoMood, options?: { force?: boolean }) => {
    setReaction({ id: (reactionId.current += 1), mood, force: options?.force ?? false, at: Date.now() });
  }, []);

  const stopTask = useCallback((id: string) => {
    stopped.current.add(id);
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'stopped',
              desc: '已停止 · 已完成的步骤已保留',
              steps: task.steps?.map((step) =>
                step.status === 'running' ? { ...step, status: 'pending', time: '已停止' } : step,
              ),
            }
          : task,
      ),
    );
  }, []);

  const finishGreeting = useCallback(() => setGreeted(true), []);

  const setTask = useCallback((task: AgentTask) => {
    setTasks((previous) => {
      const index = previous.findIndex((item) => item.id === task.id);
      if (index === -1) {
        return [task, ...previous];
      }
      const next = previous.slice();
      next[index] = task;
      return next;
    });
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }, []);

  return { tasks, greeted, celebrating, finishGreeting, reaction, react, runDemo, stopTask, setTask, removeTask };
}
