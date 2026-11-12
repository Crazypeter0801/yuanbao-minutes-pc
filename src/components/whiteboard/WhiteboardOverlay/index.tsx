import { useLayoutEffect, useRef, useState, type FC } from 'react';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import { WhiteboardBoardTools } from '@/components/whiteboard/WhiteboardBoardTools';
import { WhiteboardScene } from '@/components/whiteboard/WhiteboardScene';
import { WhiteboardToolbar } from '@/components/whiteboard/WhiteboardToolbar';
import { WhiteboardWindowControls } from '@/components/whiteboard/WhiteboardWindowControls';
import { getBoardFrame, type BoardSize } from '@/data/whiteboardScenario';
import { useWhiteboardDraw } from '@/hooks/useWhiteboardDraw';
import styles from './index.module.scss';

interface WhiteboardOverlayProps {
  /** 每次触发 +1，重播时清空白板 */
  runKey: number;
  /** 鼠标淡出后回调：App 往侧栏补一句「已画好」 */
  onComplete?: () => void;
}

/**
 * 元宝画白板（演示）
 * 盖在主讲人画面上的一层白板（Figma 221:30082）：白底 + 左侧工具栏 + 右上窗口控件 +
 * 右下缩放条 + 元宝 AI 鼠标。只负责渲染，画什么、画到哪一步由 useWhiteboardDraw 驱动；
 * 整块 pointer-events: none，不拦截会议区本身的交互。
 */
export const WhiteboardOverlay: FC<WhiteboardOverlayProps> = ({ runKey, onComplete }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<BoardSize | null>(null);
  const draw = useWhiteboardDraw({ size, runKey, onComplete });

  // 白板尺寸按实际像素量：图形坐标按它换算，侧栏开合时图形跟着重新铺，不会拉伸变形
  useLayoutEffect(() => {
    const node = boardRef.current;
    if (!node) {
      return undefined;
    }
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const frame = size ? getBoardFrame(size) : null;

  return (
    <div
      className={`${styles.overlay} ${draw.started ? styles.overlayStarted : ''}`}
      aria-hidden="true"
      data-whiteboard="active"
    >
      <div className={styles.board} ref={boardRef}>
        {size && frame && (
          <WhiteboardScene
            size={size}
            frame={frame}
            shapes={draw.shapes}
            dragBox={draw.dragBox}
            edges={draw.edges}
            chars={draw.chars}
            caret={draw.caret}
          />
        )}

        <WhiteboardWindowControls />
        <WhiteboardToolbar activeTool={draw.activeTool} pressedTool={draw.pressedTool} />
        <WhiteboardBoardTools />

        {size && draw.ripple && (
          <span
            key={draw.ripple.key}
            className={styles.ripple}
            style={{ left: draw.ripple.x, top: draw.ripple.y }}
          />
        )}

        {size && (
          <div
            className={`${styles.cursor} ${draw.cursor.visible ? styles.cursorVisible : ''} ${
              draw.cursor.pressing ? styles.cursorPressing : ''
            }`}
            style={{ transform: `translate3d(${draw.cursor.x}px, ${draw.cursor.y}px, 0)` }}
          >
            <svg className={styles.pointer} width="26" height="28" viewBox="0 0 22 24" fill="none">
              <path
                d="M3.2 2.2 3.2 18.4 7.5 14.3 10.3 20.6 13.2 19.3 10.4 13.2 16.6 12.9Z"
                className={styles.pointerBody}
              />
            </svg>
            <span className={styles.cursorAvatar}>
              <YuanbaoAvatar mood="working" size={34} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
