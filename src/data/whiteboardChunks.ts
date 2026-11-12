import type { BoardStroke } from '@/data/whiteboardScenario';

/** 一段笔画被切开后的小图块：每块都按自己的包围盒渲染成一个小 SVG */
export interface StrokeChunk {
  id: string;
  /** 子路径（设计坐标，折线近似） */
  d: string;
  color: string;
  width: number;
  /** 设计坐标中的包围盒（含描边余量） */
  x: number;
  y: number;
  w: number;
  h: number;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const round = (value: number) => Math.round(value * 10) / 10;

/**
 * 把一笔长路径切成若干短块
 *
 * generate(el, { variant: "ui" }) 只描 ≤120px 的 inline SVG，所以把整张画切成
 * 一块块小 SVG 就能让点阵线框沿真实笔迹画出来，而不是只有一个外框。
 * 每块之间按子路径（M）分开，避免跨笔画的直线把两段不相连的线连起来。
 */
export function splitStrokes(strokes: BoardStroke[], chunkLength: number): StrokeChunk[] {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const path = document.createElementNS(SVG_NS, 'path');
  svg.style.position = 'absolute';
  svg.style.left = '-9999px';
  svg.appendChild(path);
  document.body.appendChild(svg);

  const chunks: StrokeChunk[] = [];
  try {
    strokes.forEach((stroke) => {
      // 我们的路径都是绝对命令，子路径一定从 M 开始
      const subPaths = stroke.d.split(/(?=M)/).filter(Boolean);
      subPaths.forEach((subPath, subIndex) => {
        path.setAttribute('d', subPath);
        const total = path.getTotalLength();
        if (!total) {
          return;
        }
        const count = Math.max(1, Math.ceil(total / chunkLength));
        for (let index = 0; index < count; index += 1) {
          const from = (total * index) / count;
          const to = (total * (index + 1)) / count;
          const steps = Math.max(6, Math.ceil((to - from) / 5));
          const points = Array.from({ length: steps + 1 }, (_, step) =>
            path.getPointAtLength(from + ((to - from) * step) / steps),
          );
          const xs = points.map((point) => point.x);
          const ys = points.map((point) => point.y);
          const pad = 3;
          const x = Math.min(...xs) - pad;
          const y = Math.min(...ys) - pad;
          chunks.push({
            id: `${stroke.id}-${subIndex}-${index}`,
            d: `M${points.map((point) => `${round(point.x)} ${round(point.y)}`).join('L')}`,
            color: stroke.color,
            width: stroke.width,
            x,
            y,
            w: Math.max(Math.max(...xs) - Math.min(...xs) + pad * 2, 8),
            h: Math.max(Math.max(...ys) - Math.min(...ys) + pad * 2, 8),
          });
        }
      });
    });
  } finally {
    svg.remove();
  }
  return chunks;
}
