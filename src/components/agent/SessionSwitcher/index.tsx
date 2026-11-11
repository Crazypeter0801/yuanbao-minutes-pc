import { useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import {
  agentSessionGroups,
  CURRENT_SESSION_ID,
  currentSessionTitle,
} from '@/data/agentSessions';
import styles from './index.module.scss';

interface SessionSwitcherProps {
  /** 选了别的会话（演示里不真切换，只给个反馈） */
  onPick: (title: string) => void;
}

/**
 * 会话切换条
 * 当前会话挂在元宝主端的「腾讯会议」分组下；点开列出分组会话和全部对话。
 * 会议里的对话和主端是同一份，状态右侧的「已同步」表示上下文、记忆、产物两边打通。
 */
export const SessionSwitcher: FC<SessionSwitcherProps> = ({ onPick }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrap}>
      <Pressable
        className={`${styles.bar} ${open ? styles.barOpen : ''}`}
        onClick={() => setOpen((value) => !value)}
        ariaLabel="切换会话"
        ariaExpanded={open}
      >
        <span className={styles.groupIcon} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="2.5" width="9" height="7" rx="1.5" stroke="currentColor" />
            <path d="m7.5 5.2 2 -1.2v4l-2 -1.2" stroke="currentColor" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.group}>腾讯会议</span>
        <span className={styles.slash}>/</span>
        <span className={styles.title}>{currentSessionTitle}</span>
        <span className={styles.sync}>
          <i className={styles.syncDot} />
          已同步
        </span>
        <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Pressable>

      {open && (
        <>
          <div className={styles.mask} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.panel} role="listbox" aria-label="会话列表">
            {agentSessionGroups.map((group) => (
              <div className={styles.section} key={group.id}>
                <p className={styles.sectionTitle}>{group.title}</p>
                {group.sessions.map((session) => {
                  const active = session.id === CURRENT_SESSION_ID;
                  return (
                    <Pressable
                      key={session.id}
                      className={`${styles.item} ${active ? styles.itemActive : ''}`}
                      onClick={() => {
                        setOpen(false);
                        if (!active) {
                          onPick(session.title);
                        }
                      }}
                    >
                      <span className={styles.itemTitle}>{session.title}</span>
                      <span className={`${styles.itemMeta} ${session.live ? styles.itemLive : ''}`}>
                        {session.meta}
                      </span>
                    </Pressable>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
