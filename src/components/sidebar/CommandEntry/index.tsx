import type { FC } from 'react';
import IconStatusCommands from '@/assets/d2c/icons/input/icon-status-commands';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { commandGroups, type CommandItem } from '@/data/commands';
import styles from './index.module.scss';

interface CommandEntryProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  hidden?: boolean;
  /** 点了某条指令 */
  onCommand: (item: CommandItem) => void;
}

/** 展开宽度：比产物面板窄，够放最长的一条指令 */
const PANEL_WIDTH = 240;
/** 最高 280：通用指令一屏可见，下面的模拟入口滚动查看 */
const PANEL_MAX_HEIGHT = 280;

/**
 * 快捷指令入口（Figma 36:2475，底栏最左侧 36×36 的 Book AI 圆钮）
 * 展开后：通用指令（无标题）在前，三组「模拟 ·」测试入口在后；最高 280，超出滚动。
 */
export const CommandEntry: FC<CommandEntryProps> = ({ expanded, onExpandedChange, hidden, onCommand }) => (
  <MorphPanel
    expanded={expanded}
    onExpandedChange={onExpandedChange}
    hidden={hidden}
    summary={
      <span className={styles.icon}>
        <IconStatusCommands />
      </span>
    }
    expandedLabel="快捷指令"
    collapsedPaddingX={10}
    panelWidth={PANEL_WIDTH}
    maxHeight={PANEL_MAX_HEIGHT}
    name="快捷指令"
  >
    {commandGroups.map((group, index) => (
      <div className={styles.group} key={group.title ?? `group-${index}`}>
        {group.title && <p className={styles.groupTitle}>{group.title}</p>}
        <div className={styles.list}>
          {group.items.map((item) => (
            <Pressable key={item.label} className={styles.command} onClick={() => onCommand(item)} ariaLabel={item.label}>
              <span className={styles.commandText}>{item.label}</span>
            </Pressable>
          ))}
        </div>
      </div>
    ))}
  </MorphPanel>
);
