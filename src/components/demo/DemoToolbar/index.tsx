import { useEffect, useRef, useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import { demoMenus, type CommandItem, type DemoMenu } from '@/data/commands';
import styles from './index.module.scss';

/** 不带菜单、点一下就执行的演示按钮（如「演示任务状态」） */
export interface DemoAction {
  key: string;
  label: string;
  onClick: () => void;
}

/** 带菜单、每一项直接执行动作的演示按钮（如「元宝表情」：逐个触发头像动画） */
export interface DemoActionMenu {
  key: string;
  label: string;
  items: { key: string; label: string; onClick: () => void }[];
}

interface DemoToolbarProps {
  /** 点了某条演示指令 */
  onCommand: (item: CommandItem) => void;
  /** 排在三个菜单按钮后面的直接动作 */
  actions?: DemoAction[];
  /** 排在直接动作后面的动作菜单 */
  actionMenus?: DemoActionMenu[];
}

/**
 * 窗口外的演示按钮条：模拟元宝发言 / 模拟用户发言 / 模拟交互功能 + 直接动作（演示任务状态）+ 动作菜单（元宝表情）
 * 快捷指令从会议窗口里整体拿出来放到这里，窗口内只保留真实产品界面。
 * 点按钮向上弹出指令菜单，同一时间只开一个；点外面或按 Esc 收起，点指令后自动收起。
 */
export const DemoToolbar: FC<DemoToolbarProps> = ({ onCommand, actions = [], actionMenus = [] }) => {
  const [openKey, setOpenKey] = useState<DemoMenu['key'] | DemoActionMenu['key'] | null>(null);
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
      {actions.map((action) => (
        <div className={styles.slot} key={action.key}>
          <Pressable
            className={styles.button}
            onClick={() => {
              setOpenKey(null);
              action.onClick();
            }}
            ariaLabel={action.label}
          >
            <span className={styles.buttonText}>{action.label}</span>
          </Pressable>
        </div>
      ))}
      {actionMenus.map((menu) => {
        const open = openKey === menu.key;
        return (
          <div className={styles.slot} key={menu.key}>
            {open && (
              <div className={`${styles.menu} ${styles.menuWide}`} role="menu" aria-label={menu.label}>
                <div className={styles.list}>
                  {menu.items.map((item) => (
                    <Pressable
                      key={item.key}
                      className={styles.item}
                      onClick={() => {
                        setOpenKey(null);
                        item.onClick();
                      }}
                      ariaLabel={item.label}
                    >
                      <span className={styles.itemText}>{item.label}</span>
                    </Pressable>
                  ))}
                </div>
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
