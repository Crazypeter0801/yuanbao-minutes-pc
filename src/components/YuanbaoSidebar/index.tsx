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
import { NOTE_ARTIFACT_ID } from "@/data/artifacts";
import type { ArtifactItem } from "@/types/artifact";
import type { BubbleCard } from "@/types/chat";
import { ArtifactEntry } from "@/components/sidebar/ArtifactEntry";
import { ChatInput } from "@/components/sidebar/ChatInput";
import { ChatList } from "@/components/sidebar/ChatList";
import { MessageStream } from "@/components/sidebar/MessageStream";
import { NotePill } from "@/components/sidebar/NotePill";
import { AgentTitleBar } from "@/components/agent/AgentTitleBar";
import { AgentWindowShell } from "@/components/agent/AgentWindowShell";
import { buildCardResult } from "@/data/interactiveCards";
import { buildRecordingStateNote } from "@/data/yuanbaoContent";
import { useListening } from "@/hooks/useListening";
import { useToast } from "@/hooks/useToast";
import type { AgentDockControl } from "@/hooks/useAgentDock";
import type { YuanbaoSession } from "@/hooks/useYuanbaoSession";
import styles from "./index.module.scss";

interface YuanbaoSidebarProps {
  /** 元宝会话（消息流），由 App 持有 */
  chat: YuanbaoSession;
  /** 元宝本轮产出的文件；为空时不出现产物入口 */
  artifacts: ArtifactItem[];
  /** 吸附 / 分离状态（由 App 持有，会议内容是否让位也取决于它） */
  dock: AgentDockControl;
  /** 关闭侧栏 */
  onClose: () => void;
  /** 输入框提交：App 层会先匹配生成文件与演示场景，未命中才走普通提问 */
  onSubmit?: (text: string) => void;
  /** 会中已识别出的话题（最后一条是当前正在聊的），显示在「正在帮你记」卡片里 */
  noteTopics?: string[];
}

/**
 * 元宝 personal agent 窗口 · 框架改版原型（对话区与底栏沿用 Figma 257:1540 / 36:2249）
 * 外壳从会议窗口里的侧栏改成独立窗口：自己的标题栏、品牌、会话切换条（会议是元宝主端的「腾讯会议」分组）。
 *
 * 输入框上方一行：左边是长程任务（「元宝正在记笔记」，多个时从左往右排），右边固定是文件夹。
 * 文件夹可展开成整行浮层，展开时左边的任务胶囊让位。
 *
 * 快捷指令已移出窗口：元宝发言、用户发言、交互功能都从窗口外的三个演示按钮触发。
 */
export const YuanbaoSidebar: FC<YuanbaoSidebarProps> = ({
  chat,
  artifacts,
  dock,
  onClose,
  onSubmit,
  noteTopics,
}) => {
  const { toast, showToast } = useToast();
  const [artifactsOpen, setArtifactsOpen] = useState(false);
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

  const menuItems = useMemo<PopMenuItem[]>(
    () => [
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

  return (
    <AgentWindowShell toast={toast} dock={dock}>
      <AgentTitleBar
        dock={dock}
        onClose={onClose}
        onOpenMain={() => showToast("已在元宝主端打开「腾讯会议」分组（演示）")}
        onPickSession={(title) => showToast(`已切换到「${title}」（演示）`)}
        menuItems={menuItems}
      />

      {/* 消息流与底栏叠在一起：对话可以滚到底栏后面，被渐变底一点点盖掉 */}
      <div
        className={styles.body}
        style={{ "--yb-footer-height": `${footerHeight}px` } as CSSProperties}
      >
        <MessageStream
          className={styles.stream}
          scrollKey={`${chat.messages.length}-${chat.isThinking}`}
        >
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

        <div className={styles.footer} ref={footerRef}>
          {/*
          输入框上方一行：左边是长程任务（元宝正在记笔记…），多个时从左往右排；
          右边固定是文件夹，展开时向左长成整行面板
        */}
          <div className={styles.statusRow}>
            <div
              className={`${styles.tasks} ${artifactsOpen ? styles.tasksHidden : ""}`}
            >
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
                onExpandedChange={setArtifactsOpen}
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
    </AgentWindowShell>
  );
};
