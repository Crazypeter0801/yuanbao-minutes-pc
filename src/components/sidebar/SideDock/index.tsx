import { useEffect, useRef, useState, type FC, type ReactNode, type TransitionEvent } from 'react';
import IconTabClose from '@/assets/d2c/icons/sidetabs/icon-tab-close';
import IconTabMore from '@/assets/d2c/icons/sidetabs/icon-tab-more';
import IconTabPip from '@/assets/d2c/icons/sidetabs/icon-tab-pip';
import IconTabYuanbaoChevron from '@/assets/d2c/icons/sidetabs/icon-tab-yuanbao-chevron';
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
  /** 只开了一个应用：显示应用自己的标题栏；并开多个时标题栏由页签代替 */
  showHeader: boolean;
}

interface SideDockProps {
  /** 已打开的应用 */
  apps: SideAppId[];
  /** 正在看的应用；null 表示侧栏正在收起 / 已收起 */
  active: SideAppId | null;
  onSelect: (id: SideAppId) => void;
  /** 关掉某个应用（页签上的 ×，或应用标题栏的 ×） */
  onCloseApp: (id: SideAppId) => void;
  /** 「更多 → 关闭所有窗口」 */
  onCloseAll: () => void;
  /** 收起动画走完：此时再清空已打开的应用，收起过程中内容不消失 */
  onClosed: () => void;
  renderApp: (id: SideAppId, context: SideAppContext) => ReactNode;
}

/**
 * 侧栏容器 · 多应用页签（Figma 505:12264）
 *
 * - 打开 / 收起：槽位宽度 0 ↔ 386（卡片 376 + 与会议区间距 10），240ms，会议区跟着让位；
 * - 只开一个应用：就是原来的侧栏，标题栏由应用自己画（元宝仍按 Figma 416:20844）；
 * - 开了多个：顶部一行页签（padding 12、间距 4），顺序固定为 元宝 → 管理成员 → 聊天；
 *   当前页签撑满剩余宽度：图标 24 + 名称 14/18（元宝多一个小箭头），右侧 独立窗口 / 更多 / 关闭；
 *   其余页签 40×40 只露灰色图标；都是 0.5px #EBEDF2 描边、圆角 8；
 * - 切换页签时内容淡入并上移 4px（200ms）；各应用一直挂着，滚动位置、输入草稿都保留。
 */
export const SideDock: FC<SideDockProps> = ({ apps, active, onSelect, onCloseApp, onCloseAll, onClosed, renderApp }) => {
  const { toast, showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = active !== null;
  /** 收起过程中仍显示最后看的那个应用 */
  const lastShown = useRef<SideAppId | null>(active);
  if (active) {
    lastShown.current = active;
  }
  const shown = active ?? lastShown.current;
  const ordered = SIDE_APP_ORDER.filter((id) => apps.includes(id));
  const multiple = ordered.length > 1;

  // 系统开了「减少动态效果」时没有过渡，transitionend 不会来，直接收尾
  useEffect(() => {
    if (!open && apps.length && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClosed();
    }
  }, [open, apps.length, onClosed]);

  // 切页签 / 收起时菜单跟着关
  useEffect(() => {
    setMenuOpen(false);
  }, [shown, multiple, open]);

  // 菜单开着时点别处 / Esc 收起（卡片有 clip-path，fixed 遮罩会被裁掉，所以用全局监听）
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
          <nav className={styles.tabs} aria-label="侧栏应用">
            {ordered.map((id) => {
              const meta = SIDE_APPS[id];
              if (id !== shown) {
                return (
                  <Pressable
                    key={id}
                    className={styles.tab}
                    onClick={() => onSelect(id)}
                    ariaLabel={meta.title}
                    title={meta.title}
                  >
                    {meta.iconOff}
                  </Pressable>
                );
              }
              return (
                <div key={id} className={`${styles.tab} ${styles.tabSelected}`}>
                  <div className={styles.tabTitle}>
                    <span className={styles.tabIcon}>{meta.icon}</span>
                    <span className={styles.tabLabel}>{meta.title}</span>
                    {meta.chevron && (
                      <span className={styles.tabChevron} aria-hidden="true">
                        <IconTabYuanbaoChevron width={5} height={10} />
                      </span>
                    )}
                  </div>
                  <div className={styles.tabActions}>
                    <Pressable
                      className={styles.tabAction}
                      onClick={() => showToast(`${meta.title}已在独立窗口打开（演示）`)}
                      ariaLabel="独立窗口打开"
                      title="独立窗口"
                    >
                      <IconTabPip />
                    </Pressable>
                    <div className={styles.moreWrap} ref={menuRef}>
                      <Pressable
                        className={`${styles.tabAction} ${menuOpen ? styles.tabActionActive : ''}`}
                        onClick={() => setMenuOpen((value) => !value)}
                        ariaLabel="更多操作"
                        ariaExpanded={menuOpen}
                        title="更多"
                      >
                        <IconTabMore />
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
                    <Pressable
                      className={styles.tabAction}
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
