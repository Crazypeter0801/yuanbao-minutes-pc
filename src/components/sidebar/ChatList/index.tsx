import type { FC } from 'react';
import { AssistantMessageView } from '@/components/sidebar/AssistantMessageView';
import { ThinkingIndicator } from '@/components/sidebar/ThinkingIndicator';
import { UserMessageView } from '@/components/sidebar/UserMessageView';
import type { BubbleCard, ChatMessage } from '@/types/chat';

interface ChatListProps {
  messages: ChatMessage[];
  /** 元宝消息的排版形态，见 AssistantMessageView；用户气泡本版固定 round，不跟随 */
  shape: 'round' | 'compact' | 'plain';
  isThinking?: boolean;
  onFollowUp?: (text: string) => void;
  onOpenSource?: () => void;
  /** 交互卡片提交 */
  onCardSubmit?: (cardId: BubbleCard['id'], values: string[]) => void;
}

/**
 * 按角色渲染消息列表
 * 返回 Fragment，直接作为 MessageStream 的子元素参与 12px 间距。
 *
 * 演示阶段每条元宝消息都带「元宝 + 时间」：方便逐条核对时一眼定位是哪一句。
 * （真实产品里连续消息只在组头标一次，靠 AssistantMessageView 的 showMeta 控制，
 * 需要时在这里按 createdAt 分组传 false 即可。）
 */
export const ChatList: FC<ChatListProps> = ({
  messages,
  shape,
  isThinking = false,
  onFollowUp,
  onOpenSource,
  onCardSubmit,
}) => (
  <>
    {messages.map((message, index) =>
      message.role === 'user' ? (
        <UserMessageView key={message.id} message={message} shape="round" />
      ) : (
        <AssistantMessageView
          key={message.id}
          message={message}
          shape={shape}
          showMeta
          onFollowUp={onFollowUp}
          onOpenSource={onOpenSource}
          onCardSubmit={onCardSubmit}
          // 只留最后一轮的追问：元宝说了下一句，旧提问就收起
          showFollowUps={index === messages.length - 1}
        />
      ),
    )}
    {isThinking && <ThinkingIndicator plain={shape === 'plain'} />}
  </>
);
