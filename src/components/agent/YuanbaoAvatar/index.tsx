import { useEffect, useRef, type FC } from 'react';
import cheerSheet from '@/assets/sprites/yuanbao/cheer.webp';
import confirmSheet from '@/assets/sprites/yuanbao/confirm.webp';
import doneSheet from '@/assets/sprites/yuanbao/done.webp';
import eatInSheet from '@/assets/sprites/yuanbao/eat-in.webp';
import eatOutSheet from '@/assets/sprites/yuanbao/eat-out.webp';
import eatSheet from '@/assets/sprites/yuanbao/eat.webp';
import greetingSheet from '@/assets/sprites/yuanbao/greeting.webp';
import idleToSleepSheet from '@/assets/sprites/yuanbao/idle-to-sleep.webp';
import idleToWorkingSheet from '@/assets/sprites/yuanbao/idle-to-working.webp';
import idleSheet from '@/assets/sprites/yuanbao/idle.webp';
import sleepToIdleSheet from '@/assets/sprites/yuanbao/sleep-to-idle.webp';
import sleepSheet from '@/assets/sprites/yuanbao/sleep.webp';
import thinkingSheet from '@/assets/sprites/yuanbao/thinking.webp';
import touchSheet from '@/assets/sprites/yuanbao/touch.webp';
import winkSheet from '@/assets/sprites/yuanbao/wink.webp';
import workingToIdleSheet from '@/assets/sprites/yuanbao/working-to-idle.webp';
import workingSheet from '@/assets/sprites/yuanbao/working.webp';
import { ONCE_MOODS, type YuanbaoMood } from '@/data/agentTasks';
import styles from './index.module.scss';

/** 素材按 20 帧/秒制作（文件名里的「20帧」） */
const FPS = 20;
/** 每行 10 帧（素材原样保留的排布） */
const COLUMNS = 10;

interface Clip {
  src: string;
  /** 播放几帧 */
  frames: number;
  /** 从雪碧图第几帧开始播（默认 0）；done 跳过带勾的前段，避免勾挡住脸 */
  start?: number;
  /** 覆盖全局帧率（done 只剩两帧，放慢一点才不会闪） */
  fps?: number;
  /**
   * 每段动画的缩放 / 位移（相对 48 显示尺寸，transform-origin 为帧中心）。
   * 素材里各段动画的形象占比不一致：以「形象本体」等大为准逐段标定，
   * 让所有状态看起来一样大，同时都完整落在 33×36 的头像槽里。
   */
  scale?: number;
  /** 水平位移（px），配合 scale 把形象摆到头像槽正中 */
  dx?: number;
  /** 垂直位移（px） */
  dy?: number;
}

/**
 * 帧数 = 原图里非透明格子数（脚本统计，末行不满的空格子已去掉）；注释为素材原文件名。
 * 原图 260×260/帧，缩到 96×96（48 显示尺寸的 2 倍）后转 webp。
 * scale / dx / dy 是按每段动画非透明区域的并集（或形象本体）量出来的：
 * 常驻状态统一按本体约 30px 显示；张嘴吃东西、喝彩这类会撑满整帧的动作单独缩小到槽内。
 */
const CLIPS = {
  idle: { src: idleSheet, frames: 58, scale: 0.88, dx: -0.28, dy: 0.44 }, // 20帧空闲态
  working: { src: workingSheet, frames: 36, scale: 0.88, dx: -1.38, dy: 0.44 }, // 工作中2
  idleToWorking: { src: idleToWorkingSheet, frames: 6, scale: 0.88, dx: -0.72, dy: 0.22 }, // 空闲-工作中
  workingToIdle: { src: workingToIdleSheet, frames: 6, scale: 0.88, dx: -0.72, dy: 0 }, // 工作中-空闲
  confirm: { src: confirmSheet, frames: 53, scale: 0.85, dx: -0.08, dy: -0.64 }, // 20帧待确认
  // 只用最后两帧：前段的大绿勾会挡住脸，最后两帧是完整笑脸（放慢到 4fps，像在轻轻眨眼）
  done: { src: doneSheet, frames: 2, start: 51, fps: 4, scale: 0.9, dx: -0.5, dy: -0.23 }, // 20帧已完成
  sleep: { src: sleepSheet, frames: 60, scale: 0.85, dx: -0.5, dy: 0.42 }, // 20休眠态
  idleToSleep: { src: idleToSleepSheet, frames: 10, scale: 0.85, dx: -0.5, dy: 0 }, // 空闲态 - 休眠态
  sleepToIdle: { src: sleepToIdleSheet, frames: 6, scale: 0.85, dx: -0.5, dy: 0 }, // 休眠态-空闲
  greeting: { src: greetingSheet, frames: 61, scale: 0.85, dx: 0.77, dy: 2.98 }, // 打招呼
  cheer: { src: cheerSheet, frames: 35, scale: 0.68, dx: -0.5, dy: 0 }, // 20帧喝彩
  touch: { src: touchSheet, frames: 50, scale: 0.86, dx: -0.93, dy: 1.94 }, // 20帧空闲摸头
  wink: { src: winkSheet, frames: 40, scale: 0.82, dx: -2.35, dy: 2.87 }, // 20帧默认态wink
  thinking: { src: thinkingSheet, frames: 61, scale: 0.85, dx: -0.08, dy: -0.64 }, // 空闲+待确认+空闲（问号冒出来再收回去，首尾都是空闲姿态，可无缝循环）
  eatIn: { src: eatInSheet, frames: 7, scale: 0.68, dx: -0.67, dy: 0.85 }, // 吃 新动态(前)
  eat: { src: eatSheet, frames: 13, scale: 0.68, dx: -0.5, dy: 1.36 }, // 吃 新动态(中)
  eatOut: { src: eatOutSheet, frames: 14, scale: 0.68, dx: -0.5, dy: 1.36 }, // 吃 新动态(后)
} satisfies Record<string, Clip>;

interface MoodClips {
  /** 进入时的过渡 */
  enter?: Clip;
  /** 主体动画：常驻状态循环播放，一次性状态（ONCE_MOODS）播一遍 */
  loop: Clip;
  /** 离开时的过渡 */
  exit?: Clip;
}

/**
 * 每个状态：进入时的过渡（可选）→ 循环动画；离开时的过渡（可选）
 * 过渡都以「空闲」姿态为中转，所以 工作中 → 待确认 = 工作中-空闲 + 待确认循环。
 * 素材里没有「识别画面」「思考」的专属动画，分别用「吃新动态」循环、「待确认」的问号动画替代。
 */
const MOOD_CLIPS: Record<YuanbaoMood, MoodClips> = {
  greeting: { loop: CLIPS.greeting },
  idle: { loop: CLIPS.idle },
  working: { enter: CLIPS.idleToWorking, loop: CLIPS.working, exit: CLIPS.workingToIdle },
  scanning: { enter: CLIPS.eatIn, loop: CLIPS.eat, exit: CLIPS.eatOut },
  thinking: { loop: CLIPS.thinking },
  confirm: { loop: CLIPS.confirm },
  done: { loop: CLIPS.done },
  cheer: { loop: CLIPS.cheer },
  sleep: { enter: CLIPS.idleToSleep, loop: CLIPS.sleep, exit: CLIPS.sleepToIdle },
  eat: { enter: CLIPS.eatIn, loop: CLIPS.eat, exit: CLIPS.eatOut },
  touch: { loop: CLIPS.touch },
  wink: { loop: CLIPS.wink },
};

interface YuanbaoAvatarProps {
  mood: YuanbaoMood;
  /** 显示尺寸（一帧的边长），素材按 2 倍图准备 */
  size?: number;
  /** 同一个状态要重播时换一个值（如连续摸头） */
  replayKey?: number;
  /** 一次性动画（打招呼 / 喝彩 / 吃新动态…）播完时回调 */
  onOnceEnd?: () => void;
  className?: string;
}

/**
 * 元宝头像：雪碧图逐帧动画
 * 状态切换时先播上一个状态的退出过渡、再播新状态的进入过渡，最后进入循环；
 * 用 requestAnimationFrame 直接改 background-position，不触发 React 重渲染。
 * 每段动画按 Clip 上的 scale / dx / dy 缩放居中：所有状态的形象一样大，且都完整落在头像槽里。
 * 系统开了「减少动态效果」时只显示循环动画的第一帧。
 */
export const YuanbaoAvatar: FC<YuanbaoAvatarProps> = ({ mood, size = 48, replayKey = 0, onOnceEnd, className }) => {
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
    const once = ONCE_MOODS.has(mood);
    const from = previousMood.current ? MOOD_CLIPS[previousMood.current] : undefined;
    previousMood.current = mood;

    const showFrame = (clip: Clip, frame: number) => {
      const start = clip.start ?? 0;
      const rows = Math.ceil((start + clip.frames) / COLUMNS);
      const frameIndex = start + frame;
      node.style.backgroundImage = `url(${clip.src})`;
      node.style.backgroundSize = `${COLUMNS * size}px ${rows * size}px`;
      node.style.backgroundPosition = `${-(frameIndex % COLUMNS) * size}px ${-Math.floor(frameIndex / COLUMNS) * size}px`;
      node.style.transform = `translate(${clip.dx ?? 0}px, ${clip.dy ?? 0}px) scale(${clip.scale ?? 1})`;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showFrame(target.loop, 0);
      if (once) {
        onOnceEndRef.current?.();
      }
      return undefined;
    }

    const queue: Clip[] = [];
    if (from?.exit) {
      queue.push(from.exit);
    }
    if (target.enter) {
      queue.push(target.enter);
    }
    queue.push(target.loop);
    let stageIndex = 0;
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let raf = 0;
    showFrame(queue[0], 0);

    const step = (now: number) => {
      elapsed += now - last;
      last = now;
      const stage = queue[stageIndex];
      const stepTime = 1000 / (stage.fps ?? FPS);
      while (elapsed >= stepTime) {
        elapsed -= stepTime;
        frame += 1;
        if (frame < stage.frames) {
          continue;
        }
        if (stageIndex < queue.length - 1) {
          stageIndex += 1;
          frame = 0;
        } else if (once) {
          // 只播一次：停在最后一帧，交给外面切到下一个状态
          showFrame(stage, stage.frames - 1);
          onOnceEndRef.current?.();
          return;
        } else {
          frame = 0;
        }
      }
      showFrame(queue[stageIndex], frame);
      raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [mood, size, replayKey]);

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
