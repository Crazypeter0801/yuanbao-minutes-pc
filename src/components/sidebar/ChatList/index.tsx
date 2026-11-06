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
  /** 交互卡片提交 */
  onCardSubmit?: (cardId: BubbleCard['id'], values: string[]) => void;
}

/**
 * 按 IM 习惯排列消息
 *
 * - 不写发言人：左边灰泡就是元宝，右边蓝泡就是自己；
 * - 时间居中单独一行：第一条消息前出一次，之后只有距上一条超过 1 分钟才再出；
 *   同一个人连发、或一问一答紧挨着时都不插时间；
 * - 间距：换人 20、同一人连发 12，时间行上 20 下 12。
 */
export const ChatList: FC<ChatListProps> = ({
  messages,
  shape,
  isThinking = false,
  onFollowUp,
  onOpenSource,
  onOpenArtifact,
  onOpenNote,
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

        return (
          <div className={styles.entry} key={message.id}>
            {showTime && (
              <p className={`${styles.time} ${index === 0 ? styles.timeFirst : ''}`}>
                {formatDividerTime(message.createdAt)}
              </p>
            )}
            <div className={spacing}>
              {message.role === 'user' ? (
                <UserMessageView message={message} shape="round" />
              ) : (
                <AssistantMessageView
                  message={message}
                  shape={shape}
                  onFollowUp={onFollowUp}
                  onOpenSource={onOpenSource}
                  onOpenArtifact={onOpenArtifact}
                  onOpenNote={onOpenNote}
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
