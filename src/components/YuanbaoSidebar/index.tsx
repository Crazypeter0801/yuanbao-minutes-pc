import { useCallback, useMemo, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
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
import type { CommandItem } from '@/data/commands';
import { buildCardResult } from '@/data/interactiveCards';
import { buildRecordingStateNote } from '@/data/yuanbaoContent';
import { useAutoNotes } from '@/hooks/useAutoNotes';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import type { YuanbaoSession } from '@/hooks/useYuanbaoSession';
import styles from './index.module.scss';

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流 + 笔记面板状态），由 App 持有 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件；为空时不出现「输出」入口 */
  artifacts: ArtifactItem[];
  /** 关闭侧栏 */
  onClose: () => void;
  /** 输入框提交：App 层会先匹配演示场景，未命中才走普通提问；不传则直接提问 */
  onSubmit?: (text: string) => void;
  /** 生成产物的文件（PDF / PPT），由 App 层加进产物列表 */
  onCreateArtifact?: (kind: 'pdf' | 'pptx') => void;
}

/**
 * 元宝 Agent 对话区 · V1（Figma 257:1540 右侧）
 * - 元宝的实时纪要与用户的提问 / 回答在同一条时间流里；
 * - 底部：「元宝正在记笔记」状态条（暂停；点击展开指令集合）+ 产物入口（有文件才出现）+ 输入框。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  artifacts,
  onClose,
  onSubmit,
  onCreateArtifact,
}) => {
  const { toast, showToast } = useToast();
  // 暂停 / 继续只在对话里留一条消息，不再弹 Toast：反馈集中在一处
  const { isListening, toggleListening } = useListening((listening) => {
    chat.push(buildRecordingStateNote(listening));
  });

  // 会中实时记录：每 30 秒自动记下一条，模拟有人一直在说话；暂停后停住
  useAutoNotes(chat.push, isListening);

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

  /**
   * 指令集合：收起面板后按指令内容执行。
   * 普通指令交给 App 的 handleSubmit，和输入框打字走同一条链路；
   * 生成文件、打开浏览器这两类有副作用的在这里单独处理。
   */
  const runCommand = (item: CommandItem) => {
    chat.setNotePanelOpen(false);

    if (item.action === 'create-file') {
      onCreateArtifact?.(/ppt/i.test(item.label) ? 'pptx' : 'pdf');
      return;
    }
    if (item.action === 'open-browser') {
      showToast('已在浏览器打开元宝笔记（演示）');
      return;
    }

    const text = item.prompt ?? item.label;
    if (onSubmit) {
      onSubmit(text);
      return;
    }
    chat.ask(text);
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
        {/* 同一行：左侧记笔记状态条、右侧产物入口；两者的展开面板都以这一行为基线向上浮出 */}
        <div className={styles.statusRow}>
          <NotePill
            isListening={isListening}
            expanded={chat.notePanelOpen}
            onExpandedChange={chat.setNotePanelOpen}
            onToggleListening={toggleListening}
            onCommand={runCommand}
          />
          {/* 没有产物就不出这个入口，创建文件之后才出现 */}
          {artifacts.length > 0 && (
            <ArtifactEntry artifacts={artifacts} onOpen={openArtifact} hidden={chat.notePanelOpen} />
          )}
        </div>
        <ChatInput
          placeholder="提问或创建任务"
          onSubmit={(text) => (onSubmit ? onSubmit(text) : chat.ask(text))}
          onToolAction={(label) => showToast(`打开${label}（演示）`)}
        />
      </div>
    </SidebarShell>
  );
};
