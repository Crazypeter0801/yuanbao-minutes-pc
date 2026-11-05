import type { FC } from 'react';
import { createPortal } from 'react-dom';
import type { ToastState } from '@/hooks/useToast';
import styles from './index.module.scss';

/** 整个会议窗口的挂载点（App 里的 .window），窗口级 Toast 渲染到这里才能在整窗居中 */
export const WINDOW_TOAST_ROOT_ID = 'wm-window';

interface ToastProps {
  toast: ToastState | null;
  /**
   * 出现位置
   * - window：整个会议窗口正中（默认）；侧栏有 overflow 裁切，所以通过 portal 挂到窗口上
   * - top / bottom：父容器（需 position: relative）顶部或底部中央
   */
  placement?: 'window' | 'top' | 'bottom';
}

/** 轻提示，生命周期由 useToast 管理 */
export const Toast: FC<ToastProps> = ({ toast, placement = 'window' }) => {
  if (!toast) {
    return null;
  }

  const placementClass =
    placement === 'window' ? styles.center : placement === 'top' ? styles.top : '';

  const node = (
    <div className={`${styles.toast} ${placementClass}`} role="status" key={toast.id}>
      {toast.text}
    </div>
  );

  if (placement !== 'window') {
    return node;
  }
  const root = typeof document === 'undefined' ? null : document.getElementById(WINDOW_TOAST_ROOT_ID);
  return root ? createPortal(node, root) : node;
};
