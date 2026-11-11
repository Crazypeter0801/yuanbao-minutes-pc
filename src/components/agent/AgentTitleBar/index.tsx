import { useState, type FC } from 'react';
import IconSideLogo from '@/assets/d2c/icons/v1/icon-side-logo';
import IconSideClose from '@/assets/d2c/icons/v1/icon-side-close';
import IconSideMore from '@/assets/d2c/icons/v1/icon-side-more';
import IconSidePip from '@/assets/d2c/icons/v1/icon-side-pip';
import { PopMenu, type PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import { SessionSwitcher } from '@/components/agent/SessionSwitcher';
import type { AgentDockControl } from '@/hooks/useAgentDock';
import styles from './index.module.scss';

interface AgentTitleBarProps {
  /** 吸附 / 分离状态与拖动句柄 */
  dock: AgentDockControl;
  /** 关闭元宝窗口（和底部元宝按钮是同一个开关） */
  onClose: () => void;
  /** 在元宝主端打开 */
  onOpenMain: () => void;
  /** 选了会话列表里别的会话 */
  onPickSession: (title: string) => void;
  /** 「更多」菜单项 */
  menuItems: PopMenuItem[];
}

/**
 * 元宝窗口标题栏（两行）
 * 第一行：元宝品牌 | 分离/吸附 · 在元宝打开 · 更多 · 关闭。没有 macOS 红黄绿圆点；
 *   按住这一行（按钮除外）拖动即可把元宝从会议窗口分离出来，拖回会议右缘松手再吸附回去；
 * 第二行：会话切换条，显示当前会话属于元宝主端的「腾讯会议」分组，点开可切换到其他会话。
 */
export const AgentTitleBar: FC<AgentTitleBarProps> = ({ dock, onClose, onOpenMain, onPickSession, menuItems }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div
        className={`${styles.row} ${dock.dragging ? styles.rowDragging : ''}`}
        onPointerDown={dock.onTitlePointerDown}
        title="按住拖动，可把元宝从会议窗口分离出来"
      >
        <div className={styles.brand}>
          <span className={styles.logo}>
            <IconSideLogo width={14} height={14} />
          </span>
          <span className={styles.brandText}>元宝</span>
          <span className={styles.brandTag}>Personal Agent</span>
        </div>

        <div className={styles.actions} data-nodrag>
          <Pressable
            className={styles.iconButton}
            onClick={dock.toggleDock}
            title={dock.mode === 'floating' ? '吸附回会议' : '分离窗口'}
            ariaLabel={dock.mode === 'floating' ? '吸附回会议' : '分离窗口'}
          >
            {dock.mode === 'floating' ? (
              /* 吸附：窗口 + 右侧并列栏 */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10 3v10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            ) : (
              /* 分离：方框 + 斜向箭头 */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2.5" y="5.5" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M9 7l4.5-4.5M10.5 2.5h3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Pressable>
          <Pressable className={styles.iconButton} onClick={onOpenMain} title="在元宝打开" ariaLabel="在元宝主端打开">
            <IconSidePip />
          </Pressable>
          <div className={styles.moreWrap}>
            <Pressable
              className={styles.iconButton}
              onClick={() => setMenuOpen((open) => !open)}
              title="更多"
              ariaLabel="更多操作"
            >
              <IconSideMore />
            </Pressable>
            {menuOpen && <PopMenu items={menuItems} onClose={() => setMenuOpen(false)} />}
          </div>
          <Pressable className={styles.iconButton} onClick={onClose} title="关闭元宝" ariaLabel="关闭元宝">
            <IconSideClose />
          </Pressable>
        </div>
      </div>

      <SessionSwitcher onPick={onPickSession} />
    </header>
  );
};
