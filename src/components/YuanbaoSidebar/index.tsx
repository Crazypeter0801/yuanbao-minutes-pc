import { useCallback, useMemo, useRef, useState, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import type { ArtifactItem } from '@/types/artifact';
import type { BubbleCard } from '@/types/chat';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ArtifactEntry } from '@/components/sidebar/ArtifactEntry';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ChatList } from '@/components/sidebar/ChatList';
import { CommandEntry } from '@/components/sidebar/CommandEntry';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { NotePill } from '@/components/sidebar/NotePill';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import { buildAutoNote } from '@/data/autoNotes';
import type { CommandItem } from '@/data/commands';
import { buildCardResult } from '@/data/interactiveCards';
import { buildRecordingStateNote, buildScreenshotNote } from '@/data/yuanbaoContent';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import type { YuanbaoSession } from '@/hooks/useYuanbaoSession';
import styles from './index.module.scss';

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流 + 指令面板状态），由 App 持有 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件；为空时不出现产物入口 */
  artifacts: ArtifactItem[];
  /** 关闭侧栏 */
  onClose: () => void;
  /** 输入框 / 指令提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
}

/**
 * 元宝 Agent 对话区 · V1（Figma 257:1540 右侧，底栏按 Figma 36:2249）
 *
 * 底栏一行从左到右：快捷指令（36 圆钮）→ 产物（有文件才出现）→「元宝正在记笔记」，
 * 三者都按内容自适应宽度、间距 8。指令与产物可展开成浮层，展开时其余胶囊让位。
 *
 * 元宝不再定时自己说话：会中记录、主动提醒、交互卡片全部从快捷指令手动触发，演示节奏可控。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({ chat, artifacts, onClose, onSubmit }) => {
  const { toast, showToast } = useToast();
  const [artifactsOpen, setArtifactsOpen] = useState(false);
  /** 会中记录素材的游标：每次手动记一条往后走一格，不重复 */
  const noteIndex = useRef(0);

  // 暂停 / 继续只在对话里留一条消息，不弹 Toast：反馈集中在一处
  const { isListening, toggleListening } = useListening((listening) => {
    chat.push(buildRecordingStateNote(listening));
  });

  const commandsOpen = chat.notePanelOpen;
  const setCommandsOpen = chat.setNotePanelOpen;

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'settings', label: '纪要设置', onClick: () => showToast('打开纪要设置（演示）') },
    ],
    [chat.summarizeNow, showToast],
  );

  const openSource = () => showToast('已定位到原文（演示）');
  const openArtifact = (item: ArtifactItem) => showToast(`打开「${item.name}」（演示）`);

  // 交互卡片提交：元宝紧接着回一条按所选结构组织的结果
  const submitCard = useCallback(
    (cardId: BubbleCard['id'], values: string[]) => {
      chat.push(buildCardResult(cardId, values));
    },
    [chat],
  );

  const send = (text: string) => (onSubmit ? onSubmit(text) : chat.ask(text));

  /**
   * 执行一条快捷指令：先收起面板，再按类型分发
   * - effect：会中记录 / 记录画面，直接推一条元宝消息；
   * - 其余都交给和输入框相同的链路，由 App 判断是普通提问、生成文件还是演示场景。
   */
  const runCommand = (item: CommandItem) => {
    setCommandsOpen(false);

    if (item.effect === 'auto-note') {
      chat.push(buildAutoNote(noteIndex.current));
      noteIndex.current += 1;
      return;
    }
    if (item.effect === 'screenshot') {
      chat.push(buildScreenshotNote());
      return;
    }
    send(item.prompt ?? item.label);
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
          onOpenSource={openSource}
          onCardSubmit={submitCard}
        />
      </MessageStream>

      <div className={styles.footer}>
        <div className={styles.statusRow}>
          <CommandEntry
            expanded={commandsOpen}
            onExpandedChange={(open) => {
              setArtifactsOpen(false);
              setCommandsOpen(open);
            }}
            hidden={artifactsOpen}
            onCommand={runCommand}
          />
          {/* 没有产物就不出这个入口，生成文件之后才出现 */}
          {artifacts.length > 0 && (
            <ArtifactEntry
              artifacts={artifacts}
              expanded={artifactsOpen}
              onExpandedChange={(open) => {
                setCommandsOpen(false);
                setArtifactsOpen(open);
              }}
              hidden={commandsOpen}
              onOpen={openArtifact}
            />
          )}
          <NotePill
            isListening={isListening}
            hidden={commandsOpen || artifactsOpen}
            onOpen={() => showToast('已在浏览器打开元宝笔记（演示）')}
            onToggleListening={toggleListening}
          />
        </div>
        <ChatInput
          placeholder="提问或创建任务"
          onSubmit={send}
          onToolAction={(label) => showToast(`打开${label}（演示）`)}
        />
      </div>
    </SidebarShell>
  );
};
