/**
 * Apple / Figma 60% 连续曲率平滑圆角（squircle）工具
 *
 * - 支持原生 CSS `corner-shape: superellipse(1.6)` 的现代浏览器直接走原生渲染（零 JS 负担、不裁切外阴影/边框）；
 * - 不支持原生 `corner-shape` 的浏览器（如当前 Safari 或旧版 Chromium）回退到按 Figma 60% smoothing
 *   算法生成的精确 SVG `path(...)` 供 `clip-path` 使用。
 */

let cachedNativeSupport: boolean | null = null;

/** 检测浏览器是否原生支持 CSS corner-shape: superellipse(1.6) */
export function supportsNativeCornerShape(): boolean {
  if (cachedNativeSupport !== null) {
    return cachedNativeSupport;
  }
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    cachedNativeSupport = false;
    return false;
  }
  cachedNativeSupport = CSS.supports('corner-shape', 'superellipse(1.6)');
  return cachedNativeSupport;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;
const fmt = (n: number) => Number(n.toFixed(2));

/**
 * 按 Figma cornerSmoothing = 0.6（iOS/macOS 连续圆角标准）生成矩形的精确 SVG 路径。
 * 参考 Figma 官方 Squircle 几何推导：将纯圆弧拆分为两段三次贝塞尔过渡 + 中段圆弧。
 */
export function buildFigmaSquirclePath(
  width: number,
  height: number,
  radius: number,
  smoothing = 0.6,
): string {
  if (width <= 0 || height <= 0) {
    return '';
  }

  const maxR = Math.min(width, height) / 2;
  const r = Math.max(0, Math.min(radius, maxR));
  if (r === 0) {
    return `M0 0 H${fmt(width)} V${fmt(height)} H0 Z`;
  }

  const p = Math.min((1 + smoothing) * r, maxR);
  const effectiveSmoothing = Math.min(smoothing, p / r - 1);

  let angleAlpha: number;
  let angleBeta: number;
  if (r <= maxR / 2) {
    angleBeta = 90 * (1 - effectiveSmoothing);
    angleAlpha = 45 * effectiveSmoothing;
  } else {
    const diffRatio = (r - maxR / 2) / (maxR / 2);
    angleBeta = 90 * (1 - effectiveSmoothing * (1 - diffRatio));
    angleAlpha = 45 * effectiveSmoothing * (1 - diffRatio);
  }

  const angleTheta = (90 - angleBeta) / 2;
  const p3ToP4 = r * Math.tan(toRad(angleTheta / 2));
  const arcSectionLength = Math.sin(toRad(angleBeta / 2)) * r * Math.SQRT2;
  const c = p3ToP4 * Math.cos(toRad(angleAlpha));
  const d = c * Math.tan(toRad(angleAlpha));
  const b = (p - arcSectionLength - c - d) / 3;
  const a = 2 * b;

  const w = width;
  const h = height;

  return [
    `M${fmt(w - p)} 0`,
    // 右上角
    `C${fmt(w - (p - a))} 0 ${fmt(w - (p - a - b))} 0 ${fmt(w - (p - a - b - c))} ${fmt(d)}`,
    `A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(w - d)} ${fmt(p - a - b - c)}`,
    `C${fmt(w)} ${fmt(p - a - b)} ${fmt(w)} ${fmt(p - a)} ${fmt(w)} ${fmt(p)}`,
    `L${fmt(w)} ${fmt(h - p)}`,
    // 右下角
    `C${fmt(w)} ${fmt(h - (p - a))} ${fmt(w)} ${fmt(h - (p - a - b))} ${fmt(w - d)} ${fmt(h - (p - a - b - c))}`,
    `A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(w - (p - a - b - c))} ${fmt(h - d)}`,
    `C${fmt(w - (p - a - b))} ${fmt(h)} ${fmt(w - (p - a))} ${fmt(h)} ${fmt(w - p)} ${fmt(h)}`,
    `L${fmt(p)} ${fmt(h)}`,
    // 左下角
    `C${fmt(p - a)} ${fmt(h)} ${fmt(p - a - b)} ${fmt(h)} ${fmt(p - a - b - c)} ${fmt(h - d)}`,
    `A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(d)} ${fmt(h - (p - a - b - c))}`,
    `C0 ${fmt(h - (p - a - b))} 0 ${fmt(h - (p - a))} 0 ${fmt(h - p)}`,
    `L0 ${fmt(p)}`,
    // 左上角
    `C0 ${fmt(p - a)} 0 ${fmt(p - a - b)} ${fmt(d)} ${fmt(p - a - b - c)}`,
    `A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(p - a - b - c)} ${fmt(d)}`,
    `C${fmt(p - a - b)} 0 ${fmt(p - a)} 0 ${fmt(p)} 0`,
    'Z',
  ].join(' ');
}
