import { useCallback, useMemo, useState, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { NOTE_ARTIFACT_ID } from '@/data/artifacts';
import type { ArtifactItem } from '@/types/artifact';
import type { BubbleCard } from '@/types/chat';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ArtifactEntry } from '@/components/sidebar/ArtifactEntry';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ChatList } from '@/components/sidebar/ChatList';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { NotePill } from '@/components/sidebar/NotePill';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { buildCardResult } from '@/data/interactiveCards';
import { buildRecordingStateNote } from '@/data/yuanbaoContent';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import type { YuanbaoSession } from '@/hooks/useYuanbaoSession';
import styles from './index.module.scss';

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流），由 App 持有 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件；为空时不出现产物入口 */
  artifacts: ArtifactItem[];
  /** 关闭侧栏 */
  onClose: () => void;
  /** 输入框提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
}

/**
 * 元宝 Agent 对话区 · V1（Figma 257:1540 右侧，底栏按 Figma 36:2249）
 *
 * 底栏一行从左到右：产物（有文件才出现）→「元宝正在记笔记」，按内容自适应宽度、间距 8。
 * 产物可展开成浮层，展开时笔记胶囊让位。
 *
 * 快捷指令已移出窗口：元宝发言、用户发言、交互功能都从窗口外的三个演示按钮触发。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({ chat, artifacts, onClose, onSubmit, noteTopics }) => {
  const { toast, showToast } = useToast();
  const [artifactsOpen, setArtifactsOpen] = useState(false);

  // 暂停 / 继续只在对话里留一条消息，不弹 Toast：反馈集中在一处
  const { isListening, toggleListening } = useListening((listening) => {
    chat.push(buildRecordingStateNote(listening));
  });

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [chat.summarizeNow, showToast],
  );

  const openSource = () => showToast('已定位到原文（演示）');
  const openNote = () => showToast('已在浏览器打开元宝笔记（演示）');
  // 文件夹里的「元宝笔记」和对话里的笔记卡片、底栏胶囊是同一个入口，反馈一致
  const openArtifact = (item: ArtifactItem) =>
    item.id === NOTE_ARTIFACT_ID ? openNote() : showToast(`打开「${item.name}」（演示）`);

  // 交互卡片提交：元宝紧接着回一条按所选结构组织的结果
  const submitCard = useCallback(
    (cardId: BubbleCard['id'], values: string[]) => {
      chat.push(buildCardResult(cardId, values));
    },
    [chat],
  );

  const send = (text: string) => (onSubmit ? onSubmit(text) : chat.ask(text));

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
          onOpenSource={openSource}
          onOpenArtifact={openArtifact}
          onOpenNote={openNote}
          noteTopics={noteTopics}
          onCardSubmit={submitCard}
        />
      </MessageStream>

      <div className={styles.footer}>
        <div className={styles.statusRow}>
          {/* 元宝笔记本身就是一个文件，开启云笔记后这个入口一直都在 */}
          {artifacts.length > 0 && (
            <ArtifactEntry
              artifacts={artifacts}
              expanded={artifactsOpen}
              onExpandedChange={setArtifactsOpen}
              onOpen={openArtifact}
              onOpenSide={() => {
                setArtifactsOpen(false);
                showToast('已在侧边打开文件列表（演示）');
              }}
            />
          )}
          <NotePill
            isListening={isListening}
            hidden={artifactsOpen}
            onOpen={openNote}
            onToggleListening={toggleListening}
          />
        </div>
        <ChatInput
          placeholder="提问或创建任务"
          onSubmit={send}
          onToolAction={(label) => showToast(`${label}（演示）`)}
        />
      </div>
    </SidebarShell>
  );
};
