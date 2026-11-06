import { initialMessages } from '@/data/yuanbaoContent';
import { useYuanbaoChat, type YuanbaoChat } from '@/hooks/useYuanbaoChat';

/** 元宝会话：窗口内的侧栏与窗口外的演示按钮共用同一份对话 */
export type YuanbaoSession = YuanbaoChat;

/** 元宝会话状态：提到 App 层，窗口外的演示按钮和窗口内的侧栏操作的是同一份对话 */
export function useYuanbaoSession(): YuanbaoSession {
  return useYuanbaoChat(initialMessages);
}
