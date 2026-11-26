import type { FC } from 'react';
import iconBarApps from '@/assets/d2c/frame811/icon-bar-apps.svg';
import iconBarArrow from '@/assets/d2c/frame811/icon-bar-arrow.svg';
import iconBarCamera from '@/assets/d2c/frame811/icon-bar-camera.svg';
import iconBarChat from '@/assets/d2c/frame811/icon-bar-chat.svg';
import iconBarInvite from '@/assets/d2c/frame811/icon-bar-invite.svg';
import iconBarLeave from '@/assets/d2c/frame811/icon-bar-leave.svg';
import iconBarMembers from '@/assets/d2c/frame811/icon-bar-members.svg';
import iconBarMic from '@/assets/d2c/frame811/icon-bar-mic.svg';
import iconBarRecord from '@/assets/d2c/frame811/icon-bar-record.svg';
import iconBarShare from '@/assets/d2c/frame811/icon-bar-share.svg';
import iconBarTranscript from '@/assets/d2c/frame811/icon-bar-transcript.svg';
import iconBarYuanbao from '@/assets/d2c/frame811/icon-bar-yuanbao.svg';
import iconChatEmoji from '@/assets/d2c/frame811/icon-chat-emoji.svg';
import iconHandRaise from '@/assets/d2c/frame811/icon-hand-raise.svg';
import { Pressable } from '@/components/common/Pressable';
import { ChatCompose } from '@/components/meeting/ChatCompose';
import type { SideAppId } from '@/components/sidebar/SideDock';
import { meetingSession } from '@/data/meetingSession';
import styles from './index.module.scss';

interface MeetingToolbarProps {
  /** 侧栏当前激活的应用 */
  activeApp: SideAppId | null;
  /** 所有已打开的应用集合（含停靠页签与独立浮窗） */
  openApps: SideAppId[];
  /** 成员 / 聊天 / 元宝按钮切换 */
  onToggleApp: (app: SideAppId) => void;
  /** 「发送弹幕」浮层发出一条 */
  onSendBarrage: (text: string) => boolean;
  /** 弹幕浮层里的「聊天 >」 */
  onOpenChat: () => void;
}

/**
 * 会中底栏（Figma 811:25000 `toolbar-应用细节`）
 *
 * 白底高 66、padding 8 10：
 * - 左：说点什么...（触发弹幕浮层）+ 举手表情按钮；
 * - 中：麦克风 ▴ / 摄像头 ▴ / 共享屏幕 ▴ / 成员(8) / 邀请 / 聊天 / 录制 / 逐字稿 / 元宝 / 应用；
 * - 右：离开会议（#E63922）。
 */
export const MeetingToolbar: FC<MeetingToolbarProps> = ({
  activeApp,
  openApps,
  onToggleApp,
  onSendBarrage,
  onOpenChat,
}) => {
  const membersOpen = openApps.includes('members');
  const chatOpen = openApps.includes('chat');
  const yuanbaoOpen = openApps.includes('yuanbao');

  return (
    <div className={styles.toolbar}>
      <div className={styles.interactGroup}>
        <ChatCompose triggerClassName={styles.sayPill} onSend={onSendBarrage} onOpenChat={onOpenChat}>
          <img className={styles.icon24} src={iconChatEmoji} alt="" width={24} height={24} draggable={false} />
          <span className={styles.sayPlaceholder}>说点什么...</span>
        </ChatCompose>
        <span className={styles.handBtn} title="互动反应">
          <img className={styles.icon24} src={iconHandRaise} alt="" width={24} height={24} draggable={false} />
        </span>
      </div>

      <div className={styles.controls}>
        <span className={styles.splitBtn}>
          <span className={styles.splitMain}>
            <img className={styles.icon24} src={iconBarMic} alt="" width={24} height={24} draggable={false} />
            <span className={styles.label}>麦克风</span>
          </span>
          <img className={styles.arrow} src={iconBarArrow} alt="" width={12} height={37} draggable={false} />
        </span>

        <span className={styles.splitBtn}>
          <span className={styles.splitMain}>
            <img className={styles.icon24} src={iconBarCamera} alt="" width={24} height={24} draggable={false} />
            <span className={styles.label}>摄像头</span>
          </span>
          <img className={styles.arrow} src={iconBarArrow} alt="" width={12} height={37} draggable={false} />
        </span>

        <span className={styles.splitBtn}>
          <span className={styles.splitMain}>
            <img className={styles.icon24} src={iconBarShare} alt="" width={24} height={24} draggable={false} />
            <span className={styles.label}>共享屏幕</span>
          </span>
          <img className={styles.arrow} src={iconBarArrow} alt="" width={12} height={37} draggable={false} />
        </span>

        <Pressable
          as="span"
          className={`${styles.btn} ${styles.btnInteractive} ${membersOpen ? styles.btnActive : ''}`}
          onClick={() => onToggleApp('members')}
          ariaLabel={activeApp === 'members' ? '收起管理成员' : '管理成员'}
          title="管理成员"
        >
          <img className={styles.icon24} src={iconBarMembers} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>成员({meetingSession.groupMembers})</span>
        </Pressable>

        <span className={styles.btn}>
          <img className={styles.icon24} src={iconBarInvite} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>邀请</span>
        </span>

        <Pressable
          as="span"
          className={`${styles.btn} ${styles.btnInteractive} ${chatOpen ? styles.btnActive : ''}`}
          onClick={() => onToggleApp('chat')}
          ariaLabel={activeApp === 'chat' ? '收起聊天' : '打开聊天'}
          title="聊天"
        >
          <img className={styles.icon24} src={iconBarChat} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>聊天</span>
        </Pressable>

        <span className={styles.btn}>
          <img className={styles.icon24} src={iconBarRecord} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>录制</span>
        </span>

        <span className={styles.btn}>
          <img className={styles.icon24} src={iconBarTranscript} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>逐字稿</span>
        </span>

        <Pressable
          as="span"
          className={`${styles.btn} ${styles.btnInteractive} ${yuanbaoOpen ? styles.btnActive : ''}`}
          onClick={() => onToggleApp('yuanbao')}
          ariaLabel={activeApp === 'yuanbao' ? '收起元宝' : '打开元宝'}
          title={activeApp === 'yuanbao' ? '收起元宝' : '打开元宝'}
        >
          <img className={styles.icon24} src={iconBarYuanbao} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>元宝</span>
        </Pressable>

        <span className={styles.btn}>
          <img className={styles.icon24} src={iconBarApps} alt="" width={24} height={24} draggable={false} />
          <span className={styles.label}>应用</span>
        </span>
      </div>

      <div className={styles.exitWrap}>
        <span className={`${styles.btn} ${styles.leaveBtn}`}>
          <img className={styles.icon24} src={iconBarLeave} alt="" width={24} height={24} draggable={false} />
          <span className={styles.leaveLabel}>离开会议</span>
        </span>
      </div>
    </div>
  );
};
