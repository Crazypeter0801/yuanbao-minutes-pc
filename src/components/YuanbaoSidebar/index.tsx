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
import { Toast } from "@/components/common/Toast";
import { AgentDetail } from "@/components/sidebar/AgentDetail";
import { ChatInput } from "@/components/sidebar/ChatInput";
import { ChatList } from "@/components/sidebar/ChatList";
import { MessageStream, type MessageStreamHandle } from "@/components/sidebar/MessageStream";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { TaskDetail } from "@/components/sidebar/TaskDetail";
import { TopActivityStage } from "@/components/sidebar/TopActivityStage";
import { INITIAL_SCHEDULED_TASKS, type AgentScheduledTask } from "@/data/agentDetail";
import { AGENT_TASKS, getRunningTaskStatus, type AgentTask } from "@/data/agentTasks";
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
  onSubmit?: (text: string, options?: { fromUser?: boolean }) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
  /** 只开着元宝时显示自己的标题栏；多个应用并开或独立浮窗时由外层承载 */
  showHeader?: boolean;
  /** 是否打开 Agent Profile 详情页（由 App 控制，停靠侧栏与独立浮窗同步） */
  detailOpen?: boolean;
  /** 切换 Agent Profile 详情页开关 */
  onDetailOpenChange?: (open: boolean) => void;
  /** 当前是否存在进行中的任务；控制顶部活动态 / 空闲态切换 */
  hasActiveTasks?: boolean;
  /** 当前进行中任务的动态阶段文案（由上层共享驱动，确保停靠侧栏与独立浮窗同步） */
  taskStatusText?: string;
}

/**
 * 元宝 Agent 对话区（Figma 811:25080 定稿）：
 * 顶部悬浮元宝活动浮层统一承载 Agent 运行状态（空闲态 811:39347 / 活动态 811:25116）与 Agent 详情页入口；
 * 底部仅保留纯净输入框 + 22px 贴边渐隐 + 居中 32×32 回底按钮，停靠侧栏与独立浮窗双端同步。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  artifacts,
  onClose,
  onPopOut,
  onSubmit,
  noteTopics,
  showHeader = true,
  detailOpen: controlledDetailOpen,
  onDetailOpenChange,
  hasActiveTasks = false,
  taskStatusText,
}) => {
  const { toast, showToast } = useToast();
  const [uncontrolledDetailOpen, setUncontrolledDetailOpen] = useState(false);
  const detailOpen = controlledDetailOpen ?? uncontrolledDetailOpen;
  const setDetailOpen = useCallback(
    (next: boolean) => {
      if (onDetailOpenChange) {
        onDetailOpenChange(next);
      } else {
        setUncontrolledDetailOpen(next);
      }
    },
    [onDetailOpenChange],
  );

  const [scheduledTasks, setScheduledTasks] = useState<AgentScheduledTask[]>(INITIAL_SCHEDULED_TASKS);
  /** 正在看的任务；有值时盖住侧栏显示任务步骤详情 */
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MessageStreamHandle>(null);
  const [footerHeight, setFooterHeight] = useState(64);
  /** 消息流下方是否仍有未滚动到的历史内容（仅此时显示底栏上方贴边渐隐，处于最底端时隐藏避免遮挡最新气泡） */
  const [hasBottomOverflow, setHasBottomOverflow] = useState(false);
  /** 上滚离开底部超过 48px 时显示居中「回到底部」圆形按钮 */
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

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

  const toggleScheduledTask = useCallback(
    (id: string) => {
      const target = scheduledTasks.find((item) => item.id === id);
      if (!target) {
        return;
      }
      const next = !target.enabled;
      setScheduledTasks((previous) =>
        previous.map((item) => (item.id === id ? { ...item, enabled: next } : item)),
      );
      showToast(`${target.title}已${next ? "开启" : "暂停"}`);
    },
    [scheduledTasks, showToast],
  );

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
      { key: "detail", label: "查看元宝 Agent 详情", onClick: () => setDetailOpen(true) },
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
    [chat.summarizeNow, setDetailOpen, showToast],
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
      chat.replyAfterThinking(() => chat.push(buildCardResult(cardId, values)));
    },
    [chat],
  );

  const send = (text: string, fromUser = false) =>
    onSubmit ? onSubmit(text, { fromUser }) : chat.ask(text);

  const resolvedTaskStatus = taskStatusText ?? getRunningTaskStatus(AGENT_TASKS, 0);
  const topActivityActive = hasActiveTasks || chat.isThinking;
  const reservedFooterHeight = Math.max(footerHeight, 64);

  return (
    <div className={styles.panel}>
      {showHeader && (
        <SidebarHeader
          onPip={() => (onPopOut ? onPopOut() : showToast("已在独立窗口打开（演示）"))}
          menuItems={menuItems}
          onClose={onClose}
        />
      )}

      {/* 消息流与顶部元宝浮层、底部输入栏叠放：对话滚动时从磨砂胶囊与底栏后自然穿过 */}
      <div
        className={styles.body}
        style={{ "--yb-footer-height": `${reservedFooterHeight}px` } as CSSProperties}
      >
        <TopActivityStage
          isActive={topActivityActive}
          isThinking={chat.isThinking}
          statusText={resolvedTaskStatus}
          onOpenDetail={() => setDetailOpen(true)}
        />

        <MessageStream
          ref={streamRef}
          className={`${styles.stream} ${
            topActivityActive ? styles.streamWithTopActivityActive : styles.streamWithTopActivity
          }`}
          startAtTop
          withTopFade={false}
          scrollKey={`${chat.messages.length}-${chat.isThinking}`}
          onBottomOverflowChange={setHasBottomOverflow}
          onShowScrollToBottomChange={setShowScrollToBottom}
        >
          <ChatList
            messages={chat.messages}
            shape="round"
            isThinking={false}
            onFollowUp={send}
            onOpenSource={openSource}
            onOpenArtifact={openArtifact}
            onOpenNote={openNote}
            noteTopics={noteTopics}
            onCardSubmit={submitCard}
          />
        </MessageStream>

        <div
          className={`${styles.footer} ${hasBottomOverflow ? styles.footerFadeVisible : ""}`}
          data-bottom-fade-visible={hasBottomOverflow ? "true" : "false"}
          ref={footerRef}
        >
          <button
            type="button"
            className={`${styles.scrollToBottomBtn} ${
              showScrollToBottom ? styles.scrollToBottomBtnVisible : ""
            }`}
            aria-label="回到底部"
            title="回到底部"
            aria-hidden={!showScrollToBottom}
            tabIndex={showScrollToBottom ? 0 : -1}
            data-scroll-to-bottom-visible={showScrollToBottom ? "true" : "false"}
            onClick={() => streamRef.current?.scrollToBottom("smooth")}
          >
            <svg
              className={styles.scrollToBottomIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4.25 6.25L8 10L11.75 6.25"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <ChatInput
            placeholder="和元宝聊聊"
            onSubmit={send}
            onToolAction={(label) => showToast(`${label}（演示）`)}
          />
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
      </div>

      {activeTask && <TaskDetail task={activeTask} onBack={() => setActiveTask(null)} />}
      <Toast toast={toast} placement="window" />
    </div>
  );
};
