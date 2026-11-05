import { useState, type FC } from 'react';
import { Pressable } from '@/components/common/Pressable';
import type { BubbleCard } from '@/types/chat';
import styles from './index.module.scss';

interface MessageCardProps {
  card: BubbleCard;
  /** 提交：单选给一个值，多选给多个，确认类给空数组 */
  onSubmit: (values: string[]) => void;
}

type CardState = 'idle' | 'submitted' | 'cancelled';

/**
 * 对话里的交互卡片（Figma 元宝Agent · Component Gallery 4:351）
 *
 * 一张卡片只收集一次选择：单选 / 多选选完点主按钮，确认类直接点确认。
 * 提交后卡片锁定，避免演示时连点推出多条回复；要再来一次就重新敲场景词。
 */
export const MessageCard: FC<MessageCardProps> = ({ card, onSubmit }) => {
  const [picked, setPicked] = useState<string[]>([]);
  const [state, setState] = useState<CardState>('idle');

  const locked = state !== 'idle';
  const isChecked = (option: string) => picked.includes(option);
  const canSubmit = card.kind === 'confirm' || picked.length > 0;

  const toggle = (option: string) => {
    if (locked) {
      return;
    }
    if (card.kind === 'multi') {
      setPicked((previous) =>
        previous.includes(option) ? previous.filter((value) => value !== option) : [...previous, option],
      );
      return;
    }
    setPicked([option]);
  };

  const submit = () => {
    if (locked || !canSubmit) {
      return;
    }
    setState('submitted');
    onSubmit(picked);
  };

  const cancel = () => {
    if (!locked) {
      setState('cancelled');
    }
  };

  const primaryText = state === 'submitted' ? '已提交' : state === 'cancelled' ? '已取消' : card.primaryLabel;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <p className={styles.title}>{card.title}</p>
        <p className={styles.description}>{card.description}</p>
      </div>

      {card.options && card.options.length > 0 && (
        <div className={styles.options}>
          {card.options.map((option) => {
            const checked = isChecked(option);
            return (
              <Pressable
                key={option}
                className={styles.option}
                onClick={() => toggle(option)}
                disabled={locked}
                ariaLabel={`${checked ? '取消选择' : '选择'}${option}`}
              >
                <span
                  className={[
                    styles.control,
                    card.kind === 'multi' ? styles.checkbox : styles.radio,
                    checked ? styles.controlActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {checked &&
                    (card.kind === 'multi' ? (
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                    ) : (
                      <span className={styles.dot} aria-hidden="true" />
                    ))}
                </span>
                <span className={`${styles.optionText} ${checked ? styles.optionTextActive : ''}`}>{option}</span>
              </Pressable>
            );
          })}
        </div>
      )}

      {card.summary && card.summary.length > 0 && (
        <div className={styles.summary}>
          {card.summary.map((row) => (
            <div className={styles.summaryRow} key={row.label}>
              <span className={styles.summaryLabel}>{row.label}</span>
              <span className={styles.summaryValue}>{row.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        {card.secondaryLabel && (
          <Pressable
            className={`${styles.button} ${styles.ghost}`}
            onClick={cancel}
            disabled={locked}
            ariaLabel={card.secondaryLabel}
          >
            {card.secondaryLabel}
          </Pressable>
        )}
        <Pressable
          className={`${styles.button} ${styles.primary} ${canSubmit && !locked ? '' : styles.disabled}`}
          onClick={submit}
          disabled={!canSubmit || locked}
          ariaLabel={primaryText}
        >
          {primaryText}
        </Pressable>
      </div>
    </div>
  );
};
