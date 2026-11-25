import { useState, type FC } from 'react';
import IconOptionCircle from '@/assets/d2c/icons/chatCards811/icon-option-circle';
import IconOptionSelected from '@/assets/d2c/icons/chatCards811/icon-option-selected';
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
 * 对话中的反问/澄清交互卡片（Figma 811:29935 未选态 + Figma 1025:12793 选中/已提交态）
 *
 * - 未选态：白底胶囊（#FFFFFF、圆角 20px、左文案右 20×20 20% 黑圈/复选框）
 * - 选中态（1025:12796）：#3A83F71F 浅蓝底、无描边、#3A83F7 文字、右侧 20×20 蓝底白勾图标
 * - 提交锁定后的未选项（1025:12797）：rgba(0,0,0,0.04) 浅灰底、#C7C7C7 置灰文字、隐藏右侧未选圆圈
 */
export const MessageCard: FC<MessageCardProps> = ({ card, onSubmit }) => {
  const [picked, setPicked] = useState<string[]>([]);
  const [state, setState] = useState<CardState>('idle');

  const locked = state !== 'idle';
  const isSingle = card.kind === 'single';
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
    // 单选卡点击任意选项即刻选中并直接提交锁定（对齐 Figma 811:29935 / 1025:12793 无底部按钮交互）
    const next = [option];
    setPicked(next);
    setState('submitted');
    onSubmit(next);
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
            const muted = locked && !checked;
            const optionClass = [
              styles.option,
              checked ? styles.optionActive : '',
              muted ? styles.optionMuted : '',
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
                <span
                  className={[
                    styles.optionText,
                    checked ? styles.optionTextActive : '',
                    muted ? styles.optionTextMuted : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {option}
                </span>

                {/* 提交锁定后的未选项按 Figma 1025:12797 隐藏右侧选择控件，仅保留选中项图标 */}
                {!muted && (
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
                      card.kind === 'multi' ? (
                        <svg className={styles.multiCheckSvg} width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <rect width="20" height="20" rx="6" fill="currentColor" />
                          <path
                            d="M13.4091 6.65918C13.7352 6.33309 14.2647 6.33309 14.5908 6.65918C14.9168 6.98527 14.9168 7.51473 14.5908 7.84082L9.09076 13.3408C8.76467 13.6669 8.2352 13.6669 7.90912 13.3408L5.40912 10.8408C5.08303 10.5147 5.08303 9.98527 5.40912 9.65918C5.7352 9.33309 6.26467 9.33309 6.59076 9.65918L8.49994 11.5684L13.4091 6.65918Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        <IconOptionSelected className={styles.selectedIcon} width={20} height={20} />
                      )
                    ) : card.kind === 'multi' ? (
                      <span className={styles.checkboxBox} />
                    ) : (
                      <IconOptionCircle className={styles.radioRing} width={20} height={20} color="currentColor" />
                    )}
                  </span>
                )}
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

      {!isSingle && (
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
      )}
    </div>
  );
};
