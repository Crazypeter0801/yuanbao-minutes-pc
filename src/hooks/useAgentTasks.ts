import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEMO_TIMING,
  DEMO_WORKING_TICKS,
  demoConfirmTasks,
  demoDoneTasks,
  demoWorkingTasks,
  type AgentTask,
} from '@/data/agentTasks';

export interface AgentTasksControl {
  tasks: AgentTask[];
  /** 打招呼动画是否已播完：元宝窗口关掉再打开不再重播 */
  greeted: boolean;
  /** 刚全部完成，头像播「已完成」 */
  celebrating: boolean;
  finishGreeting: () => void;
  /** 窗口外的演示按钮：元宝依次走一遍 空闲 → 工作中 → 待确认 → 已完成 */
  runDemo: () => void;
  /** 长程任务详情里的「停止任务」：已完成的步骤保留 */
  stopTask: (id: string) => void;
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
    schedule(at, () => setCelebrating(false));
  }, [applyPhase, clearTimers]);

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

  return { tasks, greeted, celebrating, finishGreeting, runDemo, stopTask };
}
