import type { FC } from 'react';
import { AssistantMessageView } from '@/components/sidebar/AssistantMessageView';
import { ThinkingIndicator } from '@/components/sidebar/ThinkingIndicator';
import { UserMessageView } from '@/components/sidebar/UserMessageView';
import type { ChatMessage } from '@/types/chat';

interface ChatListProps {
  messages: ChatMessage[];
  /** 气泡形态，见 AssistantMessageView */
  shape: 'round' | 'compact' | 'plain';
  isThinking?: boolean;
  onFollowUp?: (text: string) => void;
  onOpenSource?: () => void;
}

/**
 * 按角色渲染消息列表
 * 返回 Fragment，直接作为 MessageStream 的子元素参与 12px 间距。
 */
export const ChatList: FC<ChatListProps> = ({
  messages,
  shape,
  isThinking = false,
  onFollowUp,
  onOpenSource,
}) => (
  <>
    {messages.map((message) =>
      message.role === 'user' ? (
        <UserMessageView key={message.id} message={message} shape={shape} />
      ) : (
        <AssistantMessageView
          key={message.id}
          message={message}
          shape={shape}
          onFollowUp={onFollowUp}
          onOpenSource={onOpenSource}
        />
      ),
    )}
    {isThinking && <ThinkingIndicator plain={shape === 'plain'} />}
  </>
);
