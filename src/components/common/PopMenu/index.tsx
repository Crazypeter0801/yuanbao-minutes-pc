import type { FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.css';

export interface PopMenuItem {
  key: string;
  label: string;
  /** 当前选中项（显示勾选态） */
  active?: boolean;
  onClick: () => void;
}

interface PopMenuProps {
  items: PopMenuItem[];
  /** 关闭菜单 */
  onClose: () => void;
  /** 相对触发按钮的水平对齐 */
  align?: 'left' | 'right';
  /** 向上还是向下弹出（底部输入区的菜单需要向上） */
  placement?: 'bottom' | 'top';
}

/**
 * 轻量下拉菜单
 * 用一层透明遮罩承接外部点击，避免为每个触发器维护 ref 与全局监听。
 * 父容器需设置 position: relative。
 */
export const PopMenu: FC<PopMenuProps> = ({ items, onClose, align = 'right', placement = 'bottom' }) => {
  const menuClassName = [
    styles.menu,
    align === 'right' ? styles.menuRight : '',
    placement === 'top' ? styles.menuTop : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={styles.mask} onClick={onClose} aria-hidden="true" />
      <div className={menuClassName} role="menu">
        {items.map((item) => (
          <Pressable
            key={item.key}
            className={`${styles.item} ${item.active ? styles.itemActive : ''}`}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </Pressable>
        ))}
      </div>
    </>
  );
};
