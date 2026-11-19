/**
 * 左侧会议窗口的静态展示数据
 * 说明：会议窗口本期只做视觉还原，不接交互，配置集中在此便于替换真实会议信息。
 */

export interface MeetingSessionInfo {
  /** 窗口标题 */
  title: string;
  /** 会议已进行时长 */
  duration: string;
  /** 本场会议关联的会议群（腾讯会议按会议主题自动建的群） */
  groupName: string;
  /** 会议群人数 */
  groupMembers: number;
}

export const meetingSession: MeetingSessionInfo = {
  title: '会议详情',
  duration: '01:31:09',
  groupName: '元宝侧栏视觉评审',
  groupMembers: 8,
};

/** 产物卡片下方的追问：直接发到本场会议群 */
export const SHARE_TO_GROUP_LABEL = `发送到「${meetingSession.groupName}」会议群`;
