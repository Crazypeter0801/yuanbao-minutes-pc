import type { FC, ReactNode } from 'react';
import IconFollowUpNext from '@/assets/d2c/icons/chat/icon-follow-up-next';
import IconSideLink from '@/assets/d2c/icons/v1/icon-side-link';
import { Pressable } from '@/components/common/Pressable';
import { ArtifactCard } from '@/components/sidebar/ArtifactCard';
import { FoldCard } from '@/components/sidebar/FoldCard';
import { MessageCard } from '@/components/sidebar/MessageCard';
import { RecordingCard } from '@/components/sidebar/RecordingCard';
import { RichText } from '@/components/sidebar/RichText';
import { useSquircle } from '@/hooks/useSquircle';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage, BubbleCard } from '@/types/chat';
import styles from './index.module.scss';

interface AssistantBubbleBoxProps {
  className: string;
  squircleRadius: number;
  squircleEnabled: boolean;
  children: ReactNode;
}

/** 单个助手消息气泡容器：在不支持原生 corner-shape 的浏览器里自动应用 60% squircle 回退 */
const AssistantBubbleBox: FC<AssistantBubbleBoxProps> = ({
  className,
  squircleRadius,
  squircleEnabled,
  children,
}) => {
  const ref = useSquircle<HTMLDivElement>(squircleRadius, squircleEnabled);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface AssistantMessageViewProps {
  message: AssistantMessage;
  shape: 'round' | 'compact' | 'plain';
  /** 点击追问建议 */
  onFollowUp?: (text: string) => void;
  /** 点击链接徽标 / 引用来源 */
  onOpenSource?: () => void;
  /** 点击气泡下方的产物卡片 */
  onOpenArtifact?: (artifact: ArtifactItem) => void;
  /** 点击气泡下方的「正在帮你记」卡片 */
  onOpenNote?: () => void;
  /** 「正在帮你记」卡片里已识别出的话题，最后一条是当前正在聊的 */
  noteTopics?: string[];
  /** 交互卡片提交：把选中的值交给上层生成后续回复 */
  onCardSubmit?: (cardId: BubbleCard['id'], values: string[]) => void;
  /** 只在最新一条消息上展示追问建议 */
  showFollowUps?: boolean;
}

/**
 * 元宝消息组：若干气泡 + 卡片 + 追问建议
 * 对话内全部气泡统一为四角对称圆角矩形（Apple 60% 连续曲率）。
 */
export const AssistantMessageView: FC<AssistantMessageViewProps> = ({
  message,
  shape,
  onFollowUp,
  onOpenSource,
  onOpenArtifact,
  onOpenNote,
  onCardSubmit,
  showFollowUps = true,
}) => {
  const isPlain = shape === 'plain';
  const activeCard = message.bubbles.find((bubble) => bubble.card)?.card;
  const fileCards = [
    ...(message.artifact ? [message.artifact] : []),
    ...(message.artifacts ?? []),
  ];

  return (
    <div className={`${styles.group} ${isPlain ? styles.groupPlain : ''}`}>
      <div className={styles.bubbles}>
        {message.bubbles.map((bubble) => {
          const shapeClass = isPlain
            ? styles.plain
            : [styles.bubble, shape === 'round' ? styles.round : styles.compact].join(' ');

          if (bubble.fold) {
            return <FoldCard fold={bubble.fold} key={bubble.id} />;
          }

          return (
            <AssistantBubbleBox
              key={bubble.id}
              className={shapeClass}
              squircleRadius={shape === 'compact' ? 12 : 16}
              squircleEnabled={!isPlain}
            >
              <RichText
                blocks={bubble.blocks}
                trailing={
                  bubble.withLink ? (
                    <Pressable
                      as="span"
                      className={styles.linkBadge}
                      onClick={onOpenSource}
                      title="查看原文"
                      ariaLabel="查看原文"
                    >
                      <IconSideLink />
                    </Pressable>
                  ) : undefined
                }
              />
              {bubble.image && (
                <img
                  className={styles.image}
                  src={bubble.image.src}
                  alt={bubble.image.alt}
                  width={bubble.image.width}
                  height={bubble.image.height}
                  draggable={false}
                />
              )}
            </AssistantBubbleBox>
          );
        })}
      </div>

      {activeCard && (
        <div className={styles.cardSlot}>
          <MessageCard card={activeCard} onSubmit={(values) => onCardSubmit?.(activeCard.id, values)} />
        </div>
      )}

      {fileCards.length > 0 && (
        <div className={styles.fileSlot}>
          {fileCards.map((item) => (
            <ArtifactCard key={item.id} artifact={item} onOpen={onOpenArtifact} />
          ))}
        </div>
      )}

      {message.recordingCard && (
        <div className={styles.cardSlot}>
          <RecordingCard
            compact
            title={message.recordingTitle}
            summary={message.recordingSummary}
            onOpen={onOpenNote}
          />
        </div>
      )}

      {showFollowUps && message.followUps && message.followUps.length > 0 && (
        <div className={styles.followUps}>
          {message.followUps.map((text) => (
            <Pressable className={styles.followUp} key={text} onClick={() => onFollowUp?.(text)}>
              <span className={styles.followUpIcon} aria-hidden="true">
                <IconFollowUpNext width={16} height={16} />
              </span>
              <span className={styles.followUpText}>{text}</span>
            </Pressable>
          ))}
        </div>
      )}
    </div>
  );
};
