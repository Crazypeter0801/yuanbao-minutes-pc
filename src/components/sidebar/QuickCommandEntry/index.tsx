import type { FC } from 'react';
import IconSide3Book from '@/assets/d2c/icons/v2/icon-side3-book';
import { Pressable } from '@/components/common/Pressable';
import { MorphPanel } from '@/components/sidebar/MorphPanel';
import { QUICK_COMMANDS } from '@/data/quickCommands';
import styles from './index.module.scss';

interface QuickCommandEntryProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** 别的面板展开时让位 */
  hidden?: boolean;
  /** 点一条推荐指令：等于用户自己把这句话发出去 */
  onPick: (text: string) => void;
}

/** 圆角方框「/」指令前缀图标 */
const SlashCommandIcon: FC = () => (
  <span className={styles.icon} aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="3.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.3 4.8 6.7 11.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  </span>
);

/**
 * 推荐指令入口（Figma 489:10625 + 563:16230）
 * 收起为 Book 图标胶囊；展开沿用原 MorphPanel 卡片，每条指令单行排布：「/」图标 + 主标题 + 同行浅灰副标题。
 */
export const QuickCommandEntry: FC<QuickCommandEntryProps> = ({
  expanded,
  onExpandedChange,
  hidden,
  onPick,
}) => (
  <MorphPanel
    expanded={expanded}
    onExpandedChange={onExpandedChange}
    hidden={hidden}
    summary={<IconSide3Book />}
    expandedLabel="推荐指令"
    collapsedPaddingX={12}
    panelWidth="full"
    name="推荐指令"
    contentKey={QUICK_COMMANDS.length}
    maxHeight={320}
    alignHeaderToContent
  >
    <div className={styles.list}>
      {QUICK_COMMANDS.map((command) => (
        <Pressable
          key={command.id}
          className={styles.item}
          onClick={() => {
            onExpandedChange(false);
            onPick(command.prompt);
          }}
          ariaLabel={`发送指令：${command.title}`}
          title={`${command.title}：${command.description}`}
        >
          <SlashCommandIcon />
          <span className={styles.title}>{command.title}</span>
          <span className={styles.desc}>{command.description}</span>
        </Pressable>
      ))}
    </div>
  </MorphPanel>
);
