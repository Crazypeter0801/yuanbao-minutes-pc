import { useRef, useState, type FC, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import IconTab574Chevron from '@/assets/d2c/icons/sidetabs574/icon-tab574-chevron';
import IconTab582DockBack from '@/assets/d2c/icons/sidetabs585/icon-tab582-dock-back';
import IconTab585Close from '@/assets/d2c/icons/sidetabs585/icon-tab585-close';
import { Pressable } from '@/components/common/Pressable';
import { SIDE_APPS, type SideAppId } from '@/components/sidebar/SideDock/apps';
import styles from './index.module.scss';

interface FloatingWindowProps {
  id: SideAppId;
  /** 默认左上角坐标（相对于主窗口舞台） */
  defaultOffset: { x: number; y: number };
  zIndex: number;
  onFocus: () => void;
  /** 吸附回主窗口侧栏 */
  onDockBack: () => void;
  /** 关闭浮窗 */
  onClose: () => void;
  /** 点击标题（例如元宝浮窗里打开 Agent 详情页） */
  onTitleClick?: () => void;
  children: ReactNode;
}

/**
 * 从侧栏弹出（浮出）后的独立窗口：
 * 保持 376×779 卡片尺寸，按住顶部条可自由拖拽，右上角支持一键吸附回侧栏或关闭（与停靠态关闭图标一致）。
 */
export const FloatingWindow: FC<FloatingWindowProps> = ({
  id,
  defaultOffset,
  zIndex,
  onFocus,
  onDockBack,
  onClose,
  onTitleClick,
  children,
}) => {
  const meta = SIDE_APPS[id];
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number } | null>(null);

  const pos = dragOffset ?? defaultOffset;

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('[data-nodrag]')) {
      return;
    }
    onFocus();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: pos.x,
      startY: pos.y,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const start = dragStartRef.current;
    if (!start) {
      return;
    }
    setDragOffset({
      x: start.startX + (event.clientX - start.pointerX),
      y: start.startY + (event.clientY - start.pointerY),
    });
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragStartRef.current) {
      return;
    }
    dragStartRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <aside
      className={`${styles.floating} ${dragging ? styles.dragging : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, zIndex }}
      aria-label={`${meta.title}独立窗口`}
      onPointerDown={onFocus}
    >
      <header
        className={styles.titleBar}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="按住拖动独立窗口"
      >
        <div className={styles.title}>
          {onTitleClick ? (
            <Pressable
              className={styles.titleButton}
              onClick={onTitleClick}
              ariaLabel={`查看${meta.title} Agent 详情`}
              title={`查看${meta.title} Agent 详情`}
              stopPropagation
            >
              <span className={styles.icon}>{meta.icon585On}</span>
              <span className={styles.label}>{meta.title}</span>
              <IconTab574Chevron width={5} height={10} aria-hidden="true" />
            </Pressable>
          ) : (
            <div className={styles.titleStatic}>
              <span className={styles.icon}>{meta.icon585On}</span>
              <span className={styles.label}>{meta.title}</span>
            </div>
          )}
        </div>
        <div className={styles.actions} data-nodrag>
          <Pressable
            className={styles.actionButton}
            onClick={onDockBack}
            ariaLabel={`将${meta.title}合并到主窗口`}
            title="合并到主窗口"
          >
            <IconTab582DockBack width={28} height={28} />
          </Pressable>
          <Pressable
            className={styles.actionButton}
            onClick={onClose}
            ariaLabel={`关闭${meta.title}独立窗口`}
            title="关闭"
          >
            <IconTab585Close width={28} height={28} />
          </Pressable>
        </div>
      </header>
      <div className={styles.content}>{children}</div>
    </aside>
  );
};
