import { useState, type FC } from 'react';
import IconTaskEntryIconBook from '@/assets/d2c/icons/task-entry/icon-task-entry-icon-book';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { quickCommands } from '@/data/commands';
import styles from './index.module.scss';

interface CommandEntryProps {
  /** 点了一条产品指令：走现有 ask 链路 */
  onCommand: (text: string) => void;
}

/** 展开宽度：够放最长的一条指令（11 月 5 日那版） */
const PANEL_WIDTH = 240;
/** 6 条通用问法一屏可见 */
const PANEL_MAX_HEIGHT = 280;

/**
 * 会内快捷指令（Figma 36:2475 的展开，收起态对齐下午新稿 215:22028）
 * 收起是 32 高的书本胶囊；点开后同一张卡片向上长成面板，标题行留下书本图标并出现「快捷指令」。
 * 只放 6 条产品问法，演示入口留在窗口外。
 */
export const CommandEntry: FC<CommandEntryProps> = ({ onCommand }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <MorphPanel
      expanded={expanded}
      onExpandedChange={setExpanded}
      summary={
        <span className={styles.icon}>
          <IconTaskEntryIconBook />
        </span>
      }
      expandedLabel="推荐指令"
      collapsedPaddingX={12}
      collapsedHeight={32}
      collapsedRadius={16}
      expandedRadius={20}
      appearance="glass"
      panelWidth={PANEL_WIDTH}
      maxHeight={PANEL_MAX_HEIGHT}
      name="推荐指令"
    >
      <div className={styles.list}>
        {quickCommands.map((item) => (
          <Pressable
            key={item.label}
            className={styles.command}
            onClick={() => {
              setExpanded(false);
              onCommand(item.prompt ?? item.label);
            }}
            ariaLabel={item.label}
          >
            <span className={styles.commandText}>{item.label}</span>
          </Pressable>
        ))}
      </div>
    </MorphPanel>
  );
};
