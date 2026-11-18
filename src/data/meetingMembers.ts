/**
 * 会中「管理成员」侧栏演示数据（Figma 406:17107 / 元宝Agent-入会 406:16873）
 */
import member1 from '@/assets/d2c/images/members/member-1.png';
import member2 from '@/assets/d2c/images/members/member-2.png';
import member3 from '@/assets/d2c/images/members/member-3.png';
import member4 from '@/assets/d2c/images/members/member-4.png';
import member5 from '@/assets/d2c/images/members/member-5.png';

export interface MeetingMember {
  id: string;
  name: string;
  org: string;
  avatar: string;
  micOn: boolean;
  camOn: boolean;
  /** 是否已在会中；未入会名单走内部 Tab */
  inMeeting: boolean;
}

export const MEETING_MEMBERS: MeetingMember[] = [
  {
    id: 'tinashe',
    name: 'Tinashe(蒂娜雪)',
    org: 'Tencent/CSIG云设计二中心',
    avatar: member1,
    micOn: true,
    camOn: true,
    inMeeting: true,
  },
  {
    id: 'alan',
    name: 'Alan Walker(艾伦克)',
    org: 'Tencent/CSIG云设计二中心',
    avatar: member2,
    micOn: false,
    camOn: true,
    inMeeting: true,
  },
  {
    id: 'kesha',
    name: 'Kesha(凯莎)',
    org: 'Tencent/CSIG云设计二中心',
    avatar: member3,
    micOn: true,
    camOn: false,
    inMeeting: true,
  },
  {
    id: 'taylor',
    name: 'Taylor(斯威夫特)',
    org: 'Tencent/CSIG腾讯会议产品中心',
    avatar: member4,
    micOn: true,
    camOn: false,
    inMeeting: true,
  },
  {
    id: 'lenka',
    name: 'Lenka(蕾恩卡)',
    org: 'Tencent/CSIG智慧SaaS设计工作室',
    avatar: member5,
    micOn: true,
    camOn: false,
    inMeeting: true,
  },
];
