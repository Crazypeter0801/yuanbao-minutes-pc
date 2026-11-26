import { useEffect, useRef, useState, type FC, type ReactNode, type TransitionEvent } from 'react';
import IconTab585Close from '@/assets/d2c/icons/sidetabs585/icon-tab585-close';
import IconTab585More from '@/assets/d2c/icons/sidetabs585/icon-tab585-more';
import IconTab585Pip from '@/assets/d2c/icons/sidetabs585/icon-tab585-pip';
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
  /** 点击已选中的「元宝 ›」页签标题或更多菜单项：打开/切换 Agent 详情页 */
  onToggleYuanbaoDetail?: () => void;
  /** 收起动画走完：此时再清空残留内容 */
  onClosed: () => void;
  renderApp: (id: SideAppId, context: SideAppContext) => ReactNode;
}

/**
 * 侧栏容器 · 锁定 Chrome 页签方案（Figma 585:68637 + 811:38165）
 *
 * - 激活页签内仅保留标题与「独立窗口 / 关闭」两个 28×28 操作按钮（无页签内「更多」按钮）；
 * - 顶栏最右侧 1×12 分隔线后放置统一「更多（...）」28×28 按钮，展开字号、Agent 详情、独立窗口与关闭所有窗口菜单；
 * - 打开 / 收起：槽位宽度 0 ↔ 386（卡片 376 + 间距 10），240ms；主窗口跟随向右展开 / 向左收缩，左侧会中区宽度锁定不变。
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
          /* Figma 811:38165 侧栏顶栏：#F7F7F7 顶条 + 白底内凹激活页签（独立窗口/关闭） + 右侧分割线与「更多」按钮 */
          <nav className={styles.folderBar} aria-label="侧栏应用">
            <div className={styles.folderTabs} role="tablist" aria-label="侧栏页签">
              {ordered.map((id, index) => {
                const meta = SIDE_APPS[id];
                if (id !== shown) {
                  return (
                    <Pressable
                      key={id}
                      className={styles.folderTabInactive}
                      onClick={() => onSelect(id)}
                      ariaLabel={meta.title}
                      title={meta.title}
                    >
                      <span className={styles.folderTabInactiveInner}>{meta.icon585Off}</span>
                    </Pressable>
                  );
                }
                return (
                  <div key={id} className={styles.folderTabActive}>
                    {/* 左侧 16×16 内凹反圆角（非首项时衔接左侧 #F7F7F7 轨道，Figma 585:68685） */}
                    {index > 0 && (
                      <svg
                        className={styles.folderConcaveLeft}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M16 0V16H0A16 16 0 0 0 16 0Z" fill="currentColor" />
                      </svg>
                    )}
                    {/* 右侧 16×16 内凹反圆角（衔接右侧未选中项或操作区，Figma 811:38203） */}
                    <svg
                      className={styles.folderConcaveRight}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M0 0V16H16A16 16 0 0 1 0 0Z" fill="currentColor" />
                    </svg>

                    {/* Figma 811:25083 激活页签标题：仅保留图标与「元宝」，详情入口统一归口到顶部悬浮元宝徽章 */}
                    <div className={styles.folderTabTitle}>
                      <span className={styles.folderTabIcon}>{meta.icon585On}</span>
                      <span className={styles.folderTabLabel}>{meta.title}</span>
                    </div>

                    {/* Figma 811:38186 激活页签操作区：仅保留 独立窗口 / 关闭，两个 28×28 按钮、间距 2 */}
                    <div className={styles.folderTabActions}>
                      <Pressable
                        className={styles.folderActionBtn}
                        onClick={() => onPopOutApp(id)}
                        ariaLabel={`独立窗口打开${meta.title}`}
                        title="独立窗口"
                      >
                        <IconTab585Pip width={28} height={28} />
                      </Pressable>
                      <Pressable
                        className={styles.folderActionBtn}
                        onClick={() => onCloseApp(id)}
                        ariaLabel={`关闭${meta.title}`}
                        title="关闭"
                      >
                        <IconTab585Close width={28} height={28} />
                      </Pressable>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 右侧 1×12 细分隔线 + 28×28「更多（...）」按钮（Figma 811:38218 / 811:38220 / 811:38221） */}
            <div className={styles.folderTrailing} ref={trailingRef}>
              <span className={styles.folderDivider} aria-hidden="true" />
              <Pressable
                className={`${styles.folderActionBtn} ${menuOpen ? styles.folderActionBtnActive : ''}`}
                onClick={() => setMenuOpen((value) => !value)}
                ariaLabel="更多操作"
                ariaExpanded={menuOpen}
                title="更多"
              >
                <IconTab585More width={28} height={28} />
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

        {/* Figma 811:40262：多标签页时白底内容区右上角 16px Chrome 圆角衔接 #F7F7F7 顶栏（非首项激活时左上角对称 16px） */}
        <div className={`${styles.panesStage} ${multiple ? styles.panesStageMultiple : ''}`}>
          <div
            className={[
              styles.panes,
              multiple ? styles.panesRoundedRight : '',
              multiple && activeIndex > 0 ? styles.panesRoundedLeft : '',
            ]
              .filter(Boolean)
              .join(' ')}
            data-chrome-corner={multiple ? '16px' : '0px'}
          >
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
