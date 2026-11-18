import { useRef, useState } from "react";
import { useAgentDock } from "@/hooks/useAgentDock";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { MeetingWindow } from "@/components/meeting/MeetingWindow";
import { ScreenTranslationCaption } from "@/components/meeting/ScreenTranslationCaption";
import { PollComposer } from "@/components/poll/PollComposer";
import { DemoToolbar } from "@/components/demo/DemoToolbar";
import { YuanbaoSidebar } from "@/components/YuanbaoSidebar";
import type { AgentStatusTab } from "@/components/agent/AgentStatusPage";
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
import { MOOD_DEMO_ITEMS, WHITEBOARD_TASK_ID, whiteboardBoardTask } from "@/data/agentTasks";
import { buildAutoNote } from "@/data/autoNotes";
import type { CommandItem } from "@/data/commands";
import { buildPollPostedMessage, teamBuildingPoll } from "@/data/polls";
import { SHARE_TO_GROUP_LABEL } from "@/data/meetingSession";
import { topicAt } from "@/data/meetingTopics";
import { matchScenario } from "@/data/proactiveScenarios";
import {
  buildWhiteboardDoneMessage,
  buildWhiteboardIntroMessage,
  isWhiteboardDrawRequest,
} from "@/data/whiteboardScenario";
import { buildScreenshotNote, meetingShotSrc } from "@/data/yuanbaoContent";
import { useYuanbaoSession } from "@/hooks/useYuanbaoSession";
import { useMeetingChat } from "@/hooks/useMeetingChat";
import {
  INITIAL_MEETING_APP_SIDEBAR,
  reduceMeetingAppSidebar,
  type MeetingAppTab,
} from "@/lib/meetingAppTab";
import { FileViewer } from "@/components/agent/FileViewer";
import { WhiteboardGenerateOverlay } from "@/components/whiteboard/WhiteboardGenerateOverlay";
import { WhiteboardOverlay } from "@/components/whiteboard/WhiteboardOverlay";
import type { ArtifactItem } from "@/types/artifact";
import styles from "./App.module.scss";

/** 演示条里「元宝画白板」用的示例说法：本身就带触发词 */
const WHITEBOARD_DEMO_TEXT = "帮我在白板上画一下彩虹形成的原理，给同学们讲讲";

/** 白板的两种画法：逐笔绘制 / 一次生成 */
type WhiteboardMode = "draw" | "instant";

/** 「建一个 PDF / PPT / 文件」这类说法都算要生成产物 */
const CREATE_FILE_PATTERN = /创建|建个|生成|做一?份|出一份/;
const FILE_KIND_PATTERN = /pdf|ppt|幻灯片|文件|纪要文档/i;

/**
 * 腾讯会议 PC + 元宝 Agent 对话区（Figma 257:1540）· Figma 导入版
 *
 * 1. Tahoe 壁纸铺满页面，1364 双窗（会议 960 + 缝 + 元宝 400，Figma 215:19035）居中，窗口内不放任何演示入口；
 * 2. 窗口下方的壁纸上浮着演示按钮：模拟元宝发言 / 模拟用户发言 / 模拟交互功能；
 * 3. 输入框里直接打「刚入会」「建个投票」这类词也能触发演示场景。
 * 4. 任务入口固定顶部（方案 A）；输入框上方不再出现任务胶囊。
 */
export default function App() {
  const [sidebar, setSidebar] = useState(INITIAL_MEETING_APP_SIDEBAR);
  const sidebarOpen = sidebar.open;
  const appTab = sidebar.tab;
  const meetingChat = useMeetingChat();
  /** Agent 状态页是否覆盖在元宝对话区之上 */
  const [statusOpen, setStatusOpen] = useState(false);
  /** 详情页「设置头像」之后，顶部胶囊和详情头部共用这一张 */
  const [portrait, setPortrait] = useState<string | null>(null);
  /** 资料库点开的文件查看器，浮在两扇窗之外 */
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  /** 状态页打开时落在哪个 Tab：头部胶囊进概览，资料库入口进资料库 */
  const [statusTab, setStatusTab] = useState<AgentStatusTab>("overview");
  /** 接受「开启屏幕翻译」后，主讲画面底部叠一层只有自己能看到的中文 */
  const [screenTranslation, setScreenTranslation] = useState(false);
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
  /**
   * 会中已识别出的话题数：默认 2 条，与 Figma 215:19035 的「当前正在聊」一致；
   * 之后「识别到新话题」再逐条追加。
   */
  const [topicCount, setTopicCount] = useState(2);
  const noteTopics = Array.from({ length: topicCount }, (_, index) => topicAt(index));
  /** 元宝画白板：非空时主讲人画面上盖一层批注白板；runKey 每次 +1 重播 */
  const [whiteboard, setWhiteboard] = useState<{ runKey: number; mode: WhiteboardMode } | null>(null);
  const whiteboardRun = useRef(0);
  /** 画完后完成态停留一会儿再收起，避免一直占着进行中 */
  const boardHold = useRef<number>();

  const setAppTab = (tab: MeetingAppTab) => {
    setSidebar((current) => reduceMeetingAppSidebar(current, { type: "select", tab }));
  };

  /** 关闭右侧应用容器：状态页一起收起，下次打开仍回到上次 Tab；会话与草稿不卸载 */
  const closeSidebar = () => {
    setSidebar((current) => reduceMeetingAppSidebar(current, { type: "close" }));
    setStatusOpen(false);
  };

  const toggleAppTab = (tab: MeetingAppTab) => {
    setSidebar((current) => reduceMeetingAppSidebar(current, { type: "toggle", tab }));
    if (sidebarOpen && appTab === tab) {
      setStatusOpen(false);
    }
  };

  /** 工具栏元宝按钮：关着打开元宝；已在元宝则关闭；在其他 Tab 则切回元宝 */
  const toggleSidebar = () => toggleAppTab("yuanbao");
  const toggleMembers = () => toggleAppTab("members");
  const toggleChat = () => toggleAppTab("chat");

  /** 点头部胶囊进入状态页，并指定默认 Tab */
  const openStatus = (tab: AgentStatusTab = "overview") => {
    setAppTab("yuanbao");
    setStatusTab(tab);
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
   * 元宝画白板：先按普通任务出用户气泡、元宝想一下再回；
   * 回复落地时把白板盖到主讲人画面上——逐笔绘制（draw）或一次生成（instant），
   * 两种模式的文案一致，鼠标淡出后往对话里补一句「已画好」。
   */
  const beginBoardTask = () => {
    if (boardHold.current) {
      window.clearTimeout(boardHold.current);
    }
    agent.setTask(whiteboardBoardTask("running"));
  };

  const finishBoardTask = () => {
    agent.setTask(whiteboardBoardTask("done"));
    boardHold.current = window.setTimeout(() => {
      agent.removeTask(WHITEBOARD_TASK_ID);
    }, 4500);
  };

  const startWhiteboard = (text: string, mode: WhiteboardMode = "draw") => {
    // 用户一开口就挂上两层状态，不要等画完才出现
    beginBoardTask();
    chat.runTask(text, () => {
      whiteboardRun.current += 1;
      setWhiteboard({ runKey: whiteboardRun.current, mode });
      chat.push(buildWhiteboardIntroMessage());
    });
  };

  /**
   * 输入框提交：先看是不是要生成文件，再过一遍演示场景，都没命中才当普通提问。
   * 主动开口的场景（刚入会 / 别人提到 / 会议将结束）只追加元宝消息，不出现用户气泡；
   * 投票这类任务场景用场景自带的 userText 提问，同时把确认弹窗摊开。
   */
  const handleSubmit = (text: string, options?: { whiteboardMode?: WhiteboardMode }) => {
    const shared = lastArtifact.current;
    if (text === SHARE_TO_GROUP_LABEL && shared) {
      chat.runTask(text, () => chat.push(buildArtifactSharedMessage(shared)));
      return;
    }

    if (isWhiteboardDrawRequest(text)) {
      startWhiteboard(text, options?.whiteboardMode ?? "draw");
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
      if (scenario.id === "follow-screen-translate") {
        setScreenTranslation(true);
      }
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
    setAppTab("yuanbao");
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

  /**
   * 立昌：浮出时左边不自动变宽（也不因窗口变窄而整框重居中）。
   * - 会议区在右侧容器仍打开时用固定宽 960，绝不靠 flex 吃空位；
   * - 预留位在容器仍打开时保留（吸附或浮出），浮出只是侧栏离开槽位，会议宽/位置都不变；
   * - 白条只在吸附态显示。
   */
  const agentOpen = sidebarOpen;
  const agentDocked = agentOpen && dock.mode === "docked";
  const agentReservesLeft = agentOpen && dock.side === "left";
  const agentReservesRight = agentOpen && dock.side === "right";
  const meetingWidthClass = agentOpen ? styles.meetingLocked : "";

  return (
    <div className={styles.page}>
      <div className={styles.frame} ref={frameRef}>
        <div
          className={[
            styles.window,
            agentOpen ? styles.windowAgentOpen : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* 元宝仍打开时保留左侧槽位（浮出也不收回，避免会议重居中/变宽） */}
          <div
            className={`${styles.reserve} ${styles.reserveLeft} ${agentReservesLeft ? styles.reserveOpen : ""}`}
            aria-hidden="true"
          >
            {agentDocked && dock.side === "left" && (
              <span className={`${styles.handle} ${styles.handleLeft}`} />
            )}
          </div>
          {/* 投票弹窗只盖会议区，元宝说的话仍然看得见 */}
          <div className={`${styles.meetingArea} ${meetingWidthClass}`}>
            <MeetingWindow
              yuanbaoOpen={sidebarOpen && appTab === "yuanbao"}
              onToggleYuanbao={toggleSidebar}
              sidebarOpen={sidebarOpen}
              appTab={appTab}
              onToggleMembers={toggleMembers}
              onToggleChat={toggleChat}
              stageOverlay={
                whiteboard ? (
                  whiteboard.mode === "instant" ? (
                    <WhiteboardGenerateOverlay
                      runKey={whiteboard.runKey}
                      onComplete={() => {
                        finishBoardTask();
                        chat.push(buildWhiteboardDoneMessage());
                        agent.react("cheer");
                      }}
                    />
                  ) : (
                    <WhiteboardOverlay
                      runKey={whiteboard.runKey}
                      onComplete={() => {
                        finishBoardTask();
                        chat.push(buildWhiteboardDoneMessage());
                        agent.react("cheer");
                      }}
                    />
                  )
                ) : screenTranslation ? (
                  <ScreenTranslationCaption />
                ) : undefined
              }
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
          {/* 元宝仍打开时保留右侧槽位；浮出时空槽仍在，会议固定宽不会撑开 */}
          <div
            className={`${styles.reserve} ${agentReservesRight ? styles.reserveOpen : ""}`}
            aria-hidden="true"
          >
            {agentDocked && dock.side === "right" && <span className={styles.handle} />}
          </div>
        </div>
        {/* 拖回会议右缘时的吸附提示：右缘一个浅色描边的玻璃占位框（无文字），松手后元宝落在这里 */}
        {sidebarOpen && dock.mode === "floating" && dock.dockHint && (
          <div className={`${styles.dockHint} ${dock.dockHint === "left" ? styles.dockHintLeft : ""}`} aria-hidden="true" />
        )}
        {/* 元宝 personal agent：默认吸附在会议窗口右缘并列；按住标题栏拖动可分离成浮动小窗 */}
        <YuanbaoSidebar
          visible={sidebarOpen}
          appTab={appTab}
          onSelectTab={setAppTab}
          meetingChat={meetingChat}
          chat={chat}
          artifacts={artifacts}
          dock={dock}
          agent={agent}
          statusTab={statusTab}
          onClose={closeSidebar}
          statusOpen={statusOpen}
          onOpenStatus={openStatus}
          onCloseStatus={() => setStatusOpen(false)}
          portrait={portrait}
          onApplyPortrait={setPortrait}
          onOpenFile={() => setFileViewerOpen(true)}
          onSubmit={handleSubmit}
          noteTopics={noteTopics}
        />
        {fileViewerOpen && <FileViewer onClose={() => setFileViewerOpen(false)} />}
        {/* 窗口外：演示按钮，浮在窗口下方的壁纸上 */}
        <div className={styles.demoBar}>
          <DemoToolbar
            onCommand={runCommand}
            actionMenus={[
              {
                key: "whiteboard",
                label: "元宝画白板",
                // 两种画法：逐笔绘制（默认）/ 一次生成；示例说法本身就带触发词，走同一条链路
                items: [
                  {
                    key: "draw",
                    label: "逐笔绘制",
                    onClick: () => {
                      setAppTab("yuanbao");
                      handleSubmit(WHITEBOARD_DEMO_TEXT, { whiteboardMode: "draw" });
                    },
                  },
                  {
                    key: "instant",
                    label: "一次生成",
                    onClick: () => {
                      setAppTab("yuanbao");
                      handleSubmit(WHITEBOARD_DEMO_TEXT, { whiteboardMode: "instant" });
                    },
                  },
                ],
              },
              {
                key: "yuanbao-moods",
                label: "元宝表情",
                // 逐个触发头像的每一种表情 / 动画；侧栏关着就先打开
                items: MOOD_DEMO_ITEMS.map(({ mood, label }) => ({
                  key: mood,
                  label,
                  onClick: () => {
                    setAppTab("yuanbao");
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
