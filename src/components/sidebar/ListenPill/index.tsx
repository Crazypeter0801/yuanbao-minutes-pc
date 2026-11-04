import { useState, type FC } from 'react';
import IconBArrow from '@/assets/d2c/icons/schemes/icon-b-arrow';
import IconBListening from '@/assets/d2c/icons/schemes/icon-b-listening';
import IconSidePause from '@/assets/d2c/icons/schemes/icon-side-pause';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface ListenPillProps {
  isListening: boolean;
  onToggleListening: () => void;
  /** 插画右侧箭头展开的菜单 */
  menuItems: PopMenuItem[];
}

/**
 * 方案 B 左下「正在听」胶囊（Figma 248:13461）
 * 插画 + 展开箭头（菜单向上弹出）| 暂停 / 继续。
 */
export const ListenPill: FC<ListenPillProps> = ({ isListening, onToggleListening, menuItems }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.pill}>
      <div className={styles.menuWrap}>
        <Pressable
          className={`${styles.trigger} ${isListening ? '' : styles.triggerPaused}`}
          onClick={() => setMenuOpen((open) => !open)}
          ariaLabel="元宝会议助手"
          title="元宝会议助手"
        >
          <IconBListening />
          <span className={`${styles.arrow} ${menuOpen ? styles.arrowOpen : ''}`}>
            <IconBArrow />
          </span>
        </Pressable>
        {menuOpen && (
          <PopMenu items={menuItems} align="left" placement="top" onClose={() => setMenuOpen(false)} />
        )}
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
};
