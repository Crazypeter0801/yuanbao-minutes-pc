import { useEffect, useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
import IconChatEmoji from '@/assets/d2c/icons/sidetabs/icon-chat-emoji';
import IconChatFile from '@/assets/d2c/icons/sidetabs/icon-chat-file';
import IconChatImage from '@/assets/d2c/icons/sidetabs/icon-chat-image';
import IconChatSend from '@/assets/d2c/icons/sidetabs/icon-chat-send';
import { Toast } from '@/components/common/Toast';
import { Pressable } from '@/components/common/Pressable';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SIDE_APPS } from '@/components/sidebar/SideDock/apps';
import { CHAT_HISTORY, SELF, type ChatEntry } from '@/data/meetingChat';
import type { MeetingChat } from '@/hooks/useMeetingChat';
import { useToast } from '@/hooks/useToast';
import styles from './index.module.scss';

interface ChatSidebarProps {
  chat: MeetingChat;
  showHeader: boolean;
  onClose: () => void;
  onPopOut?: () => void;
  /** 每次变化都把焦点放进输入框（从弹幕浮层「聊天 >」进来时用） */
  focusSignal?: number;
}

/** 输入框最多撑到 4 行（14/20） */
const MAX_INPUT_HEIGHT = 80;

/**
 * 一条消息（Figma 接收消息_01 / 发送消息_01 / Sent Messages）
 * 别人的：头像 32 在左，名字 11/14 + 浅灰泡；自己的：深灰泡白字在右、头像在最右，不显示名字。
 * 左右各留 38 不让气泡贴到对侧（图片消息留 118，图 190×190）。
 */
const ChatRow: FC<{ entry: Exclude<ChatEntry, { kind: 'time' }> }> = ({ entry }) => {
  const rowClass = [styles.row, entry.self ? styles.rowSelf : '', entry.kind === 'image' ? styles.rowImage : '']
    .filter(Boolean)
    .join(' ');

  const content =
    entry.kind === 'image' ? (
      <img className={styles.image} src={entry.src} alt={entry.alt} draggable={false} />
    ) : (
      <p className={styles.bubble}>{entry.text}</p>
    );

  if (entry.self) {
    return (
      <div className={rowClass}>
        {content}
        <img className={styles.avatarSelf} src={entry.avatar} alt="" draggable={false} />
      </div>
    );
  }

  return (
    <div className={rowClass}>
      <img className={styles.avatar} src={entry.avatar} alt="" draggable={false} />
      <div className={styles.rowBody}>
        <span className={styles.rowName}>{entry.name}</span>
        {content}
      </div>
    </div>
  );
};

/**
 * 会中聊天侧栏（Figma 505:12264 第三张 · 504:12069）
 * 消息列表（padding 10 20、间距 16）→ 底部输入框（344 宽、圆角 20）：
 * 第一行「说点什么」，第二行左侧 表情 / 图片 / 文件，右侧圆形发送。Enter 发送，消息同时以弹幕上屏。
 */
export const ChatSidebar: FC<ChatSidebarProps> = ({ chat, showHeader, onClose, onPopOut, focusSignal }) => {
  const { toast, showToast } = useToast();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0;

  useEffect(() => {
    if (focusSignal) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [focusSignal]);

  // 随内容长高：一行 20，最多 4 行
  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.style.height = 'auto';
    input.style.height = `${Math.min(MAX_INPUT_HEIGHT, Math.max(20, input.scrollHeight))}px`;
  }, [value]);

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'settings', label: '聊天设置', onClick: () => showToast('打开聊天设置（演示）') },
      { key: 'export', label: '保存聊天记录', onClick: () => showToast('聊天记录已保存（演示）') },
    ],
    [showToast],
  );

  const submit = () => {
    if (chat.send(value, chat.barrageEnabled)) {
      setValue('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    submit();
  };

  const insertEmoji = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    setValue(`${value.slice(0, start)}😊${value.slice(end)}`);
    window.requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + 2, start + 2);
    });
  };

  return (
    <div className={styles.panel}>
      {showHeader && (
        <SidebarHeader
          icon={SIDE_APPS.chat.icon}
          title={SIDE_APPS.chat.title}
          onPip={() => (onPopOut ? onPopOut() : showToast('聊天已在独立窗口打开（演示）'))}
          menuItems={menuItems}
          onClose={onClose}
        />
      )}

      <MessageStream className={styles.stream} scrollKey={chat.sent.length}>
        {CHAT_HISTORY.map((entry) =>
          entry.kind === 'time' ? (
            <div className={styles.time} key={entry.id}>
              {entry.text}
            </div>
          ) : (
            <ChatRow key={entry.id} entry={entry} />
          ),
        )}
        {chat.sent.map((item) => (
          <ChatRow
            key={`sent-${item.id}`}
            entry={{ kind: 'text', id: String(item.id), self: true, name: SELF.name, avatar: SELF.avatar, text: item.text }}
          />
        ))}
      </MessageStream>

      <div className={styles.compose} onClick={() => inputRef.current?.focus()}>
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            className={styles.input}
            rows={1}
            value={value}
            maxLength={500}
            placeholder="说点什么"
            aria-label="聊天消息"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.toolbar}>
          <div className={styles.tools}>
            <Pressable className={styles.tool} onClick={insertEmoji} ariaLabel="表情" title="表情" stopPropagation>
              <IconChatEmoji />
            </Pressable>
            <Pressable
              className={styles.tool}
              onClick={() => showToast('发送图片（演示）')}
              ariaLabel="图片"
              title="图片"
              stopPropagation
            >
              <IconChatImage />
            </Pressable>
            <Pressable
              className={styles.tool}
              onClick={() => showToast('发送文件（演示）')}
              ariaLabel="文件"
              title="文件"
              stopPropagation
            >
              <IconChatFile />
            </Pressable>
          </div>
          <Pressable
            className={`${styles.send} ${canSend ? styles.sendEnabled : ''}`}
            onClick={submit}
            disabled={!canSend}
            ariaLabel="发送"
            title={canSend ? '发送（Enter）' : '请输入内容'}
            stopPropagation
          >
            <IconChatSend />
          </Pressable>
        </div>
      </div>

      <Toast toast={toast} placement="window" />
    </div>
  );
};
