import { useEffect, useRef, type FC } from 'react';
import confirmSheet from '@/assets/sprites/yuanbao/confirm.webp';
import doneSheet from '@/assets/sprites/yuanbao/done.webp';
import greetingSheet from '@/assets/sprites/yuanbao/greeting.webp';
import idleToSleepSheet from '@/assets/sprites/yuanbao/idle-to-sleep.webp';
import idleToWorkingSheet from '@/assets/sprites/yuanbao/idle-to-working.webp';
import idleSheet from '@/assets/sprites/yuanbao/idle.webp';
import sleepToIdleSheet from '@/assets/sprites/yuanbao/sleep-to-idle.webp';
import sleepSheet from '@/assets/sprites/yuanbao/sleep.webp';
import workingToIdleSheet from '@/assets/sprites/yuanbao/working-to-idle.webp';
import workingSheet from '@/assets/sprites/yuanbao/working.webp';
import type { YuanbaoMood } from '@/data/agentTasks';
import styles from './index.module.scss';

/** 素材按 20 帧/秒制作（文件名里的「20帧」） */
const FPS = 20;
/** 每行 10 帧（素材原样保留的排布） */
const COLUMNS = 10;

interface Clip {
  src: string;
  frames: number;
}

/**
 * 帧数 = 原图里非透明格子数（脚本统计，末行不满的空格子已去掉）；注释为素材原文件名。
 * 原图 260×260/帧，缩到 96×96（48 显示尺寸的 2 倍）后转 webp。
 */
const CLIPS = {
  idle: { src: idleSheet, frames: 58 }, // 20帧空闲态
  working: { src: workingSheet, frames: 36 }, // 工作中2
  idleToWorking: { src: idleToWorkingSheet, frames: 6 }, // 空闲-工作中
  workingToIdle: { src: workingToIdleSheet, frames: 6 }, // 工作中-空闲
  confirm: { src: confirmSheet, frames: 53 }, // 20帧待确认
  done: { src: doneSheet, frames: 53 }, // 20帧已完成
  sleep: { src: sleepSheet, frames: 60 }, // 20休眠态
  idleToSleep: { src: idleToSleepSheet, frames: 10 }, // 空闲态 - 休眠态
  sleepToIdle: { src: sleepToIdleSheet, frames: 6 }, // 休眠态-空闲
  greeting: { src: greetingSheet, frames: 61 }, // 打招呼
} satisfies Record<string, Clip>;

/**
 * 每个状态：进入时的过渡（可选）→ 循环动画；离开时的过渡（可选）
 * 过渡都以「空闲」姿态为中转，所以 工作中 → 待确认 = 工作中-空闲 + 待确认循环。
 */
const MOOD_CLIPS: Record<YuanbaoMood, { enter?: Clip; loop: Clip; exit?: Clip; once?: boolean }> = {
  greeting: { loop: CLIPS.greeting, once: true },
  idle: { loop: CLIPS.idle },
  working: { enter: CLIPS.idleToWorking, loop: CLIPS.working, exit: CLIPS.workingToIdle },
  confirm: { loop: CLIPS.confirm },
  done: { loop: CLIPS.done },
  sleep: { enter: CLIPS.idleToSleep, loop: CLIPS.sleep, exit: CLIPS.sleepToIdle },
};

interface YuanbaoAvatarProps {
  mood: YuanbaoMood;
  /** 显示尺寸（一帧的边长），素材按 2 倍图准备 */
  size?: number;
  /** 只播一次的动画（打招呼）播完时回调 */
  onOnceEnd?: () => void;
  className?: string;
}

/**
 * 元宝头像：雪碧图逐帧动画
 * 状态切换时先播上一个状态的退出过渡、再播新状态的进入过渡，最后进入循环；
 * 用 requestAnimationFrame 直接改 background-position，不触发 React 重渲染。
 * 系统开了「减少动态效果」时只显示循环动画的第一帧。
 */
export const YuanbaoAvatar: FC<YuanbaoAvatarProps> = ({ mood, size = 48, onOnceEnd, className }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const previousMood = useRef<YuanbaoMood | null>(null);
  const onOnceEndRef = useRef(onOnceEnd);
  onOnceEndRef.current = onOnceEnd;

  // 先把所有雪碧图拉下来，切状态时不闪白
  useEffect(() => {
    Object.values(CLIPS).forEach((clip) => {
      const image = new Image();
      image.src = clip.src;
    });
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return undefined;
    }
    const target = MOOD_CLIPS[mood];
    const from = previousMood.current ? MOOD_CLIPS[previousMood.current] : undefined;
    previousMood.current = mood;

    const showFrame = (clip: Clip, frame: number) => {
      const rows = Math.ceil(clip.frames / COLUMNS);
      node.style.backgroundImage = `url(${clip.src})`;
      node.style.backgroundSize = `${COLUMNS * size}px ${rows * size}px`;
      node.style.backgroundPosition = `${-(frame % COLUMNS) * size}px ${-Math.floor(frame / COLUMNS) * size}px`;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showFrame(target.loop, 0);
      if (target.once) {
        onOnceEndRef.current?.();
      }
      return undefined;
    }

    const queue = [from?.exit, target.enter, target.loop].filter((clip): clip is Clip => Boolean(clip));
    let clipIndex = 0;
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let raf = 0;
    showFrame(queue[0], 0);

    const step = (now: number) => {
      elapsed += now - last;
      last = now;
      while (elapsed >= 1000 / FPS) {
        elapsed -= 1000 / FPS;
        frame += 1;
        const clip = queue[clipIndex];
        if (frame < clip.frames) {
          continue;
        }
        if (clipIndex < queue.length - 1) {
          clipIndex += 1;
          frame = 0;
        } else if (target.once) {
          // 只播一次：停在最后一帧，交给外面切到下一个状态
          showFrame(clip, clip.frames - 1);
          onOnceEndRef.current?.();
          return;
        } else {
          frame = 0;
        }
      }
      showFrame(queue[clipIndex], frame);
      raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [mood, size]);

  return (
    <span
      className={`${styles.avatar} ${className ?? ''}`}
      ref={nodeRef}
      style={{ width: size, height: size }}
      data-mood={mood}
      aria-hidden="true"
    />
  );
};
