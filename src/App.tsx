import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { WINDOW_TOAST_ROOT_ID } from "@/components/common/Toast";
import { DemoToolbar } from "@/components/demo/DemoToolbar";
import { MeetingTitleBar } from "@/components/meeting/MeetingTitleBar";
import { MeetingWindow } from "@/components/meeting/MeetingWindow";
import { PollComposer } from "@/components/poll/PollComposer";
import { ChatSidebar } from "@/components/sidebar/ChatSidebar";
import { FloatingWindow } from "@/components/sidebar/FloatingWindow";
import { MembersSidebar } from "@/components/sidebar/MembersSidebar";
import { SideDock, type SideAppId } from "@/components/sidebar/SideDock";
import { SIDE_APP_ORDER } from "@/components/sidebar/SideDock/apps";
import { YuanbaoSidebar, type CommandBarVariant } from "@/components/YuanbaoSidebar";
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
import { buildAutoNote } from "@/data/autoNotes";
import type { CommandItem } from "@/data/commands";
import { SHARE_TO_GROUP_LABEL } from "@/data/meetingSession";
import { topicAt } from "@/data/meetingTopics";
import { buildPollPostedMessage, teamBuildingPoll } from "@/data/polls";
import { matchScenario } from "@/data/proactiveScenarios";
import { buildScreenshotNote, meetingShotSrc } from "@/data/yuanbaoContent";
import { useMeetingChat } from "@/hooks/useMeetingChat";
import { useYuanbaoSession } from "@/hooks/useYuanbaoSession";
import type { ArtifactItem } from "@/types/artifact";
import styles from "./App.module.scss";

/** 侧栏停靠状态 + 弹出独立浮窗列表；active 为 null 表示侧栏区为空、主窗口向左收缩 */
interface DockState {
  apps: SideAppId[];
  active: SideAppId | null;
  floating: SideAppId[];
}

/**
 * 从停靠区移除一个页签后的激活切换规则：
 * - 若关闭/弹出的是成员或聊天且元宝仍在侧栏里，自动切回元宝页签；
 * - 否则按固定顺序切到相邻残留页签；
 * - 若停靠区已空，置 active 为 null，触发主窗口向左收缩（保留 apps 供收起过渡动画结束再清空）。
 */
function removeFromDock(state: DockState, app: SideAppId): Pick<DockState, "apps" | "active"> {
  const ordered = SIDE_APP_ORDER.filter((id) => state.apps.includes(id));
  const rest = state.apps.filter((id) => id !== app);

  if (state.active !== app) {
    return { apps: rest, active: state.active };
  }

  if (rest.length === 0) {
    return { apps: state.apps, active: null };
  }

  if (app !== "yuanbao" && rest.includes("yuanbao")) {
    return { apps: rest, active: "yuanbao" };
  }

  const index = ordered.indexOf(app);
  const nextActive = ordered[index + 1] ?? ordered[index - 1] ?? rest[0];
  return { apps: rest, active: nextActive };
}

/**
 * 底栏按钮切换应用：
 * - 若该应用当前正浮出为独立窗口，重新吸附回侧栏并激活（主窗口向右展开）；
 * - 若该应用正是当前停靠激活页签，则关闭它；
 * - 否则在侧栏中打开/切到该页签（若侧栏收起，主窗口向右展开）。
 */
function toggleDockApp(state: DockState, app: SideAppId): DockState {
  if (state.floating.includes(app)) {
    const nextFloating = state.floating.filter((id) => id !== app);
    const baseApps = state.active === null ? [] : state.apps;
    const nextApps = baseApps.includes(app) ? baseApps : [...baseApps, app];
    return { apps: nextApps, active: app, floating: nextFloating };
  }

  if (state.active === app) {
    return { ...state, ...removeFromDock(state, app) };
  }

  if (state.active === null) {
    return { ...state, apps: [app], active: app };
  }

  return {
    ...state,
    apps: state.apps.includes(app) ? state.apps : [...state.apps, app],
    active: app,
  };
}

/** 打开并激活指定应用（如「聊天 >」或演示指令）：若已浮出则吸附回侧栏 */
function openDockApp(state: DockState, app: SideAppId): DockState {
  if (state.active === app && !state.floating.includes(app)) {
    return state;
  }
  const nextFloating = state.floating.filter((id) => id !== app);
  const baseApps = state.active === null ? [] : state.apps;
  const nextApps = baseApps.includes(app) ? baseApps : [...baseApps, app];
  return { apps: nextApps, active: app, floating: nextFloating };
}

/** 「建一个 PDF / PPT / 文件」这类说法都算要生成产物 */
const CREATE_FILE_PATTERN = /创建|建个|生成|做一?份|出一份/;
const FILE_KIND_PATTERN = /pdf|ppt|幻灯片|文件|纪要文档/i;

export default function App() {
  const [dock, setDock] = useState<DockState>({
    apps: ["yuanbao", "members", "chat"],
    active: "yuanbao",
    floating: [],
  });
  const [commandBarVariant, setCommandBarVariant] = useState<CommandBarVariant>("agent-status");
  const [yuanbaoDetailOpen, setYuanbaoDetailOpen] = useState(false);
  /** 主窗口相对初始居中位置的自由拖拽偏移（px） */
  const [windowPos, setWindowPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [windowDragging, setWindowDragging] = useState(false);
  const stageElRef = useRef<HTMLDivElement>(null);
  const windowElRef = useRef<HTMLDivElement>(null);
  const windowDragRef = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  const handleWindowDragDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('[data-nodrag], button, [role="button"], input, textarea')) {
      return;
    }
    const winEl = windowElRef.current;
    if (!winEl) {
      return;
    }
    const rect = winEl.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    windowDragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: windowPos.x,
      startY: windowPos.y,
      /* 顶部至少留 12px，保证标题栏绝不被拖出视口上方；左右与底部保证标题栏始终可拖回 */
      minY: windowPos.y - (rect.top - 12),
      maxY: windowPos.y + (window.innerHeight - 64 - rect.top),
      minX: windowPos.x - (rect.right - 200),
      maxX: windowPos.x + (window.innerWidth - 200 - rect.left),
    };
    setWindowDragging(true);
  }, [windowPos.x, windowPos.y]);

  const handleWindowDragMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const start = windowDragRef.current;
    if (!start) {
      return;
    }
    const rawX = start.startX + (event.clientX - start.pointerX);
    const rawY = start.startY + (event.clientY - start.pointerY);
    setWindowPos({
      x: Math.round(Math.min(start.maxX, Math.max(start.minX, rawX))),
      y: Math.round(Math.min(start.maxY, Math.max(start.minY, rawY))),
    });
  }, []);

  const handleWindowDragUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!windowDragRef.current) {
      return;
    }
    windowDragRef.current = null;
    setWindowDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);
  const meetingChat = useMeetingChat();
  /** 从弹幕浮层「聊天 >」进来时，把焦点放进聊天输入框 */
  const [chatFocusSignal, setChatFocusSignal] = useState(0);

  const toggleApp = useCallback((app: SideAppId) => setDock((state) => toggleDockApp(state, app)), []);
  const openApp = useCallback((app: SideAppId) => setDock((state) => openDockApp(state, app)), []);
  const closeApp = useCallback(
    (app: SideAppId) => setDock((state) => ({ ...state, ...removeFromDock(state, app) })),
    [],
  );
  const popOutApp = useCallback(
    (app: SideAppId) =>
      setDock((state) => {
        const nextDock = removeFromDock(state, app);
        const nextFloating = [...state.floating.filter((id) => id !== app), app];
        return { ...nextDock, floating: nextFloating };
      }),
    [],
  );
  const dockBackApp = useCallback((app: SideAppId) => setDock((state) => openDockApp(state, app)), []);
  const closeFloatingApp = useCallback(
    (app: SideAppId) => setDock((state) => ({ ...state, floating: state.floating.filter((id) => id !== app) })),
    [],
  );
  const focusFloatingApp = useCallback(
    (app: SideAppId) =>
      setDock((state) =>
        state.floating[state.floating.length - 1] === app
          ? state
          : { ...state, floating: [...state.floating.filter((id) => id !== app), app] },
      ),
    [],
  );
  const closeAll = useCallback(() => setDock((state) => ({ ...state, active: null })), []);
  const handleDockClosed = useCallback(
    () => setDock((state) => (state.active === null ? { ...state, apps: [], active: null } : state)),
    [],
  );

  const [pollOpen, setPollOpen] = useState(false);
  /** 会中文件：一开始只有「元宝笔记」（来源），生成文件、记录画面后再往里加 */
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([noteArtifact]);
  const chat = useYuanbaoSession();
  const noteIndex = useRef(0);
  const lastArtifact = useRef<ArtifactItem | null>(null);
  const [topicCount, setTopicCount] = useState(0);
  const noteTopics = Array.from({ length: topicCount }, (_, index) => topicAt(index));

  const createArtifact = (kind: ArtifactKind, title: string) => {
    const created = buildArtifact(kind, title);
    setArtifacts((previous) =>
      previous.some((item) => item.id === companionArtifacts[0].id)
        ? [created, ...previous]
        : [created, ...companionArtifacts, ...previous],
    );
    lastArtifact.current = created;
    chat.push(buildArtifactCreatedMessage(created));
  };

  const handleSubmit = (text: string, options?: { fromUser?: boolean }) => {
    const shared = lastArtifact.current;
    if (text === SHARE_TO_GROUP_LABEL && shared) {
      chat.runTask(text, () => chat.push(buildArtifactSharedMessage(shared)));
      return;
    }

    if (CREATE_FILE_PATTERN.test(text) && FILE_KIND_PATTERN.test(text)) {
      const kind: ArtifactKind = /ppt|幻灯片/i.test(text) ? "pptx" : "pdf";
      chat.runTask(text, () => createArtifact(kind, resolveArtifactTitle(text, kind)));
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
    if (scenario.asReply || options?.fromUser) {
      chat.runTask(text, () => [scenario.build()].flat().forEach(chat.push));
      return;
    }
    [scenario.build()].flat().forEach(chat.push);
  };

  const runCommand = (item: CommandItem) => {
    openApp("yuanbao");
    if (item.effect === "auto-note") {
      chat.push(buildAutoNote(noteIndex.current));
      noteIndex.current += 1;
      return;
    }
    if (item.effect === "next-topic") {
      setTopicCount((current) => current + 1);
      return;
    }
    if (item.effect === "screenshot") {
      const note = buildScreenshotNote();
      chat.push(note);
      setArtifacts((previous) => [buildScreenshotArtifact(meetingShotSrc, note.createdAt), ...previous]);
      return;
    }
    handleSubmit(item.prompt ?? item.label);
  };

  const renderAppContent = (id: SideAppId, showHeader: boolean, inFloating: boolean) => {
    if (id === "chat") {
      return (
        <ChatSidebar
          chat={meetingChat}
          showHeader={showHeader}
          onClose={() => (inFloating ? closeFloatingApp("chat") : closeApp("chat"))}
          onPopOut={inFloating ? undefined : () => popOutApp("chat")}
          focusSignal={chatFocusSignal}
        />
      );
    }
    if (id === "members") {
      return (
        <MembersSidebar
          showHeader={showHeader}
          onClose={() => (inFloating ? closeFloatingApp("members") : closeApp("members"))}
          onPopOut={inFloating ? undefined : () => popOutApp("members")}
        />
      );
    }
    return (
      <YuanbaoSidebar
        chat={chat}
        artifacts={artifacts}
        onClose={() => (inFloating ? closeFloatingApp("yuanbao") : closeApp("yuanbao"))}
        onPopOut={inFloating ? undefined : () => popOutApp("yuanbao")}
        onSubmit={handleSubmit}
        noteTopics={noteTopics}
        showHeader={showHeader}
        detailOpen={yuanbaoDetailOpen}
        onDetailOpenChange={setYuanbaoDetailOpen}
        commandBarVariant={commandBarVariant}
      />
    );
  };

  const dockOpen = dock.active !== null;

  /**
   * 计算弹出独立浮窗的初始位置（相对舞台左上角）：
   * 明显向右上角拉开分离感，并按当前视口尺寸做安全边界夹紧，避免出屏或与右侧演示控制台硬重叠。
   */
  const computeFloatingDefaultOffset = (index: number) => {
    const FLOATING_W = 376;
    const FLOATING_H = 747;
    const SAFE_MARGIN = 16;
    const idealX = windowPos.x + (dockOpen ? 1052 : 1032) + index * 24;
    const idealY = windowPos.y - 52 + index * 24;

    const stageRect = stageElRef.current?.getBoundingClientRect();
    if (!stageRect || typeof window === "undefined") {
      return { x: idealX, y: idealY };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // 宽屏下为最右侧吸附的演示控制台（宽约 134px）预留避让呼吸空间
    const rightReserve = vw >= 1560 ? 148 : 20;
    const minStageX = SAFE_MARGIN - stageRect.left;
    const maxStageX = vw - rightReserve - FLOATING_W - stageRect.left;
    const minStageY = SAFE_MARGIN - stageRect.top;
    const maxStageY = Math.max(minStageY, vh - SAFE_MARGIN - FLOATING_H - stageRect.top);

    return {
      x: Math.round(Math.min(maxStageX, Math.max(minStageX, idealX))),
      y: Math.round(Math.min(maxStageY, Math.max(minStageY, idealY))),
    };
  };

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        {/* 固定 1338 宽舞台锚点：主窗口靠左停放，侧栏全部关闭或浮出时主窗口向左收缩到 952，左侧会中区 936 原地不动 */}
        <div ref={stageElRef} className={styles.windowStage}>
          <div
            ref={windowElRef}
            className={`${styles.window} ${windowDragging ? styles.windowDragging : ""}`}
            id={WINDOW_TOAST_ROOT_ID}
            style={{ transform: `translate3d(${windowPos.x}px, ${windowPos.y}px, 0)` }}
          >
            {/* 顶部通栏操作栏（Figma 574:19176）：横跨会议区与侧栏上方 */}
            <MeetingTitleBar
              dragHandlers={{
                dragging: windowDragging,
                onPointerDown: handleWindowDragDown,
                onPointerMove: handleWindowDragMove,
                onPointerUp: handleWindowDragUp,
              }}
              sidebarOpen={dockOpen}
              onToggleSidebar={() => {
                if (dockOpen) {
                  closeAll();
                } else {
                  openApp("yuanbao");
                }
              }}
            />
            <div className={styles.workspaceRow}>
              <div className={styles.meetingArea}>
                <MeetingWindow
                  activeApp={dock.active}
                  onToggleApp={toggleApp}
                  barrage={meetingChat.barrage}
                  onSendBarrage={meetingChat.send}
                  onOpenChat={() => {
                    openApp("chat");
                    setChatFocusSignal((value) => value + 1);
                  }}
                />
                {pollOpen && (
                  <PollComposer
                    draft={teamBuildingPoll}
                    onClose={() => setPollOpen(false)}
                    onSubmit={() => {
                      setPollOpen(false);
                      chat.push(buildPollPostedMessage(teamBuildingPoll.title));
                    }}
                  />
                )}
              </div>
              <SideDock
                apps={dock.apps}
                active={dock.active}
                onSelect={openApp}
                onCloseApp={closeApp}
                onPopOutApp={popOutApp}
                onCloseAll={closeAll}
                onToggleYuanbaoDetail={() => setYuanbaoDetailOpen((open) => !open)}
                onClosed={handleDockClosed}
                renderApp={(id, { showHeader }) => renderAppContent(id, showHeader, false)}
              />
            </div>
          </div>

          {dock.floating.map((id, index) => (
            <FloatingWindow
              key={id}
              id={id}
              defaultOffset={computeFloatingDefaultOffset(index)}
              zIndex={40 + index}
              onFocus={() => focusFloatingApp(id)}
              onDockBack={() => dockBackApp(id)}
              onClose={() => closeFloatingApp(id)}
              onTitleClick={id === "yuanbao" ? () => setYuanbaoDetailOpen((open) => !open) : undefined}
            >
              {renderAppContent(id, false, true)}
            </FloatingWindow>
          ))}
        </div>
      </div>

      {/* 视口右侧贴边吸附演示控制台 */}
      <div className={styles.demoBar}>
        <DemoToolbar
          onCommand={runCommand}
          commandBarVariant={commandBarVariant}
          onCommandBarVariantChange={setCommandBarVariant}
        />
      </div>
    </div>
  );
}
