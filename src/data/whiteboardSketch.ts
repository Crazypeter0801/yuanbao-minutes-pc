/**
 * 板书的手绘路径工具
 *
 * 把几何形状（圆、弧、折线、箭头）采样成一串点，加一点低频抖动再串成顺滑的二次曲线，
 * 让画出来的线看起来是手写的：起笔收笔略歪、圆不闭合、射线长短不齐。
 * 抖动用固定种子的伪随机数，同一条路径每次加载都一样，重播不会变形。
 */

export interface SketchPoint {
  x: number;
  y: number;
}

export interface SketchOptions {
  seed?: number;
  /** 抖动幅度（px），0 表示完全规整 */
  amp?: number;
  /** 采样点数，越多越顺滑 */
  samples?: number;
}

/** mulberry32：小而稳的定长种子随机数 */
const seededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const round = (value: number) => Math.round(value * 10) / 10;

/** 点列 → 抖动 → 二次曲线串成的 path（首尾点不抖，保证起止位置准确） */
function pathOf(points: SketchPoint[], { seed = 1, amp = 1.1 }: SketchOptions = {}): string {
  if (points.length < 2) {
    return '';
  }
  const random = seededRandom(seed);
  const jittered = points.map((point, index) => {
    if (index === 0 || index === points.length - 1) {
      return point;
    }
    const previous = points[index - 1];
    const next = points[index + 1] ?? point;
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    // 垂直方向的随机偏移 + 一条慢起伏，像手腕带着笔轻轻晃
    const offset = (random() - 0.5) * 2 * amp + Math.sin(index * 0.8 + seed) * amp * 0.4;
    return { x: point.x - (dy / length) * offset, y: point.y + (dx / length) * offset };
  });

  let d = `M${round(jittered[0].x)} ${round(jittered[0].y)}`;
  for (let index = 1; index < jittered.length - 1; index += 1) {
    const current = jittered[index];
    const next = jittered[index + 1];
    const midX = round((current.x + next.x) / 2);
    const midY = round((current.y + next.y) / 2);
    d += `Q${round(current.x)} ${round(current.y)} ${midX} ${midY}`;
  }
  const last = jittered[jittered.length - 1];
  d += `L${round(last.x)} ${round(last.y)}`;
  return d;
}

/** 按参数曲线采样 */
export function handCurve(
  build: (t: number) => SketchPoint,
  { samples = 64, ...options }: SketchOptions = {},
): string {
  const points: SketchPoint[] = [];
  for (let index = 0; index <= samples; index += 1) {
    points.push(build(index / samples));
  }
  return pathOf(points, options);
}

/** 圆：起点故意错开一点、收尾多绕 4°，看起来没完全封口 */
export function handCircle(cx: number, cy: number, r: number, options: SketchOptions = {}): string {
  const start = 200 + (options.seed ?? 0) * 13;
  return handCurve(
    (t) => {
      const angle = ((start + t * 356) * Math.PI) / 180;
      const radius = r + Math.sin(t * 9 + (options.seed ?? 1)) * 0.7;
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
    },
    { samples: 72, ...options },
  );
}

/** 圆弧：角度用度数，逆时针/顺时针都可以 */
export function handArc(
  cx: number,
  cy: number,
  r: number,
  fromDeg: number,
  toDeg: number,
  options: SketchOptions = {},
): string {
  return handCurve(
    (t) => {
      const angle = ((fromDeg + (toDeg - fromDeg) * t) * Math.PI) / 180;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    },
    { samples: 56, ...options },
  );
}

/** 折线 / 直线（多点会串成一条顺滑的线） */
export function handLine(points: SketchPoint[], options: SketchOptions = {}): string {
  return pathOf(points, options);
}

/** 手绘箭头：一条线 + 箭头两撇（分开的子路径，画的时候会连着描出来） */
export function handArrow(from: SketchPoint, to: SketchPoint, options: SketchOptions = {}): string {
  const head = 9;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const left = { x: to.x - Math.cos(angle - 0.5) * head, y: to.y - Math.sin(angle - 0.5) * head };
  const right = { x: to.x - Math.cos(angle + 0.5) * head, y: to.y - Math.sin(angle + 0.5) * head };
  return [
    handLine([from, to], options),
    handLine([left, to], { ...options, seed: (options.seed ?? 1) + 7 }),
    handLine([right, to], { ...options, seed: (options.seed ?? 1) + 13 }),
  ].join(' ');
}

/** 虚线弧：自己拆成一段段小弧，这样能被 dashoffset 逐段描出来（而不是整体平移） */
export function handDashedArc(
  cx: number,
  cy: number,
  r: number,
  fromDeg: number,
  toDeg: number,
  { dash = 7, gap = 6, ...options }: SketchOptions & { dash?: number; gap?: number } = {},
): string {
  const stepDeg = 360 / ((Math.PI * 2 * r) / (dash + gap));
  const parts: string[] = [];
  for (let angle = fromDeg; angle < toDeg; angle += stepDeg) {
    const end = Math.min(angle + (dash / (dash + gap)) * stepDeg, toDeg);
    parts.push(
      handArc(cx, cy, r, angle, end, { samples: 5, amp: 0.4, seed: (options.seed ?? 1) + angle }),
    );
  }
  return parts.join(' ');
}

/** 虚线直线 */
export function handDashedLine(
  from: SketchPoint,
  to: SketchPoint,
  { dash = 8, gap = 6, ...options }: SketchOptions & { dash?: number; gap?: number } = {},
): string {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const step = dash + gap;
  const parts: string[] = [];
  for (let done = 0; done < length; done += step) {
    const k0 = done / length;
    const k1 = Math.min((done + dash) / length, 1);
    parts.push(
      handLine(
        [
          { x: from.x + (to.x - from.x) * k0, y: from.y + (to.y - from.y) * k0 },
          { x: from.x + (to.x - from.x) * k1, y: from.y + (to.y - from.y) * k1 },
        ],
        { samples: 4, amp: 0.4, seed: (options.seed ?? 1) + done },
      ),
    );
  }
  return parts.join(' ');
}

/** 水滴：下面是圆，上面收成尖 */
export function handDrop(
  cx: number,
  cy: number,
  r: number,
  tipY: number,
  options: SketchOptions = {},
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  // 水滴主体是圆的下面大半圈：从左上肩 210° 绕左、底、右到右上肩 -30°
  const arcStart = 210;
  const arcEnd = -30;
  const shoulderRight = { x: cx + Math.cos(toRad(-30)) * r, y: cy + Math.sin(toRad(-30)) * r };
  const shoulderLeft = { x: cx + Math.cos(toRad(210)) * r, y: cy + Math.sin(toRad(210)) * r };
  const tip = { x: cx, y: tipY };

  return handCurve(
    (t) => {
      if (t <= 0.66) {
        const angle = toRad(arcStart + (arcEnd - arcStart) * (t / 0.66));
        return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
      }
      if (t <= 0.85) {
        // 右上肩 → 尖
        const k = (t - 0.66) / 0.19;
        const rest = 1 - k;
        const control = { x: cx + r * 0.5, y: cy - r * 1.3 };
        return {
          x: rest * rest * shoulderRight.x + 2 * rest * k * control.x + k * k * tip.x,
          y: rest * rest * shoulderRight.y + 2 * rest * k * control.y + k * k * tip.y,
        };
      }
      // 尖 → 左上肩
      const k = (t - 0.85) / 0.15;
      const rest = 1 - k;
      const control = { x: cx - r * 0.5, y: cy - r * 1.3 };
      return {
        x: rest * rest * tip.x + 2 * rest * k * control.x + k * k * shoulderLeft.x,
        y: rest * rest * tip.y + 2 * rest * k * control.y + k * k * shoulderLeft.y,
      };
    },
    { samples: 96, ...options },
  );
}
