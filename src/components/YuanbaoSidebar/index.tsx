import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
} from "react";
import { NOTE_ARTIFACT_ID } from "@/data/artifacts";
import type { ArtifactItem } from "@/types/artifact";
import type { BubbleCard } from "@/types/chat";
import { AiDisclaimer } from "@/components/sidebar/AiDisclaimer";
import { ProgressiveBlur } from "@/components/common/ProgressiveBlur";
import { ChatInput } from "@/components/sidebar/ChatInput";
import { ChatList } from "@/components/sidebar/ChatList";
import { MessageStream } from "@/components/sidebar/MessageStream";
import { BoardProgressPill, TaskEntryBar } from "@/components/sidebar/TaskEntryBar";
import { AgentTitleBar } from "@/components/agent/AgentTitleBar";
import {
  AgentStatusPage,
  type AgentStatusTab,
} from "@/components/agent/AgentStatusPage";
import { AgentWindowShell } from "@/components/agent/AgentWindowShell";
import { TaskDetail } from "@/components/agent/TaskDetail";
import { WHITEBOARD_TASK_ID } from "@/data/agentTasks";
import {
  TASK_ENTRY_LISTENING_TEXT,
  TASK_ENTRY_RECORDING_TEXT,
  TASK_ENTRY_TASKS,
  type TaskEntryMode,
} from "@/data/taskEntry";
import { buildCardResult } from "@/data/interactiveCards";
import { useListening } from "@/hooks/useListening";
import { useToast } from "@/hooks/useToast";
import { useYuanbaoMood } from "@/hooks/useYuanbaoMood";
import type { DetailLibraryItem } from "@/data/detailLibrary";
import type { AgentDockControl } from "@/hooks/useAgentDock";
import type { AgentTasksControl } from "@/hooks/useAgentTasks";
import type { YuanbaoSession } from "@/hooks/useYuanbaoSession";
import styles from "./index.module.scss";

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流），由 App 持有 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件；为空时不出现产物入口 */
  artifacts: ArtifactItem[];
  /** 吸附 / 分离状态（由 App 持有，会议内容是否让位也取决于它） */
  dock: AgentDockControl;
  /** 元宝的任务（由 App 持有）：头像状态、任务条、长程任务详情都从这里推出来 */
  agent: AgentTasksControl;
  /** 任务入口方案：顶部胶囊（A）/ 输入框上方（B） */
  taskEntry: TaskEntryMode;
  /** 打开状态页时默认停留的 Tab */
  statusTab: AgentStatusTab;
  /** 关闭侧栏 */
  onClose: () => void;
  /** 是否显示 Agent 状态页（覆盖对话区） */
  statusOpen: boolean;
  /** 点击头部胶囊 / 任务胶囊 / 文件夹进入状态页，并指定 Tab */
  onOpenStatus: (tab: AgentStatusTab) => void;
  /** 状态页左上角返回聊天 */
  onCloseStatus: () => void;
  /** 详情页设置过的形象，同步到顶部胶囊 */
  portrait: string | null;
  onApplyPortrait: (src: string) => void;
  onOpenFile: (item: DetailLibraryItem) => void;
  /** 输入框提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
}

/**
 * 元宝 personal agent 窗口（Figma 215:19034 / 215:21463）
 * 外壳与会议窗一样是毛玻璃（#F0F2F7F2、圆角 12），两扇窗并排、中间一条白缝。
 * 方案 A：头部胶囊「头像 + 元宝 › + 正在记笔记…」，点胶囊进状态页概览；底部只有输入框。
 * 方案 B：头部副标题改成「正在听...」，输入框上方放指令大全和任务胶囊（元宝笔记 +16 / 会议待办 +5）。
 *
 * 长程任务详情仍占用对话区；快捷指令仍在窗口外的演示按钮条上。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  dock,
  agent,
  taskEntry,
  statusTab,
  onClose,
  statusOpen,
  onOpenStatus,
  onCloseStatus,
  onSubmit,
  noteTopics,
  portrait,
  onApplyPortrait,
  onOpenFile,
}) => {
  const { toast, showToast } = useToast();
  /** 正在看详情的长程任务；为空时对话区显示对话 */
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  /**
   * 底栏浮在消息流上方（Figma 91:15671 的渐变底），消息流底部要留出底栏的高度，
   * 否则最后一条会被压在输入框下面；输入框多行撑高时一起跟着变。
   */
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

  // 是否正在记笔记：驱动头像的休眠状态（暂停入口已从新方案的底栏移除）
  const { isListening } = useListening();

  const openSource = () => showToast("已定位到原文（演示）");
  const openNote = () => showToast("已在浏览器打开元宝笔记（演示）");
  // 文件夹里的「元宝笔记」和对话里的笔记卡片、底栏胶囊是同一个入口，反馈一致
  const openArtifact = (item: ArtifactItem) =>
    item.id === NOTE_ARTIFACT_ID
      ? openNote()
      : showToast(`打开「${item.name}」（演示）`);

  // 交互卡片提交：元宝紧接着回一条按所选结构组织的结果
  const submitCard = useCallback(
    (cardId: BubbleCard["id"], values: string[]) => {
      chat.push(buildCardResult(cardId, values));
    },
    [chat],
  );

  const send = (text: string) => (onSubmit ? onSubmit(text) : chat.ask(text));

  // 头像状态：任务推出的常驻状态 + 打瞌睡 / 眨眼 / 摸头 / 吃新动态 / 喝彩这些反应
  const { mood, replayKey, onOnceEnd, touch } = useYuanbaoMood({
    agent,
    messages: chat.messages,
    thinking: chat.isThinking,
    listening: isListening,
  });
  /*
   * 顶上是此刻的动作：画板进行中用任务自己的 activity（正在控制画板...）。
   * 画完或没有这条任务时，方案 B 回到「正在听...」，方案 A 回到「正在记笔记...」；
   * 若当时还有别的进行中任务，用那条的 activity。
   */
  const boardTask = agent.tasks.find((task) => task.id === WHITEBOARD_TASK_ID);
  const otherRunning = agent.tasks.find(
    (task) => task.status === "running" && task.id !== WHITEBOARD_TASK_ID,
  );
  const headerStatus =
    boardTask?.status === "running"
      ? boardTask.activity
      : otherRunning
        ? otherRunning.activity
        : taskEntry === "footer"
          ? TASK_ENTRY_LISTENING_TEXT
          : TASK_ENTRY_RECORDING_TEXT;
  const detailTask = agent.tasks.find((task) => task.id === detailTaskId);

  return (
    <AgentWindowShell toast={toast} dock={dock}>
      <AgentTitleBar
        dock={dock}
        mood={mood}
        statusText={headerStatus}
        replayKey={replayKey}
        onOnceEnd={onOnceEnd}
        onTouch={touch}
        onOpenStatus={() => onOpenStatus('overview')}
        onClose={onClose}
        portrait={portrait}
      />

      {/* 消息流与底栏叠在一起：对话可以滚到底栏后面，被渐进模糊一点点糊掉 */}
      <div
        className={styles.body}
        style={{ "--yb-footer-height": `${footerHeight}px` } as CSSProperties}
      >
        {/* 长程任务详情占用对话区的位置，从顶部读起；返回后对话重新定位到底部 */}
        {detailTask ? (
          <div className={`${styles.detailScroll} wm-scroll-hidden`}>
            <div className={styles.stream}>
              <TaskDetail
                task={detailTask}
                onBack={() => setDetailTaskId(null)}
                onStop={() => {
                  agent.stopTask(detailTask.id);
                  showToast(`已停止「${detailTask.title}」，已完成的步骤已保留`);
                }}
                onPreview={() => showToast(`已在会议中预览「${detailTask.title}」（演示）`)}
              />
            </div>
          </div>
        ) : (
          <MessageStream
            className={styles.stream}
            scrollKey={`${chat.messages.length}-${chat.isThinking}`}
            initialScroll="top"
          >
            <AiDisclaimer />
            <ChatList
              messages={chat.messages}
              shape="round"
              isThinking={chat.isThinking}
              // 追问和输入框走同一条链路：「发送到会议群」这类需要上下文的追问由 App 接住
              onFollowUp={send}
              onOpenSource={openSource}
              onOpenArtifact={openArtifact}
              onOpenNote={openNote}
              noteTopics={noteTopics}
              onCardSubmit={submitCard}
            />
          </MessageStream>
        )}

        <ProgressiveBlur className={styles.blur} maxBlur={8} tint="var(--wm-color-blur-tint-agent)" />

        <div className={`${styles.footer} ${taskEntry === "footer" ? styles.footerWithTasks : ""}`} ref={footerRef}>
          {/*
            方案 B：输入框上方一排毛玻璃胶囊（指令大全 / 元宝笔记 +16 / 会议待办 +5）；
            方案 A 不出现这一行，任务状态全部收进头部胶囊。
          */}
          {taskEntry === "footer" ? (
            <TaskEntryBar
              tasks={TASK_ENTRY_TASKS}
              boardTask={boardTask}
              onOpen={onOpenStatus}
              onCommand={send}
            />
          ) : (
            boardTask && (
              <div className={styles.boardRow}>
                <BoardProgressPill task={boardTask} />
              </div>
            )
          )}
          <ChatInput
            placeholder="和元宝聊聊"
            onSubmit={send}
            onToolAction={(label) => showToast(`${label}（演示）`)}
          />
        </div>
      </div>

      {/* 状态页覆盖整个元宝窗口：对话区保持挂载，返回后消息、输入和滚动位置都还在 */}
      {statusOpen && (
        <div className={styles.statusOverlay}>
          <AgentStatusPage
            dock={dock}
            initialTab={statusTab}
            portrait={portrait}
            onBack={onCloseStatus}
            onClose={onClose}
            onApplyPortrait={onApplyPortrait}
            onOpenFile={onOpenFile}
            onCreateAuto={() => showToast('创建自动任务（演示）')}
            onOpenSettings={() => showToast('设置（演示）')}
          />
        </div>
      )}
    </AgentWindowShell>
  );
};
