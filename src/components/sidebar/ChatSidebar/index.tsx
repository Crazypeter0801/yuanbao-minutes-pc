import { useEffect, useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
import noticeIcon from '@/assets/ref/dawen/b4689.svg';
import readIcon from '@/assets/ref/dawen/b19ba.svg';
import infoIcon from '@/assets/ref/dawen/b5697.svg';
import reportIcon from '@/assets/ref/dawen/ed40c.svg';
import docIcon from '@/assets/ref/dawen/8e15c.svg';
import emojiIcon from '@/assets/ref/dawen/62899.svg';
import fileIcon from '@/assets/ref/dawen/99346.svg';
import barrageIcon from '@/assets/ref/dawen/5ac15.svg';
import barrageSettingIcon from '@/assets/ref/dawen/fc498.svg';
import { Toast } from '@/components/common/Toast';
import { Pressable } from '@/components/common/Pressable';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SIDE_APPS } from '@/components/sidebar/SideDock/apps';
import { CHAT_HISTORY, CHAT_NOTICE, SELF, type ChatEntry } from '@/data/meetingChat';
import type { MeetingChat } from '@/hooks/useMeetingChat';
import { useToast } from '@/hooks/useToast';
import styles from './index.module.scss';

interface ChatSidebarProps {
  chat: MeetingChat;
  showHeader: boolean;
  onClose: () => void;
  /** 每次变化都把焦点放进输入框（从弹幕浮层「聊天 >」进来时用） */
  focusSignal?: number;
}

const RECEIVERS = ['所有人', '主持人'] as const;

/** 一行消息：自己的靠右（深灰泡白字），别人的靠左（浅灰泡），头像 28 */
const ChatRow: FC<{ entry: Exclude<ChatEntry, { kind: 'time' }> }> = ({ entry }) => (
  <div className={`${styles.row} ${entry.self ? styles.rowSelf : ''}`}>
    <img className={styles.avatar} src={entry.avatar} alt="" draggable={false} />
    <div className={styles.rowBody}>
      <span className={styles.rowName}>{entry.name}</span>
      {entry.kind === 'text' ? (
        <p className={styles.bubble}>{entry.text}</p>
      ) : (
        <div className={styles.infoCard}>
          <strong className={styles.infoTitle}>
            <img src={infoIcon} width={20} height={20} alt="" />
            {entry.title}
          </strong>
          <div className={styles.infoDescription}>{entry.description}</div>
          <div className={styles.attachments}>
            {entry.attachments.map((file) => (
              <div className={styles.attachment} key={file.id}>
                <img src={file.type === 'report' ? reportIcon : docIcon} width={16} height={16} alt="" />
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

/**
 * 会中聊天侧栏（参考 Demo sidebar-content.js chatSidebarContent）
 * 置顶公告 → 时间 → 聊天记录（含会议信息卡）→ 本场新发的消息；
 * 底部输入：「说点什么...」+ 发给 所有人 ▾ + 表情 / 文件 / 弹幕开关 | 弹幕设置。Enter 发送，开着弹幕时同时上屏。
 */
export const ChatSidebar: FC<ChatSidebarProps> = ({ chat, showHeader, onClose, focusSignal }) => {
  const { toast, showToast } = useToast();
  const [value, setValue] = useState('');
  const [receiver, setReceiver] = useState<(typeof RECEIVERS)[number]>('所有人');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusSignal) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [focusSignal]);

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
          onPip={() => showToast('聊天已在独立窗口打开（演示）')}
          menuItems={menuItems}
          onClose={onClose}
        />
      )}

      <MessageStream className={styles.stream} scrollKey={chat.sent.length}>
        <div className={styles.content}>
          <div className={styles.notice}>
            <img className={styles.noticeIcon} src={noticeIcon} width={20} height={20} alt="" />
            <span className={styles.noticeText}>{CHAT_NOTICE.text}</span>
            <small className={styles.noticeRead}>
              <img src={readIcon} width={16} height={16} alt="" />
              {CHAT_NOTICE.readCount}
            </small>
          </div>

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
        </div>
      </MessageStream>

      <div className={styles.compose}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={value}
          maxLength={200}
          placeholder="说点什么..."
          aria-label="聊天消息"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.actions}>
          <label className={styles.receiver}>
            发给
            <select
              className={styles.receiverSelect}
              value={receiver}
              aria-label="接收者"
              onChange={(event) => setReceiver(event.target.value as (typeof RECEIVERS)[number])}
            >
              {RECEIVERS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <Pressable className={styles.tool} onClick={insertEmoji} ariaLabel="添加表情" title="表情">
            <img src={emojiIcon} width={20} height={16} alt="" />
          </Pressable>
          <Pressable className={styles.tool} onClick={() => showToast('添加文件（演示）')} ariaLabel="添加文件" title="文件">
            <img src={fileIcon} width={16} height={16} alt="" />
          </Pressable>
          <Pressable
            className={`${styles.tool} ${chat.barrageEnabled ? '' : styles.toolOff}`}
            onClick={() => {
              const next = !chat.barrageEnabled;
              chat.setBarrageEnabled(next);
              showToast(next ? '已开启弹幕，发送的消息会同时显示在画面上' : '已关闭弹幕');
            }}
            ariaLabel={chat.barrageEnabled ? '关闭弹幕' : '开启弹幕'}
            title={chat.barrageEnabled ? '弹幕已开启' : '弹幕已关闭'}
          >
            <img src={barrageIcon} width={20} height={20} alt="" />
          </Pressable>
          <span className={styles.toolDivider} aria-hidden="true" />
          <Pressable className={styles.tool} onClick={() => showToast('弹幕设置（演示）')} ariaLabel="弹幕设置" title="弹幕设置">
            <img src={barrageSettingIcon} width={16} height={16} alt="" />
          </Pressable>
        </div>
      </div>

      <Toast toast={toast} placement="window" />
    </div>
  );
};
