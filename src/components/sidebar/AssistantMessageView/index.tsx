import type { FC } from 'react';
import IconFollowUpNext from '@/assets/d2c/icons/chat/icon-follow-up-next';
import IconSideLink from '@/assets/d2c/icons/v1/icon-side-link';
import { Pressable } from '@/components/common/Pressable';
import { ArtifactCard } from '@/components/sidebar/ArtifactCard';
import { MessageCard } from '@/components/sidebar/MessageCard';
import { RecordingCard } from '@/components/sidebar/RecordingCard';
import { RichText } from '@/components/sidebar/RichText';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage, BubbleCard } from '@/types/chat';
import { formatMessageTime } from './formatTime';
import styles from './index.module.scss';

interface AssistantMessageViewProps {
  message: AssistantMessage;
  /**
   * 气泡形态
   * - round：圆角 16，组内气泡各自独立（方案 A）
   * - compact：圆角 8，组内非末条左下直角相连（方案 B）
   * - plain：无气泡、无署名，像文档一样直接排版（方案 C，参考 Granola）
   */
  shape: 'round' | 'compact' | 'plain';
  /**
   * 是否显示「元宝 + 时间」
   * 元宝会连着发几条，间隔短时只在组头标一次；只有距上一条足够久才重新标。
   */
  showMeta?: boolean;
  /** 点击追问建议 */
  onFollowUp?: (text: string) => void;
  /** 点击链接徽标 / 引用来源 */
  onOpenSource?: () => void;
  /** 点击气泡下方的产物卡片 */
  onOpenArtifact?: (artifact: ArtifactItem) => void;
  /** 点击气泡下方的「正在帮你记」卡片 */
  onOpenNote?: () => void;
  /** 交互卡片提交：把选中的值交给上层生成后续回复 */
  onCardSubmit?: (cardId: BubbleCard['id'], values: string[]) => void;
  /**
   * 是否展示追问建议
   * 只在最新一条消息上展示：元宝说了下一句之后，上一句后面的提问就收起来，避免满屏都是旧按钮
   */
  showFollowUps?: boolean;
}

/** 元宝消息组：署名 + 时间 + 若干气泡 + 引用来源 + 追问建议 */
export const AssistantMessageView: FC<AssistantMessageViewProps> = ({
  message,
  shape,
  showMeta = true,
  onFollowUp,
  onOpenSource,
  onOpenArtifact,
  onOpenNote,
  onCardSubmit,
  showFollowUps = true,
}) => {
  const isPlain = shape === 'plain';
  const lastIndex = message.bubbles.length - 1;
  // 交互卡片独立在气泡外，一条消息最多一张
  const activeCard = message.bubbles.find((bubble) => bubble.card)?.card;

  return (
    <div className={`${styles.group} ${isPlain ? styles.groupPlain : ''}`}>
      {!isPlain && showMeta && (
        <div className={styles.meta}>
          <span className={styles.name}>元宝</span>
          <span className={styles.time}>{formatMessageTime(message.createdAt)}</span>
        </div>
      )}

      <div className={styles.bubbles}>
        {message.bubbles.map((bubble, index) => {
          const shapeClass = isPlain
            ? styles.plain
            : [
                styles.bubble,
                shape === 'round' ? styles.round : styles.compact,
                shape === 'compact' && index !== lastIndex ? styles.compactJoined : '',
              ]
                .filter(Boolean)
                .join(' ');

          return (
            <div className={shapeClass} key={bubble.id}>
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
            </div>
          );
        })}
      </div>

      {activeCard && (
        <div className={styles.cardSlot}>
          <MessageCard card={activeCard} onSubmit={(values) => onCardSubmit?.(activeCard.id, values)} />
        </div>
      )}

      {message.artifact && (
        <div className={styles.cardSlot}>
          <ArtifactCard artifact={message.artifact} onOpen={onOpenArtifact} />
        </div>
      )}

      {message.recordingCard && (
        <div className={styles.cardSlot}>
          <RecordingCard summary={message.recordingCard.summary} onOpen={onOpenNote} />
        </div>
      )}

      {showFollowUps && message.followUps && message.followUps.length > 0 && (
        <div className={styles.followUps}>
          {message.followUps.map((text) => (
            <Pressable className={styles.followUp} key={text} onClick={() => onFollowUp?.(text)}>
              {/* 左侧回车箭头（Figma PC新框架改版 14355:74961） */}
              <span className={styles.followUpIcon} aria-hidden="true">
                <IconFollowUpNext />
              </span>
              <span className={styles.followUpText}>{text}</span>
            </Pressable>
          ))}
        </div>
      )}
    </div>
  );
};
