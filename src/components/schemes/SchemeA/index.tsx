import { useMemo, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { AssistantBar } from '@/components/sidebar/AssistantBar';
import { ChatList } from '@/components/sidebar/ChatList';
import { Composer } from '@/components/sidebar/Composer';
import { ListenPill } from '@/components/sidebar/ListenPill';
import { ListeningHint } from '@/components/sidebar/ListeningHint';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { PillComposer } from '@/components/sidebar/PillComposer';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { schemeAMessages } from '@/data/schemeContent';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import { useYuanbaoChat } from '@/hooks/useYuanbaoChat';
import type { SchemeSidebarProps } from '@/components/schemes/types';
import styles from './index.module.scss';

/**
 * 方案 A · 纪要与问答混排（Figma 245:5577）
 * 元宝的实时纪要和用户的提问 / 回答进入同一条时间流。
 * 变体只换底栏，消息流与状态共用，切换时内容不丢：
 * - stacked：设计稿原样，助手条 + 大输入框，两行
 * - pill：沿用方案 B 的底栏（元宝胶囊 + 「问元宝」单行输入），一行，消息流多出约 100px
 */
export const SchemeA: FC<SchemeSidebarProps> = ({ onClose, variant = 'stacked' }) => {
  const { toast, showToast } = useToast();
  const chat = useYuanbaoChat(schemeAMessages);
  const { isListening, toggleListening } = useListening((listening) =>
    showToast(listening ? '继续记录中' : '已暂停记录'),
  );

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [showToast],
  );

  const pillMenu: PopMenuItem[] = [
    { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
    { key: 'switch', label: '切换助手', onClick: () => showToast('切换助手（演示）') },
  ];

  return (
    <SidebarShell toast={toast}>
      <SidebarHeader
        onPip={() => showToast('已在独立窗口打开（演示）')}
        menuItems={menuItems}
        onClose={onClose}
      />

      <MessageStream
        withTopFade
        bottomAligned
        className={styles.stream}
        scrollKey={`${variant}-${chat.messages.length}-${chat.isThinking}`}
      >
        <AiDisclaimer />
        <ChatList
          messages={chat.messages}
          shape="round"
          isThinking={chat.isThinking}
          onFollowUp={chat.ask}
          onOpenSource={() => showToast('已定位到原文（演示）')}
        />
        <ListeningHint
          isListening={isListening}
          onSummarize={chat.summarizeNow}
          onResume={toggleListening}
        />
      </MessageStream>

      {variant === 'pill' ? (
        <div className={styles.footerPill}>
          <ListenPill isListening={isListening} onToggleListening={toggleListening} menuItems={pillMenu} />
          <PillComposer placeholder="问元宝" onSubmit={chat.ask} />
        </div>
      ) : (
        <div className={styles.footer}>
          <AssistantBar
            isListening={isListening}
            onToggleListening={toggleListening}
            onSwitch={() => showToast('切换助手（演示）')}
          />
          <Composer
            placeholder="输入问题或任务"
            onSubmit={chat.ask}
            onAttach={() => showToast('添加附件或技能（演示）')}
          />
        </div>
      )}
    </SidebarShell>
  );
};
