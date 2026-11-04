import type { FC } from 'react';
import IconInputSend from '@/assets/icons/icon-input-send';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.css';

interface SendButtonProps {
  /** 有内容时可发送 */
  enabled: boolean;
  onClick: () => void;
}

/**
 * 发送按钮（Figma 248:12599 / 248:13528）
 * 设计稿只给了置灰态；可发送态把圆底换成深色，箭头保持白色。
 */
export const SendButton: FC<SendButtonProps> = ({ enabled, onClick }) => (
  <Pressable
    className={`${styles.send} ${enabled ? styles.enabled : ''}`}
    onClick={onClick}
    disabled={!enabled}
    ariaLabel="发送"
    title={enabled ? '发送（Enter）' : '请输入内容'}
  >
    <IconInputSend />
  </Pressable>
);
