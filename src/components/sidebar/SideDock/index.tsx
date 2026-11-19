import { Fragment, useEffect, useRef, useState, type FC, type ReactNode, type TransitionEvent } from 'react';
import IconTabClose from '@/assets/d2c/icons/sidetabs/icon-tab-close';
import IconTabMore from '@/assets/d2c/icons/sidetabs/icon-tab-more';
import IconTabPip from '@/assets/d2c/icons/sidetabs/icon-tab-pip';
import IconTabYuanbaoChevron from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-chevron';
import IconTab505Chevron from '@/assets/d2c/icons/sidetabs505/icon-tab505-chevron';
import IconTab505More from '@/assets/d2c/icons/sidetabs505/icon-tab505-more';
import IconTab505Pip from '@/assets/d2c/icons/sidetabs505/icon-tab505-pip';
import { Pressable } from '@/components/common/Pressable';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { useToast } from '@/hooks/useToast';
import { SIDE_APPS, SIDE_APP_ORDER, type SideAppId, type SideTabStyle } from './apps';
import styles from './index.module.scss';

export type { SideAppId, SideTabStyle } from './apps';

/** 「更多」菜单里的字号档位 */
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
  /** 侧栏标签页视觉方案（默认 pill505：Figma 505:12421） */
  tabStyle?: SideTabStyle;
  onSelect: (id: SideAppId) => void;
  /** 关掉某个标签页（标签上的 × 或应用标题栏的 ×） */
  onCloseApp: (id: SideAppId) => void;
  /** 弹出某个应用为独立浮窗 */
  onPopOutApp: (id: SideAppId) => void;
  /** 「更多 → 关闭所有窗口」 */
  onCloseAll: () => void;
  /** 点击已选中的「元宝 ›」页签标题或更多菜单项：打开/切换 Agent 详情页 */
  onToggleYuanbaoDetail?: () => void;
  /** 收起动画走完：此时再清空残留内容 */
  onClosed: () => void;
  renderApp: (id: SideAppId, context: SideAppContext) => ReactNode;
}

/**
 * 侧栏容器 · 支持 Figma 505:12421 新版顶部胶囊标签栏 与 原版 single-window-base（Figma 505:12264）实时切换
 *
 * - 打开 / 收起：槽位宽度 0 ↔ 386（卡片 376 + 间距 10），240ms；主窗口跟随向右展开 / 向左收缩，左侧会中区宽度锁定不变；
 * - 两种标签页方案均完整支持页签切换、关闭、弹出独立浮窗、打开元宝 Agent 详情页与空态主窗口左缩。
 */
export const SideDock: FC<SideDockProps> = ({
  apps,
  active,
  tabStyle = 'pill505',
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
  }, [shown, multiple, open, tabStyle]);

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

  const renderMoreMenu = (classicPlacement = false) => (
    <div className={`${styles.menu} ${classicPlacement ? styles.menuClassic : ''}`} role="menu">
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
      {shown && !classicPlacement && (
        <Pressable
          className={`${styles.menuRow} ${styles.menuItem}`}
          onClick={() => {
            setMenuOpen(false);
            onCloseApp(shown);
          }}
        >
          关闭当前「{SIDE_APPS[shown].title}」
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
  );

  const firstIsActive = activeIndex === 0;
  const lastIsActive = activeIndex === ordered.length - 1;
  const trackPaddingClass = firstIsActive
    ? styles.pillTrackPadRight
    : lastIsActive
      ? styles.pillTrackPadLeft
      : styles.pillTrackPadBoth;

  return (
    <div
      className={`${styles.slot} ${open ? styles.slotOpen : ''}`}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={!open}
    >
      <SidebarShell toast={toast} label={shown ? SIDE_APPS[shown].title : '侧栏'} fontSize={fontSize}>
        {multiple &&
          (tabStyle === 'classic' ? (
            /* 原版 single-window-base（Figma 505:12264）：选中展开带操作、未选中 40×40 灰图标 */
            <nav className={styles.classicTabs} aria-label="侧栏应用">
              {ordered.map((id) => {
                const meta = SIDE_APPS[id];
                if (id !== shown) {
                  return (
                    <Pressable
                      key={id}
                      className={styles.classicTab}
                      onClick={() => onSelect(id)}
                      ariaLabel={meta.title}
                      title={meta.title}
                    >
                      {meta.iconOff}
                    </Pressable>
                  );
                }
                return (
                  <div key={id} className={`${styles.classicTab} ${styles.classicTabSelected}`}>
                    {id === 'yuanbao' && onToggleYuanbaoDetail ? (
                      <Pressable
                        className={`${styles.classicTabTitle} ${styles.classicTabTitleClickable}`}
                        onClick={onToggleYuanbaoDetail}
                        ariaLabel="查看元宝 Agent 详情"
                        title="查看元宝 Agent 详情"
                      >
                        <span className={styles.classicTabIcon}>{meta.icon}</span>
                        <span className={styles.classicTabLabel}>{meta.title}</span>
                        {meta.chevron && (
                          <span className={styles.classicTabChevron} aria-hidden="true">
                            <IconTabYuanbaoChevron width={5} height={10} />
                          </span>
                        )}
                      </Pressable>
                    ) : (
                      <div className={styles.classicTabTitle}>
                        <span className={styles.classicTabIcon}>{meta.icon}</span>
                        <span className={styles.classicTabLabel}>{meta.title}</span>
                        {meta.chevron && (
                          <span className={styles.classicTabChevron} aria-hidden="true">
                            <IconTabYuanbaoChevron width={5} height={10} />
                          </span>
                        )}
                      </div>
                    )}
                    <div className={styles.classicTabActions}>
                      <Pressable
                        className={styles.classicTabAction}
                        onClick={() => onPopOutApp(id)}
                        ariaLabel={`独立窗口打开${meta.title}`}
                        title="独立窗口"
                      >
                        <IconTabPip />
                      </Pressable>
                      <div className={styles.moreWrap} ref={menuRef}>
                        <Pressable
                          className={`${styles.classicTabAction} ${menuOpen ? styles.classicTabActionActive : ''}`}
                          onClick={() => setMenuOpen((value) => !value)}
                          ariaLabel="更多操作"
                          ariaExpanded={menuOpen}
                          title="更多"
                        >
                          <IconTabMore />
                        </Pressable>
                        {menuOpen && renderMoreMenu(true)}
                      </div>
                      <Pressable
                        className={styles.classicTabAction}
                        onClick={() => onCloseApp(id)}
                        ariaLabel={`关闭${meta.title}`}
                        title="关闭"
                      >
                        <IconTabClose width={20} height={21} />
                      </Pressable>
                    </div>
                  </div>
                );
              })}
            </nav>
          ) : (
            /* Figma 505:12421 新版顶部胶囊标签栏（Frame 505:12423） */
            <nav className={styles.pillBar} aria-label="侧栏应用标签页">
              <div className={`${styles.pillTrack} ${trackPaddingClass}`} role="tablist" aria-label="侧栏页签">
                {ordered.map((id, index) => {
                  const meta = SIDE_APPS[id];
                  const isSelected = id === shown;
                  const showRightDivider =
                    index < ordered.length - 1 && !isSelected && index + 1 !== activeIndex;

                  return (
                    <Fragment key={id}>
                      {isSelected ? (
                        <div className={`${styles.pillTab} ${styles.pillTabActive}`}>
                          {id === 'yuanbao' && onToggleYuanbaoDetail ? (
                            <Pressable
                              className={styles.pillActiveMain}
                              onClick={onToggleYuanbaoDetail}
                              ariaLabel="查看元宝 Agent 详情"
                              title="点击查看元宝 Agent 详情"
                            >
                              <span className={styles.pillIcon}>{meta.icon505On}</span>
                              <span className={styles.pillLabel}>{meta.title}</span>
                              {meta.chevron && (
                                <span className={styles.pillChevron} aria-hidden="true">
                                  <IconTab505Chevron width={5} height={10} />
                                </span>
                              )}
                            </Pressable>
                          ) : (
                            <div className={styles.pillActiveMain}>
                              <span className={styles.pillIcon}>{meta.icon505On}</span>
                              <span className={styles.pillLabel}>{meta.title}</span>
                            </div>
                          )}
                          <Pressable
                            as="span"
                            className={styles.pillClose}
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
                        </div>
                      ) : (
                        <Pressable
                          className={styles.pillTabInactive}
                          onClick={() => onSelect(id)}
                          ariaLabel={meta.title}
                          title={meta.title}
                        >
                          <span className={styles.pillIcon}>{meta.icon505Off}</span>
                          <Pressable
                            as="span"
                            className={styles.pillInactiveClose}
                            onClick={() => onCloseApp(id)}
                            ariaLabel={`关闭${meta.title}`}
                            title={`关闭${meta.title}`}
                            stopPropagation
                          >
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                              <path
                                d="M2.4 2.4 7.6 7.6M7.6 2.4 2.4 7.6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </Pressable>
                        </Pressable>
                      )}
                      {showRightDivider && <span className={styles.pillDivider} aria-hidden="true" />}
                    </Fragment>
                  );
                })}
              </div>

              {/* 右侧独立操作胶囊（Figma 505:12590）：高 40、圆角 20、padding 6 12、1px #EBEDF2 */}
              <div className={styles.pillActionsCapsule}>
                {shown && (
                  <Pressable
                    className={styles.pillActionBtn}
                    onClick={() => onPopOutApp(shown)}
                    ariaLabel={`独立窗口打开${SIDE_APPS[shown].title}`}
                    title="独立窗口弹出"
                  >
                    <IconTab505Pip width={24} height={24} />
                  </Pressable>
                )}
                <div className={styles.moreWrap} ref={menuRef}>
                  <Pressable
                    className={`${styles.pillActionBtn} ${menuOpen ? styles.pillActionBtnActive : ''}`}
                    onClick={() => setMenuOpen((value) => !value)}
                    ariaLabel="更多操作"
                    ariaExpanded={menuOpen}
                    title="更多"
                  >
                    <IconTab505More width={24} height={24} />
                  </Pressable>
                  {menuOpen && renderMoreMenu(false)}
                </div>
              </div>
            </nav>
          ))}

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
