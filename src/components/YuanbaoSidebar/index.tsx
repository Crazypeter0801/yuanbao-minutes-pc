import { useMemo, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage } from '@/types/chat';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ArtifactEntry } from '@/components/sidebar/ArtifactEntry';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ChatList } from '@/components/sidebar/ChatList';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { NotePill } from '@/components/sidebar/NotePill';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { meetingSession } from '@/data/meetingSession';
import { buildScreenshotNote } from '@/data/yuanbaoContent';
import { useAutoNotes } from '@/hooks/useAutoNotes';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import type { YuanbaoSession } from '@/hooks/useYuanbaoSession';
import styles from './index.module.scss';

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流 + 笔记面板状态），由 App 持有，窗口外的演示条共用同一份 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件 */
  artifacts: ArtifactItem[];
  /** 关闭侧栏 */
  onClose: () => void;
}

/**
 * 元宝 Agent 对话区 · V1（Figma 257:1540 右侧）
 * - 元宝的实时纪要与用户的提问 / 回答在同一条时间流里；
 * - 底部：「元宝正在记笔记」状态条（保存截图 / 暂停，点击展开查看元宝主动记下的内容）+ 输入框。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({ chat, artifacts, onClose }) => {
  const { toast, showToast } = useToast();
  const { isListening, toggleListening } = useListening((listening) =>
    showToast(listening ? '元宝继续记笔记' : '已暂停记笔记'),
  );

  // 会中实时记录：每 10–15 秒自动记下一条，模拟有人一直在说话；暂停后停住
  useAutoNotes(chat.push, isListening);

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [chat.summarizeNow, showToast],
  );

  // 展开面板只列元宝主动记下的内容（isNote），用户的提问和追问都不会进来
  const notes = useMemo(
    () => chat.messages.filter((m): m is AssistantMessage => m.role === 'assistant' && Boolean(m.isNote)),
    [chat.messages],
  );

  const openSource = () => showToast('已定位到原文（演示）');

  const openArtifact = (item: ArtifactItem) => showToast(`打开「${item.name}」（演示）`);

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
          shape="plain"
          isThinking={chat.isThinking}
          onFollowUp={chat.ask}
          onOpenSource={openSource}
        />
      </MessageStream>

      <div className={styles.footer}>
        {/* 同一行：左侧记笔记状态条、右侧产物入口；两者的展开面板都以这一行为基线向上浮出 */}
        <div className={styles.statusRow}>
          <NotePill
            isListening={isListening}
            expanded={chat.notePanelOpen}
            onExpandedChange={chat.setNotePanelOpen}
            notes={notes}
            onScreenshot={saveScreenshot}
            onToggleListening={toggleListening}
            onOpenSource={openSource}
          />
          <ArtifactEntry artifacts={artifacts} onOpen={openArtifact} />
        </div>
        <ChatInput placeholder="提问或创建任务" onSubmit={chat.ask} />
      </div>
    </SidebarShell>
  );
};
