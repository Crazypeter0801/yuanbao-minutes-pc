import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import type { SideTabStyle } from '@/components/sidebar/SideDock';
import { demoMenus, type CommandItem, type DemoMenu } from '@/data/commands';
import styles from './index.module.scss';

type OpenMenuKey = DemoMenu['key'] | 'tab-style';

const TAB_STYLE_OPTIONS: Array<{ value: SideTabStyle; label: string }> = [
  { value: 'classic', label: 'Chrome页签' },
  { value: 'pill505', label: 'Safari胶囊' },
];

interface DemoToolbarProps {
  /** 点了某条演示指令 */
  onCommand: (item: CommandItem) => void;
  /** 当前侧栏标签页方案 */
  tabStyle: SideTabStyle;
  /** 切换侧栏标签页方案 */
  onTabStyleChange: (style: SideTabStyle) => void;
}

/**
 * 视口右侧贴边吸附演示控制台：模拟元宝发言 / 模拟用户发言 / 模拟交互功能 / 侧栏标签页
 * 四个按钮竖向吸附在右侧边缘，菜单统一向左侧弹出并自动约束在视口上下安全区内，不被裁切。
 */
export const DemoToolbar: FC<DemoToolbarProps> = ({ onCommand, tabStyle, onTabStyleChange }) => {
  const [openKey, setOpenKey] = useState<OpenMenuKey | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openKey) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setOpenKey(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenKey(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey]);

  /** 菜单向左侧展开，同时按视口高度动态修正纵向偏移与最大高度，防止上下或右侧裁切 */
  const menuRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!openKey || !menu) {
      return undefined;
    }
    const fit = () => {
      menu.style.maxHeight = '';
      menu.style.top = '0px';
      const maxH = Math.max(180, Math.min(620, window.innerHeight - 32));
      menu.style.maxHeight = `${maxH}px`;
      const rect = menu.getBoundingClientRect();
      let shiftY = 0;
      if (rect.bottom > window.innerHeight - 16) {
        shiftY = window.innerHeight - 16 - rect.bottom;
      }
      if (rect.top + shiftY < 16) {
        shiftY = 16 - rect.top;
      }
      menu.style.top = `${Math.round(shiftY)}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [openKey]);

  const pick = (item: CommandItem) => {
    setOpenKey(null);
    onCommand(item);
  };

  const tabStyleOpen = openKey === 'tab-style';

  return (
    <div className={styles.bar} ref={barRef} aria-label="演示控制台">
      {demoMenus.map((menu) => {
        const open = openKey === menu.key;
        return (
          <div className={styles.slot} key={menu.key}>
            {open && (
              <div className={styles.menu} role="menu" aria-label={menu.label} ref={menuRef}>
                {menu.groups.map((group, index) => (
                  <div className={styles.group} key={group.title ?? `group-${index}`}>
                    {group.title && <p className={styles.groupTitle}>{group.title}</p>}
                    <div className={styles.list}>
                      {group.items.map((item) => (
                        <Pressable
                          key={item.label}
                          className={styles.item}
                          onClick={() => pick(item)}
                          ariaLabel={item.label}
                        >
                          <span className={styles.itemText}>{item.label}</span>
                        </Pressable>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pressable
              className={`${styles.button} ${open ? styles.buttonActive : ''}`}
              onClick={() => setOpenKey(open ? null : menu.key)}
              ariaLabel={menu.label}
              ariaExpanded={open}
            >
              <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 3 4.5 6l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.buttonText}>{menu.label}</span>
            </Pressable>
          </div>
        );
      })}

      {/* 侧栏标签页切换：Chrome页签（默认，Figma 585:68637） vs Safari胶囊（Figma 505:12421） */}
      <div className={styles.slot}>
        {tabStyleOpen && (
          <div className={`${styles.menu} ${styles.optionMenu}`} role="menu" aria-label="侧栏标签页" ref={menuRef}>
            <div className={styles.list} role="radiogroup" aria-label="侧栏标签页">
              {TAB_STYLE_OPTIONS.map((option) => {
                const selected = tabStyle === option.value;
                return (
                  <Pressable
                    key={option.value}
                    className={`${styles.item} ${styles.optionItem} ${selected ? styles.optionItemActive : ''}`}
                    onClick={() => onTabStyleChange(option.value)}
                    ariaLabel={option.label}
                    ariaExpanded={selected}
                  >
                    <span className={styles.itemText}>{option.label}</span>
                    <span className={`${styles.optionCheck} ${selected ? styles.optionCheckVisible : ''}`} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3.2 7.3 5.8 9.9 10.9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Pressable>
                );
              })}
            </div>
          </div>
        )}
        <Pressable
          className={`${styles.button} ${tabStyleOpen ? styles.buttonActive : ''}`}
          onClick={() => setOpenKey(tabStyleOpen ? null : 'tab-style')}
          ariaLabel="侧栏标签页"
          ariaExpanded={tabStyleOpen}
        >
          <span className={`${styles.caret} ${tabStyleOpen ? styles.caretOpen : ''}`} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 3 4.5 6l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.buttonText}>侧栏标签页</span>
        </Pressable>
      </div>
    </div>
  );
};
