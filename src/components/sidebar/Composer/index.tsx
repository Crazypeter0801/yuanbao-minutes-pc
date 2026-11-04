import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import IconInputChevron from '@/assets/icons/icon-input-chevron';
import IconInputFlash from '@/assets/icons/icon-input-flash';
import IconInputPlus from '@/assets/icons/icon-input-plus';
import { PopMenu } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import { SendButton } from '@/components/sidebar/SendButton';
import styles from './index.module.css';

/** 输入框最多自动撑高到 4 行（14/20） */
const MAX_TEXTAREA_HEIGHT = 80;

const MODES = ['快速', '深度思考'] as const;
type Mode = (typeof MODES)[number];

export interface ComposerHandle {
  /** 预填内容并聚焦（如从纪要抽屉跳过来提问） */
  fill: (text: string) => void;
  focus: () => void;
}

interface ComposerProps {
  placeholder: string;
  onSubmit: (text: string) => void;
  /** 点击「+」（附件 / 技能） */
  onAttach?: () => void;
}

/**
 * 大输入框（Figma 248:12488）
 * 上：多行输入；下：「+」| 模式切换（快速 / 深度思考）…… 发送。
 * Enter 发送、Shift+Enter 换行；中文输入法组词期间不触发发送。
 */
export const Composer = forwardRef<ComposerHandle, ComposerProps>(
  ({ placeholder, onSubmit, onAttach }, ref) => {
    const [value, setValue] = useState('');
    const [mode, setMode] = useState<Mode>('快速');
    const [modeMenuOpen, setModeMenuOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      fill: (text: string) => {
        setValue(text);
        window.requestAnimationFrame(() => {
          const node = textareaRef.current;
          node?.focus();
          node?.setSelectionRange(text.length, text.length);
        });
      },
      focus: () => textareaRef.current?.focus(),
    }));

    // 内容变化时自适应高度
    useLayoutEffect(() => {
      const node = textareaRef.current;
      if (!node) {
        return;
      }
      node.style.height = '0px';
      node.style.height = `${Math.min(node.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }, [value]);

    const canSend = value.trim().length > 0;

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
      <div className={styles.composer}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className={styles.bar}>
          <div className={styles.tools}>
            <Pressable className={styles.plus} onClick={onAttach} ariaLabel="添加附件或技能" title="添加">
              <IconInputPlus />
            </Pressable>
            <span className={styles.divider} aria-hidden="true" />
            <div className={styles.modeWrap}>
              <Pressable
                className={styles.mode}
                onClick={() => setModeMenuOpen((open) => !open)}
                ariaLabel={`回答模式：${mode}`}
              >
                <IconInputFlash />
                <span className={styles.modeLabel}>
                  <span className={styles.modeText}>{mode}</span>
                  <IconInputChevron />
                </span>
              </Pressable>
              {modeMenuOpen && (
                <PopMenu
                  align="left"
                  placement="top"
                  onClose={() => setModeMenuOpen(false)}
                  items={MODES.map((item) => ({
                    key: item,
                    label: item,
                    active: item === mode,
                    onClick: () => setMode(item),
                  }))}
                />
              )}
            </div>
          </div>
          <SendButton enabled={canSend} onClick={submit} />
        </div>
      </div>
    );
  },
);

Composer.displayName = 'Composer';
