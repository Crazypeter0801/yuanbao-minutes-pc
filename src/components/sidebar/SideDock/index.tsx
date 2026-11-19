import { useEffect, useRef, useState, type FC, type ReactNode, type TransitionEvent } from 'react';
import IconTabMore from '@/assets/d2c/icons/sidetabs/icon-tab-more';
import IconTabPip from '@/assets/d2c/icons/sidetabs/icon-tab-pip';
import { Pressable } from '@/components/common/Pressable';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { useToast } from '@/hooks/useToast';
import { SIDE_APPS, SIDE_APP_ORDER, type SideAppId } from './apps';
import styles from './index.module.scss';

export type { SideAppId } from './apps';

/** 「更多」菜单里的字号档位 */
const FONT_SIZES = [
  { label: '小', value: 12 },
  { label: '标准', value: 14 },
  { label: '大', value: 16 },
  { label: '特大', value: 18 },
] as const;

export interface SideAppContext {
  /** 只开了一个应用：显示应用自己的标题栏；并开多个时由顶部 macOS Safari 风格标签栏代替 */
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
  /** 「更多 → 关闭所有标签页」 */
  onCloseAll: () => void;
  /** 收起动画走完：此时再清空残留内容 */
  onClosed: () => void;
  renderApp: (id: SideAppId, context: SideAppContext) => ReactNode;
}

/**
 * 侧栏容器 · macOS Safari 风格多应用标签页
 *
 * - 打开 / 收起：槽位宽度 0 ↔ 386（卡片 376 + 间距 10），240ms；主窗口跟随向右展开 / 向左收缩，左侧会中区宽度锁定不变；
 * - 多个应用并开时顶部呈现 Safari 风格凹槽轨道 + 选中白卡浮起 + 非相邻未选中项淡竖分隔线 + hover 反馈与关闭按钮（×）；
 * - 元宝 / 成员 / 聊天均支持关闭与弹出为独立窗口；关闭成员或聊天时自动切回元宝页签。
 */
export const SideDock: FC<SideDockProps> = ({
  apps,
  active,
  onSelect,
  onCloseApp,
  onPopOutApp,
  onCloseAll,
  onClosed,
  renderApp,
}) => {
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<SideAppId | null>(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = active !== null;
  /** 收起过程中保留最后看的那个应用，避免收起动画还没走完内容先变白 */
  const lastShown = useRef<SideAppId | null>(active);
  if (active) {
    lastShown.current = active;
  }
  const shown = active ?? lastShown.current;
  const ordered = SIDE_APP_ORDER.filter((id) => apps.includes(id));
  const multiple = ordered.length > 1;
  const activeIndex = shown ? ordered.indexOf(shown) : -1;

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
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
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
          <nav className={styles.safariBar} aria-label="侧栏应用标签页">
            <div className={styles.safariTrack} role="tablist" aria-label="侧栏页签">
              {ordered.map((id, index) => {
                const meta = SIDE_APPS[id];
                const isSelected = id === shown;
                const nextId = ordered[index + 1];
                const hideRightDivider =
                  index === ordered.length - 1 ||
                  isSelected ||
                  index + 1 === activeIndex ||
                  hoveredId === id ||
                  (nextId !== undefined && hoveredId === nextId);

                return (
                  <div
                    key={id}
                    className={styles.safariCell}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId((current) => (current === id ? null : current))}
                  >
                    <Pressable
                      className={`${styles.safariTab} ${isSelected ? styles.safariTabActive : ''}`}
                      onClick={() => onSelect(id)}
                      ariaLabel={meta.title}
                      ariaExpanded={isSelected}
                      title={meta.title}
                    >
                      <span className={styles.safariTabInner}>
                        <span className={styles.safariTabIcon}>
                          {isSelected ? meta.tabIcon : meta.tabIconOff}
                        </span>
                        <span className={styles.safariTabLabel}>{meta.tabLabel}</span>
                      </span>
                      <Pressable
                        as="span"
                        className={styles.safariTabClose}
                        onClick={() => onCloseApp(id)}
                        ariaLabel={`关闭${meta.title}`}
                        title={`关闭${meta.title}`}
                        stopPropagation
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path
                            d="M2.4 2.4 7.6 7.6M7.6 2.4 2.4 7.6"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                          />
                        </svg>
                      </Pressable>
                    </Pressable>
                    {index < ordered.length - 1 && (
                      <span
                        className={`${styles.safariDivider} ${hideRightDivider ? styles.safariDividerHidden : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.barActions}>
              {shown && (
                <Pressable
                  className={styles.barAction}
                  onClick={() => onPopOutApp(shown)}
                  ariaLabel={`独立窗口打开${SIDE_APPS[shown].title}`}
                  title="独立窗口弹出"
                >
                  <IconTabPip width={18} height={18} />
                </Pressable>
              )}
              <div className={styles.moreWrap} ref={menuRef}>
                <Pressable
                  className={`${styles.barAction} ${menuOpen ? styles.barActionActive : ''}`}
                  onClick={() => setMenuOpen((value) => !value)}
                  ariaLabel="更多操作"
                  ariaExpanded={menuOpen}
                  title="更多"
                >
                  <IconTabMore width={18} height={18} />
                </Pressable>
                {menuOpen && (
                  <div className={styles.menu} role="menu">
                    <div className={styles.menuRow}>
                      <span>字体大小</span>
                      <div className={styles.fontOptions} role="radiogroup" aria-label="侧栏字体大小">
                        {FONT_SIZES.map((item) => (
                          <Pressable
                            key={item.value}
                            as="span"
                            className={`${styles.fontOption} ${
                              fontSize === item.value ? styles.fontOptionActive : ''
                            }`}
                            onClick={() => setFontSize(item.value)}
                            ariaLabel={`字体${item.label}`}
                          >
                            {item.label}
                          </Pressable>
                        ))}
                      </div>
                    </div>
                    {shown && (
                      <Pressable
                        className={`${styles.menuRow} ${styles.menuItem}`}
                        onClick={() => {
                          setMenuOpen(false);
                          onPopOutApp(shown);
                        }}
                      >
                        独立窗口弹出「{SIDE_APPS[shown].tabLabel}」
                      </Pressable>
                    )}
                    <Pressable
                      className={`${styles.menuRow} ${styles.menuItem}`}
                      onClick={() => {
                        setMenuOpen(false);
                        onCloseAll();
                      }}
                    >
                      关闭所有标签页
                    </Pressable>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}

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
      </SidebarShell>
    </div>
  );
};
