import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
} from "react";
import {
  DEFAULT_CHAT_FONT_FAMILY,
  DEFAULT_CHAT_FONT_SIZE,
  findChatFontFamily,
  findChatFontSize,
  type ChatFontFamilyKey,
  type ChatFontSizeKey,
} from "@/data/chatPreferences";
import { NOTE_ARTIFACT_ID } from "@/data/artifacts";
import type { ArtifactItem } from "@/types/artifact";
import type { BubbleCard } from "@/types/chat";
import { AiDisclaimer } from "@/components/sidebar/AiDisclaimer";
import { ProgressiveBlur } from "@/components/common/ProgressiveBlur";
import { ChatInput } from "@/components/sidebar/ChatInput";
import { ChatList } from "@/components/sidebar/ChatList";
import { MessageStream } from "@/components/sidebar/MessageStream";
import { TaskEntryBar } from "@/components/sidebar/TaskEntryBar";
import { AgentTitleBar } from "@/components/agent/AgentTitleBar";
import {
  AgentStatusPage,
  type AgentStatusTab,
} from "@/components/agent/AgentStatusPage";
import { AgentWindowShell } from "@/components/agent/AgentWindowShell";
import { TaskDetail } from "@/components/agent/TaskDetail";
import { resolveMoodText } from "@/data/agentTasks";
import {
  TASK_ENTRY_FILE_COUNT,
  TASK_ENTRY_RECORDING_TEXT,
  TASK_ENTRY_TASKS,
  type TaskEntryMode,
} from "@/data/taskEntry";
import { buildCardResult } from "@/data/interactiveCards";
import { useListening } from "@/hooks/useListening";
import { useToast } from "@/hooks/useToast";
import { useYuanbaoMood } from "@/hooks/useYuanbaoMood";
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
  /** 输入框提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
}

/**
 * 元宝 personal agent 窗口（Figma 215:19035 / 215:21463）
 * 外壳是纯白面板（圆角 12），与会议并排。
 * 方案 A：头部胶囊里放「头像 + 元宝 › + 正在记笔记…」，点胶囊进状态页概览；
 * 方案 B：头部只留「元宝 ›」，输入框上方放任务胶囊（元宝笔记中… / 待办捕捉中…）和文件夹，分别进概览 / 资料库。
 *
 * 长程任务详情仍占用对话区；快捷指令仍在窗口外的演示按钮条上。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  artifacts,
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
}) => {
  const { toast, showToast } = useToast();
  /** 对话区阅读偏好：字号 / 字体，实时下发到侧栏根节点上的 CSS 变量 */
  const [fontSize, setFontSize] = useState<ChatFontSizeKey>(DEFAULT_CHAT_FONT_SIZE);
  const [fontFamily, setFontFamily] = useState<ChatFontFamilyKey>(DEFAULT_CHAT_FONT_FAMILY);
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
   * 头部胶囊状态：没有运行中的任务时按 Figma 215:19432 显示「正在记笔记...」；
   * 演示任务状态跑起来后仍沿用任务文案，状态机不变。
   */
  const headerStatus =
    agent.tasks.length > 0 ? resolveMoodText(mood, agent.tasks) : TASK_ENTRY_RECORDING_TEXT;
  const detailTask = agent.tasks.find((task) => task.id === detailTaskId);

  // 对话区字号 / 字体：挂在侧栏根节点上，对话里的样式统一引用这三个变量
  const sizeOption = findChatFontSize(fontSize);
  const familyOption = findChatFontFamily(fontFamily);
  const chatStyle = {
    "--chat-font-size": sizeOption.fontSize,
    "--chat-line-height": sizeOption.lineHeight,
    "--chat-font-family": familyOption.stack,
  } as CSSProperties;

  return (
    <AgentWindowShell toast={toast} dock={dock} rootStyle={chatStyle}>
      <AgentTitleBar
        dock={dock}
        taskEntry={taskEntry}
        mood={mood}
        statusText={headerStatus}
        replayKey={replayKey}
        onOnceEnd={onOnceEnd}
        onTouch={touch}
        onOpenStatus={() => onOpenStatus('overview')}
        onClose={onClose}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onFontSizeChange={setFontSize}
        onFontFamilyChange={setFontFamily}
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

        <ProgressiveBlur className={styles.blur} tint="var(--wm-color-blur-tint-agent)" />

        <div className={`${styles.footer} ${taskEntry === "footer" ? styles.footerWithTasks : ""}`} ref={footerRef}>
          {/*
          方案 B：输入框上方一排任务胶囊（元宝笔记中… / 待办捕捉中…）+ 右侧文件夹 + 数字；
          方案 A 不出现这一行，任务状态全部收进头部胶囊。
        */}
          {taskEntry === "footer" && (
            <TaskEntryBar
              tasks={TASK_ENTRY_TASKS}
              fileCount={Math.max(TASK_ENTRY_FILE_COUNT, artifacts.length)}
              onOpen={onOpenStatus}
            />
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
            onBack={onCloseStatus}
            onClose={onClose}
            onOpenSetting={(setting) => showToast(`打开「${setting.label}」设置（演示）`)}
            onOpenLibraryItem={(item) => showToast(`打开「${item.title}」（演示）`)}
          />
        </div>
      )}
    </AgentWindowShell>
  );
};
