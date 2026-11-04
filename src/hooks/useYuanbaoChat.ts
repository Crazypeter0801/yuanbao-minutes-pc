import { useCallback, useEffect, useRef, useState } from 'react';
import { answerQuestion, buildStageSummary, createId } from '@/data/yuanbaoContent';
import type { AssistantMessage, ChatMessage } from '@/types/chat';

/** 模拟元宝思考耗时（ms） */
const ANSWER_DELAY = 900;

export interface YuanbaoChat {
  messages: ChatMessage[];
  /** 正在等待元宝回答 */
  isThinking: boolean;
  /** 提问：先追加用户消息，再异步追加回答 */
  ask: (question: string) => void;
  /** 追加一条元宝消息（如立即总结） */
  push: (message: AssistantMessage) => void;
  /** 立即生成阶段小结 */
  summarizeNow: () => void;
}

/**
 * 元宝对话状态
 * 三个方案都用它管理消息流：A 把纪要和问答放进同一个实例；
 * B 的两个 Tab 各用一个实例；C 只用一个问答实例。
 */
export function useYuanbaoChat(initial: ChatMessage[]): YuanbaoChat {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [isThinking, setIsThinking] = useState(false);
  const timers = useRef<number[]>([]);

  // 卸载时清理未完成的回答，避免对已卸载组件 setState
  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const push = useCallback((message: AssistantMessage) => {
    setMessages((previous) => [...previous, message]);
  }, []);

  const ask = useCallback(
    (question: string) => {
      const text = question.trim();
      if (!text) {
        return;
      }
      setMessages((previous) => [...previous, { id: createId('q'), role: 'user', text }]);
      setIsThinking(true);
      const timer = window.setTimeout(() => {
        push(answerQuestion(text));
        setIsThinking(false);
      }, ANSWER_DELAY);
      timers.current.push(timer);
    },
    [push],
  );

  const summarizeNow = useCallback(() => {
    push(buildStageSummary());
  }, [push]);

  return { messages, isThinking, ask, push, summarizeNow };
}
