import { useState, type FC } from 'react';
import IconSideClose from '@/assets/d2c/icons/schemes/icon-side-close';
import IconSideLogo from '@/assets/d2c/icons/schemes/icon-side-logo';
import IconSideMore from '@/assets/d2c/icons/schemes/icon-side-more';
import IconSidePip from '@/assets/d2c/icons/schemes/icon-side-pip';
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

/** 侧栏头部（Figma 245:5579）：元宝 Logo + 标题 | 独立窗口 / 更多 / 关闭 */
export const SidebarHeader: FC<SidebarHeaderProps> = ({ onPip, menuItems, onClose }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.logo}>
          <IconSideLogo />
        </span>
        <span className={styles.titleText}>元宝</span>
      </div>

      <div className={styles.actions}>
        <Pressable className={styles.iconButton} onClick={onPip} title="独立窗口" ariaLabel="独立窗口打开">
          <IconSidePip />
        </Pressable>
        <div className={styles.moreWrap}>
          <Pressable
            className={styles.iconButton}
            onClick={() => setMenuOpen((open) => !open)}
            title="更多"
            ariaLabel="更多操作"
          >
            <IconSideMore />
          </Pressable>
          {menuOpen && <PopMenu items={menuItems} onClose={() => setMenuOpen(false)} />}
        </div>
        <Pressable className={styles.iconButton} onClick={onClose} title="关闭" ariaLabel="关闭元宝">
          <IconSideClose />
        </Pressable>
      </div>
    </header>
  );
};
