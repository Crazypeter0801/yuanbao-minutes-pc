import { useRef, useState } from "react";
import { useAgentDock } from "@/hooks/useAgentDock";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { MeetingWindow } from "@/components/meeting/MeetingWindow";
import { PollComposer } from "@/components/poll/PollComposer";
import { DemoToolbar } from "@/components/demo/DemoToolbar";
import { YuanbaoSidebar } from "@/components/YuanbaoSidebar";
import {
  buildArtifact,
  buildArtifactCreatedMessage,
  buildArtifactSharedMessage,
  buildScreenshotArtifact,
  companionArtifacts,
  noteArtifact,
  resolveArtifactTitle,
  type ArtifactKind,
} from "@/data/artifacts";
import { MOOD_DEMO_ITEMS } from "@/data/agentTasks";
import { buildAutoNote } from "@/data/autoNotes";
import type { CommandItem } from "@/data/commands";
import { buildPollPostedMessage, teamBuildingPoll } from "@/data/polls";
import { SHARE_TO_GROUP_LABEL } from "@/data/meetingSession";
import { topicAt } from "@/data/meetingTopics";
import { matchScenario } from "@/data/proactiveScenarios";
import { buildScreenshotNote, meetingShotSrc } from "@/data/yuanbaoContent";
import { useYuanbaoSession } from "@/hooks/useYuanbaoSession";
import type { ArtifactItem } from "@/types/artifact";
import styles from "./App.module.scss";

/** 「建一个 PDF / PPT / 文件」这类说法都算要生成产物 */
const CREATE_FILE_PATTERN = /创建|建个|生成|做一?份|出一份/;
const FILE_KIND_PATTERN = /pdf|ppt|幻灯片|文件|纪要文档/i;

/**
 * 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）· Figma 导入版
 *
 * 1. Tahoe 壁纸铺满页面，1440×760 主窗口（会议区 + 元宝侧栏）居中，窗口内不放任何演示入口；
 * 2. 窗口下方的壁纸上浮着演示按钮：模拟元宝发言 / 模拟用户发言 / 模拟交互功能 / 演示任务状态；
 * 3. 输入框里直接打「刚入会」「建个投票」这类词也能触发演示场景。
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  /** Agent 状态页是否覆盖在元宝对话区之上 */
  const [statusOpen, setStatusOpen] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  /** 会中文件：一开始只有「元宝笔记」（来源），生成文件、记录画面后再往里加 */
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([noteArtifact]);
  const chat = useYuanbaoSession();
  /** 会议窗口外框：吸附 / 分离都以它的位置为准 */
  const frameRef = useRef<HTMLDivElement>(null);
  /** 元宝窗口：吸附在会议右侧并列，或分离成浮动小窗 */
  const dock = useAgentDock(frameRef);
  /** 元宝的任务：头像状态、任务条、长程任务详情；窗口关掉再打开也不丢 */
  const agent = useAgentTasks();
  /** 会中记录素材的游标：每次手动记一条往后走一格，不重复 */
  const noteIndex = useRef(0);
  /** 最近生成的文件：「发送到某某会议群」的追问发的就是它 */
  const lastArtifact = useRef<ArtifactItem | null>(null);
  /** 会中已识别出的话题数：0 时「正在帮你记」卡片显示识别中，之后逐条出现在「当前正在聊」下 */
  const [topicCount, setTopicCount] = useState(0);
  const noteTopics = Array.from({ length: topicCount }, (_, index) => topicAt(index));

  /** 关闭元宝窗口：状态页一起收起，下次打开回到对话 */
  const closeSidebar = () => {
    setSidebarOpen(false);
    setStatusOpen(false);
  };

  /** 工具栏元宝按钮：保持原有开关行为，关闭时顺带退出状态页 */
  const toggleSidebar = () => {
    if (sidebarOpen) {
      closeSidebar();
      return;
    }
    setSidebarOpen(true);
  };

  /** 点头像 / 名字进入状态页 */
  const openStatus = () => {
    setSidebarOpen(true);
    setStatusOpen(true);
  };

  /**
   * 创建产物：本次生成的文件排最前；第一次额外附带一组会中已有文件。
   * 只有创建过才会出现文件入口，这样第一步是从零开始的。
   */
  const createArtifact = (kind: ArtifactKind, title: string) => {
    const created = buildArtifact(kind, title);
    // 第一次生成时带上会中已有的文件（判断依据：附带文件还没进来）；之后只把新文件插到最前
    setArtifacts((previous) =>
      previous.some((item) => item.id === companionArtifacts[0].id)
        ? [created, ...previous]
        : [created, ...companionArtifacts, ...previous],
    );
    lastArtifact.current = created;
    chat.push(buildArtifactCreatedMessage(created));
    // 文件生成好了：元宝喝一声彩
    agent.react("cheer");
  };

  /**
   * 输入框提交：先看是不是要生成文件，再过一遍演示场景，都没命中才当普通提问。
   * 主动开口的场景（刚入会 / 别人提到 / 会议将结束）只追加元宝消息，不出现用户气泡；
   * 投票这类任务场景用场景自带的 userText 提问，同时把确认弹窗摊开。
   */
  const handleSubmit = (text: string) => {
    const shared = lastArtifact.current;
    if (text === SHARE_TO_GROUP_LABEL && shared) {
      chat.runTask(text, () => chat.push(buildArtifactSharedMessage(shared)));
      return;
    }

    if (CREATE_FILE_PATTERN.test(text) && FILE_KIND_PATTERN.test(text)) {
      // 和普通提问一样先出用户气泡、元宝想一下再回，文件随回答一起落进「输出」
      const kind: ArtifactKind = /ppt|幻灯片/i.test(text) ? "pptx" : "pdf";
      chat.runTask(text, () =>
        createArtifact(kind, resolveArtifactTitle(text, kind)),
      );
      return;
    }

    const scenario = matchScenario(text);
    if (!scenario) {
      chat.ask(text);
      return;
    }
    if (scenario.kind === "ask") {
      chat.ask(scenario.userText);
      if (scenario.opens === "poll") {
        setPollOpen(true);
      }
      return;
    }
    if (scenario.asReply) {
      // 追问建议触发的承接场景：先出用户气泡，元宝想一下再回
      chat.runTask(text, () => [scenario.build()].flat().forEach(chat.push));
      return;
    }
    [scenario.build()].flat().forEach(chat.push);
  };

  /**
   * 执行一条演示指令：侧栏关着就先打开，再按类型分发
   * - effect：会中记录 / 记录画面，直接推一条元宝消息；
   * - 其余都走和输入框相同的链路（普通提问 / 生成文件 / 演示场景）。
   */
  const runCommand = (item: CommandItem) => {
    setSidebarOpen(true);
    // 演示指令都是给对话用的；状态页开着时先回到对话
    setStatusOpen(false);
    if (item.effect === "auto-note") {
      chat.push(buildAutoNote(noteIndex.current));
      noteIndex.current += 1;
      return;
    }
    if (item.effect === "next-topic") {
      // 只换卡片上的话题，不往对话里加消息：要点在对话里，话题在卡片上，两边不重复
      // 不封顶：话题池用完后从头轮着取
      setTopicCount((current) => current + 1);
      return;
    }
    if (item.effect === "screenshot") {
      // 对话里出现的截图同步进文件夹的「来源」
      const note = buildScreenshotNote();
      chat.push(note);
      setArtifacts((previous) => [buildScreenshotArtifact(meetingShotSrc, note.createdAt), ...previous]);
      return;
    }
    handleSubmit(item.prompt ?? item.label);
  };

  return (
    <div className={styles.page}>
      <div className={styles.frame} ref={frameRef}>
        <div className={styles.window}>
          {/* 元宝吸附在左侧时，同样的空位让在会议窗口左边（镜像） */}
          <div
            className={`${styles.reserve} ${styles.reserveLeft} ${sidebarOpen && dock.mode === "docked" && dock.side === "left" ? styles.reserveOpen : ""}`}
            aria-hidden="true"
          >
            {sidebarOpen && dock.mode === "docked" && dock.side === "left" && <span className={`${styles.handle} ${styles.handleLeft}`} />}
          </div>
          {/* 投票弹窗只盖会议区，元宝说的话仍然看得见 */}
          <div className={styles.meetingArea}>
            <MeetingWindow
              yuanbaoOpen={sidebarOpen}
              onToggleYuanbao={toggleSidebar}
            />
            {pollOpen && (
              <PollComposer
                draft={teamBuildingPoll}
                onClose={() => setPollOpen(false)}
                onSubmit={() => {
                  setPollOpen(false);
                  chat.push(buildPollPostedMessage(teamBuildingPoll.title));
                  agent.react("cheer");
                }}
              />
            )}
          </div>
          {/* 元宝吸附在右侧时，会议窗口让出 408（元宝 400 + 缝隙 8，缝隙正中是拖拽条）；分离或关闭后恢复撑满 1440 */}
          <div
            className={`${styles.reserve} ${sidebarOpen && dock.mode === "docked" && dock.side === "right" ? styles.reserveOpen : ""}`}
            aria-hidden="true"
          >
            {sidebarOpen && dock.mode === "docked" && dock.side === "right" && <span className={styles.handle} />}
          </div>
        </div>
        {/* 拖回会议右缘时的吸附提示：右缘一个浅色描边的玻璃占位框（无文字），松手后元宝落在这里 */}
        {sidebarOpen && dock.mode === "floating" && dock.dockHint && (
          <div className={`${styles.dockHint} ${dock.dockHint === "left" ? styles.dockHintLeft : ""}`} aria-hidden="true" />
        )}
        {/* 元宝 personal agent：默认吸附在会议窗口右缘并列；按住标题栏拖动可分离成浮动小窗 */}
        {sidebarOpen && (
          <YuanbaoSidebar
            chat={chat}
            artifacts={artifacts}
            dock={dock}
            agent={agent}
            onClose={closeSidebar}
            statusOpen={statusOpen}
            onOpenStatus={openStatus}
            onCloseStatus={() => setStatusOpen(false)}
            onSubmit={handleSubmit}
            noteTopics={noteTopics}
          />
        )}
        {/* 窗口外：演示按钮，浮在窗口下方的壁纸上 */}
        <div className={styles.demoBar}>
          <DemoToolbar
            onCommand={runCommand}
            actions={[
              {
                key: "task-states",
                label: "演示任务状态",
                // 元宝依次走一遍：空闲 → 工作中 → 待确认 → 已完成；侧栏关着就先打开
                onClick: () => {
                  setSidebarOpen(true);
                  agent.runDemo();
                },
              },
            ]}
            actionMenus={[
              {
                key: "yuanbao-moods",
                label: "元宝表情",
                // 逐个触发头像的每一种表情 / 动画；侧栏关着就先打开
                items: MOOD_DEMO_ITEMS.map(({ mood, label }) => ({
                  key: mood,
                  label,
                  onClick: () => {
                    setSidebarOpen(true);
                    agent.react(mood, { force: true });
                  },
                })),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
