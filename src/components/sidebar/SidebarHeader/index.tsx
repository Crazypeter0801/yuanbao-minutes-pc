import { useState, type FC } from 'react';
import IconSide3Close from '@/assets/d2c/icons/v2/icon-side3-close';
import IconSide3Logo from '@/assets/d2c/icons/v2/icon-side3-logo';
import IconSide3More from '@/assets/d2c/icons/v2/icon-side3-more';
import IconSide3Pip from '@/assets/d2c/icons/v2/icon-side3-pip';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface SidebarHeaderProps {
  /** 独立窗口打开 */
  onPip: () => void;
  /** 「更多」菜单项 */
  menuItems: PopMenuItem[];
  /** 关闭侧栏 */
  onClose: () => void;
}

/**
 * 侧栏头部（Figma 416:20844）
 * 左：元宝标 24 + 「元宝」12/17 600；右：独立窗口 / 更多 / 关闭，三个 20 的图标、间距 4。
 */
export const SidebarHeader: FC<SidebarHeaderProps> = ({ onPip, menuItems, onClose }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.logo}>
          <IconSide3Logo />
        </span>
        <span className={styles.titleText}>元宝</span>
      </div>

      <div className={styles.actions}>
        <Pressable className={styles.iconButton} onClick={onPip} title="独立窗口" ariaLabel="独立窗口打开">
          <IconSide3Pip />
        </Pressable>
        <div className={styles.moreWrap}>
          <Pressable
            className={styles.iconButton}
            onClick={() => setMenuOpen((open) => !open)}
            title="更多"
            ariaLabel="更多操作"
          >
            <IconSide3More />
          </Pressable>
          {menuOpen && <PopMenu items={menuItems} onClose={() => setMenuOpen(false)} />}
        </div>
        <Pressable className={styles.iconButton} onClick={onClose} title="关闭" ariaLabel="关闭元宝">
          <IconSide3Close />
        </Pressable>
      </div>
    </header>
  );
};
