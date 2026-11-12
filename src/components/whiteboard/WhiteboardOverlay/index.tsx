import { useLayoutEffect, useRef, useState, type FC } from 'react';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import { WhiteboardBoardTools } from '@/components/whiteboard/WhiteboardBoardTools';
import { WhiteboardScene } from '@/components/whiteboard/WhiteboardScene';
import { WhiteboardToolbar } from '@/components/whiteboard/WhiteboardToolbar';
import { WhiteboardWindowControls } from '@/components/whiteboard/WhiteboardWindowControls';
import { getBoardFrame, type BoardSize } from '@/data/whiteboardScenario';
import { useCursorTilt } from '@/hooks/useCursorTilt';
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
  /** 箭头朝向跟着鼠标移动方向转，停下回默认角度 */
  const arrowRef = useCursorTilt(draw.cursor);

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

  /**
   * 角色立在箭头左下方；鼠标贴到白板左缘（点工具栏时）会把角色挤出画面，
   * 这时把角色往右推、紧贴左缘，避免被裁掉。
   */
  const avatarLeft = Math.max(-48, 8 - draw.cursor.x);

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
            {/* 箭头层：只转这一层，旋转中心在箭头尖端 */}
            <span className={styles.cursorArrow} ref={arrowRef}>
              <svg className={styles.arrowGlyph} width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path
                  d="M4.2 3 4.2 22.4 9.4 17.2 12.8 24.2 16.6 22.4 13.3 15.6 20.4 15.1Z"
                  className={styles.arrowBody}
                />
              </svg>
            </span>
            {/* 元宝：不跟着转，只跟随位置，立在箭头左下方 */}
            <span className={styles.cursorAvatar} style={{ left: avatarLeft }}>
              <YuanbaoAvatar mood="working" size={56} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
