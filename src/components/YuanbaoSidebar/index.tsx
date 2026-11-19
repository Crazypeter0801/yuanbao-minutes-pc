import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FC,
} from "react";
import type { PopMenuItem } from "@/components/common/PopMenu";
import { Pressable } from "@/components/common/Pressable";
import { Toast } from "@/components/common/Toast";
import { AgentDetail } from "@/components/sidebar/AgentDetail";
import { ChatInput } from "@/components/sidebar/ChatInput";
import { ChatList } from "@/components/sidebar/ChatList";
import { MessageStream } from "@/components/sidebar/MessageStream";
import { QuickCommandEntry } from "@/components/sidebar/QuickCommandEntry";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { TaskDetail } from "@/components/sidebar/TaskDetail";
import { TaskDots } from "@/components/sidebar/TaskDots";
import { INITIAL_SCHEDULED_TASKS, type AgentScheduledTask } from "@/data/agentDetail";
import type { AgentTask } from "@/data/agentTasks";
import { NOTE_ARTIFACT_ID } from "@/data/artifacts";
import { buildCardResult } from "@/data/interactiveCards";
import { useToast } from "@/hooks/useToast";
import type { YuanbaoSession } from "@/hooks/useYuanbaoSession";
import type { ArtifactItem } from "@/types/artifact";
import type { BubbleCard } from "@/types/chat";
import styles from "./index.module.scss";

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流），由 App 持有 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件（对话里的产物卡片与 Agent 详情资料库共用） */
  artifacts: ArtifactItem[];
  /** 关闭侧栏 / 页签 */
  onClose: () => void;
  /** 独立窗口弹出 */
  onPopOut?: () => void;
  /** 输入框提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
  /** 只开着元宝时显示自己的标题栏；多个应用并开或独立浮窗时由外层承载 */
  showHeader?: boolean;
}

/**
 * 元宝 Agent 对话区
 *
 * 严守方案 A 约束：任务与 Agent 详情入口固定放在顶部 header（绝不在输入框上方放任务入口）；
 * 输入框上方仅保留「推荐指令」快捷入口，点击顶部入口可展开完整 Agent 详情页。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  artifacts,
  onClose,
  onPopOut,
  onSubmit,
  noteTopics,
  showHeader = true,
}) => {
  const { toast, showToast } = useToast();
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState<AgentScheduledTask[]>(INITIAL_SCHEDULED_TASKS);
  /** 从 Agent 详情页点进某条长程任务步骤详情 */
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(122);

  useLayoutEffect(() => {
    const node = footerRef.current;
    if (!node) {
      return undefined;
    }
    const measure = () => setFooterHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const enabledTaskCount = useMemo(
    () => scheduledTasks.filter((item) => item.enabled).length,
    [scheduledTasks],
  );

  const toggleScheduledTask = useCallback(
    (id: string) => {
      setScheduledTasks((previous) =>
        previous.map((item) => {
          if (item.id !== id) {
            return item;
          }
          const next = !item.enabled;
          showToast(`${item.title}已${next ? "开启" : "暂停"}`);
          return { ...item, enabled: next };
        }),
      );
    },
    [showToast],
  );

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: "detail", label: "查看 Agent 详情", onClick: () => setDetailOpen(true) },
      { key: "summary", label: "立即总结", onClick: chat.summarizeNow },
      {
        key: "export",
        label: "导出纪要文档",
        onClick: () => showToast("纪要已导出为文档（演示）"),
      },
      {
        key: "settings",
        label: "纪要设置",
        onClick: () => showToast("打开纪要设置（演示）"),
      },
    ],
    [chat.summarizeNow, showToast],
  );

  const openSource = () => showToast("已定位到原文（演示）");
  const openNote = () => showToast("已在浏览器打开元宝笔记（演示）");
  const openArtifact = useCallback(
    (item: ArtifactItem) =>
      item.id === NOTE_ARTIFACT_ID
        ? showToast("已在浏览器打开元宝笔记（演示）")
        : showToast(`打开「${item.name}」（演示）`),
    [showToast],
  );

  const submitCard = useCallback(
    (cardId: BubbleCard["id"], values: string[]) => {
      chat.push(buildCardResult(cardId, values));
    },
    [chat],
  );

  const send = (text: string) => (onSubmit ? onSubmit(text) : chat.ask(text));

  return (
    <div className={styles.panel}>
      {showHeader ? (
        <SidebarHeader
          onPip={() => (onPopOut ? onPopOut() : showToast("已在独立窗口打开（演示）"))}
          menuItems={menuItems}
          onClose={onClose}
          onTitleClick={() => setDetailOpen(true)}
          titleTooltip="打开元宝 Agent 详情"
          titleStatus={
            <>
              <TaskDots running={enabledTaskCount > 0} />
              <span>{enabledTaskCount > 0 ? `正在记录 · ${enabledTaskCount}项任务` : "已暂停自动任务"}</span>
            </>
          }
        />
      ) : (
        /* 多页签 / 独立浮窗模式下的方案 A 顶部 Agent 状态与详情入口（位于头部，不在输入框上方） */
        <div className={styles.headerStripWrap}>
          <Pressable
            className={styles.headerStrip}
            onClick={() => setDetailOpen(true)}
            ariaLabel="查看元宝 Agent 详情与自动任务"
            title="打开元宝 Agent 详情"
          >
            <span className={styles.headerStripLeft}>
              <TaskDots running={enabledTaskCount > 0} />
              <span className={styles.headerStripText}>
                {enabledTaskCount > 0
                  ? `正在记录会议 · ${enabledTaskCount}项自动任务运行中`
                  : "自动任务已暂停 · 点击管理"}
              </span>
            </span>
            <span className={styles.headerStripRight}>
              <span>详情</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M4.4 2.8 7.6 6 4.4 9.2"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Pressable>
        </div>
      )}

      {/* 消息流与底栏叠在一起：对话可以滚到底栏后面，被渐变底一点点盖掉 */}
      <div
        className={styles.body}
        style={{ "--yb-footer-height": `${footerHeight}px` } as CSSProperties}
      >
        <MessageStream
          className={styles.stream}
          startAtTop
          scrollKey={`${chat.messages.length}-${chat.isThinking}`}
        >
          <ChatList
            messages={chat.messages}
            shape="round"
            isThinking={chat.isThinking}
            onFollowUp={send}
            onOpenSource={openSource}
            onOpenArtifact={openArtifact}
            onOpenNote={openNote}
            noteTopics={noteTopics}
            onCardSubmit={submitCard}
          />
        </MessageStream>

        <div className={styles.footer} ref={footerRef}>
          {/* 仅保留「推荐指令」，严守方案 A 不在输入框上方放置任务入口 */}
          <div className={styles.statusRow}>
            <QuickCommandEntry
              expanded={commandsOpen}
              onExpandedChange={setCommandsOpen}
              onPick={send}
            />
          </div>
          <ChatInput
            placeholder="和元宝聊聊"
            onSubmit={send}
            onToolAction={(label) => showToast(`${label}（演示）`)}
          />
        </div>
      </div>

      {detailOpen && (
        <AgentDetail
          scheduledTasks={scheduledTasks}
          onToggleTask={toggleScheduledTask}
          artifacts={artifacts}
          topicCount={noteTopics?.length ?? 0}
          onBack={() => setDetailOpen(false)}
          onOpenTaskDetail={(task) => setActiveTask(task)}
          onOpenArtifact={openArtifact}
          onToast={showToast}
        />
      )}

      {activeTask && <TaskDetail task={activeTask} onBack={() => setActiveTask(null)} />}
      <Toast toast={toast} placement="window" />
    </div>
  );
};
