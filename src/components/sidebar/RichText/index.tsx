import type { FC, ReactNode } from 'react';
import type { RichBlock, TextRun } from '@/types/chat';
import styles from './index.module.css';

interface RichTextProps {
  blocks: RichBlock[];
  /** 句首 @ 人名胶囊 */
  mention?: string;
  /** 跟在最后一段末尾的行内元素（如链接徽标） */
  trailing?: ReactNode;
}

const Runs: FC<{ runs: TextRun[] }> = ({ runs }) => (
  <>
    {runs.map((run, index) =>
      run.bold ? (
        <strong className={styles.bold} key={index}>
          {run.text}
        </strong>
      ) : (
        <span key={index}>{run.text}</span>
      ),
    )}
  </>
);

/**
 * 元宝消息富文本
 * 段落 / 小标题（600）/ 无序列表（圆点缩进 18，Figma 248:14751）。
 */
export const RichText: FC<RichTextProps> = ({ blocks, mention, trailing }) => {
  const lastIndex = blocks.length - 1;
  const trailingInline = blocks[lastIndex]?.type === 'paragraph';

  return (
    <div className={styles.rich}>
      {blocks.map((block, index) => {
        const isFirst = index === 0;
        const isLast = index === lastIndex;

        if (block.type === 'heading') {
          return (
            <p className={styles.heading} key={index}>
              {block.text}
            </p>
          );
        }

        if (block.type === 'list') {
          return (
            <ul className={styles.list} key={index}>
              {block.items.map((item, itemIndex) => (
                <li className={styles.item} key={itemIndex}>
                  <Runs runs={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p className={styles.paragraph} key={index}>
            {isFirst && mention && <span className={styles.mention}>{mention}</span>}
            <Runs runs={block.runs} />
            {isLast && trailingInline && trailing}
          </p>
        );
      })}
      {!trailingInline && trailing}
    </div>
  );
};
