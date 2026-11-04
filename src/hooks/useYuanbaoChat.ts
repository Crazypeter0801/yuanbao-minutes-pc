import { useCallback, useEffect, useRef, useState } from 'react';
import { answerQuestion, buildStageSummary, createId, type ReplyTopic } from '@/data/yuanbaoContent';
import type { AssistantMessage, ChatMessage } from '@/types/chat';

/** 模拟元宝思考耗时（ms） */
const ANSWER_DELAY = 900;

export interface YuanbaoChat {
  messages: ChatMessage[];
  /** 正在等待元宝回答（多条并发提问时，全部回答落地才结束） */
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
  /** 待回答数量：用计数而非布尔，否则并发提问时第一条回答落地就提前结束思考态 */
  const [pending, setPending] = useState(0);
  /** 上一条回答的主题，供问答规则处理「语气再正式一点」这类依赖上下文的追问 */
  const lastTopic = useRef<ReplyTopic | undefined>(undefined);
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
      // 回答在提问瞬间就定型（含上下文），避免连续提问时按落地顺序读取到别人的上下文
      const answer = answerQuestion(text, { lastTopic: lastTopic.current });
      lastTopic.current = answer.topic;

      setMessages((previous) => [...previous, { id: createId('q'), role: 'user', text }]);
      setPending((count) => count + 1);
      const timer = window.setTimeout(() => {
        push(answer.message);
        setPending((count) => count - 1);
      }, ANSWER_DELAY);
      timers.current.push(timer);
    },
    [push],
  );

  const summarizeNow = useCallback(() => {
    push(buildStageSummary());
  }, [push]);

  return { messages, isThinking: pending > 0, ask, push, summarizeNow };
}
