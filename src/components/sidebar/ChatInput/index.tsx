import { useLayoutEffect, useRef, useState, type KeyboardEvent, type FC } from 'react';
import { SendButton } from '@/components/sidebar/SendButton';
import styles from './index.module.scss';

/** 最多自动撑高到 4 行（14/20） */
const MAX_TEXTAREA_HEIGHT = 80;

interface ChatInputProps {
  placeholder: string;
  onSubmit: (text: string) => void;
}

/**
 * 输入框（Figma 316:2725）
 * 单行时高 48：padding 10、文字与发送按钮间距 16；多行时向上撑高，发送按钮贴底。
 * Enter 发送、Shift+Enter 换行；中文输入法组词期间不触发发送。
 */
export const ChatInput: FC<ChatInputProps> = ({ placeholder, onSubmit }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0;

  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!node) {
      return;
    }
    node.style.height = '0px';
    node.style.height = `${Math.min(node.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  const submit = () => {
    if (!canSend) {
      return;
    }
    onSubmit(value.trim());
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.input}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <SendButton enabled={canSend} onClick={submit} />
    </div>
  );
};
