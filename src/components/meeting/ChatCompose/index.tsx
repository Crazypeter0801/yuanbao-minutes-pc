import { useCallback, useEffect, useRef, useState, type FC, type KeyboardEvent, type ReactNode } from 'react';
import chevronIcon from '@/assets/ref/dawen/5a3e6.svg';
import { Pressable } from '@/components/common/Pressable';
import styles from './index.module.scss';

interface ChatComposeProps {
  /** 底栏上的聊天图标 */
  children: ReactNode;
  /** 触发按钮的类名（沿用底栏 36×36 图标位） */
  triggerClassName?: string;
  /** 发出一条弹幕，空内容返回 false */
  onSend: (text: string) => boolean;
  /** 点「聊天 >」：收起浮层并打开聊天侧栏 */
  onOpenChat: () => void;
}

/** 鼠标移出后多久收起（ms），给鼠标从按钮挪到浮层留时间 */
const CLOSE_DELAY = 180;

/**
 * 底栏聊天按钮 + 「发送弹幕」浮层（参考 Demo chat-compose.js）
 * - 鼠标悬停或点击按钮弹出，点击时直接聚焦输入框；
 * - Enter 发送并收起，Shift+Enter 换行；输入法组字中不发送；
 * - 移出且输入框没焦点时 180ms 后收起；点外面 / Esc 收起；
 * - 右上角「聊天 >」进入聊天侧栏。
 */
export const ChatCompose: FC<ChatComposeProps> = ({ children, triggerClassName, onSend, onOpenChat }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const closeTimer = useRef<number>();

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
  }, []);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      const anchor = anchorRef.current;
      if (anchor && !anchor.matches(':hover') && !anchor.contains(document.activeElement)) {
        setOpen(false);
      }
    }, CLOSE_DELAY);
  };

  // 打开后：点外面、按 Esc、窗口失焦都收起
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', close);
    };
  }, [open, close]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // 输入框随内容长高：最少一行 24，最高 108 后出滚动条
  useEffect(() => {
    const input = inputRef.current;
    if (!open || !input) {
      return;
    }
    input.style.height = 'auto';
    input.style.height = `${Math.max(24, input.scrollHeight)}px`;
  }, [open, value]);

  const submit = () => {
    if (!onSend(value)) {
      return;
    }
    setValue('');
    close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    submit();
  };

  return (
    <div
      ref={anchorRef}
      className={styles.anchor}
      onPointerEnter={(event) => event.pointerType === 'mouse' && show()}
      onPointerLeave={scheduleClose}
      onBlur={scheduleClose}
    >
      <Pressable
        as="span"
        className={`${triggerClassName ?? ''} ${styles.trigger} ${open ? styles.triggerActive : ''}`}
        onClick={() => {
          show();
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
        ariaLabel="发送弹幕"
        ariaExpanded={open}
      >
        {children}
      </Pressable>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="发送弹幕">
          <div className={styles.header}>
            <span>发送弹幕</span>
            <Pressable
              as="span"
              className={styles.openChat}
              onClick={() => {
                close();
                onOpenChat();
              }}
              ariaLabel="打开聊天侧栏"
            >
              聊天
              <img className={styles.chevron} src={chevronIcon} alt="" draggable={false} />
            </Pressable>
          </div>
          <div className={styles.field}>
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={1}
              maxLength={200}
              value={value}
              placeholder="说点什么…"
              aria-label="弹幕内容"
              title="Enter 发送，Shift + Enter 换行"
              enterKeyHint="send"
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
    </div>
  );
};
