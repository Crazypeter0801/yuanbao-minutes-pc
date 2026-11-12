import { useEffect, useRef, type RefObject } from 'react';
import { WHITEBOARD_SPEED } from '@/data/whiteboardScenario';

/** 转向的时间常数（1 倍速，ms）：越小转得越快，跟着全局速度系数一起缩短 */
const TILT_TAU = 96;

/** 箭头默认指向左上：屏幕坐标里是 -135°，旋转角 0 就表示这个姿态 */
const DEFAULT_POINT_DEG = -135;

/** 角度归一到 (-180, 180]：-180 和 180 是同一个方向，不然缓动会绕远路 */
const wrapDeg = (deg: number) => {
  let value = deg % 360;
  if (value > 180) {
    value -= 360;
  }
  if (value <= -180) {
    value += 360;
  }
  return value;
};

/** 从 from 转到 to 的最短角度差（带符号，范围 (-180, 180]） */
const shortestDelta = (from: number, to: number) => wrapDeg(to - from);

interface Point {
  x: number;
  y: number;
  /** 笔尖切线方向（度）；有值时优先用它，没有再用位移推算 */
  heading?: number | null;
}

/**
 * AI 鼠标的箭头朝向
 *
 * 根据鼠标位移方向算目标角度，再按最短路径缓动，停下来回到默认朝向（指向左上）。
 * 运行时用 requestAnimationFrame 直接改 transform，不触发 React 重渲染；
 * 只作用于箭头层，元宝角色保持正立、只跟随位置。
 */
export function useCursorTilt(cursor: Point): RefObject<HTMLSpanElement> {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const positionRef = useRef(cursor);
  positionRef.current = cursor;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return undefined;
    }
    let raf = 0;
    const initialHeading = positionRef.current.heading;
    let angle = initialHeading != null ? wrapDeg(initialHeading - DEFAULT_POINT_DEG) : 0;
    let velocity = { x: 0, y: 0 };
    let last = { ...positionRef.current };
    let lastTime = performance.now();

    const tick = (now: number) => {
      // 按真实帧间隔做指数缓动：帧率波动不影响手感；时间常数跟着全局速度系数一起缩短
      const dt = Math.min(64, now - lastTime);
      lastTime = now;
      const current = positionRef.current;
      const dx = current.x - last.x;
      const dy = current.y - last.y;
      last = { x: current.x, y: current.y };

      // 方向取最近若干帧的平均：单帧抖动不至于让箭头乱摆
      velocity = { x: velocity.x * 0.72 + dx, y: velocity.y * 0.72 + dy };
      const speed = Math.hypot(velocity.x, velocity.y);
      // 逐笔绘制会一直带上固定朝向：不跟路径转，停笔、拐弯也不回正。
      // 没给朝向时（一次生成）仍按位移转向，停下回到默认。
      const heading = current.heading;
      const target =
        heading != null
          ? wrapDeg(heading - DEFAULT_POINT_DEG)
          : speed > 0.5
            ? wrapDeg((Math.atan2(velocity.y, velocity.x) * 180) / Math.PI - DEFAULT_POINT_DEG)
            : 0;

      if (heading != null) {
        // 有固定朝向就直接锁住，不缓动、不回正
        angle = target;
      } else {
        const ease = 1 - Math.exp(-dt / (TILT_TAU / WHITEBOARD_SPEED));
        angle = wrapDeg(angle + shortestDelta(angle, target) * ease);
      }
      node.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return nodeRef;
}
