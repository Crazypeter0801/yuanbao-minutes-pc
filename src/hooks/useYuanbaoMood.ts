import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IDLE_SLEEP_DELAY,
  IDLE_WINK_JITTER,
  IDLE_WINK_MIN_DELAY,
  MOOD_PREVIEW_HOLD,
  ONCE_MOODS,
  resolveMood,
  type YuanbaoMood,
} from '@/data/agentTasks';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import type { AgentTasksControl } from '@/hooks/useAgentTasks';
import type { ChatMessage } from '@/types/chat';

interface MoodOptions {
  agent: AgentTasksControl;
  dock: AgentDockControl;
  messages: ChatMessage[];
  /** 正在回答用户的提问 */
  thinking: boolean;
  /** 是否在记笔记；暂停时元宝休眠 */
  listening: boolean;
}

export interface YuanbaoMoodControl {
  mood: YuanbaoMood;
  /** 同一个状态要重播时递增（连续摸头 / 连续演示同一个表情） */
  replayKey: number;
  /** 一次性动画播完：回到常驻状态 */
  onOnceEnd: () => void;
  /** 点一下头像：摸头 */
  touch: () => void;
}

interface ActiveReaction {
  mood: YuanbaoMood;
  key: number;
  force: boolean;
}

/** 只有这两种常驻状态下元宝「有空」做一次性反应，忙着干活 / 等确认时不打断 */
const FREE_MOODS: ReadonlySet<YuanbaoMood> = new Set<YuanbaoMood>(['idle', 'sleep']);
/** 侧栏刚挂载时，补播多久以内的外部触发 */
const REACTION_REPLAY_WINDOW = 1000;
/** 连续的鼠标移动只当一次「有操作」，避免每次移动都重排计时器 */
const ACTIVITY_THROTTLE = 400;

/**
 * 元宝头像的状态机：在「由任务推出的常驻状态」之上叠加随时间和操作变化的反应
 *
 * - 常驻状态来自 resolveMood：空闲 / 工作中（按任务类型换动画）/ 思考 / 待确认 / 已完成 / 休眠；
 * - 空闲连续 IDLE_SLEEP_DELAY 没有任何操作（鼠标、键盘、滚轮、新消息）就打瞌睡，有操作醒来；
 * - 空闲时偶尔眨眼；点头像摸头；有新内容进来吃一口；吸附到左 / 右侧时贴边；
 * - 一次性反应只在空闲 / 休眠时播，忙着干活或等确认时丢掉；演示面板的 force 触发不受限。
 */
export function useYuanbaoMood({ agent, dock, messages, thinking, listening }: MoodOptions): YuanbaoMoodControl {
  const base = resolveMood({
    greeted: agent.greeted,
    tasks: agent.tasks,
    celebrating: agent.celebrating,
    listening,
    thinking,
  });
  const [asleep, setAsleep] = useState(false);
  const [active, setActive] = useState<ActiveReaction | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const baseRef = useRef(base);
  baseRef.current = base;
  const reactionKey = useRef(0);

  // ---------- 空闲太久打瞌睡 ----------
  const sleepTimer = useRef<number>();
  const lastActivity = useRef(0);
  const armSleep = useCallback(() => {
    window.clearTimeout(sleepTimer.current);
    if (baseRef.current === 'idle') {
      sleepTimer.current = window.setTimeout(() => setAsleep(true), IDLE_SLEEP_DELAY);
    }
  }, []);

  useEffect(() => {
    setAsleep(false);
    armSleep();
    return () => window.clearTimeout(sleepTimer.current);
  }, [base, armSleep]);

  useEffect(() => {
    const onActivity = () => {
      const now = performance.now();
      if (now - lastActivity.current < ACTIVITY_THROTTLE) {
        return;
      }
      lastActivity.current = now;
      setAsleep(false);
      armSleep();
    };
    const events = ['pointerdown', 'pointermove', 'keydown', 'wheel'] as const;
    events.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, onActivity));
  }, [armSleep]);

  // ---------- 一次性反应 ----------
  const play = useCallback(
    (mood: YuanbaoMood, { force = false, idleOnly = false, spontaneous = false } = {}) => {
      if (!force && !FREE_MOODS.has(baseRef.current)) {
        return;
      }
      if (idleOnly && baseRef.current !== 'idle') {
        return;
      }
      reactionKey.current += 1;
      // 自发的小动作（眨眼）不算「有操作」，否则永远等不到打瞌睡
      if (!spontaneous) {
        setAsleep(false);
        armSleep();
      }
      setActive({ mood, key: reactionKey.current, force });
      setReplayKey(reactionKey.current);
    },
    [armSleep],
  );

  // 有新内容进来（元宝新发的一条消息）：吃一口
  const messageCount = useRef(messages.length);
  useEffect(() => {
    const previous = messageCount.current;
    messageCount.current = messages.length;
    if (messages.length > previous && messages[messages.length - 1]?.role === 'assistant') {
      // 暂停记笔记时元宝在休眠，新来的「已暂停」提示不叫醒它
      play('eat', { idleOnly: true });
    }
  }, [messages, play]);

  // 外部触发：喝彩（文件生成 / 投票发布 / 演示收尾）与演示面板；排在「吃新动态」后面，同一拍里两个都来时以它为准
  // 侧栏就是被这次触发打开的（演示面板在窗口关着时点表情）：刚挂载时补播 1 秒内的触发，更早的不重播
  const handled = useRef(agent.reaction && Date.now() - agent.reaction.at < REACTION_REPLAY_WINDOW ? 0 : agent.reaction?.id ?? 0);
  useEffect(() => {
    const reaction = agent.reaction;
    if (reaction && reaction.id !== handled.current) {
      handled.current = reaction.id;
      play(reaction.mood, { force: reaction.force });
    }
  }, [agent.reaction, play]);

  // 吸附到会议窗口的左 / 右侧：贴边
  const previousDockMode = useRef(dock.mode);
  useEffect(() => {
    if (previousDockMode.current === 'floating' && dock.mode === 'docked') {
      play(dock.side === 'left' ? 'edgeLeft' : 'edgeRight');
    }
    previousDockMode.current = dock.mode;
  }, [dock.mode, dock.side, play]);

  // 干活 / 等确认时没空：把还没播完的非强制反应收掉
  useEffect(() => {
    if (active && !active.force && !FREE_MOODS.has(base)) {
      setActive(null);
    }
  }, [active, base]);

  // 强制播放的循环动画（工作中 / 待确认…）停一会儿回到真实状态
  useEffect(() => {
    if (!active || ONCE_MOODS.has(active.mood)) {
      return undefined;
    }
    const timer = window.setTimeout(() => setActive(null), MOOD_PREVIEW_HOLD);
    return () => window.clearTimeout(timer);
  }, [active]);

  const resting: YuanbaoMood = asleep && base === 'idle' ? 'sleep' : base;
  const settled = active ? active.mood : resting;

  // ---------- 空闲时偶尔眨眼 ----------
  useEffect(() => {
    if (settled !== 'idle') {
      return undefined;
    }
    const timer = window.setTimeout(
      () => play('wink', { spontaneous: true }),
      IDLE_WINK_MIN_DELAY + Math.random() * IDLE_WINK_JITTER,
    );
    return () => window.clearTimeout(timer);
  }, [settled, play]);

  const onOnceEnd = useCallback(() => {
    setActive((current) => (current && ONCE_MOODS.has(current.mood) ? null : current));
    if (baseRef.current === 'greeting') {
      agent.finishGreeting();
    }
  }, [agent]);

  const touch = useCallback(() => play('touch'), [play]);

  return { mood: settled, replayKey, onOnceEnd, touch };
}
