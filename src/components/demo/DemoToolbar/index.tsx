import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import type { SideTabStyle } from '@/components/sidebar/SideDock';
import { demoMenus, type CommandItem, type DemoMenu } from '@/data/commands';
import styles from './index.module.scss';

type OpenMenuKey = DemoMenu['key'] | 'tab-style';

const TAB_STYLE_OPTIONS: Array<{ value: SideTabStyle; label: string }> = [
  { value: 'pill505', label: '新版胶囊标签页' },
  { value: 'classic', label: '分段标签页' },
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
 * 窗口外的演示按钮条：模拟元宝发言 / 模拟用户发言 / 模拟交互功能 / 侧栏标签页方案（竖向排列，跟在主窗口右侧）
 * 快捷指令从会议窗口里整体拿出来放到这里，窗口内只保留真实产品界面。
 * 点按钮向下弹出指令菜单，同一时间只开一个；点外面或按 Esc 收起。
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

  /** 菜单向下弹出：最高只到浏览器底边上方 16，放不下的部分在菜单里滚动 */
  const menuRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!openKey || !menu) {
      return undefined;
    }
    const fit = () => {
      menu.style.maxHeight = '';
      const room = window.innerHeight - menu.getBoundingClientRect().top - 16;
      menu.style.maxHeight = `${Math.max(160, Math.min(660, room))}px`;
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
    <div className={styles.bar} ref={barRef}>
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
              <span className={styles.buttonText}>{menu.label}</span>
              <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 7.5 6 4.5l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Pressable>
          </div>
        );
      })}

      {/* 侧栏标签页方案对比切换：新版胶囊标签页（默认） vs 分段标签页 */}
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
          <span className={styles.buttonText}>侧栏标签页</span>
          <span className={`${styles.caret} ${tabStyleOpen ? styles.caretOpen : ''}`} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 7.5 6 4.5l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Pressable>
      </div>
    </div>
  );
};
