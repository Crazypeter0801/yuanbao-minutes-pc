import { useState, type FC, type ReactNode } from 'react';
import IconTab505Yuanbao from '@/assets/d2c/icons/sidetabs505/icon-tab505-yuanbao';
import IconTab574Chevron from '@/assets/d2c/icons/sidetabs574/icon-tab574-chevron';
import IconTab585Close from '@/assets/d2c/icons/sidetabs585/icon-tab585-close';
import IconTab585More from '@/assets/d2c/icons/sidetabs585/icon-tab585-more';
import IconTab585Pip from '@/assets/d2c/icons/sidetabs585/icon-tab585-pip';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface SidebarHeaderProps {
  /** 标题前的 20 图标，默认元宝标 */
  icon?: ReactNode;
  /** 标题文字，默认「元宝」 */
  title?: string;
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
 * 单侧栏头部（Figma 582:62255：376×44、padding 8）
 * 左：20 图标 + 4px + 12/14 标题；右：更多 / 独立窗口 / 关闭，三个 28×28 按钮（间距 2）。
 */
export const SidebarHeader: FC<SidebarHeaderProps> = ({
  icon,
  title = '元宝',
  onTitleClick,
  titleTooltip,
  onPip,
  menuItems,
  onClose,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const titleContent = (
    <>
      <span className={styles.logo}>{icon ?? <IconTab505Yuanbao width={20} height={20} />}</span>
      <span className={styles.titleText}>{title}</span>
      {onTitleClick && (
        <span className={styles.chevron} aria-hidden="true">
          <IconTab574Chevron width={5} height={10} />
        </span>
      )}
    </>
  );

  return (
    <header className={styles.header} aria-label={`${title}标题栏`}>
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

      {/* Figma 582:62274 顺序：更多 / 独立窗口 / 关闭 */}
      <div className={styles.actions}>
        <div className={styles.moreWrap}>
          <Pressable
            className={`${styles.iconButton} ${menuOpen ? styles.iconButtonActive : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            title="更多"
            ariaLabel="更多操作"
            ariaExpanded={menuOpen}
          >
            <IconTab585More width={28} height={28} />
          </Pressable>
          {menuOpen && <PopMenu items={menuItems} onClose={() => setMenuOpen(false)} />}
        </div>
        <Pressable className={styles.iconButton} onClick={onPip} title="独立窗口弹出" ariaLabel="独立窗口弹出">
          <IconTab585Pip width={28} height={28} />
        </Pressable>
        <Pressable className={styles.iconButton} onClick={onClose} title="关闭" ariaLabel={`关闭${title}`}>
          <IconTab585Close width={28} height={28} />
        </Pressable>
      </div>
    </header>
  );
};
