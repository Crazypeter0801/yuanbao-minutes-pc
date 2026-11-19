import { useEffect, useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
import IconChat556Chevron from '@/assets/d2c/icons/chat556/icon-chat556-chevron';
import IconChat556Emoji from '@/assets/d2c/icons/chat556/icon-chat556-emoji';
import IconChat556File from '@/assets/d2c/icons/chat556/icon-chat556-file';
import IconChat556Notice from '@/assets/d2c/icons/chat556/icon-chat556-notice';
import IconChat556Settings from '@/assets/d2c/icons/chat556/icon-chat556-settings';
import IconChatSend from '@/assets/d2c/icons/sidetabs/icon-chat-send';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import { Toast } from '@/components/common/Toast';
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

const RECIPIENTS = ['所有人', '主持人', 'Carmen', 'Tinashe(蒂娜雪)'] as const;

/**
 * 一条消息（Figma 接收消息_01 / 发送消息_01 / Sent Messages）
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
 * 会中聊天侧栏（底部输入框按 Figma 556:9748 还原）
 * 底部白卡（圆角 20、padding 12 10 10、0.5px 8% 黑描边 + 0 4 20 4% 落影）：
 * 第一行「说点什么」，第二行左侧「发给 所有人 ⌄」，右侧 表情 / 文件 / 公告 / 设置（有输入时支持 Enter 或点发送）。
 */
export const ChatSidebar: FC<ChatSidebarProps> = ({ chat, showHeader, onClose, onPopOut, focusSignal }) => {
  const { toast, showToast } = useToast();
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState<(typeof RECIPIENTS)[number]>('所有人');
  const [recipientOpen, setRecipientOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recipientRef = useRef<HTMLDivElement>(null);
  const canSend = value.trim().length > 0;

  useEffect(() => {
    if (focusSignal) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [focusSignal]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.style.height = 'auto';
    input.style.height = `${Math.min(MAX_INPUT_HEIGHT, Math.max(20, input.scrollHeight))}px`;
  }, [value]);

  useEffect(() => {
    if (!recipientOpen) {
      return undefined;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!recipientRef.current?.contains(event.target as Node)) {
        setRecipientOpen(false);
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRecipientOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [recipientOpen]);

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
          icon={SIDE_APPS.chat.icon585On}
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

      {/* 底部输入框（Figma 556:9748） */}
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
          <div className={styles.recipientWrap} ref={recipientRef}>
            <span className={styles.recipientPrefix}>发给</span>
            <Pressable
              className={`${styles.recipientTrigger} ${recipientOpen ? styles.recipientTriggerActive : ''}`}
              onClick={() => setRecipientOpen((open) => !open)}
              ariaLabel={`发送对象：${recipient}`}
              ariaExpanded={recipientOpen}
              stopPropagation
            >
              <span className={styles.recipientName}>{recipient}</span>
              <span className={`${styles.recipientChevron} ${recipientOpen ? styles.recipientChevronOpen : ''}`}>
                <IconChat556Chevron width={11} height={6} />
              </span>
            </Pressable>
            {recipientOpen && (
              <div className={styles.recipientMenu} role="menu" aria-label="选择发送对象" onClick={(e) => e.stopPropagation()}>
                {RECIPIENTS.map((name) => (
                  <Pressable
                    key={name}
                    className={`${styles.recipientOption} ${recipient === name ? styles.recipientOptionActive : ''}`}
                    onClick={() => {
                      setRecipient(name);
                      setRecipientOpen(false);
                    }}
                  >
                    {name}
                  </Pressable>
                ))}
              </div>
            )}
          </div>

          <div className={styles.tools}>
            <Pressable className={styles.tool} onClick={insertEmoji} ariaLabel="表情" title="表情" stopPropagation>
              <IconChat556Emoji width={16} height={16} />
            </Pressable>
            <Pressable
              className={styles.tool}
              onClick={() => showToast('发送文件（演示）')}
              ariaLabel="文件"
              title="文件"
              stopPropagation
            >
              <IconChat556File width={24} height={24} />
            </Pressable>
            <Pressable
              className={styles.tool}
              onClick={() => showToast('发布会议公告（演示）')}
              ariaLabel="公告"
              title="公告"
              stopPropagation
            >
              <IconChat556Notice width={24} height={24} />
            </Pressable>
            <Pressable
              className={styles.tool}
              onClick={() => showToast('打开聊天设置（演示）')}
              ariaLabel="聊天设置"
              title="聊天设置"
              stopPropagation
            >
              <IconChat556Settings width={24} height={24} />
            </Pressable>
            {canSend && (
              <Pressable
                className={styles.send}
                onClick={submit}
                ariaLabel="发送"
                title="发送（Enter）"
                stopPropagation
              >
                <IconChatSend width={24} height={24} />
              </Pressable>
            )}
          </div>
        </div>
      </div>

      <Toast toast={toast} placement="window" />
    </div>
  );
};
