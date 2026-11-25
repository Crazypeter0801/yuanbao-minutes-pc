import { useState, type FC } from 'react';
import IconOptionCircle from '@/assets/d2c/icons/chatCards811/icon-option-circle';
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
 * 对话中的反问/澄清交互卡片（Figma 811:29935）
 *
 * 浅灰底容器（#F7F7F7、圆角 23px、padding 16px、垂直间距 12px）；
 * 内含问题标题、白底胶囊选项行（圆角 19.5px、左文案右 20×20 选择控件，行距 6px）及底部操作按钮。
 * 一张卡片只收集一次选择，提交或取消后锁定并清晰保留已选态。
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
    <div
      className={`${styles.card} ${locked ? styles.cardLocked : ''}`}
      data-clarification-card="811-29935"
      data-card-state={state}
    >
      <div className={styles.head}>
        <p className={styles.title}>{card.title}</p>
        {card.description && <p className={styles.description}>{card.description}</p>}
      </div>

      {card.options && card.options.length > 0 && (
        <div
          className={styles.options}
          role={card.kind === 'multi' ? 'group' : 'radiogroup'}
          aria-label={card.title}
        >
          {card.options.map((option) => {
            const checked = isChecked(option);
            const optionClass = [
              styles.option,
              checked ? styles.optionActive : '',
              locked && !checked ? styles.optionMuted : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <Pressable
                key={option}
                className={optionClass}
                onClick={() => toggle(option)}
                disabled={locked}
                ariaLabel={`${checked ? '取消选择' : '选择'}${option}`}
              >
                <span className={`${styles.optionText} ${checked ? styles.optionTextActive : ''}`}>{option}</span>

                <span
                  className={[
                    styles.control,
                    card.kind === 'multi' ? styles.checkbox : styles.radio,
                    checked ? styles.controlActive : styles.controlIdle,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  {checked ? (
                    <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.2 4.9 8.6 9.5 3.6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : card.kind === 'multi' ? (
                    <span className={styles.checkboxBox} />
                  ) : (
                    <IconOptionCircle className={styles.radioRing} width={20} height={20} color="currentColor" />
                  )}
                </span>
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
        {card.secondaryLabel && !locked && (
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
          className={[
            styles.button,
            locked ? styles.done : canSubmit ? styles.primary : styles.disabled,
          ].join(' ')}
          onClick={submit}
          disabled={!canSubmit || locked}
          ariaLabel={primaryText}
        >
          {state === 'submitted' && (
            <svg className={styles.doneIcon} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6.2 4.9 8.6 9.5 3.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>{primaryText}</span>
        </Pressable>
      </div>
    </div>
  );
};
