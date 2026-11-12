import { useLayoutEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import { WhiteboardBoardTools } from '@/components/whiteboard/WhiteboardBoardTools';
import { WhiteboardPalette } from '@/components/whiteboard/WhiteboardPalette';
import { WhiteboardScene } from '@/components/whiteboard/WhiteboardScene';
import { WhiteboardToolbar } from '@/components/whiteboard/WhiteboardToolbar';
import { WhiteboardWindowControls } from '@/components/whiteboard/WhiteboardWindowControls';
import { WHITEBOARD_SPEED, getSceneTransform, type BoardSize } from '@/data/whiteboardScenario';
import { useCursorTilt } from '@/hooks/useCursorTilt';
import { useWhiteboardDraw } from '@/hooks/useWhiteboardDraw';
import styles from './index.module.scss';

/** 把全局速度系数透给 CSS：淡入淡出、涟漪、调色板弹出等动画时长跟着一起缩放 */
const speedStyle = { '--wb-speed-scale': 1 / WHITEBOARD_SPEED } as CSSProperties;

interface WhiteboardOverlayProps {
  /** 每次触发 +1，重播时清空白板 */
  runKey: number;
  /** 鼠标淡出后回调：App 往侧栏补一句「画好了」 */
  onComplete?: () => void;
}

/**
 * 元宝画白板（演示）
 * 盖在主讲人画面上的一层白板（Figma 221:30082）：白底 + 左侧工具栏（+ 画笔调色板）+
 * 右上窗口控件 + 右下缩放条 + 板书内容 + 元宝 AI 鼠标。
 * 只负责渲染，画什么、画到哪一步由 useWhiteboardDraw 驱动；整块 pointer-events: none。
 */
export const WhiteboardOverlay: FC<WhiteboardOverlayProps> = ({ runKey, onComplete }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<BoardSize | null>(null);
  const draw = useWhiteboardDraw({ size, runKey, onComplete });
  /** 箭头朝向跟着笔尖切线 / 鼠标移动方向转，停下回默认角度 */
  const arrowRef = useCursorTilt(draw.cursor);

  // 白板尺寸按实际像素量：板书按它等比缩放，侧栏开合时内容跟着重排，不会拉伸变形
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

  const transform = size ? getSceneTransform(size) : null;

  return (
    <div
      className={`${styles.overlay} ${draw.started ? styles.overlayStarted : ''}`}
      style={speedStyle}
      aria-hidden="true"
      data-whiteboard="active"
    >
      <div className={styles.board} ref={boardRef}>
        {transform && (
          <WhiteboardScene
            transform={transform}
            strokes={draw.strokes}
            fills={draw.fills}
            labels={draw.labels}
            caret={draw.caret}
          />
        )}

        <WhiteboardWindowControls />
        <WhiteboardToolbar activeTool={draw.activeTool} pressedTool={draw.pressedTool} />
        <WhiteboardPalette
          visible={draw.activeTool === 'ai-pen'}
          activeColor={draw.activeColor}
          pressedColor={draw.pressedColor}
        />
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
