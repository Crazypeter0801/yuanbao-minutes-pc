import type { FC } from 'react';
import { YuanbaoAvatar } from '@/components/agent/YuanbaoAvatar';
import { useCursorTilt } from '@/hooks/useCursorTilt';
import styles from './index.module.scss';

export interface WhiteboardCursorState {
  x: number;
  y: number;
  visible: boolean;
  pressing: boolean;
  /** 笔尖切线方向（度）；为空时由位移推算 */
  heading: number | null;
}

interface WhiteboardCursorProps {
  cursor: WhiteboardCursorState;
}

/**
 * 元宝 AI 鼠标：黑箭头 + 右下角元宝小角色
 * 箭头层单独旋转（旋转中心在尖端），角度由 useCursorTilt 缓动；角色保持正立只跟随位置。
 * 坐标是白板像素，组件自己负责定位，白板上的两种演示（逐笔 / 一次生成）共用。
 */
export const WhiteboardCursor: FC<WhiteboardCursorProps> = ({ cursor }) => {
  const arrowRef = useCursorTilt(cursor);
  /** 角色立在箭头左下方；贴到白板左缘时往右推，避免被裁掉 */
  const avatarLeft = Math.max(-48, 8 - cursor.x);

  return (
    <div
      className={`${styles.cursor} ${cursor.visible ? styles.cursorVisible : ''} ${
        cursor.pressing ? styles.cursorPressing : ''
      }`}
      style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
      aria-hidden="true"
    >
      <span className={styles.cursorArrow} ref={arrowRef}>
        <svg className={styles.arrowGlyph} width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M4.2 3 4.2 22.4 9.4 17.2 12.8 24.2 16.6 22.4 13.3 15.6 20.4 15.1Z"
            className={styles.arrowBody}
          />
        </svg>
      </span>
      <span className={styles.cursorAvatar} style={{ left: avatarLeft }}>
        <YuanbaoAvatar mood="working" size={56} />
      </span>
    </div>
  );
};
