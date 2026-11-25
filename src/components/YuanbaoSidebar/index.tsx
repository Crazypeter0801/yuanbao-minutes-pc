import {
  useCallback,
  useEffect,
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
import { MessageStream } from "@/components/sidebar/MessageStream";
import { QuickCommandEntry } from "@/components/sidebar/QuickCommandEntry";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { TaskDetail } from "@/components/sidebar/TaskDetail";
import { TaskEntry, type CommandBarVariant } from "@/components/sidebar/TaskEntry";
import { isAgentStatusVariant } from "@/components/sidebar/TaskEntry/types";
import { INITIAL_SCHEDULED_TASKS, type AgentScheduledTask } from "@/data/agentDetail";
import { AGENT_TASKS, getRunningTaskStatus, type AgentTask } from "@/data/agentTasks";
import { NOTE_ARTIFACT_ID } from "@/data/artifacts";
import { buildCardResult } from "@/data/interactiveCards";
import { useToast } from "@/hooks/useToast";
import type { YuanbaoSession } from "@/hooks/useYuanbaoSession";
import type { ArtifactItem } from "@/types/artifact";
import type { BubbleCard } from "@/types/chat";
import styles from "./index.module.scss";

export type { CommandBarVariant } from "@/components/sidebar/TaskEntry";

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
  /** 是否打开 Agent Profile 详情页（由 App 控制，便于顶部页签/浮窗标题联动） */
  detailOpen?: boolean;
  /** 切换 Agent Profile 详情页开关 */
  onDetailOpenChange?: (open: boolean) => void;
  /** 输入框上方形态：agent-status（Figma 811:38164 新版元宝状态栏）或 capsules（推荐与任务胶囊） */
  commandBarVariant?: CommandBarVariant;
  /** 当前是否存在进行中的任务；false 时隐藏新版状态栏（胶囊模式隐藏「进行中任务」胶囊） */
  hasActiveTasks?: boolean;
  /** 当前进行中任务的动态阶段文案（由上层共享驱动，确保停靠侧栏与独立浮窗同步） */
  taskStatusText?: string;
}

/**
 * 元宝 Agent 对话区
 *
 * 顶部保持清爽；输入框上方支持在「元宝状态栏（Figma 811:38164）」与「推荐与任务胶囊」间实时切换，
 * 两种形态均完整保留「推荐指令」与「进行中任务」交互；点顶部元宝标题/页签或任务列表内入口可打开 Agent Profile 详情页。
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
  commandBarVariant = "agent-status-sprite",
  hasActiveTasks = false,
  taskStatusText,
}) => {
  const { toast, showToast } = useToast();
  /** 底栏同一时刻只展开一个面板：推荐指令 / 进行中任务 */
  const [openPanel, setOpenPanel] = useState<"commands" | "tasks" | null>(null);
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

  // 切换输入框上方形态时先收起展开中的浮层面板，避免旧坐标残留
  useEffect(() => {
    setOpenPanel(null);
  }, [commandBarVariant]);

  // 任务结束清空时，若「进行中任务」面板正展开则同步平滑收起
  useEffect(() => {
    if (!hasActiveTasks) {
      setOpenPanel((current) => (current === "tasks" ? null : current));
    }
  }, [hasActiveTasks]);

  const [scheduledTasks, setScheduledTasks] = useState<AgentScheduledTask[]>(INITIAL_SCHEDULED_TASKS);
  /** 正在看的任务；有值时盖住侧栏显示任务步骤详情 */
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(80);
  /** 消息流下方是否仍有未滚动到的历史内容（仅此时显示底栏上方渐隐，处于最底端时隐藏避免遮挡最新气泡） */
  const [hasBottomOverflow, setHasBottomOverflow] = useState(false);

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

  const isAgentStatus = isAgentStatusVariant(commandBarVariant);
  const resolvedTaskStatus = taskStatusText ?? getRunningTaskStatus(AGENT_TASKS, 0);
  // 展开的「进行中任务」列表与底部状态栏共用当前执行阶段文案，保证两处语义一致
  const activeTasks = useMemo<AgentTask[]>(
    () =>
      hasActiveTasks
        ? AGENT_TASKS.map((task) =>
            task.state === "running" ? { ...task, summary: resolvedTaskStatus } : task,
          )
        : [],
    [hasActiveTasks, resolvedTaskStatus],
  );
  const runningCount = useMemo(
    () => activeTasks.filter((task) => task.state === "running").length,
    [activeTasks],
  );
  const showStatusRow = isAgentStatus ? runningCount > 0 || chat.isThinking : true;
  // 输入框上方已通过「元宝状态栏」呈现「正在思考回复...」或任务执行状态时，
  // 不再在消息流中重复展示灰色「•••」输入气泡；capsules 模式下保留。
  const showTypingBubble = !isAgentStatus && chat.isThinking;
  // 状态栏触发瞬间即预留完整目标高度（120px），避免 240ms 展开过渡期间 padding-bottom 滞后导致最新气泡被挡
  const reservedFooterHeight = Math.max(footerHeight, showStatusRow ? 120 : 80);

  return (
    <div className={styles.panel}>
      {showHeader && (
        <SidebarHeader
          onPip={() => (onPopOut ? onPopOut() : showToast("已在独立窗口打开（演示）"))}
          menuItems={menuItems}
          onClose={onClose}
          onTitleClick={() => setDetailOpen(!detailOpen)}
          titleTooltip="打开元宝 Agent 详情"
        />
      )}

      {/* 消息流与底栏叠在一起：对话可以滚到底栏后面，仅在下方仍有内容时淡出渐隐 */}
      <div
        className={styles.body}
        style={{ "--yb-footer-height": `${reservedFooterHeight}px` } as CSSProperties}
      >
        <MessageStream
          className={styles.stream}
          startAtTop
          withTopFade="scroll"
          scrollKey={`${chat.messages.length}-${chat.isThinking}`}
          onBottomOverflowChange={setHasBottomOverflow}
        >
          <ChatList
            messages={chat.messages}
            shape="round"
            isThinking={showTypingBubble}
            onFollowUp={send}
            onOpenSource={openSource}
            onOpenArtifact={openArtifact}
            onOpenNote={openNote}
            noteTopics={noteTopics}
            onCardSubmit={submitCard}
          />
        </MessageStream>

        <div
          className={[
            styles.footer,
            showStatusRow ? styles.footerWithStatus : "",
            hasBottomOverflow ? styles.footerFadeVisible : "",
          ]
            .filter(Boolean)
            .join(" ")}
          data-bottom-fade-visible={hasBottomOverflow ? "true" : "false"}
          ref={footerRef}
        >
          {/* 输入框上方一行：有任务时平滑滑入/淡入，无任务时 agent-status 整体收起不留空、capsules 仅保留推荐指令 */}
          <div
            className={`${styles.statusRowWrap} ${showStatusRow ? styles.statusRowWrapVisible : styles.statusRowWrapCollapsed}`}
            data-command-bar-variant={commandBarVariant}
            data-status-bar-visible={showStatusRow ? "true" : "false"}
            aria-hidden={!showStatusRow}
          >
            <div className={isAgentStatus ? styles.statusRowAgent : styles.statusRow} data-morph-row>
              {isAgentStatus ? (
                <TaskEntry
                  variant={commandBarVariant}
                  isThinking={chat.isThinking}
                  statusText={resolvedTaskStatus}
                  tasks={activeTasks}
                  runningCount={runningCount}
                  expanded={openPanel === "tasks"}
                  onExpandedChange={(next) => setOpenPanel(next ? "tasks" : null)}
                  onOpenTask={setActiveTask}
                  onOpenAgentDetail={() => setDetailOpen(true)}
                />
              ) : (
                <>
                  <QuickCommandEntry
                    variant="capsules"
                    expanded={openPanel === "commands"}
                    onExpandedChange={(next) => setOpenPanel(next ? "commands" : null)}
                    hidden={openPanel === "tasks"}
                    onPick={(prompt) => send(prompt, true)}
                  />
                  <div
                    className={`${styles.taskCapsuleSlot} ${
                      hasActiveTasks ? styles.taskCapsuleSlotVisible : styles.taskCapsuleSlotCollapsed
                    }`}
                    data-task-capsule-visible={hasActiveTasks ? "true" : "false"}
                    aria-hidden={!hasActiveTasks}
                  >
                    <TaskEntry
                      variant="capsules"
                      tasks={activeTasks}
                      runningCount={runningCount}
                      expanded={openPanel === "tasks"}
                      onExpandedChange={(next) => setOpenPanel(next ? "tasks" : null)}
                      hidden={openPanel === "commands"}
                      onOpenTask={setActiveTask}
                      onOpenAgentDetail={() => setDetailOpen(true)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
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
