import { useCallback, useMemo, useState, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import type { ArtifactItem } from '@/types/artifact';
import type { AssistantMessage } from '@/types/chat';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ArtifactEntry } from '@/components/sidebar/ArtifactEntry';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ChatList } from '@/components/sidebar/ChatList';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { NotePill } from '@/components/sidebar/NotePill';
import { ScenarioTriggers } from '@/components/sidebar/ScenarioTriggers';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { initialArtifacts } from '@/data/artifacts';
import { proactiveScenarios } from '@/data/proactiveScenarios';
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
 * - 底部：「元宝正在记笔记」状态条（保存截图 / 暂停，点击展开查看元宝主动记下的内容）+ 输入框。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({ onClose }) => {
  const { toast, showToast } = useToast();
  const chat = useYuanbaoChat(initialMessages);
  const [notePanelOpen, setNotePanelOpen] = useState(false);
  const { isListening, toggleListening } = useListening((listening) =>
    showToast(listening ? '元宝继续记笔记' : '已暂停记笔记'),
  );

  // 提问前先收起笔记面板：展开态是 400 高的浮层，会整块盖住刚出现的回答
  const askChat = chat.ask;
  const ask = useCallback(
    (text: string) => {
      setNotePanelOpen(false);
      askChat(text);
    },
    [askChat],
  );

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [chat.summarizeNow, showToast],
  );

  // 展开面板只列元宝主动记的笔记，不含回答提问的消息
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

      {/* 演示用：元宝主动开口的三个时机 + 用户自己发任务的一条 */}
      <ScenarioTriggers
        scenarios={proactiveScenarios}
        onTrigger={(scenario) => {
          // ask 走正常问答流程（先出用户气泡）；nudge 是元宝主动推一条消息
          if (scenario.kind === 'ask') {
            ask(scenario.userText);
          } else {
            chat.push(scenario.build());
          }
        }}
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
          onFollowUp={ask}
          onOpenSource={openSource}
        />
      </MessageStream>

      <div className={styles.footer}>
        {/* 同一行：左侧记笔记状态条、右侧产物入口；两者的展开面板都以这一行为基线向上浮出 */}
        <div className={styles.statusRow}>
          <NotePill
            isListening={isListening}
            expanded={notePanelOpen}
            onExpandedChange={setNotePanelOpen}
            notes={notes}
            onScreenshot={saveScreenshot}
            onToggleListening={toggleListening}
            onOpenSource={openSource}
          />
          <ArtifactEntry artifacts={initialArtifacts} onOpen={openArtifact} />
        </div>
        <ChatInput placeholder="提问或创建任务" onSubmit={ask} />
      </div>
    </SidebarShell>
  );
};
