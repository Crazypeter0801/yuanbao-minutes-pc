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
import { ArtifactEntry } from "@/components/sidebar/ArtifactEntry";
import { ProgressiveBlur } from "@/components/common/ProgressiveBlur";
import { ChatInput } from "@/components/sidebar/ChatInput";
import { ChatList } from "@/components/sidebar/ChatList";
import { MessageStream } from "@/components/sidebar/MessageStream";
import { NotePill } from "@/components/sidebar/NotePill";
import { AgentTitleBar } from "@/components/agent/AgentTitleBar";
import { AgentStatusPage, type AgentStatusScheme } from "@/components/agent/AgentStatusPage";
import { AgentWindowShell } from "@/components/agent/AgentWindowShell";
import { TaskDetail } from "@/components/agent/TaskDetail";
import { TaskTray } from "@/components/agent/TaskTray";
import { resolveMoodText, type AgentTask } from "@/data/agentTasks";
import { buildCardResult } from "@/data/interactiveCards";
import { buildRecordingStateNote } from "@/data/yuanbaoContent";
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
  /** 关闭侧栏 */
  onClose: () => void;
  /** 是否显示 Agent 状态页（覆盖对话区） */
  statusOpen: boolean;
  /** 当前状态页方案 */
  statusScheme: AgentStatusScheme;
  /** 点击头部头像 / 名字进入状态页 */
  onOpenStatus: () => void;
  /** 状态页左上角返回聊天 */
  onCloseStatus: () => void;
  /** 输入框提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
}

/**
 * 元宝 personal agent 窗口（视觉 Figma 215:16455，任务状态交互 Figma 197:42）
 * 外壳是和会议并排的独立窗口（纯白底）：标题栏左侧是「头像 + 元宝 + 状态文字」，头像用雪碧图跟着任务状态和用户操作动。
 *
 * 输入框上方一行：左边是任务条（「N 个任务进行中」，可展开任务列表）和记笔记胶囊，右边固定是文件夹。
 * 文件夹、任务列表都向上展开，展开一个时另一个让位；点进行中的长程任务，对话区换成任务详情。
 *
 * 快捷指令已移出窗口：元宝发言、用户发言、交互功能都从窗口外的三个演示按钮触发。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  artifacts,
  dock,
  agent,
  onClose,
  statusOpen,
  statusScheme,
  onOpenStatus,
  onCloseStatus,
  onSubmit,
  noteTopics,
}) => {
  const { toast, showToast } = useToast();
  const [artifactsOpen, setArtifactsOpen] = useState(false);
  const [taskListOpen, setTaskListOpen] = useState(false);
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

  // 暂停 / 继续只在对话里留一条消息，不弹 Toast：反馈集中在一处
  const { isListening, toggleListening } = useListening((listening) => {
    chat.push(buildRecordingStateNote(listening));
  });

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
  const detailTask = agent.tasks.find((task) => task.id === detailTaskId);

  // 对话区字号 / 字体：挂在侧栏根节点上，对话里的样式统一引用这三个变量
  const sizeOption = findChatFontSize(fontSize);
  const familyOption = findChatFontFamily(fontFamily);
  const chatStyle = {
    "--chat-font-size": sizeOption.fontSize,
    "--chat-line-height": sizeOption.lineHeight,
    "--chat-font-family": familyOption.stack,
  } as CSSProperties;

  // 任务列表里点一行：长程任务进详情，其余给演示反馈
  const openTask = (task: AgentTask) => {
    setTaskListOpen(false);
    if (task.steps) {
      setDetailTaskId(task.id);
      return;
    }
    if (task.status === "confirm") {
      showToast(`已确认「${task.title}」包含待办清单（演示）`);
      return;
    }
    showToast(task.status === "done" ? `打开「${task.title}」的产物（演示）` : `「${task.title}」${task.desc}`);
  };

  return (
    <AgentWindowShell toast={toast} dock={dock} rootStyle={chatStyle}>
      <AgentTitleBar
        dock={dock}
        mood={mood}
        statusText={resolveMoodText(mood, agent.tasks)}
        replayKey={replayKey}
        onOnceEnd={onOnceEnd}
        onTouch={touch}
        onOpenStatus={onOpenStatus}
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

        <div className={styles.footer} ref={footerRef}>
          {/*
          输入框上方一行：左边是任务条（有任务时出现）和记笔记胶囊，从左往右排；
          右边固定是文件夹，展开时向左长成整行面板；任务列表向上展开，两者互相让位
        */}
          <div className={styles.statusRow}>
            <div
              className={`${styles.tasks} ${artifactsOpen ? styles.tasksHidden : ""}`}
            >
              {agent.tasks.length > 0 && (
                <TaskTray
                  tasks={agent.tasks}
                  expanded={taskListOpen}
                  onExpandedChange={(open) => {
                    setTaskListOpen(open);
                    if (open) {
                      setArtifactsOpen(false);
                    }
                  }}
                  hidden={artifactsOpen}
                  onOpenTask={openTask}
                />
              )}
              <NotePill
                isListening={isListening}
                hidden={artifactsOpen}
                onOpen={openNote}
                onToggleListening={toggleListening}
              />
            </div>
            {/* 元宝笔记本身就是一个文件，开启云笔记后这个入口一直都在 */}
            {artifacts.length > 0 && (
              <ArtifactEntry
                artifacts={artifacts}
                expanded={artifactsOpen}
                onExpandedChange={(open) => {
                  setArtifactsOpen(open);
                  if (open) {
                    setTaskListOpen(false);
                  }
                }}
                hidden={taskListOpen}
                onOpen={openArtifact}
                onOpenSide={() => {
                  setArtifactsOpen(false);
                  showToast("已在侧边打开文件列表（演示）");
                }}
              />
            )}
          </div>
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
            scheme={statusScheme}
            dock={dock}
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
