import { Fragment, useEffect, useRef, useState, type FC, type ReactNode, type TransitionEvent } from 'react';
import iconTabClose811 from '@/assets/d2c/frame811/icon-tab-close.svg';
import iconTabDropdown811 from '@/assets/d2c/frame811/icon-tab-dropdown.svg';
import iconTabPip811 from '@/assets/d2c/frame811/icon-tab-pip.svg';
import { Pressable } from '@/components/common/Pressable';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { useToast } from '@/hooks/useToast';
import { SIDE_APPS, SIDE_APP_ORDER, type SideAppId } from './apps';
import styles from './index.module.scss';

export type { SideAppId } from './apps';

/** 下拉菜单里的字号档位 */
const FONT_SIZES = [
  { label: '小', value: 12 },
  { label: '标准', value: 14 },
  { label: '大', value: 16 },
  { label: '特大', value: 18 },
] as const;

export interface SideAppContext {
  /** 只开了一个应用：显示应用自己的标题栏；并开多个时由顶部标签栏代替 */
  showHeader: boolean;
}

interface SideDockProps {
  /** 已停靠在侧栏的应用 */
  apps: SideAppId[];
  /** 正在看的应用；null 表示侧栏正在收起 / 已收起 */
  active: SideAppId | null;
  onSelect: (id: SideAppId) => void;
  /** 关掉某个标签页（标签上的 × 或应用标题栏的 ×） */
  onCloseApp: (id: SideAppId) => void;
  /** 弹出某个应用为独立浮窗 */
  onPopOutApp: (id: SideAppId) => void;
  /** 「更多 → 关闭所有窗口」 */
  onCloseAll: () => void;
  /** 菜单项：打开/切换元宝 Agent 详情页 */
  onToggleYuanbaoDetail?: () => void;
  /** 收起动画走完：此时再清空残留内容 */
  onClosed: () => void;
  renderApp: (id: SideAppId, context: SideAppContext) => ReactNode;
}

/**
 * 侧栏容器（Figma 811:25080 / 811:25081）
 *
 * - 顶部 40px 浅灰顶条（#F3F3F4，pt 2px）：激活页签铺白底并展示图标 + 文案 +「独立窗口 / 关闭」按钮；
 *   未选中页签宽 84px 展示图标 + 短文案（聊天 / 成员），相邻未选中项间及尾部用 1×14 #D3D6DB 竖线分隔；
 * - 最右侧 36×28 下拉箭头展开更多操作菜单（字体大小、Agent 详情、独立窗口与关闭所有窗口）；
 * - 打开 / 收起：槽位宽度 0 ↔ 378（2px 分隔 + 376 侧栏），主窗口向左收缩 / 向右展开，左侧会中区宽度锁定 1019 不变。
 */
export const SideDock: FC<SideDockProps> = ({
  apps,
  active,
  onSelect,
  onCloseApp,
  onPopOutApp,
  onCloseAll,
  onToggleYuanbaoDetail,
  onClosed,
  renderApp,
}) => {
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const trailingRef = useRef<HTMLDivElement>(null);
  const open = active !== null;
  /** 收起过程中保留最后看的那个应用，避免收起动画还没走完内容先变白 */
  const lastShown = useRef<SideAppId | null>(active);
  if (active) {
    lastShown.current = active;
  }
  const shown = active ?? lastShown.current;
  const ordered = SIDE_APP_ORDER.filter((id) => apps.includes(id));
  const multiple = ordered.length > 1;

  useEffect(() => {
    if (!open && apps.length && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClosed();
    }
  }, [open, apps.length, onClosed]);

  useEffect(() => {
    setMenuOpen(false);
  }, [shown, multiple, open]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trailingRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === 'width' && !open) {
      onClosed();
    }
  };

  return (
    <div
      className={`${styles.slot} ${open ? styles.slotOpen : ''}`}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={!open}
    >
      <SidebarShell toast={toast} label={shown ? SIDE_APPS[shown].title : '侧栏'} fontSize={fontSize}>
        {multiple && (
          <nav className={styles.folderBar} aria-label="侧栏应用">
            <div className={styles.folderTabs} role="tablist" aria-label="侧栏页签">
              {ordered.map((id, index) => {
                const meta = SIDE_APPS[id];
                const isActive = id === shown;
                const prevId = index > 0 ? ordered[index - 1] : null;
                const needLeftDivider = !isActive && prevId !== null && prevId !== shown;

                if (!isActive) {
                  return (
                    <Fragment key={id}>
                      {needLeftDivider && <span className={styles.folderDivider} aria-hidden="true" />}
                      <Pressable
                        className={styles.folderTabInactive}
                        onClick={() => onSelect(id)}
                        ariaLabel={meta.title}
                        title={meta.title}
                      >
                        <span className={styles.folderTabIcon}>{meta.icon585Off}</span>
                        <span className={styles.folderTabInactiveLabel}>{meta.tabLabel}</span>
                      </Pressable>
                    </Fragment>
                  );
                }

                return (
                  <div key={id} className={styles.folderTabActive}>
                    <div className={styles.folderTabTitle}>
                      <span className={styles.folderTabIcon}>{meta.icon585On}</span>
                      <span className={styles.folderTabLabel}>{meta.tabLabel}</span>
                    </div>

                    <div className={styles.folderTabActions}>
                      <Pressable
                        className={styles.folderActionBtn}
                        onClick={() => onPopOutApp(id)}
                        ariaLabel={`独立窗口打开${meta.title}`}
                        title="独立窗口"
                      >
                        <img src={iconTabPip811} alt="" width={14} height={14} draggable={false} />
                      </Pressable>
                      <Pressable
                        className={styles.folderActionBtn}
                        onClick={() => onCloseApp(id)}
                        ariaLabel={`关闭${meta.title}`}
                        title="关闭"
                      >
                        <img src={iconTabClose811} alt="" width={20} height={20} draggable={false} />
                      </Pressable>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.folderTrailing} ref={trailingRef}>
              <span className={styles.folderDivider} aria-hidden="true" />
              <Pressable
                className={`${styles.folderDropdownBtn} ${menuOpen ? styles.folderActionBtnActive : ''}`}
                onClick={() => setMenuOpen((value) => !value)}
                ariaLabel="更多操作"
                ariaExpanded={menuOpen}
                title="更多"
              >
                <img src={iconTabDropdown811} alt="" width={36} height={28} draggable={false} />
              </Pressable>
              {menuOpen && (
                <div className={`${styles.menu} ${styles.menuTrailing}`} role="menu" aria-label="更多操作">
                  <div className={styles.menuRow}>
                    <span>字体大小</span>
                    <div className={styles.fontOptions} role="radiogroup" aria-label="侧栏字体大小">
                      {FONT_SIZES.map((item) => (
                        <Pressable
                          key={item.value}
                          as="span"
                          className={`${styles.fontOption} ${fontSize === item.value ? styles.fontOptionActive : ''}`}
                          onClick={() => setFontSize(item.value)}
                          ariaLabel={`字体${item.label}`}
                        >
                          {item.label}
                        </Pressable>
                      ))}
                    </div>
                  </div>
                  {shown === 'yuanbao' && onToggleYuanbaoDetail && (
                    <Pressable
                      className={`${styles.menuRow} ${styles.menuItem}`}
                      onClick={() => {
                        setMenuOpen(false);
                        onToggleYuanbaoDetail();
                      }}
                    >
                      查看元宝 Agent 详情
                    </Pressable>
                  )}
                  {shown && (
                    <Pressable
                      className={`${styles.menuRow} ${styles.menuItem}`}
                      onClick={() => {
                        setMenuOpen(false);
                        onPopOutApp(shown);
                      }}
                    >
                      独立窗口弹出「{SIDE_APPS[shown].title}」
                    </Pressable>
                  )}
                  <Pressable
                    className={`${styles.menuRow} ${styles.menuItem}`}
                    onClick={() => {
                      setMenuOpen(false);
                      onCloseAll();
                    }}
                  >
                    关闭所有窗口
                  </Pressable>
                </div>
              )}
            </div>
          </nav>
        )}

        <div className={styles.panesStage}>
          <div className={styles.panes}>
            {apps.map((id) => (
              <section
                key={id}
                className={`${styles.pane} ${id === shown ? styles.paneActive : ''}`}
                aria-hidden={id !== shown}
              >
                {renderApp(id, { showHeader: !multiple })}
              </section>
            ))}
          </div>
        </div>
      </SidebarShell>
    </div>
  );
};
