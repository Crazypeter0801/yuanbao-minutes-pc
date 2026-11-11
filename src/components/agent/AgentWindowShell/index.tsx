import type { CSSProperties, FC, ReactNode } from 'react';
import { Toast, WINDOW_TOAST_ROOT_ID } from '@/components/common/Toast';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import type { ToastState } from '@/hooks/useToast';
import styles from './index.module.scss';

interface AgentWindowShellProps {
  /** 轻提示：在元宝窗口正中弹出（portal 到本窗口根节点） */
  toast: ToastState | null;
  dock: AgentDockControl;
  children: ReactNode;
}

/**
 * 元宝 personal agent 窗口外壳
 * - 吸附态：贴紧会议窗口右缘，和会议连成一体（无重阴影、不探出），左缘一条细线分隔；
 * - 分离态：浮动小窗，轻阴影，位置由拖动决定。
 * 同一个节点在两种形态间只换样式，对话滚动位置、输入内容不会丢。
 */
export const AgentWindowShell: FC<AgentWindowShellProps> = ({ toast, dock, children }) => {
  const floating = dock.mode === 'floating';
  const className = [
    styles.shell,
    floating ? styles.floating : styles.docked,
    dock.dragging ? styles.dragging : '',
    floating && dock.dockHint ? styles.nearDock : '',
  ]
    .filter(Boolean)
    .join(' ');
  const style: CSSProperties | undefined = floating
    ? { left: dock.position.x, top: dock.position.y }
    : undefined;

  return (
    <aside
      className={className}
      style={style}
      id={WINDOW_TOAST_ROOT_ID}
      ref={dock.panelRef}
      data-dock-mode={dock.mode}
      aria-label="元宝"
    >
      {children}
      <Toast toast={toast} placement="window" />
    </aside>
  );
};
