import { useCallback, useMemo, useRef, useState, type FC } from 'react';
import type { PopMenuItem } from '@/components/common/PopMenu';
import { Pressable } from '@/components/common/Pressable';
import { AiDisclaimer } from '@/components/sidebar/AiDisclaimer';
import { ChatList } from '@/components/sidebar/ChatList';
import { Composer, type ComposerHandle } from '@/components/sidebar/Composer';
import { ListenPill } from '@/components/sidebar/ListenPill';
import { MessageStream } from '@/components/sidebar/MessageStream';
import { PillComposer } from '@/components/sidebar/PillComposer';
import { SidebarHeader } from '@/components/sidebar/SidebarHeader';
import { SidebarShell } from '@/components/sidebar/SidebarShell';
import type { SchemeSidebarProps } from '@/components/schemes/types';
import { schemeCMessages, schemeCMinutes, schemeCRecipes } from '@/data/schemeContent';
import { useClipboard } from '@/hooks/useClipboard';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/useToast';
import { useYuanbaoChat } from '@/hooks/useYuanbaoChat';
import type { MeetingMinutes } from '@/types/chat';
import { MinutesPeek } from './MinutesPeek';
import { MinutesSheet } from './MinutesSheet';
import styles from './index.module.scss';

/** 纪要转纯文本，供「复制全文」使用 */
function minutesToText(minutes: MeetingMinutes): string {
  const conclusions = minutes.conclusions
    .map((item, index) => `${index + 1}. ${item.title}：${item.detail}`)
    .join('\n');
  const todos = minutes.todos
    .map((todo) => `- [${todo.done ? 'x' : ' '}] ${todo.owner}：${todo.content}`)
    .join('\n');
  const pending = minutes.pending.map((item) => `- ${item}`).join('\n');
  return [
    `【${minutes.title}】`,
    `概览\n${minutes.overview}`,
    `结论\n${conclusions}`,
    `待办\n${todos}`,
    `待定\n${pending}`,
  ].join('\n\n');
}

/**
 * 方案 C · 问答为主，纪要按需展开（无稿，参考 Granola）
 * - 主体是和元宝的对话：回答不用气泡，直接排版，像一份随问随写的笔记；
 * - 纪要收成顶部一条预览，点开以抽屉形式盖在对话上，看完即收；
 * - 输入框上方给常用技能（对应 Granola 的 recipes），减少空白输入框的启动成本。
 * 变体只换输入区，消息流、纪要抽屉与状态共用，切换时内容不丢：
 * - composer：大输入框（默认）
 * - pill：方案 B 的底栏（元宝胶囊 + 「问元宝」单行输入），暂停入口与顶部状态胶囊同步
 */
export const SchemeC: FC<SchemeSidebarProps> = ({ onClose, variant = 'composer' }) => {
  const { toast, showToast } = useToast();
  const chat = useYuanbaoChat(schemeCMessages);
  const [minutes, setMinutes] = useState<MeetingMinutes>(schemeCMinutes);
  const [sheetOpen, setSheetOpen] = useState(false);
  const composerRef = useRef<ComposerHandle>(null);
  const copy = useClipboard();
  const { isListening, toggleListening } = useListening((listening) =>
    showToast(listening ? '继续记录中' : '已暂停记录'),
  );

  const toggleTodo = useCallback((id: string) => {
    setMinutes((previous) => ({
      ...previous,
      todos: previous.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    }));
  }, []);

  const copyMinutes = async () => {
    const succeeded = await copy(minutesToText(minutes));
    showToast(succeeded ? '已复制纪要全文' : '复制失败，请重试');
  };

  const askAbout = (prefix: string) => {
    setSheetOpen(false);
    composerRef.current?.fill(prefix);
  };

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: 'export', label: '导出纪要文档', onClick: () => showToast('纪要已导出为文档（演示）') },
      { key: 'history', label: '历史对话', onClick: () => showToast('打开历史对话（演示）') },
      { key: 'new', label: '新建对话', onClick: () => showToast('已新建对话（演示）') },
    ],
    [showToast],
  );

  const pillMenu: PopMenuItem[] = [
    { key: 'summary', label: '立即总结', onClick: chat.summarizeNow },
    { key: 'minutes', label: '查看元宝纪要', onClick: () => setSheetOpen(true) },
    { key: 'switch', label: '切换助手', onClick: () => showToast('切换助手（演示）') },
  ];

  return (
    <SidebarShell toast={toast}>
      <SidebarHeader
        onPip={() => showToast('已在独立窗口打开（演示）')}
        menuItems={menuItems}
        onClose={onClose}
      />

      <div className={styles.main}>
        <div className={styles.peekWrap}>
          <MinutesPeek
            minutes={minutes}
            isListening={isListening}
            expanded={sheetOpen}
            onToggleExpand={() => setSheetOpen((open) => !open)}
            onToggleListening={toggleListening}
          />
          {sheetOpen && (
            <MinutesSheet
              minutes={minutes}
              onToggleTodo={toggleTodo}
              onCopy={copyMinutes}
              onAskAbout={askAbout}
            />
          )}
        </div>

        {sheetOpen && <div className={styles.mask} onClick={() => setSheetOpen(false)} aria-hidden="true" />}

        <MessageStream
          className={styles.stream}
          withTopFade
          bottomAligned
          scrollKey={`${variant}-${chat.messages.length}-${chat.isThinking}`}
        >
          <AiDisclaimer />
          <ChatList
            messages={chat.messages}
            shape="plain"
            isThinking={chat.isThinking}
            onFollowUp={chat.ask}
            onOpenSource={() => {
              setSheetOpen(true);
              showToast('已在纪要中定位（演示）');
            }}
          />
        </MessageStream>
      </div>

      <div className={styles.footer}>
        <div className={styles.recipes}>
          {schemeCRecipes.map((recipe) => (
            <Pressable className={styles.recipe} key={recipe} onClick={() => chat.ask(recipe)}>
              {recipe}
            </Pressable>
          ))}
          <Pressable className={`${styles.recipe} ${styles.recipeMore}`} onClick={() => showToast('全部技能（演示）')}>
            全部技能
          </Pressable>
        </div>
        {variant === 'pill' ? (
          <div className={styles.pillRow}>
            <ListenPill isListening={isListening} onToggleListening={toggleListening} menuItems={pillMenu} />
            <PillComposer ref={composerRef} placeholder="问元宝" onSubmit={chat.ask} />
          </div>
        ) : (
          <Composer
            ref={composerRef}
            placeholder="问元宝会上的任何事"
            onSubmit={chat.ask}
            onAttach={() => showToast('添加附件或技能（演示）')}
          />
        )}
      </div>
    </SidebarShell>
  );
};
