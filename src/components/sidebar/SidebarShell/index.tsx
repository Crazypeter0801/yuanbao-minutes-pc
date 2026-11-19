import type { CSSProperties, FC, ReactNode } from 'react';
import { Toast } from '@/components/common/Toast';
import type { ToastState } from '@/hooks/useToast';
import styles from './index.module.scss';

interface SidebarShellProps {
  /** 当前侧栏的轻提示 */
  toast: ToastState | null;
  /** 读屏标签 */
  label?: string;
  /** 侧栏正文字号（全局更多菜单里调），写到 --wm-side-font-size */
  fontSize?: number;
  children: ReactNode;
}

/**
 * 元宝侧栏外壳（Figma 316:2624）
 * 400 宽白色圆角卡片，高度随窗口；Toast 在整个会议窗口正中弹出（portal 到窗口根节点）。
 */
export const SidebarShell: FC<SidebarShellProps> = ({ toast, label = '元宝', fontSize, children }) => (
  <aside
    className={styles.shell}
    aria-label={label}
    style={fontSize ? ({ '--wm-side-font-size': `${fontSize}px` } as CSSProperties) : undefined}
  >
    {children}
    <Toast toast={toast} placement="window" />
  </aside>
);
