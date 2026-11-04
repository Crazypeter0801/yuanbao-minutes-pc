import type { FC, ReactNode } from 'react';
import { Toast } from '@/components/common/Toast';
import type { ToastState } from '@/hooks/useToast';
import styles from './index.module.scss';

interface SidebarShellProps {
  /** 当前侧栏的轻提示 */
  toast: ToastState | null;
  children: ReactNode;
}

/**
 * 元宝侧栏外壳（Figma 245:5578 / 248:13384）
 * 400×674 白底纵向布局；Toast 在侧栏头部下方弹出，不挡会议画面也不挡输入区。
 */
export const SidebarShell: FC<SidebarShellProps> = ({ toast, children }) => (
  <aside className={styles.shell} aria-label="元宝">
    {children}
    <Toast toast={toast} placement="top" />
  </aside>
);
