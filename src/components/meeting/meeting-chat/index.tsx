import type { FC, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";
import IconChatIconAttach from "@/assets/d2c/icons/meeting-app/icon-chat-icon-attach";
import IconChatIconNotice from "@/assets/d2c/icons/meeting-app/icon-chat-icon-notice";
import iconFileWord from "@/assets/d2c/icons/v1/icon-file-word.svg";
import iconFileSheet from "@/assets/d2c/icons/v1/icon-file-sheet.svg";
import { Pressable } from "@/components/common/Pressable";
import type { MeetingChatItem } from "@/data/meetingChat";
import type { MeetingChatSession } from "@/hooks/useMeetingChat";
import styles from "./index.module.scss";

interface MeetingChatProps {
  chat: MeetingChatSession;
  onToolAction?: (label: string) => void;
}

/**
 * 会中聊天内容（Figma 305:39344）
 * 顶栏由 AppTabBar 提供；本组件只负责消息流与发布器。
 * TODO: 文案与消息由会中 IM 接入后替换硬编码演示数据
 */
export const MeetingChat: FC<MeetingChatProps> = ({ chat, onToolAction }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [chat.messages.length]);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    chat.send();
  };

  return (
    <div className={styles.panel}>
      <div className={`${styles.list} wm-scroll-hidden`} ref={listRef}>
        {chat.messages.map((item) => (
          <ChatRow key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.composer}>
        <textarea
          className={styles.input}
          value={chat.draft}
          placeholder="说点什么..."
          rows={2}
          onChange={(event) => chat.setDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className={styles.composerBar}>
          <Pressable
            className={styles.audience}
            onClick={() => onToolAction?.("发给所有人")}
            title="发给所有人"
            ariaLabel="发给所有人"
          >
            <span>发给</span>
            <strong>所有人</strong>
            <span className={styles.caret} aria-hidden="true" />
          </Pressable>
          <span className={styles.tools}>
            <Pressable className={styles.tool} onClick={() => onToolAction?.("表情")} ariaLabel="表情" title="表情">
              <ComposerEmoji />
            </Pressable>
            <Pressable className={styles.tool} onClick={() => onToolAction?.("文件")} ariaLabel="文件" title="文件">
              <ComposerFolder />
            </Pressable>
            <Pressable className={styles.tool} onClick={() => onToolAction?.("语音")} ariaLabel="语音" title="语音">
              <ComposerWave />
            </Pressable>
            <Pressable className={styles.tool} onClick={() => chat.send()} ariaLabel="发送" title="发送">
              <ComposerSend />
            </Pressable>
          </span>
        </div>
      </div>
    </div>
  );
};

const ChatRow: FC<{ item: MeetingChatItem }> = ({ item }) => {
  if (item.kind === "notice") {
    return (
      <div className={styles.notice}>
        <span className={styles.noticeIcon}>
          <IconChatIconNotice width={20} height={20} />
        </span>
        <p className={styles.noticeText}>{item.text}</p>
        {item.attachCount ? (
          <span className={styles.noticeAttach}>
            <IconChatIconAttach width={16} height={16} />
            <span>{item.attachCount}</span>
          </span>
        ) : null}
      </div>
    );
  }

  if (item.kind === "time") {
    return <div className={styles.time}>{item.time}</div>;
  }

  if (item.kind === "info-card") {
    return (
      <div className={`${styles.row} ${styles.rowSelf}`}>
        <div className={styles.bubbleCol}>
          <div className={styles.sender}>{item.sender}</div>
          <div className={styles.infoCard}>
            <div className={styles.infoHead}>
              <IconChatIconNotice width={20} height={20} />
              <span>{item.title}</span>
            </div>
            <p className={styles.infoBody}>{item.text}</p>
            {item.attachments?.map((file) => (
              <div className={styles.file} key={file.id}>
                <img src={file.kind === "doc" ? iconFileWord : iconFileSheet} alt="" width={16} height={16} />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
        <img className={styles.avatar} src={item.avatar} alt="" />
      </div>
    );
  }

  return (
    <div className={`${styles.row} ${item.self ? styles.rowSelf : styles.rowPeer}`}>
      {!item.self && <img className={styles.avatar} src={item.avatar} alt="" />}
      <div className={styles.bubbleCol}>
        <div className={styles.sender}>{item.sender}</div>
        <div className={item.self ? styles.bubbleSelf : styles.bubblePeer}>{item.text}</div>
      </div>
      {item.self && <img className={styles.avatar} src={item.avatar} alt="" />}
    </div>
  );
};

const ComposerEmoji: FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="5.7" cy="6.6" r="0.8" fill="currentColor" />
    <circle cx="10.3" cy="6.6" r="0.8" fill="currentColor" />
    <path d="M5.3 9.4c.7 1.3 1.8 1.9 2.7 1.9s2-.6 2.7-1.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ComposerFolder: FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 4.5h4.2l1.3 1.5H13.5v6.5h-11V4.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const ComposerWave: FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h1.2v0M6 5.5v5M8.8 4v8M11.6 5.5v5M14 8h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M3.2 6.2v3.6M6.2 4.8v6.4M9.2 3.6v8.8M12.2 5.2v5.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ComposerSend: FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.2 8.1 13.4 3.4 8.2 13.8l-.7-4.5-5.3-1.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M7.5 9.3 13.4 3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
