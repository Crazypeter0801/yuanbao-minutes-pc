import type { FC } from 'react';
import IconSideAssistantAvatar from '@/assets/icons/icon-side-assistant-avatar';
import IconSidePause from '@/assets/icons/icon-side-pause';
import IconSideSwitch from '@/assets/icons/icon-side-switch';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.css';

interface AssistantBarProps {
  isListening: boolean;
  onToggleListening: () => void;
  /** 切换助手 */
  onSwitch: () => void;
}

/** 方案 A 底部助手条（Figma 246:6298）：头像 + 名称/能力说明 + 暂停 */
export const AssistantBar: FC<AssistantBarProps> = ({ isListening, onToggleListening, onSwitch }) => (
  <div className={styles.bar}>
    <div className={styles.left}>
      <IconSideAssistantAvatar />
      <div className={styles.info}>
        <Pressable className={styles.nameRow} onClick={onSwitch} title="切换助手" ariaLabel="切换助手">
          <span className={styles.name}>元宝会议助手</span>
          <IconSideSwitch />
        </Pressable>
        <span className={styles.desc}>
          {isListening ? '洞察讨论观点，总结纪要及待办' : '已暂停记录，点击右侧继续'}
        </span>
      </div>
    </div>

    <Pressable
      className={`${styles.toggle} ${isListening ? '' : styles.togglePaused}`}
      onClick={onToggleListening}
      title={isListening ? '暂停记录' : '继续记录'}
      ariaLabel={isListening ? '暂停记录' : '继续记录'}
    >
      {isListening ? <IconSidePause /> : <span className={styles.play} />}
    </Pressable>
  </div>
);
