import { useEffect } from 'react';
import { buildInitialFocusMessage, buildRecordingStartMessage } from '@/data/proactiveScenarios';
import { useYuanbaoChat, type YuanbaoChat } from '@/hooks/useYuanbaoChat';
import type { ChatMessage } from '@/types/chat';

/** 元宝会话：窗口内的侧栏与窗口外的演示按钮共用同一份对话 */
export type YuanbaoSession = YuanbaoChat;

const EMPTY_INITIAL_MESSAGES: ChatMessage[] = [];
/** 空态短暂停顿后一起入场 ① 开场气泡 + ② 元宝笔记卡片 */
const INTRO_APPEAR_DELAY_MS = 400;
/** 前 2 项入场后间隔 5 秒再滑入 ③ 重点确认提示 */
const FOCUS_FOLLOWUP_DELAY_MS = 5000;

/**
 * 元宝会话状态：提到 App 层，停靠侧栏、独立悬浮窗与演示按钮共用同一份对话，切换窗口形态不重置不重播。
 * 首屏初始化为空数组 []，400ms 后一起出现 ①+②，间隔 5000ms 后再滑入 ③；
 * 卸载/StrictMode 重挂载时严格清理定时器并由 push 按消息 id 去重。
 */
export function useYuanbaoSession(): YuanbaoSession {
  const chat = useYuanbaoChat(EMPTY_INITIAL_MESSAGES);
  const { push } = chat;

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      push(buildRecordingStartMessage());
    }, INTRO_APPEAR_DELAY_MS);

    const focusTimer = window.setTimeout(() => {
      push(buildInitialFocusMessage());
    }, INTRO_APPEAR_DELAY_MS + FOCUS_FOLLOWUP_DELAY_MS);

    return () => {
      window.clearTimeout(introTimer);
      window.clearTimeout(focusTimer);
    };
  }, [push]);

  return chat;
}
