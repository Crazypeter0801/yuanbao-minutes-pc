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

/**
 * 推荐指令入口（Figma 489:10625：Book 图标小卡）
 * 收起只有一个 Book 图标；展开长成整行面板，列出会中常用的一句话需求。
 * 点任意一条走和输入框相同的链路，点完自动收起，回答直接出现在对话里。
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
    alignHeaderToContent
  >
    <div className={styles.list}>
      {QUICK_COMMANDS.map((command) => (
        <Pressable
          key={command}
          className={styles.item}
          onClick={() => {
            onExpandedChange(false);
            onPick(command);
          }}
          ariaLabel={`发送指令：${command}`}
        >
          {command}
        </Pressable>
      ))}
    </div>
  </MorphPanel>
);
