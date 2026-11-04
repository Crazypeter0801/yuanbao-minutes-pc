import { useMemo, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { AssistantBar } from '@/components/sidebar/AssistantBar';
import { ChatList } from '@/components/sidebar/ChatList';
import { Composer } from '@/components/sidebar/Composer';
import { ListeningHint } from '@/components/sidebar/ListeningHint';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { initialMessages } from '@/data/schemeContent';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import { useYuanbaoChat } from '@/hooks/useYuanbaoChat';
import styles from './index.module.css';

interface YuanbaoSidebarProps {
  /** 关闭侧栏 */
  onClose: () => void;
}

/**
 * 元宝侧栏 · 方案 A v1：纪要与问答混排（Figma 245:5577）
 * 元宝的实时纪要和用户的提问 / 回答进入同一条时间流；
 * 底部为「助手条 + 大输入框」两层。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({ onClose }) => {
  const { toast, showToast } = useToast();
  const chat = useYuanbaoChat(initialMessages);
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
        scrollKey={`${chat.messages.length}-${chat.isThinking}`}
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
    </SidebarShell>
  );
};
