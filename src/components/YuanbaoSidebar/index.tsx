import { useMemo, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ChatList } from '@/components/sidebar/ChatList';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { NotePill } from '@/components/sidebar/NotePill';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { meetingSession } from '@/data/meetingSession';
import { buildScreenshotNote, initialMessages } from '@/data/yuanbaoContent';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import { useYuanbaoChat } from '@/hooks/useYuanbaoChat';
import styles from './index.module.scss';

interface YuanbaoSidebarProps {
  /** 关闭侧栏 */
  onClose: () => void;
}

/**
 * 元宝 Agent 对话区 · V1（Figma 257:1540 右侧）
 * - 元宝的实时纪要与用户的提问 / 回答在同一条时间流里；
 * - 底部：「元宝正在记笔记」状态胶囊（保存截图 / 暂停）+ 单行输入框。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({ onClose }) => {
  const { toast, showToast } = useToast();
  const chat = useYuanbaoChat(initialMessages);
  const { isListening, toggleListening } = useListening((listening) =>
    showToast(listening ? '元宝继续记笔记' : '已暂停记笔记'),
  );

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [chat.summarizeNow, showToast],
  );

  const saveScreenshot = () => {
    chat.push(buildScreenshotNote(meetingSession.duration));
    showToast('截图已保存');
  };

  return (
    <SidebarShell toast={toast}>
      <SidebarHeader
        onPip={() => showToast('已在独立窗口打开（演示）')}
        menuItems={menuItems}
        onClose={onClose}
      />

      <MessageStream
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
      </MessageStream>

      <div className={styles.footer}>
        <NotePill
          isListening={isListening}
          onScreenshot={saveScreenshot}
          onToggleListening={toggleListening}
        />
        <ChatInput placeholder="提问或创建任务" onSubmit={chat.ask} />
      </div>
    </SidebarShell>
  );
};
