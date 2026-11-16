import type { FC } from 'react';
import iconCam from '@/assets/d2c/icons/members/icon-cam.svg';
import iconCamOff from '@/assets/d2c/icons/members/icon-cam-off.svg';
import iconClose from '@/assets/d2c/icons/members/icon-close.svg';
import iconMembers from '@/assets/d2c/icons/members/icon-members.svg';
import iconMic from '@/assets/d2c/icons/members/icon-mic.svg';
import iconMicMuted from '@/assets/d2c/icons/members/icon-mic-muted.svg';
import iconMore from '@/assets/d2c/icons/members/icon-more.svg';
import iconPip from '@/assets/d2c/icons/members/icon-pip.svg';
import iconSearch from '@/assets/d2c/icons/members/icon-search.svg';
import avatarRing from '@/assets/d2c/icons/members/avatar-ring.svg';
import { Pressable } from '@/components/common/Pressable';
import { MEETING_MEMBERS } from '@/data/meetingMembers';
import styles from './index.module.scss';

interface MembersSidebarProps {
  /** 关闭「管理成员」（不影响元宝窗） */
  onClose: () => void;
}

/**
 * 会中「管理成员」侧栏（Figma 406:17107）
 * 嵌在会议窗内右侧；与元宝 Agent 窗并存（三栏 OK），打开/关闭不互斥。
 */
export const MembersSidebar: FC<MembersSidebarProps> = ({ onClose }) => (
  <aside className={styles.panel} aria-label="管理成员">
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.titleIcon} aria-hidden="true">
          <img src={iconMembers} alt="" width={20} height={20} />
        </span>
        管理成员
      </div>
      <div className={styles.actions}>
        <span className={styles.iconButton} aria-hidden="true" title="独立窗口（演示）">
          <img src={iconPip} alt="" />
        </span>
        <span className={styles.iconButton} aria-hidden="true" title="更多（演示）">
          <img src={iconMore} alt="" />
        </span>
        <Pressable className={styles.iconButton} onClick={onClose} title="关闭管理成员" ariaLabel="关闭管理成员">
          <img src={iconClose} alt="" />
        </Pressable>
      </div>
    </header>

    <div className={styles.body}>
      <div className={styles.tabsRow}>
        <div className={styles.tabs} role="tablist" aria-label="成员状态">
          <span className={`${styles.tab} ${styles.tabActive}`} role="tab" aria-selected="true">
            会议中
          </span>
          <span className={styles.tab} role="tab" aria-selected="false">
            未入会
          </span>
        </div>
        <span className={styles.search} aria-hidden="true" title="搜索">
          <img src={iconSearch} alt="" />
        </span>
      </div>

      <ul className={`${styles.list} wm-scroll-hidden`}>
        {MEETING_MEMBERS.map((member) => (
          <li key={member.id} className={styles.row}>
            <div className={styles.identity}>
              <span className={styles.avatarWrap}>
                <img className={styles.avatar} src={member.avatar} alt="" />
                <img className={styles.avatarRing} src={avatarRing} alt="" />
              </span>
              <span className={styles.meta}>
                <span className={styles.name}>{member.name}</span>
                <span className={styles.org}>{member.org}</span>
              </span>
            </div>
            <span className={styles.device} aria-hidden="true">
              <img src={member.micOn ? iconMic : iconMicMuted} alt="" />
              <img src={member.camOn ? iconCam : iconCamOff} alt="" />
            </span>
          </li>
        ))}
      </ul>
    </div>

    <footer className={styles.footer}>
      <span className={styles.footerButton}>全体静音</span>
      <span className={styles.footerButton}>会议管控</span>
      <span className={`${styles.footerButton} ${styles.footerPrimary}`}>邀请成员</span>
    </footer>
  </aside>
);
