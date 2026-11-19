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
import { MessageStream } from "@/components/sidebar/MessageStream";
import { QuickCommandEntry } from "@/components/sidebar/QuickCommandEntry";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { TaskDetail } from "@/components/sidebar/TaskDetail";
import { TaskEntry } from "@/components/sidebar/TaskEntry";
import { INITIAL_SCHEDULED_TASKS, type AgentScheduledTask } from "@/data/agentDetail";
import { AGENT_TASKS, RUNNING_TASK_COUNT, type AgentTask } from "@/data/agentTasks";
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
  /** 是否打开 Agent Profile 详情页（由 App 控制，便于顶部页签/浮窗标题联动） */
  detailOpen?: boolean;
  /** 切换 Agent Profile 详情页开关 */
  onDetailOpenChange?: (open: boolean) => void;
}

/**
 * 元宝 Agent 对话区
 *
 * 顶部保持清爽（无额外状态条）；输入框上方恢复原「推荐指令」与「进行中任务」TaskEntry 进度条，
 * 点顶部元宝标题/页签或任务列表内入口可打开完整 Agent Profile 详情页。
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

  const [scheduledTasks, setScheduledTasks] = useState<AgentScheduledTask[]>(INITIAL_SCHEDULED_TASKS);
  /** 正在看的任务；有值时盖住侧栏显示任务步骤详情 */
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
      chat.push(buildCardResult(cardId, values));
    },
    [chat],
  );

  const send = (text: string) => (onSubmit ? onSubmit(text) : chat.ask(text));

  return (
    <div className={styles.panel}>
      {showHeader && (
        <SidebarHeader
          onPip={() => (onPopOut ? onPopOut() : showToast("已在独立窗口打开（演示）"))}
          menuItems={menuItems}
          onClose={onClose}
          onTitleClick={() => setDetailOpen(true)}
          titleTooltip="打开元宝 Agent 详情"
        />
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
          {/* 输入框上方一行：左「推荐指令」、右「进行中任务」（按 feat/single-window-base 还原） */}
          <div className={styles.statusRow}>
            <QuickCommandEntry
              expanded={openPanel === "commands"}
              onExpandedChange={(next) => setOpenPanel(next ? "commands" : null)}
              hidden={openPanel === "tasks"}
              onPick={send}
            />
            <TaskEntry
              tasks={AGENT_TASKS}
              runningCount={RUNNING_TASK_COUNT}
              expanded={openPanel === "tasks"}
              onExpandedChange={(next) => setOpenPanel(next ? "tasks" : null)}
              hidden={openPanel === "commands"}
              onOpenTask={setActiveTask}
              onOpenAgentDetail={() => setDetailOpen(true)}
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
