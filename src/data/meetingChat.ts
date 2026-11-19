import avatarLike from '@/assets/d2c/images/sidetabs/chat-avatar-like@2x.png';
import avatarSelf from '@/assets/d2c/images/sidetabs/chat-avatar-self@2x.png';
import avatarCarmen from '@/assets/d2c/images/sidetabs/chat-avatar-carmen@2x.png';
import touchGrass from '@/assets/d2c/images/sidetabs/chat-image-touch-grass@2x.png';
import member1 from '@/assets/d2c/images/sidetabs/members-avatar-1@2x.png';
import member2 from '@/assets/d2c/images/sidetabs/members-avatar-2@2x.png';
import member3 from '@/assets/d2c/images/sidetabs/members-avatar-3@2x.png';
import member4 from '@/assets/d2c/images/sidetabs/members-avatar-4@2x.png';
import member5 from '@/assets/d2c/images/sidetabs/members-avatar-5@2x.png';

/**
 * 会中聊天 / 管理成员侧栏的演示数据（文案、头像按 Figma 505:12264）
 * TODO: 接入真实会中聊天与成员列表
 */

/** 本人：聊天里自己的消息、弹幕署名都用这个（自己的头像导出图上下各带 2 的留白，32×36） */
export const SELF = { name: '刘冰冰', avatar: avatarSelf };

export type ChatEntry =
  | { kind: 'time'; id: string; text: string }
  | { kind: 'text'; id: string; self: boolean; name: string; avatar: string; text: string }
  | { kind: 'image'; id: string; self: boolean; name: string; avatar: string; src: string; alt: string };

/** 入会前已有的聊天记录（Figma 545:23112） */
export const CHAT_HISTORY: ChatEntry[] = [
  { kind: 'time', id: 't-1', text: '昨天 22:10' },
  {
    kind: 'text',
    id: 'm1',
    self: false,
    name: '李可',
    avatar: avatarLike,
    text: '你说的那个文档发下呗, 我想了解一下细节看要不要购买吧我帮你看',
  },
  {
    kind: 'text',
    id: 'm2',
    self: true,
    name: SELF.name,
    avatar: SELF.avatar,
    text: '大家请留意新公告！本次春日茶话会旨在让大家在轻松愉快的氛围中畅所欢迎各位踊跃参与，期待大家都共同度过一个美好的下午！',
  },
  { kind: 'text', id: 'm3', self: false, name: 'Carmen', avatar: avatarCarmen, text: '好棒啊，开心👍' },
  { kind: 'image', id: 'm4', self: true, name: SELF.name, avatar: SELF.avatar, src: touchGrass, alt: 'touch grass 海报' },
];

export interface MeetingMember {
  id: string;
  name: string;
  department: string;
  avatar: string;
  micOn: boolean;
  cameraOn: boolean;
}

/** 会议中的成员 */
export const MEMBERS_IN_MEETING: MeetingMember[] = [
  { id: 'tinashe', name: 'Tinashe(蒂娜雪)', department: 'Tencent/CSIG云设计二中心', avatar: member1, micOn: true, cameraOn: true },
  { id: 'alan', name: 'Alan Walker(艾伦克)', department: 'Tencent/CSIG云设计二中心', avatar: member2, micOn: false, cameraOn: true },
  { id: 'kesha', name: 'Kesha(凯莎)', department: 'Tencent/CSIG云设计二中心', avatar: member3, micOn: true, cameraOn: false },
  { id: 'taylor', name: 'Taylor(斯威夫特)', department: 'Tencent/CSIG腾讯会议产品中心', avatar: member4, micOn: true, cameraOn: false },
  { id: 'lenka', name: 'Lenka(蕾恩卡)', department: 'Tencent/CSIG智慧SaaS设计工作室', avatar: member5, micOn: true, cameraOn: false },
];

/** 已邀请但还没入会的成员 */
export const MEMBERS_NOT_JOINED: Pick<MeetingMember, 'id' | 'name' | 'department' | 'avatar'>[] = [
  { id: 'xu', name: '徐青青', department: 'Tencent/CSIG腾讯会议产品中心', avatar: avatarLike },
];
