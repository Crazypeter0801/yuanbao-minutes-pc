import { useState, type FC, type ReactNode } from 'react';
import IconSide3Close from '@/assets/d2c/icons/v2/icon-side3-close';
import IconSide3Logo from '@/assets/d2c/icons/v2/icon-side3-logo';
import IconSide3More from '@/assets/d2c/icons/v2/icon-side3-more';
import IconSide3Pip from '@/assets/d2c/icons/v2/icon-side3-pip';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface SidebarHeaderProps {
  /** 标题前的 24 图标，默认元宝标 */
  icon?: ReactNode;
  /** 标题文字，默认「元宝」 */
  title?: string;
  /** 标题右侧可选状态徽标（方案 A 顶部任务状态入口） */
  titleStatus?: ReactNode;
  /** 点击标题区触发（如打开 Agent 详情页） */
  onTitleClick?: () => void;
  /** 标题区可点提示 */
  titleTooltip?: string;
  /** 独立窗口弹出 */
  onPip: () => void;
  /** 「更多」菜单项 */
  menuItems: PopMenuItem[];
  /** 关闭侧栏 */
  onClose: () => void;
}

/**
 * 单应用侧栏头部（Figma 416:20844 + 方案 A 顶部 Agent 详情入口）
 */
export const SidebarHeader: FC<SidebarHeaderProps> = ({
  icon,
  title = '元宝',
  titleStatus,
  onTitleClick,
  titleTooltip,
  onPip,
  menuItems,
  onClose,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const titleContent = (
    <>
      <span className={styles.logo}>{icon ?? <IconSide3Logo />}</span>
      <span className={styles.titleMeta}>
        <span className={styles.titleRow}>
          <span className={styles.titleText}>{title}</span>
          {onTitleClick && (
            <svg className={styles.chevron} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M4.4 2.8 7.6 6 4.4 9.2"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {titleStatus && <span className={styles.titleStatus}>{titleStatus}</span>}
      </span>
    </>
  );

  return (
    <header className={styles.header}>
      {onTitleClick ? (
        <Pressable
          className={`${styles.title} ${styles.titleClickable}`}
          onClick={onTitleClick}
          title={titleTooltip ?? `查看${title}详情`}
          ariaLabel={titleTooltip ?? `查看${title}详情`}
        >
          {titleContent}
        </Pressable>
      ) : (
        <div className={styles.title}>{titleContent}</div>
      )}

      <div className={styles.actions}>
        <Pressable className={styles.iconButton} onClick={onPip} title="独立窗口弹出" ariaLabel="独立窗口弹出">
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
        <Pressable className={styles.iconButton} onClick={onClose} title="关闭" ariaLabel={`关闭${title}`}>
          <IconSide3Close />
        </Pressable>
      </div>
    </header>
  );
};
