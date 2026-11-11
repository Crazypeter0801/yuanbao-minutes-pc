import { useEffect, useRef, type FC } from 'react';
import cheerSheet from '@/assets/sprites/yuanbao/cheer.webp';
import confirmSheet from '@/assets/sprites/yuanbao/confirm.webp';
import doneSheet from '@/assets/sprites/yuanbao/done.webp';
import eatInSheet from '@/assets/sprites/yuanbao/eat-in.webp';
import eatOutSheet from '@/assets/sprites/yuanbao/eat-out.webp';
import eatSheet from '@/assets/sprites/yuanbao/eat.webp';
import edgeLeftToIdleSheet from '@/assets/sprites/yuanbao/edge-left-to-idle.webp';
import edgeLeftSheet from '@/assets/sprites/yuanbao/edge-left.webp';
import edgeRightToIdleSheet from '@/assets/sprites/yuanbao/edge-right-to-idle.webp';
import edgeRightSheet from '@/assets/sprites/yuanbao/edge-right.webp';
import greetingSheet from '@/assets/sprites/yuanbao/greeting.webp';
import idleToEdgeLeftSheet from '@/assets/sprites/yuanbao/idle-to-edge-left.webp';
import idleToEdgeRightSheet from '@/assets/sprites/yuanbao/idle-to-edge-right.webp';
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

/** 吸边动画里形象贴着哪一侧：整个头像随动画滑到窗口那一侧的边缘 */
type EdgeSide = 'left' | 'right';

interface Clip {
  src: string;
  frames: number;
  /** 吸边动画：in = 从原位滑向窗口边缘，hold = 停在边缘，out = 滑回原位 */
  slide?: 'in' | 'hold' | 'out';
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
  cheer: { src: cheerSheet, frames: 35 }, // 20帧喝彩
  touch: { src: touchSheet, frames: 50 }, // 20帧空闲摸头
  wink: { src: winkSheet, frames: 40 }, // 20帧默认态wink
  thinking: { src: thinkingSheet, frames: 61 }, // 空闲+待确认+空闲（问号冒出来再收回去，首尾都是空闲姿态，可无缝循环）
  eatIn: { src: eatInSheet, frames: 7 }, // 吃 新动态(前)
  eat: { src: eatSheet, frames: 13 }, // 吃 新动态(中)
  eatOut: { src: eatOutSheet, frames: 14 }, // 吃 新动态(后)
  idleToEdgeLeft: { src: idleToEdgeLeftSheet, frames: 8, slide: 'in' }, // 空闲-左吸边
  edgeLeft: { src: edgeLeftSheet, frames: 24, slide: 'hold' }, // 12左吸边
  edgeLeftToIdle: { src: edgeLeftToIdleSheet, frames: 8, slide: 'out' }, // 左吸边-空闲
  idleToEdgeRight: { src: idleToEdgeRightSheet, frames: 8, slide: 'in' }, // 空闲-右吸边
  edgeRight: { src: edgeRightSheet, frames: 24, slide: 'hold' }, // 12右吸边
  edgeRightToIdle: { src: edgeRightToIdleSheet, frames: 8, slide: 'out' }, // 右吸边-空闲
} satisfies Record<string, Clip>;

interface MoodClips {
  /** 进入时的过渡 */
  enter?: Clip;
  /** 主体动画：常驻状态循环播放，一次性状态（ONCE_MOODS）播一遍 */
  loop: Clip;
  /** 离开时的过渡 */
  exit?: Clip;
  /** 吸边状态：头像要滑到哪一侧 */
  edge?: EdgeSide;
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
  edgeLeft: { enter: CLIPS.idleToEdgeLeft, loop: CLIPS.edgeLeft, exit: CLIPS.edgeLeftToIdle, edge: 'left' },
  edgeRight: { enter: CLIPS.idleToEdgeRight, loop: CLIPS.edgeRight, exit: CLIPS.edgeRightToIdle, edge: 'right' },
};

/** 播放队列里的一段：吸边动画还要知道往哪一侧滑 */
interface Stage {
  clip: Clip;
  edge?: EdgeSide;
}

interface YuanbaoAvatarProps {
  mood: YuanbaoMood;
  /** 显示尺寸（一帧的边长），素材按 2 倍图准备 */
  size?: number;
  /** 同一个状态要重播时换一个值（如连续摸头） */
  replayKey?: number;
  /** 一次性动画（打招呼 / 喝彩 / 吃新动态 / 吸边…）播完时回调 */
  onOnceEnd?: () => void;
  className?: string;
}

/**
 * 元宝头像：雪碧图逐帧动画
 * 状态切换时先播上一个状态的退出过渡、再播新状态的进入过渡，最后进入循环；
 * 用 requestAnimationFrame 直接改 background-position，不触发 React 重渲染。
 * 吸边动画里头像按进度平移到所在窗口的左 / 右边缘（雪碧图的形象本身就被裁在那一侧的边上）。
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

    /** 头像从原位滑到窗口 side 一侧边缘需要的位移（量的时候先去掉当前平移） */
    const measureShift = (side: EdgeSide) => {
      const windowNode = node.closest('aside');
      if (!windowNode) {
        return 0;
      }
      const previous = node.style.transform;
      node.style.transform = 'none';
      const outer = windowNode.getBoundingClientRect();
      const inner = node.getBoundingClientRect();
      node.style.transform = previous;
      return side === 'left' ? outer.left - inner.left : outer.right - inner.right;
    };
    const shifts: Partial<Record<EdgeSide, number>> = {};

    const showFrame = ({ clip, edge }: Stage, frame: number) => {
      const rows = Math.ceil(clip.frames / COLUMNS);
      node.style.backgroundImage = `url(${clip.src})`;
      node.style.backgroundSize = `${COLUMNS * size}px ${rows * size}px`;
      node.style.backgroundPosition = `${-(frame % COLUMNS) * size}px ${-Math.floor(frame / COLUMNS) * size}px`;
      if (!edge || !clip.slide) {
        node.style.transform = '';
        return;
      }
      shifts[edge] ??= measureShift(edge);
      const progress = (frame + 1) / clip.frames;
      const ratio = clip.slide === 'in' ? progress : clip.slide === 'out' ? 1 - progress : 1;
      node.style.transform = `translateX(${(shifts[edge] ?? 0) * ratio}px)`;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showFrame({ clip: target.loop }, 0);
      if (once) {
        onOnceEndRef.current?.();
      }
      return undefined;
    }

    const queue: Stage[] = [];
    if (from?.exit) {
      queue.push({ clip: from.exit, edge: from.edge });
    }
    if (target.enter) {
      queue.push({ clip: target.enter, edge: target.edge });
    }
    queue.push({ clip: target.loop, edge: target.edge });
    let stageIndex = 0;
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
        const stage = queue[stageIndex];
        if (frame < stage.clip.frames) {
          continue;
        }
        if (stageIndex < queue.length - 1) {
          stageIndex += 1;
          frame = 0;
        } else if (once) {
          // 只播一次：停在最后一帧，交给外面切到下一个状态
          showFrame(stage, stage.clip.frames - 1);
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
