import type { FC } from 'react';
import IconSideLink from '@/assets/d2c/icons/v1/icon-side-link';
import { Pressable } from '@/components/common/Pressable';
import { ArtifactCard } from '@/components/sidebar/ArtifactCard';
import { FoldCard } from '@/components/sidebar/FoldCard';
import { MessageCard } from '@/components/sidebar/MessageCard';
import { RecordingCard } from '@/components/sidebar/RecordingCard';
import { RichText } from '@/components/sidebar/RichText';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage, BubbleCard } from '@/types/chat';
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
  /**
   * 是否展示追问建议
   * 只在最新一条消息上展示：元宝说了下一句之后，上一句后面的提问就收起来，避免满屏都是旧按钮
   */
  showFollowUps?: boolean;
}

/**
 * 元宝消息组：若干气泡 + 卡片 + 追问建议
 * 按 IM 习惯不再逐条写「元宝」署名，时间统一由 ChatList 居中插在消息之间。
 */
export const AssistantMessageView: FC<AssistantMessageViewProps> = ({
  message,
  shape,
  onFollowUp,
  onOpenSource,
  onOpenArtifact,
  onOpenNote,
  noteTopics,
  onCardSubmit,
  showFollowUps = true,
}) => {
  const isPlain = shape === 'plain';
  const lastIndex = message.bubbles.length - 1;
  // 交互卡片独立在气泡外，一条消息最多一张
  const activeCard = message.bubbles.find((bubble) => bubble.card)?.card;

  return (
    <div className={`${styles.group} ${isPlain ? styles.groupPlain : ''}`}>
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

          // 默认折叠的补充信息：不套气泡，独立一张轻卡片
          if (bubble.fold) {
            return <FoldCard fold={bubble.fold} key={bubble.id} />;
          }

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
          <RecordingCard topics={noteTopics} onOpen={onOpenNote} />
        </div>
      )}

      {showFollowUps && message.followUps && message.followUps.length > 0 && (
        <div className={styles.followUps}>
          {message.followUps.map((text) => (
            <Pressable className={styles.followUp} key={text} onClick={() => onFollowUp?.(text)}>
              <span className={styles.followUpText}>{text}</span>
              {/* 右侧 ↗ 是设计稿里的文字符号（Figma 215:16877） */}
              <span className={styles.followUpArrow} aria-hidden="true">
                ↗
              </span>
            </Pressable>
          ))}
        </div>
      )}
    </div>
  );
};
