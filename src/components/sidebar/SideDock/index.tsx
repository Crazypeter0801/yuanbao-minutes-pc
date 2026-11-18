import { useEffect, useRef, useState, type FC, type ReactNode, type TransitionEvent } from 'react';
import IconSide3Close from '@/assets/d2c/icons/v2/icon-side3-close';
import IconSide3More from '@/assets/d2c/icons/v2/icon-side3-more';
import IconSide3Pip from '@/assets/d2c/icons/v2/icon-side3-pip';
import { Pressable } from '@/components/common/Pressable';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { useToast } from '@/hooks/useToast';
import { SIDE_APPS, type SideAppId } from './apps';
import styles from './index.module.scss';

export type { SideAppId } from './apps';

/** 全局更多菜单里的字号档位（参考 Demo：小 / 标准 / 大 / 特大） */
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
  /** 已打开的应用，按打开先后排（即页签顺序） */
  apps: SideAppId[];
  /** 正在看的应用；null 表示侧栏正在收起 / 已收起 */
  active: SideAppId | null;
  onSelect: (id: SideAppId) => void;
  /** 关掉某个应用（页签上的 ×，或应用标题栏的 ×） */
  onCloseApp: (id: SideAppId) => void;
  /** 全局更多 →「关闭所有窗口」 */
  onCloseAll: () => void;
  /** 收起动画走完：此时再清空已打开的应用，收起过程中内容不消失 */
  onClosed: () => void;
  renderApp: (id: SideAppId, context: SideAppContext) => ReactNode;
}

/**
 * 侧栏容器（参考 Demo sidebar-motion.js）
 *
 * - 打开 / 收起：外层宽度 0 ↔ 386（卡片 376 + 与会议区间距 10），240ms，会议区跟着让位；
 * - 只开一个应用时就是原来的侧栏，标题栏由应用自己画（元宝仍按 Figma 416:20844）；
 * - 再打开别的应用时顶部变成页签：当前页签展开显示名称与「独立窗口 / 关闭」，其余只露图标，
 *   最右是全局更多（字体大小、关闭所有窗口）；
 * - 切换页签时内容淡入并上移 4px（200ms）；各应用一直挂着，滚动位置、输入草稿都保留。
 */
export const SideDock: FC<SideDockProps> = ({
  apps,
  active,
  onSelect,
  onCloseApp,
  onCloseAll,
  onClosed,
  renderApp,
}) => {
  const { toast, showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const open = active !== null;
  /** 收起过程中仍显示最后看的那个应用 */
  const lastShown = useRef<SideAppId | null>(active);
  if (active) {
    lastShown.current = active;
  }
  const shown = active ?? lastShown.current;
  const multiple = apps.length > 1;

  // 系统开了「减少动态效果」时没有过渡，transitionend 不会来，直接收尾
  useEffect(() => {
    if (!open && apps.length && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClosed();
    }
  }, [open, apps.length, onClosed]);

  useEffect(() => {
    if (!multiple || !open) {
      setMenuOpen(false);
    }
  }, [multiple, open]);

  // 菜单开着时点别处 / Esc 收起（卡片有 clip-path，fixed 遮罩会被裁掉，所以用全局监听）
  const menuRef = useRef<HTMLDivElement>(null);
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
            {apps.map((id) => {
              const selected = id === shown;
              const meta = SIDE_APPS[id];
              return (
                <div key={id} className={`${styles.tab} ${selected ? styles.tabSelected : ''}`}>
                  <Pressable
                    className={styles.tabSelect}
                    onClick={() => !selected && onSelect(id)}
                    ariaLabel={meta.title}
                    title={selected ? undefined : meta.title}
                  >
                    <span className={styles.tabIcon}>{meta.icon}</span>
                    <span className={styles.tabLabel}>{meta.title}</span>
                  </Pressable>
                  {selected && (
                    <div className={styles.tabActions}>
                      <Pressable
                        className={styles.tabAction}
                        onClick={() => showToast(`${meta.title}已在独立窗口打开（演示）`)}
                        ariaLabel="独立窗口打开"
                      >
                        <IconSide3Pip />
                      </Pressable>
                      <Pressable
                        className={styles.tabAction}
                        onClick={() => onCloseApp(id)}
                        ariaLabel={`关闭${meta.title}`}
                      >
                        <IconSide3Close />
                      </Pressable>
                    </div>
                  )}
                </div>
              );
            })}

            <div className={styles.globalWrap} ref={menuRef}>
              <Pressable
                className={`${styles.globalMore} ${menuOpen ? styles.globalMoreActive : ''}`}
                onClick={() => setMenuOpen((value) => !value)}
                ariaLabel="侧栏全局操作"
                ariaExpanded={menuOpen}
              >
                <IconSide3More />
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
                          className={`${styles.fontOption} ${fontSize === item.value ? styles.fontOptionActive : ''}`}
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
