import { useMemo, useState, type FC } from 'react';
import IconMembersCameraOff from '@/assets/d2c/icons/sidetabs/icon-members-camera-off';
import IconMembersCameraOn from '@/assets/d2c/icons/sidetabs/icon-members-camera-on';
import IconMembersMicOff from '@/assets/d2c/icons/sidetabs/icon-members-mic-off';
import IconMembersMicOn from '@/assets/d2c/icons/sidetabs/icon-members-mic-on';
import IconMembersSearch from '@/assets/d2c/icons/sidetabs/icon-members-search';
import { Toast } from '@/components/common/Toast';
import { Pressable } from '@/components/common/Pressable';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SIDE_APPS } from '@/components/sidebar/SideDock/apps';
import { MEMBERS_IN_MEETING, MEMBERS_NOT_JOINED, type MeetingMember } from '@/data/meetingChat';
import { useToast } from '@/hooks/useToast';
import styles from './index.module.scss';

interface MembersSidebarProps {
  showHeader: boolean;
  onClose: () => void;
  onPopOut?: () => void;
}

type MemberTab = 'joined' | 'invited';

/**
 * 管理成员侧栏（Figma 505:12264 第二张 · 504:11247 / 504:11358）
 * 「会议中 / 未入会」分段 + 搜索 30；成员行：头像 28、名字 / 部门两行 12/20、麦克风 / 摄像头 16；
 * 底部三颗 32 高的胶囊按钮：全体静音、会议管控、邀请成员（黑底）。
 * 演示里点麦克风图标可切换该成员的静音状态，「全体静音」把会议中所有人静音。
 */
export const MembersSidebar: FC<MembersSidebarProps> = ({ showHeader, onClose, onPopOut }) => {
  const { toast, showToast } = useToast();
  const [tab, setTab] = useState<MemberTab>('joined');
  const [members, setMembers] = useState<MeetingMember[]>(MEMBERS_IN_MEETING);
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'join-mute', label: '成员入会时静音', onClick: () => showToast('已开启：成员入会时静音（演示）') },
      { key: 'export', label: '导出成员列表', onClick: () => showToast('成员列表已导出（演示）') },
    ],
    [showToast],
  );

  const match = (name: string) => !keyword.trim() || name.toLowerCase().includes(keyword.trim().toLowerCase());
  const joined = members.filter((member) => match(member.name));
  const invited = MEMBERS_NOT_JOINED.filter((member) => match(member.name));

  const toggleMic = (id: string) =>
    setMembers((previous) => previous.map((member) => (member.id === id ? { ...member, micOn: !member.micOn } : member)));

  const muteAll = () => {
    setMembers((previous) => previous.map((member) => ({ ...member, micOn: false })));
    showToast('已全体静音');
  };

  return (
    <div className={styles.panel}>
      {showHeader && (
        <SidebarHeader
          icon={SIDE_APPS.members.icon}
          title={SIDE_APPS.members.title}
          onPip={() => (onPopOut ? onPopOut() : showToast('管理成员已在独立窗口打开（演示）'))}
          menuItems={menuItems}
          onClose={onClose}
        />
      )}

      <div className={styles.toolbar}>
        {searching ? (
          <input
            className={styles.search}
            autoFocus
            value={keyword}
            placeholder="搜索成员"
            aria-label="搜索成员"
            onChange={(event) => setKeyword(event.target.value)}
            onBlur={() => !keyword && setSearching(false)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setKeyword('');
                setSearching(false);
              }
            }}
          />
        ) : (
          <div className={styles.segment} role="tablist" aria-label="成员分组">
            <Pressable
              as="span"
              className={`${styles.segmentItem} ${tab === 'joined' ? styles.segmentItemActive : ''}`}
              onClick={() => setTab('joined')}
              ariaLabel={`会议中 ${members.length} 人`}
            >
              会议中
            </Pressable>
            <Pressable
              as="span"
              className={`${styles.segmentItem} ${tab === 'invited' ? styles.segmentItemActive : ''}`}
              onClick={() => setTab('invited')}
              ariaLabel={`未入会 ${MEMBERS_NOT_JOINED.length} 人`}
            >
              未入会
            </Pressable>
          </div>
        )}
        <Pressable
          className={styles.searchButton}
          onClick={() => {
            if (searching) {
              setKeyword('');
            }
            setSearching(!searching);
          }}
          ariaLabel={searching ? '取消搜索' : '搜索成员'}
        >
          <IconMembersSearch />
        </Pressable>
      </div>

      <div className={`${styles.list} wm-scroll-hidden`}>
        {tab === 'joined'
          ? joined.map((member) => (
              <div className={styles.member} key={member.id}>
                <div className={styles.person}>
                  <img className={styles.avatar} src={member.avatar} alt="" draggable={false} />
                  <div className={styles.personText}>
                    <strong className={styles.name}>{member.name}</strong>
                    <small className={styles.department}>{member.department}</small>
                  </div>
                </div>
                <div className={styles.devices}>
                  <Pressable
                    as="span"
                    className={styles.device}
                    onClick={() => toggleMic(member.id)}
                    ariaLabel={member.micOn ? `将${member.name}静音` : `请${member.name}解除静音`}
                    title={member.micOn ? '静音' : '解除静音'}
                  >
                    {member.micOn ? <IconMembersMicOn /> : <IconMembersMicOff />}
                  </Pressable>
                  <span className={styles.device} aria-label={member.cameraOn ? '摄像头已开启' : '摄像头已关闭'}>
                    {member.cameraOn ? <IconMembersCameraOn /> : <IconMembersCameraOff />}
                  </span>
                </div>
              </div>
            ))
          : invited.map((member) => (
              <div className={styles.member} key={member.id}>
                <div className={styles.person}>
                  <img className={styles.avatar} src={member.avatar} alt="" draggable={false} />
                  <div className={styles.personText}>
                    <strong className={styles.name}>{member.name}</strong>
                    <small className={styles.department}>{member.department}</small>
                  </div>
                </div>
                <Pressable
                  as="span"
                  className={styles.callButton}
                  onClick={() => showToast(`已呼叫${member.name}（演示）`)}
                >
                  呼叫
                </Pressable>
              </div>
            ))}
        {(tab === 'joined' ? joined : invited).length === 0 && <div className={styles.empty}>没有找到相关成员</div>}
      </div>

      <div className={styles.footer}>
        <Pressable className={styles.footerButton} onClick={muteAll}>
          全体静音
        </Pressable>
        <Pressable className={styles.footerButton} onClick={() => showToast('打开会议管控（演示）')}>
          会议管控
        </Pressable>
        <Pressable
          className={`${styles.footerButton} ${styles.footerButtonStrong}`}
          onClick={() => showToast('会议链接已复制，可发给要邀请的人（演示）')}
        >
          邀请成员
        </Pressable>
      </div>

      <Toast toast={toast} placement="window" />
    </div>
  );
};
