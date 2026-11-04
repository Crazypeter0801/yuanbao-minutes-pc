import { useEffect, useState, type FC } from 'react';
import IconSideClose from '@/assets/d2c/icons/v1/icon-side-close';
import { Pressable } from '@/components/common/Pressable';
import type { PollDraft } from '@/data/polls';
import styles from './index.module.scss';

interface PollComposerProps {
  /** 元宝生成的投票草稿 */
  draft: PollDraft;
  /** 关闭弹窗 */
  onClose: () => void;
  /** 确认发起，回传选中的选项下标（多选时可能是多个） */
  onSubmit: (selected: number[]) => void;
}

/**
 * 发起投票弹窗
 * 覆盖左侧会议区（不含元宝侧栏，发起时仍能看到元宝说了什么）。
 * 元宝已经把主题和选项填好，这里只做确认：可以改选中项、切换单选多选，确认后发到会议里。
 */
export const PollComposer: FC<PollComposerProps> = ({ draft, onClose, onSubmit }) => {
  const [selected, setSelected] = useState<number[]>([0]);
  const [mode, setMode] = useState<PollDraft['mode']>(draft.mode);

  // 单选：点谁选谁（再点取消）；多选：点一下加入或移除
  const pick = (index: number) => {
    if (mode === 'single') {
      setSelected((previous) => (previous.length === 1 && previous[0] === index ? [] : [index]));
      return;
    }
    setSelected((previous) =>
      previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index],
    );
  };

  // 从多选切回单选时，只保留第一个已选项
  const changeMode = (value: PollDraft['mode']) => {
    setMode(value);
    if (value === 'single') {
      setSelected((previous) => previous.slice(0, 1));
    }
  };

  // Esc 关闭：和元宝面板的收起键保持一致
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.layer}>
      <div className={styles.scrim} onClick={onClose} />
      <div className={styles.card} role="dialog" aria-modal="true" aria-label="发起投票">
        <div className={styles.header}>
          <span className={styles.title}>发起投票</span>
          <Pressable className={styles.close} onClick={onClose} title="关闭" ariaLabel="关闭">
            <IconSideClose />
          </Pressable>
        </div>

        <div className={styles.subject}>
          <span className={styles.subjectLabel}>投票主题</span>
          <span className={styles.subjectText}>{draft.title}</span>
          <span className={styles.meta}>
            <span>{mode === 'single' ? '单选' : '多选'}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span>{draft.anonymous ? '匿名' : '实名'}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span>{draft.options.length} 个选项</span>
          </span>
        </div>

        <div className={styles.modes}>
          {(['single', 'multi'] as const).map((value) => (
            <Pressable
              key={value}
              className={`${styles.mode} ${mode === value ? styles.modeOn : ''}`}
              onClick={() => changeMode(value)}
              ariaLabel={value === 'single' ? '单选' : '多选'}
            >
              {value === 'single' ? '单选' : '多选'}
            </Pressable>
          ))}
        </div>

        <div className={styles.options}>
          {draft.options.map((option, index) => {
            const on = selected.includes(index);
            return (
              <Pressable
                key={option}
                className={`${styles.option} ${on ? styles.optionOn : ''}`}
                onClick={() => pick(index)}
                ariaLabel={option}
              >
                <span className={`${styles.radio} ${on ? styles.radioOn : ''}`} aria-hidden="true" />
                <span className={styles.optionText}>{option}</span>
                {on && <span className={styles.myPick}>我的选择</span>}
              </Pressable>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Pressable className={styles.ghost} onClick={onClose}>
            取消
          </Pressable>
          <Pressable className={styles.primary} onClick={() => onSubmit(selected)}>
            发起投票
          </Pressable>
        </div>
      </div>
    </div>
  );
};
