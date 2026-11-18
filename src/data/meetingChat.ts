/**
 * 会中聊天演示数据（Figma 305:39344）
 * TODO: 接入真实会中 IM 后由会话服务驱动
 */
import avatarLiubingbing from "@/assets/d2c/images/meeting-app/chat-avatar-liubingbing@2x.png";
import avatarXuqingqing from "@/assets/d2c/images/meeting-app/chat-avatar-xuqingqing@2x.png";
import avatarYiiybliu from "@/assets/d2c/images/meeting-app/chat-avatar-yiiybliu@2x.png";

export type MeetingChatKind = "notice" | "time" | "text" | "info-card";

export interface MeetingChatAttachment {
  id: string;
  name: string;
  kind: "report" | "doc";
}

export interface MeetingChatItem {
  id: string;
  kind: MeetingChatKind;
  /** 系统通知或正文 */
  text?: string;
  /** 通知右下角附件数 */
  attachCount?: number;
  /** 时间分割 */
  time?: string;
  sender?: string;
  avatar?: string;
  self?: boolean;
  title?: string;
  attachments?: MeetingChatAttachment[];
}

export const MEETING_CHAT_SEED: MeetingChatItem[] = [
  {
    id: "notice-1",
    kind: "notice",
    text: "对齐 Thread 的新思路，如何展示心率、身体指标与会议进程的联动，还有会关系到各部门，重点推进还有哪些维度能衡量用户的会议状...",
    attachCount: 4,
  },
  {
    id: "time-1",
    kind: "time",
    time: "20:35",
  },
  {
    id: "text-self-1",
    kind: "text",
    sender: "刘冰冰",
    avatar: avatarLiubingbing,
    self: true,
    text: "今天是一个阳光明媚的日子",
  },
  {
    id: "text-peer-1",
    kind: "text",
    sender: "徐青青",
    avatar: avatarXuqingqing,
    self: false,
    text: "论述散文创作的某种特色所惯常运用的",
  },
  {
    id: "card-1",
    kind: "info-card",
    sender: "yiiybliu",
    avatar: avatarYiiybliu,
    self: true,
    title: "会议信息",
    text: "对齐 Thread 的新思路，如何展示心率、身体指标与会议进程的联动，还有哪些维度能衡量用户的会议状态；会议涉及资料现在已全部发完成了会议的...",
    attachments: [
      { id: "a1", name: "月度市场收入贡献对比报告", kind: "report" },
      { id: "a2", name: "市场营销预算.doc", kind: "doc" },
    ],
  },
];
