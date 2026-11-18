import { useCallback, useState } from "react";
import { MEETING_CHAT_SEED, type MeetingChatItem } from "@/data/meetingChat";
import avatarLiubingbing from "@/assets/d2c/images/meeting-app/chat-avatar-liubingbing@2x.png";

export interface MeetingChatSession {
  messages: MeetingChatItem[];
  draft: string;
  setDraft: (value: string) => void;
  send: (text?: string) => void;
}

/** 会中聊天：消息与草稿放在 App，切 Tab / 关闭侧栏都不会丢 */
export function useMeetingChat(): MeetingChatSession {
  const [messages, setMessages] = useState<MeetingChatItem[]>(MEETING_CHAT_SEED);
  const [draft, setDraft] = useState("");

  const send = useCallback((text?: string) => {
    const next = (text ?? draft).trim();
    if (!next) {
      return;
    }
    const item: MeetingChatItem = {
      id: `local-${Date.now()}`,
      kind: "text",
      sender: "刘冰冰",
      avatar: avatarLiubingbing,
      self: true,
      text: next,
    };
    setMessages((previous) => [...previous, item]);
    setDraft("");
  }, [draft]);

  return { messages, draft, setDraft, send };
}
