/**
 * 左侧会议窗口的静态展示数据
 * 说明：会议窗口本期只做视觉还原，不接交互，配置集中在此便于替换真实会议信息。
 */

export interface MeetingSessionInfo {
  /** 窗口标题 */
  title: string;
  /** 会议已进行时长 */
  duration: string;
}

export const meetingSession: MeetingSessionInfo = {
  title: '会议详情',
  duration: '01:31:09',
};
