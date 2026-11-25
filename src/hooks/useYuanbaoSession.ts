import { useState } from 'react';
import { buildInitialSummaryRound, buildRecordingStartMessage } from '@/data/proactiveScenarios';
import { useYuanbaoChat, type YuanbaoChat } from '@/hooks/useYuanbaoChat';
import type { ChatMessage } from '@/types/chat';

/** 元宝会话：窗口内的侧栏与窗口外的演示按钮共用同一份对话 */
export type YuanbaoSession = YuanbaoChat;

/**
 * 元宝会话状态：提到 App 层，窗口外的演示按钮和窗口内的侧栏操作的是同一份对话
 * 初始对话对齐 Figma 811:38602：开场记录 + 元宝笔记卡片 + 会中重点确认与多轮问答。
 */
export function useYuanbaoSession(): YuanbaoSession {
  // 惰性初始化：时间取打开页面的那一刻，而不是模块加载时
  const [initial] = useState<ChatMessage[]>(() => [buildRecordingStartMessage(), ...buildInitialSummaryRound()]);
  return useYuanbaoChat(initial);
}
