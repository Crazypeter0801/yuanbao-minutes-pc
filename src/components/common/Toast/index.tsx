import type { FC } from 'react';
import type { ToastState } from '@/hooks/useToast';
import styles from './index.module.scss';

interface ToastProps {
  toast: ToastState | null;
  /** 出现位置：侧栏底部是输入区，放顶部避免遮挡 */
  placement?: 'top' | 'bottom';
}

/** 轻提示：出现在父容器（需 position: relative）顶部或底部中央，生命周期由 useToast 管理 */
export const Toast: FC<ToastProps> = ({ toast, placement = 'bottom' }) => {
  if (!toast) {
    return null;
  }

  return (
    <div
      className={`${styles.toast} ${placement === 'top' ? styles.top : ''}`}
      role="status"
      key={toast.id}
    >
      {toast.text}
    </div>
  );
};
