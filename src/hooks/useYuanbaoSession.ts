import { useCallback, useState } from 'react';
import { initialMessages } from '@/data/yuanbaoContent';
import { useYuanbaoChat, type YuanbaoChat } from '@/hooks/useYuanbaoChat';

/** 元宝会话：消息流 + 笔记面板状态，供窗口内的侧栏与窗口外的演示条共用 */
export interface YuanbaoSession extends YuanbaoChat {
  /** 「元宝正在记笔记」面板是否展开 */
  notePanelOpen: boolean;
  setNotePanelOpen: (open: boolean) => void;
}

/**
 * 元宝会话状态
 * 把 useYuanbaoChat 和笔记面板状态放在一起，是因为「提问前先收起面板」需要同时用到两者；
 * 提到 App 层后，窗口外的场景切换条和窗口内的侧栏操作的是同一份对话。
 */
export function useYuanbaoSession(): YuanbaoSession {
  const chat = useYuanbaoChat(initialMessages);
  const [notePanelOpen, setNotePanelOpen] = useState(false);
  const askChat = chat.ask;

  // 提问前先收起笔记面板：展开态是 400 高的浮层，会整块盖住刚出现的回答
  const ask = useCallback(
    (text: string) => {
      setNotePanelOpen(false);
      askChat(text);
    },
    [askChat],
  );

  return { ...chat, ask, notePanelOpen, setNotePanelOpen };
}
