import type { FC } from 'react';
import IconSideSend from '@/assets/d2c/icons/v1/icon-side-send';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface SendButtonProps {
  /** 有内容时可发送 */
  enabled: boolean;
  onClick: () => void;
}

/**
 * 发送按钮（Figma 316:2770）
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
    <IconSideSend />
  </Pressable>
);
