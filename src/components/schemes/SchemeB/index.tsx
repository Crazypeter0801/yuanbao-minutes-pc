import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ChatList } from '@/components/sidebar/ChatList';
import { ListenPill } from '@/components/sidebar/ListenPill';
import { ListeningHint } from '@/components/sidebar/ListeningHint';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { PillComposer } from '@/components/sidebar/PillComposer';
import { SegmentedControl, type SegmentOption } from '@/components/sidebar/SegmentedControl';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import type { SchemeSidebarProps } from '@/components/schemes/types';
import { schemeBAskWelcome, schemeBMinutes } from '@/data/schemeContent';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import { useYuanbaoChat } from '@/hooks/useYuanbaoChat';
import styles from './index.module.scss';

type TabKey = 'minutes' | 'ask';

/**
 * 方案 B · 元宝纪要为主，问元宝独立 Tab（Figma 248:13383）
 * - 「元宝纪要」只放元宝主动记录的内容，保持纪要干净；
 * - 「问元宝」是独立对话，在输入框提问会自动切过去；
 * - 在纪要页时有新回答，「问元宝」右上角出现红点。
 */
export const SchemeB: FC<SchemeSidebarProps> = ({ onClose }) => {
  const { toast, showToast } = useToast();
  const [tab, setTab] = useState<TabKey>('minutes');
  const [askUnread, setAskUnread] = useState(false);
  const minutes = useYuanbaoChat(schemeBMinutes);
  const ask = useYuanbaoChat(schemeBAskWelcome);
  const { isListening, toggleListening } = useListening((listening) =>
    showToast(listening ? '继续记录中' : '已暂停记录'),
  );

  // 不在「问元宝」时收到新回答 → 红点
  const askCount = useRef(ask.messages.length);
  useEffect(() => {
    if (ask.messages.length > askCount.current && tab !== 'ask') {
      setAskUnread(true);
    }
    askCount.current = ask.messages.length;
  }, [ask.messages.length, tab]);

  const switchTab = (key: TabKey) => {
    setTab(key);
    if (key === 'ask') {
      setAskUnread(false);
    }
  };

  const tabs: SegmentOption<TabKey>[] = [
    { key: 'minutes', label: '元宝纪要' },
    { key: 'ask', label: '问元宝', dot: askUnread },
  ];

  const summarize = () => {
    minutes.summarizeNow();
    switchTab('minutes');
  };

  const handleAsk = (text: string) => {
    switchTab('ask');
    ask.ask(text);
  };

  const headerMenu = useMemo<PopMenuItem[]>(
    () => [
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [showToast],
  );

  const pillMenu: PopMenuItem[] = [
    { key: 'summary', label: '立即总结', onClick: summarize },
    { key: 'switch', label: '切换助手', onClick: () => showToast('切换助手（演示）') },
  ];

  const active = tab === 'minutes' ? minutes : ask;

  return (
    <SidebarShell toast={toast}>
      <SidebarHeader
        onPip={() => showToast('已在独立窗口打开（演示）')}
        menuItems={headerMenu}
        onClose={onClose}
      />

      <div className={styles.tabs}>
        <SegmentedControl options={tabs} value={tab} onChange={switchTab} />
      </div>

      <MessageStream
        key={tab}
        className={styles.stream}
        scrollKey={`${tab}-${active.messages.length}-${active.isThinking}`}
      >
        <AiDisclaimer />
        <ChatList
          messages={active.messages}
          shape="compact"
          isThinking={active.isThinking}
          onFollowUp={handleAsk}
          onOpenSource={() => showToast('已定位到原文（演示）')}
        />
        {tab === 'minutes' && (
          <ListeningHint isListening={isListening} onSummarize={summarize} onResume={toggleListening} />
        )}
      </MessageStream>

      <div className={styles.footer}>
        <ListenPill isListening={isListening} onToggleListening={toggleListening} menuItems={pillMenu} />
        <PillComposer placeholder="问元宝" onSubmit={handleAsk} />
      </div>
    </SidebarShell>
  );
};
