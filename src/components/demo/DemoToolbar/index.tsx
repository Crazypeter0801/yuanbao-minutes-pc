import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import type { CommandBarVariant } from '@/components/YuanbaoSidebar';
import { demoMenus, type CommandItem, type DemoMenu } from '@/data/commands';
import styles from './index.module.scss';

type OpenMenuKey = DemoMenu['key'] | 'command-bar';

const COMMAND_BAR_OPTIONS: Array<{ value: CommandBarVariant; label: string }> = [
  { value: 'agent-status', label: '元宝状态栏（新版）' },
  { value: 'capsules', label: '推荐与任务胶囊' },
];

interface DemoToolbarProps {
  /** 点了某条演示指令 */
  onCommand: (item: CommandItem) => void;
  /** 当前输入框上方栏形态 */
  commandBarVariant: CommandBarVariant;
  /** 切换输入框上方栏形态 */
  onCommandBarVariantChange: (variant: CommandBarVariant) => void;
  /** 是否正在模拟进行中任务（一键开关控制状态栏显隐） */
  taskSimulated: boolean;
  /** 一键切换模拟进行中任务（开始 / 结束） */
  onToggleTaskSimulated: () => void;
}

/**
 * 视口右侧贴边吸附演示控制台：
 * 模拟元宝发言 / 模拟用户发言 / 模拟交互功能 / 上方工具栏 / 模拟任务一键开关。
 */
export const DemoToolbar: FC<DemoToolbarProps> = ({
  onCommand,
  commandBarVariant,
  onCommandBarVariantChange,
  taskSimulated,
  onToggleTaskSimulated,
}) => {
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

  const commandBarOpen = openKey === 'command-bar';
  const taskToggleLabel = taskSimulated ? '模拟任务：结束' : '模拟任务：开始';

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

      {/* 输入框上方栏切换：元宝状态栏（Figma 811:38164） vs 推荐与任务胶囊 */}
      <div className={styles.slot}>
        {commandBarOpen && (
          <div className={`${styles.menu} ${styles.optionMenu}`} role="menu" aria-label="上方工具栏" ref={menuRef}>
            <div className={styles.list} role="radiogroup" aria-label="上方工具栏">
              {COMMAND_BAR_OPTIONS.map((option) => {
                const selected = commandBarVariant === option.value;
                return (
                  <Pressable
                    key={option.value}
                    className={`${styles.item} ${styles.optionItem} ${selected ? styles.optionItemActive : ''}`}
                    onClick={() => onCommandBarVariantChange(option.value)}
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
          className={`${styles.button} ${commandBarOpen ? styles.buttonActive : ''}`}
          onClick={() => setOpenKey(commandBarOpen ? null : 'command-bar')}
          ariaLabel="上方工具栏"
          ariaExpanded={commandBarOpen}
        >
          <span className={`${styles.caret} ${commandBarOpen ? styles.caretOpen : ''}`} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 3 4.5 6l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.buttonText}>上方工具栏</span>
        </Pressable>
      </div>

      {/* 模拟进行中任务一键开关：点一次触发任务（状态栏出现），再点一次结束任务（状态栏收起） */}
      <div className={styles.slot}>
        <Pressable
          className={`${styles.button} ${styles.toggleButton} ${taskSimulated ? styles.toggleButtonActive : ''}`}
          onClick={() => {
            setOpenKey(null);
            onToggleTaskSimulated();
          }}
          ariaLabel={taskToggleLabel}
          ariaExpanded={taskSimulated}
          title={taskSimulated ? '点击结束进行中任务并隐藏状态栏' : '点击触发进行中任务并显示状态栏'}
        >
          <span
            className={`${styles.toggleDot} ${taskSimulated ? styles.toggleDotActive : ''}`}
            aria-hidden="true"
          />
          <span className={styles.buttonText}>{taskToggleLabel}</span>
        </Pressable>
      </div>
    </div>
  );
};
