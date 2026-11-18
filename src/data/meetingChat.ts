import avatarSelf from '@/assets/ref/dawen/064e9.png';
import avatarXu from '@/assets/ref/dawen/3a851.png';
import member1 from '@/assets/ref/dawen/member-1.png';
import member2 from '@/assets/ref/dawen/member-2.png';
import member3 from '@/assets/ref/dawen/member-3.png';
import member4 from '@/assets/ref/dawen/member-4.png';
import member5 from '@/assets/ref/dawen/member-5.png';

/**
 * 会中聊天 / 管理成员侧栏的演示数据
 * 结构与文案取自参考 Demo（meeting-experience-demo-dawen），后续有 Figma 再逐像素校准。
 */

/** 本人：聊天里自己的消息、弹幕署名都用这个 */
export const SELF = { name: '刘冰冰', avatar: avatarSelf };

/** 置顶公告：最多显示 3 行，右下角是已读人数 */
export const CHAT_NOTICE = {
  text: '对齐 Thread 的新思路，如何展示心率、身体指标与会议进程的联动，还有会关系到各部门，重点推进还有哪些维度能衡量用户的会议状态。',
  readCount: 4,
};

export type ChatEntry =
  | { kind: 'time'; id: string; text: string }
  | { kind: 'text'; id: string; self: boolean; name: string; avatar: string; text: string }
  | {
      kind: 'info';
      id: string;
      self: boolean;
      name: string;
      avatar: string;
      title: string;
      description: string;
      attachments: { id: string; name: string; type: 'report' | 'doc' }[];
    };

/** 入会前已有的聊天记录 */
export const CHAT_HISTORY: ChatEntry[] = [
  { kind: 'time', id: 't-2035', text: '20:35' },
  { kind: 'text', id: 'm1', self: true, name: SELF.name, avatar: SELF.avatar, text: '今天是一个阳光明媚的日子' },
  { kind: 'text', id: 'm2', self: false, name: '徐青青', avatar: avatarXu, text: '论述散文创作的某种特色所惯常运用的' },
  {
    kind: 'info',
    id: 'm3',
    self: true,
    name: 'yiiybliu',
    avatar: SELF.avatar,
    title: '会议信息',
    description:
      '对齐 Thread 的新思路，如何展示心率、身体指标与会议进程的联动，还有哪些维度能衡量用户的会议状态；会议涉及资料现在已全部发完成了会议的准备工作。',
    attachments: [
      { id: 'a1', name: '月度市场收入贡献对比报告', type: 'report' },
      { id: 'a2', name: '市场营销预算.doc', type: 'doc' },
    ],
  },
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
  { id: 'taylor', name: 'Taylor(斯威夫特)', department: 'Tencent/CSIG腾讯会议产品中心', avatar: member4, micOn: false, cameraOn: false },
  { id: 'lenka', name: 'Lenka(蕾恩卡)', department: 'Tencent/CSIG智慧SaaS设计工作室', avatar: member5, micOn: false, cameraOn: false },
];

/** 已邀请但还没入会的成员 */
export const MEMBERS_NOT_JOINED: Pick<MeetingMember, 'id' | 'name' | 'department' | 'avatar'>[] = [
  { id: 'xu', name: '徐青青', department: 'Tencent/CSIG腾讯会议产品中心', avatar: avatarXu },
];
