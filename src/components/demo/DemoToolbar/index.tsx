import { useEffect, useRef, useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import { demoMenus, type CommandItem, type DemoMenu } from '@/data/commands';
import styles from './index.module.scss';

interface DemoToolbarProps {
  /** 点了某条演示指令 */
  onCommand: (item: CommandItem) => void;
}

/**
 * 窗口外的演示按钮条：模拟元宝发言 / 模拟用户发言 / 模拟交互功能
 * 快捷指令从会议窗口里整体拿出来放到这里，窗口内只保留真实产品界面。
 * 点按钮向上弹出指令菜单，同一时间只开一个；点外面或按 Esc 收起，点指令后自动收起。
 */
export const DemoToolbar: FC<DemoToolbarProps> = ({ onCommand }) => {
  const [openKey, setOpenKey] = useState<DemoMenu['key'] | null>(null);
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

  const pick = (item: CommandItem) => {
    setOpenKey(null);
    onCommand(item);
  };

  return (
    <div className={styles.bar} ref={barRef}>
      {demoMenus.map((menu) => {
        const open = openKey === menu.key;
        return (
          <div className={styles.slot} key={menu.key}>
            {open && (
              <div className={styles.menu} role="menu" aria-label={menu.label}>
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
    </div>
  );
};
