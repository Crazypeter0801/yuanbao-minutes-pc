import { forwardRef, useImperativeHandle, useRef, useState, type KeyboardEvent } from 'react';
import type { ComposerHandle } from '@/components/sidebar/Composer';
import { SendButton } from '@/components/sidebar/SendButton';
import styles from './index.module.scss';

interface PillComposerProps {
  placeholder: string;
  onSubmit: (text: string) => void;
  /** 聚焦时回调（方案 B 用于自动切到「问元宝」Tab） */
  onFocus?: () => void;
}

/**
 * 胶囊单行输入框（Figma 248:13483）：高 54、圆角 27
 * 暴露与 Composer 相同的 fill / focus，两种输入框可以互换使用。
 */
export const PillComposer = forwardRef<ComposerHandle, PillComposerProps>(
  ({ placeholder, onSubmit, onFocus }, ref) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const canSend = value.trim().length > 0;

    useImperativeHandle(ref, () => ({
      fill: (text: string) => {
        setValue(text);
        window.requestAnimationFrame(() => {
          const node = inputRef.current;
          node?.focus();
          node?.setSelectionRange(text.length, text.length);
        });
      },
      focus: () => inputRef.current?.focus(),
    }));

    const submit = () => {
      if (!canSend) {
        return;
      }
      onSubmit(value.trim());
      setValue('');
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        event.preventDefault();
        submit();
      }
    };

    return (
      <div className={styles.pill}>
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
        />
        <SendButton enabled={canSend} onClick={submit} />
      </div>
    );
  },
);

PillComposer.displayName = 'PillComposer';
