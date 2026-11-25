import type { FC } from 'react';
import { AssistantMessageView } from '@/components/sidebar/AssistantMessageView';
import { ThinkingIndicator } from '@/components/sidebar/ThinkingIndicator';
import { UserMessageView } from '@/components/sidebar/UserMessageView';
import type { ArtifactItem } from '@/types/artifact';
import type { BubbleCard, ChatMessage } from '@/types/chat';
import { formatDividerTime } from './formatTime';
import styles from './index.module.scss';

/** 距上一条超过 1 分钟才再插一次时间 */
const TIME_GAP_MS = 60 * 1000;

interface ChatListProps {
  messages: ChatMessage[];
  /** 元宝消息的排版形态，见 AssistantMessageView；用户气泡本版固定 round，不跟随 */
  shape: 'round' | 'compact' | 'plain';
  isThinking?: boolean;
  onFollowUp?: (text: string) => void;
  onOpenSource?: () => void;
  /** 点击气泡下方的产物卡片 */
  onOpenArtifact?: (artifact: ArtifactItem) => void;
  /** 点击气泡下方的「正在帮你记」卡片 */
  onOpenNote?: () => void;
  /** 「正在帮你记」卡片里已识别出的话题，最后一条是当前正在聊的 */
  noteTopics?: string[];
  /** 交互卡片提交 */
  onCardSubmit?: (cardId: BubbleCard['id'], values: string[]) => void;
}

/**
 * 按 IM 习惯排列消息
 *
 * - 不写发言人：左边灰泡就是元宝，右边蓝泡就是自己；
 * - 时间居中单独一行：第一条消息前出一次，之后相邻消息时间差超过 1 分钟（> 60_000ms）自动插入居中 HH:mm 时间戳；
 * - 间距：同一发送方连续消息（≤ 1 分钟）4px，不同发送方交替（≤ 1 分钟）16px，时间行上 20px 下 16px。
 */
export const ChatList: FC<ChatListProps> = ({
  messages,
  shape,
  isThinking = false,
  onFollowUp,
  onOpenSource,
  onOpenArtifact,
  onOpenNote,
  noteTopics,
  onCardSubmit,
}) => {
  const lastRole = messages[messages.length - 1]?.role;

  return (
    <div className={styles.list}>
      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const showTime = !previous || message.createdAt - previous.createdAt > TIME_GAP_MS;
        const sameSender = Boolean(previous) && previous.role === message.role;
        const spacing = showTime ? styles.afterTime : sameSender ? styles.sameSender : styles.newSender;
        const spacingKind = showTime ? 'after-time' : sameSender ? 'same-sender' : 'new-sender';

        return (
          <div className={styles.entry} key={message.id} data-chat-entry={message.id} data-message-role={message.role}>
            {showTime && (
              <p
                className={`${styles.time} ${index === 0 ? styles.timeFirst : ''}`}
                data-time-divider={index === 0 ? 'first' : 'gap'}
              >
                {formatDividerTime(message.createdAt)}
              </p>
            )}
            <div className={spacing} data-spacing={spacingKind}>
              {message.role === 'user' ? (
                <UserMessageView message={message} shape="round" onOpenArtifact={onOpenArtifact} />
              ) : (
                <AssistantMessageView
                  message={message}
                  shape={shape}
                  onFollowUp={onFollowUp}
                  onOpenSource={onOpenSource}
                  onOpenArtifact={onOpenArtifact}
                  onOpenNote={onOpenNote}
                  noteTopics={noteTopics}
                  onCardSubmit={onCardSubmit}
                  // 只留最后一轮的追问：元宝说了下一句，旧提问就收起
                  showFollowUps={index === messages.length - 1}
                />
              )}
            </div>
          </div>
        );
      })}
      {isThinking && (
        // 思考中一定是元宝：紧跟在元宝后面按连发算，跟在用户后面按换人算
        <div className={lastRole === 'assistant' ? styles.sameSender : styles.newSender}>
          <ThinkingIndicator plain={shape === 'plain'} />
        </div>
      )}
    </div>
  );
};
