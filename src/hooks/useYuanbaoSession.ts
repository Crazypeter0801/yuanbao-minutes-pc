import { useState } from 'react';
import { buildRecordingStartMessage } from '@/data/proactiveScenarios';
import { useYuanbaoChat, type YuanbaoChat } from '@/hooks/useYuanbaoChat';
import type { ChatMessage } from '@/types/chat';

/** 元宝会话：窗口内的侧栏与窗口外的演示按钮共用同一份对话 */
export type YuanbaoSession = YuanbaoChat;

/**
 * 元宝会话状态：提到 App 层，窗口外的演示按钮和窗口内的侧栏操作的是同一份对话
 * 开启云笔记后默认第一条就是「我已经开始记录啦～」+「正在帮你记」卡片，不需要手动触发。
 */
export function useYuanbaoSession(): YuanbaoSession {
  // 惰性初始化：时间取打开页面的那一刻，而不是模块加载时
  const [initial] = useState<ChatMessage[]>(() => [buildRecordingStartMessage()]);
  return useYuanbaoChat(initial);
}
