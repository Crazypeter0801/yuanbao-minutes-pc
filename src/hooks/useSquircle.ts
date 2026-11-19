import { useLayoutEffect, useRef } from 'react';
import { buildFigmaSquirclePath, supportsNativeCornerShape } from '@/utils/squircle';

/**
 * 为元素挂接 Apple 60% 连续平滑圆角（仅在浏览器不支持原生 CSS corner-shape 时启用 SVG clip-path 回退）。
 * 在支持 `corner-shape: superellipse(1.6)` 的浏览器中完全零开销，避免额外观察与重排。
 */
export function useSquircle<T extends HTMLElement>(radius: number, enabled = true) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled || supportsNativeCornerShape()) {
      return undefined;
    }

    const apply = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width <= 0 || height <= 0) {
        return;
      }
      const d = buildFigmaSquirclePath(width, height, radius, 0.6);
      el.style.clipPath = `path("${d}")`;
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.clipPath = '';
    };
  }, [radius, enabled]);

  return ref;
}
