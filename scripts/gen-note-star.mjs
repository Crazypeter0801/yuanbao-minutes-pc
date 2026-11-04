/**
 * 生成「元宝正在记笔记」星星动画（圆点 → 圆角方块 → 四芒星 → 圆点，边变形边转一圈）
 *
 * 动作参数来自企业微信表情 GIF（36×36、45 帧、每帧 40ms，共 1.8s）的逐帧拟合：
 *   每帧把轮廓按极坐标展开成 r(θ)，做 4 / 8 / 12 次谐波傅里叶拟合，得到
 *   - p：「星形程度」0（圆）→ 1（四芒星），= 4 次谐波幅值 / 3.42
 *   - rot：尖角朝向（展开后的累计角度，一圈 0° → 360°）
 * 轮廓模型 r(θ) = R0 + a4·cos4θ + a8·cos8θ + a12·cos12θ，系数都是 p 的函数，
 * 谷底半径始终 ≈ 8，只有四个尖角向外长出去（和原 GIF 一致）。
 *
 * 产物（都是纯矢量，无位图）：
 *   src/assets/anim/note-star.svg              独立 SVG（SMIL 动画，可直接 <img> 引用 / 拖进浏览器看）
 *   src/components/sidebar/NoteStar/frames.ts  React 组件用的关键帧数据
 *
 * 用法：node scripts/gen-note-star.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const FRAMES = 45;
const DURATION_MS = FRAMES * 40;
/**
 * 输出画布 16×16，与 Figma 星星图标（317:6078）同尺寸：
 * 设计稿四芒星宽 10.46、中心 (8, 8.67)，所以把 GIF 的 36 坐标系按「峰值尖角半径 15.42 → 5.23」缩放，
 * 圆点静止时直径约 5.8px，完整四芒星与设计稿静态图标等大。
 */
const VIEWBOX = 16;
const CENTER_X = 8;
const CENTER_Y = 8.67;
const SCALE = 5.23 / 15.42;
const COLOR = '#7B818F';
/** 每 22.5° 一段贝塞尔（4 段 / 象限）：最大误差 0.07 viewBox 单位（16px 显示时 ≈ 0.03px），体积约 15KB */
const SEGMENTS = 16;

// ---- GIF 逐帧拟合结果（帧 0-3、42-44 为静止圆点） ----
// prettier-ignore
const P_RAW = [0, 0, 0, 0, 0.02, 0.04, 0.08, 0.10, 0.17, 0.25, 0.32, 0.37, 0.45, 0.53, 0.61, 0.70, 0.77, 0.82, 0.87, 0.92, 0.94, 1, 1, 0.99, 1, 0.94, 0.95, 0.87, 0.84, 0.78, 0.70, 0.61, 0.51, 0.46, 0.38, 0.29, 0.23, 0.18, 0.13, 0.085, 0.06, 0.02, 0, 0, 0];
// prettier-ignore
const ROT_RAW = [0, 0, 0, 0, 3, 6.9, 8.1, 12.2, 17.1, 24.1, 30.8, 38.8, 45.5, 55.7, 65, 76.3, 88.4, 101.7, 116.1, 130.6, 145.2, 161.3, 177.4, 193.2, 209.2, 224.4, 238.7, 253.3, 266.1, 278.4, 289.6, 300.5, 309.5, 317.5, 325, 331.3, 338.4, 344.2, 347.7, 351.3, 354, 357, 360, 360, 360];

/** 3 点平滑，去掉逐帧测量抖动（首尾的静止段保持不动） */
const smooth = (arr) =>
  arr.map((v, i) => (i === 0 || i === arr.length - 1 ? v : (arr[i - 1] + 2 * v + arr[i + 1]) / 4));

const P = smooth(P_RAW);
const ROT = smooth(ROT_RAW);

/** 轮廓系数（由 GIF 峰值帧 a4=3.42 / a8=0.88 / a12=0.19、R0 8.56→10.71 拟合） */
const coeffs = (p) => ({
  r0: (8.56 + 2.15 * p) * SCALE,
  a4: 3.42 * p * SCALE,
  a8: 0.88 * p ** 1.6 * SCALE,
  a12: 0.19 * p ** 2 * SCALE,
});

const radius = (c, t) => c.r0 + c.a4 * Math.cos(4 * t) + c.a8 * Math.cos(8 * t) + c.a12 * Math.cos(12 * t);
const radiusDeriv = (c, t) =>
  -4 * c.a4 * Math.sin(4 * t) - 8 * c.a8 * Math.sin(8 * t) - 12 * c.a12 * Math.sin(12 * t);

const fmt = (n, digits = 2) => {
  const s = n.toFixed(digits).replace(/\.?0+$/, '');
  return s === '-0' ? '0' : s;
};
/** keyTimes 需要 4 位小数，否则相邻帧会四舍五入成同一时刻 */
const fmtTime = (n) => fmt(n, 4);

/** 用解析切线做 Hermite → 三次贝塞尔，闭合曲线；每帧命令结构完全相同，SMIL 才能逐点插值 */
const pathFor = (p) => {
  const c = coeffs(p);
  const step = (2 * Math.PI) / SEGMENTS;
  const pt = (t) => {
    const r = radius(c, t);
    const dr = radiusDeriv(c, t);
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    return {
      x: CENTER_X + r * cos,
      y: CENTER_Y + r * sin,
      dx: dr * cos - r * sin,
      dy: dr * sin + r * cos,
    };
  };
  const k = step / 3;
  let a = pt(0);
  let d = `M${fmt(a.x)} ${fmt(a.y)}`;
  for (let i = 1; i <= SEGMENTS; i += 1) {
    const b = pt(i * step);
    d += `C${fmt(a.x + a.dx * k)} ${fmt(a.y + a.dy * k)} ${fmt(b.x - b.dx * k)} ${fmt(b.y - b.dy * k)} ${fmt(b.x)} ${fmt(b.y)}`;
    a = b;
  }
  return `${d}Z`;
};

// ---- 关键帧：形状每 2 帧取一个（形状变化慢），旋转逐帧取 ----
const shapeIdx = [];
for (let i = 3; i <= 42; i += 2) shapeIdx.push(i);
if (shapeIdx[shapeIdx.length - 1] !== 42) shapeIdx.push(42);
const shapeKeys = [0, ...shapeIdx, FRAMES];
const shapeTimes = shapeKeys.map((i) => fmtTime(i / FRAMES));
const shapeValues = shapeKeys.map((i) => pathFor(i === FRAMES ? 0 : P[i]));

const rotKeys = [];
for (let i = 3; i <= 42; i += 1) rotKeys.push(i);
const rotAll = [0, ...rotKeys, FRAMES];
const rotTimes = rotAll.map((i) => fmtTime(i / FRAMES));
const rotValues = rotAll.map((i) => (i === FRAMES ? 360 : ROT[i]));

/** 暂停 / 减少动态效果时停在「完整四芒星」那一帧（第 22 帧） */
const REST_FRAME = 22;
const restPath = pathFor(P[REST_FRAME]);
const restRotate = ROT[REST_FRAME];
const restTime = REST_FRAME / FRAMES;

// ---- 独立 SVG ----
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX}" height="${VIEWBOX}" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}">
  <!-- 元宝正在记笔记：圆点 → 圆角方块 → 四芒星 → 圆点，边变形边转一圈，循环 ${DURATION_MS / 1000}s。由 scripts/gen-note-star.mjs 生成 -->
  <g>
    <animateTransform attributeName="transform" type="rotate" dur="${DURATION_MS}ms" repeatCount="indefinite" keyTimes="${rotTimes.join(';')}" values="${rotValues.map((v) => `${fmt(v)} ${CENTER_X} ${CENTER_Y}`).join(';')}"/>
    <path fill="${COLOR}" d="${shapeValues[0]}">
      <animate attributeName="d" dur="${DURATION_MS}ms" repeatCount="indefinite" keyTimes="${shapeTimes.join(';')}" values="${shapeValues.join(';')}"/>
    </path>
  </g>
</svg>
`;

// ---- React 关键帧数据 ----
const ts = `// 由 scripts/gen-note-star.mjs 生成，请勿手改
export const NOTE_STAR_VIEWBOX = ${VIEWBOX};
export const NOTE_STAR_DURATION_MS = ${DURATION_MS};
export const NOTE_STAR_SHAPE_KEY_TIMES = ${JSON.stringify(shapeTimes.join(';'))};
export const NOTE_STAR_SHAPE_VALUES = ${JSON.stringify(shapeValues.join(';'))};
export const NOTE_STAR_ROTATE_KEY_TIMES = ${JSON.stringify(rotTimes.join(';'))};
export const NOTE_STAR_ROTATE_VALUES = ${JSON.stringify(rotValues.map((v) => `${fmt(v)} ${CENTER_X} ${CENTER_Y}`).join(';'))};
/** 暂停时停留的完整四芒星 */
export const NOTE_STAR_REST_PATH = ${JSON.stringify(restPath)};
export const NOTE_STAR_REST_ROTATE = ${fmt(restRotate)};
/** 完整四芒星在一个循环里的时间点（秒） */
export const NOTE_STAR_REST_TIME_S = ${fmtTime((restTime * DURATION_MS) / 1000)};
`;

const svgPath = resolve(ROOT, 'src/assets/anim/note-star.svg');
const tsPath = resolve(ROOT, 'src/components/sidebar/NoteStar/frames.ts');
mkdirSync(dirname(svgPath), { recursive: true });
mkdirSync(dirname(tsPath), { recursive: true });
writeFileSync(svgPath, svg);
writeFileSync(tsPath, ts);

// 自检：贝塞尔中点与真实轮廓的最大偏差
let maxErr = 0;
for (const p of [0, 0.5, 1]) {
  const c = coeffs(p);
  const step = (2 * Math.PI) / SEGMENTS;
  for (let i = 0; i < SEGMENTS; i += 1) {
    const t0 = i * step;
    const P0 = [radius(c, t0) * Math.cos(t0), radius(c, t0) * Math.sin(t0)];
    const t1 = t0 + step;
    const P3 = [radius(c, t1) * Math.cos(t1), radius(c, t1) * Math.sin(t1)];
    const d0 = [radiusDeriv(c, t0) * Math.cos(t0) - radius(c, t0) * Math.sin(t0), radiusDeriv(c, t0) * Math.sin(t0) + radius(c, t0) * Math.cos(t0)];
    const d1 = [radiusDeriv(c, t1) * Math.cos(t1) - radius(c, t1) * Math.sin(t1), radiusDeriv(c, t1) * Math.sin(t1) + radius(c, t1) * Math.cos(t1)];
    const k = step / 3;
    const P1 = [P0[0] + d0[0] * k, P0[1] + d0[1] * k];
    const P2 = [P3[0] - d1[0] * k, P3[1] - d1[1] * k];
    const mid = [0, 1].map((j) => 0.125 * P0[j] + 0.375 * P1[j] + 0.375 * P2[j] + 0.125 * P3[j]);
    const tm = t0 + step / 2;
    const rm = radius(c, tm);
    maxErr = Math.max(maxErr, Math.abs(Math.hypot(mid[0], mid[1]) - rm));
  }
}
console.log(`note-star.svg ${svg.length} B, frames.ts ${ts.length} B, 形状关键帧 ${shapeValues.length}，旋转关键帧 ${rotValues.length}，贝塞尔最大误差 ${maxErr.toFixed(4)}`);
